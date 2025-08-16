import React from 'react';

type Props = React.PropsWithChildren<{ className?: string }>;

const Card = React.forwardRef<HTMLDivElement, Props>(({ className = '', children }, ref) => {
  return (
    <div
      ref={ref}
      className={`rounded-2xl border shadow-sm ${className}`}
      style={{ background: 'var(--card-bg)', borderColor: 'var(--card-border)' }}
    >
      {children}
    </div>
  );
});
Card.displayName = 'Card';

export default Card;

