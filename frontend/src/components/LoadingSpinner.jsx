import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', fullPage = false, label = 'Loading...' }) => {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const content = (
    <div className="flex flex-col items-center justify-center gap-3">
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary-600 dark:text-primary-400`} />
      {label && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 animate-pulse">{label}</p>}
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-slate-900/20 dark:bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800">
          {content}
        </div>
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
