import React from 'react';
import InformationCircleIcon from '@/icons/information-circle.svg?react';

interface NotFoundStateProps {
  message?: string;
  className?: string;
}

const NotFoundState = ({
  message = 'Data not found',
  className = '',
}: NotFoundStateProps) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 ${className}`}
    >
      <InformationCircleIcon className="text-base-300 mb-4 h-16 w-16" />
      <div className="text-base-content/70 text-center text-base font-medium">
        {message}
      </div>
    </div>
  );
};

export default NotFoundState;
