import React from 'react';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'success';
};
export default function Button({ variant = 'primary', className = '', ...props }: Props) {
  const v =
    variant === 'ghost' ? 'btn-ghost' :
    variant === 'danger' ? 'btn-danger' :
    variant === 'success' ? 'btn-success' : 'btn-primary';
  return <button {...props} className={`btn ${v} ${className}`} />;
}
