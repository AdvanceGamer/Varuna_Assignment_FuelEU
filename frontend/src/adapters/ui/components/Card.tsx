import React from 'react';
export default function Card({ className = '', children }: React.PropsWithChildren<{ className?: string }>) {
  return <div className={`ui-card ${className}`}><div className="ui-card-pad">{children}</div></div>;
}
