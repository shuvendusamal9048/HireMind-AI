import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
      onError: (error) => {
        const message = error.response?.data?.detail || 'An error occurred fetching data';
        toast.error(typeof message === 'string' ? message : 'Network error');
      },
    },
    mutations: {
      onError: (error) => {
        const message = error.response?.data?.detail || 'An error occurred during submission';
        toast.error(typeof message === 'string' ? message : 'Action failed');
      },
    },
  },
});

export default queryClient;
