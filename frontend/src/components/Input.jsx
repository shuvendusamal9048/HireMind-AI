import React, { forwardRef } from 'react';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className = '',
  type = 'text',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-red-500">*</span>}
          </span>
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 dark:text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={`w-full text-sm rounded-xl border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-all duration-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
            Icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} py-2.5 ${
            error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-slate-200 dark:border-slate-800 focus:border-primary-600 focus:ring-2 focus:ring-primary-500/20'
          } outline-none ${className}`}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-slate-400 dark:text-slate-500 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {!error && helperText && <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
