import React from 'react';

type Props = React.PropsWithChildren<{ className?: string }>;

const Card: React.FC<Props> = ({ className = '', children }) => {
  return <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm ${className}`}>{children}</div>;
};

export default Card;

