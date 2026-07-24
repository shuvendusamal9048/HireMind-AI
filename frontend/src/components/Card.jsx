import React from 'react';

export const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm ${
        hover ? 'transition-all duration-200 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
    <div>
      <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      {subtitle && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export default Card;
