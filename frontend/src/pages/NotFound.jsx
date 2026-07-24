import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';
import { ROUTES } from '../utils/constants';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F17] p-6 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-950/60 border border-primary-200 dark:border-primary-800 text-primary-600 dark:text-primary-400 mx-auto flex items-center justify-center">
          <Sparkles className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404 Page Not Found</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The page or feature you are trying to access does not exist or will be enabled in future phases.
          </p>
        </div>
        <Button variant="primary" icon={ArrowLeft} onClick={() => navigate(ROUTES.DASHBOARD)}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
