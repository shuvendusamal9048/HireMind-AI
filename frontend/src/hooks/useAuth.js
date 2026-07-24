import { useAuthStore } from '../store/useAuthStore';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuth = () => {
  const { user, token, isAuthenticated, isLoading, setAuth, clearAuth, setIsLoading } = useAuthStore();

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const authData = await authService.login(credentials);
      const accessToken = authData.access_token;
      
      // Temporary token set to allow calling getMe()
      setAuth(null, accessToken);

      const currentUser = await authService.getMe();
      const userData = {
        id: currentUser.id,
        admin_name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        company_id: currentUser.company_id,
        company_name: currentUser.company_name || 'HireMind Client',
      };

      setAuth(userData, accessToken);
      toast.success('Successfully logged in!');
      return userData;
    } catch (error) {
      clearAuth();
      const detailMessage = error.response?.data?.detail;
      const msg = typeof detailMessage === 'string' ? detailMessage : 'Invalid credentials';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (companyData) => {
    setIsLoading(true);
    try {
      await authService.register(companyData);
      // Auto login after successful registration
      return await login({
        email: companyData.email,
        password: companyData.password,
      });
    } catch (error) {
      const detailMessage = error.response?.data?.detail;
      const msg = typeof detailMessage === 'string' ? detailMessage : 'Registration failed';
      toast.error(msg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearAuth();
    toast.success('Logged out successfully');
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };
};

export default useAuth;
