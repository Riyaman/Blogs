import React, { useId } from 'react';

function Select({ options, label, className, ...props }, ref) {
  const id = useId();
  
  return (
    <div className='w-full'>
      {label && <label htmlFor={id} className='mb-2 block text-sm font-medium text-muted-foreground'>{label}</label>}
      <select
        {...props}
        id={id}
        ref={ref}
        className={`h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 ${className}`}
      >
        {options?.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
