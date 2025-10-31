import React from 'react';

interface InfoRowItem {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}

interface InfoRowSectionProps {
  items: InfoRowItem[];
  title?: string;
  className?: string;
}

const InfoRowSection: React.FC<InfoRowSectionProps> = ({
  items,
  title,
  className = '',
}) => (
  <div
    className={`flex shrink-0 flex-col items-start justify-start gap-0.5 self-stretch ${className}`}
  >
    {title && (
      <h3 className="text-base-content text-lg font-semibold">{title}</h3>
    )}

    {items.map((item, idx) => (
      <div
        key={idx}
        className={`flex h-8 w-full flex-row items-center justify-between ${idx < items.length - 1 ? 'border-neutral/20 border-b' : ''}`}
      >
        <div className="text-base-content flex items-center text-sm leading-5 font-normal">
          {item.icon && <span className="mr-2">{item.icon}</span>}
          {item.label}
        </div>
        <div className="text-neutral flex items-center justify-end text-right text-xs leading-3 font-normal">
          {item.value}
        </div>
      </div>
    ))}
  </div>
);

export default InfoRowSection;
