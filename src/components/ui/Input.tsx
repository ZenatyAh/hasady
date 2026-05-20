import React, { InputHTMLAttributes, ReactNode, forwardRef, useId } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: ReactNode;
  onIconClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, onIconClick, className = '', id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className={`w-full ${className}`}>
        <div
          className={`relative flex w-full items-center rounded-xl border p-3 transition-colors ${
            error
              ? 'border-red-500 focus-within:border-red-500'
              : 'border-[#e0e0e0] focus-within:border-[#265C38]'
          }`}
        >
          <div className="flex flex-1 flex-col">
            <label htmlFor={inputId} className="mb-1 text-xs font-medium text-[#999999]">
              {label}
            </label>
            <input
              id={inputId}
              ref={ref}
              className="w-full bg-transparent text-base text-[#333333] outline-none placeholder:text-[#cccccc]"
              {...props}
            />
          </div>
          {icon && (
            <button
              type="button"
              onClick={onIconClick}
              className="ml-2 flex h-6 w-6 items-center justify-center text-[#999999] hover:text-[#333333] focus:outline-none"
              tabIndex={-1}
            >
              {icon}
            </button>
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
