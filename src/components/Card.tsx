import React from 'react';

type Props = React.PropsWithChildren<{ className?: string }>;

const Card: React.FC<Props> = ({ className = '', children }) => {
  return (
    <div
      className={`rounded-2xl border shadow-sm ${className}`}
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      {children}
    </div>
  );
};

export default Card;

