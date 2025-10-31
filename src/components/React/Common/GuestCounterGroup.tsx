import type { Guests } from '@/types/search';

interface GuestCounterGroupProps {
  type: keyof Guests;
  value: number;
  label: string;
  description: string;
  onChange: (value: number) => void;
  canIncrease: boolean;
  canDecrease: boolean;
}

const GuestCounterGroup: React.FC<GuestCounterGroupProps> = ({
  type,
  value,
  label,
  description,
  onChange,
  canIncrease,
  canDecrease,
}) => (
  <li className="m-4 flex flex-col">
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-start space-y-1 text-xs">
        <span>{label}</span>
        <span className="text-neutral">{description}</span>
      </div>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChange(value - 1)}
          data-testid={`decrease-${type}`}
          className={`btn btn-outline btn-circle btn-primary btn-xs rounded-full text-base font-semibold ${
            !canDecrease ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          -
        </button>
        <span
          className="w-[20px] text-center text-sm font-medium"
          data-testid={`${type}-count`}
        >
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          data-testid={`increase-${type}`}
          className={`btn btn-outline btn-circle btn-primary btn-xs rounded-full text-base font-semibold ${
            !canIncrease ? 'cursor-not-allowed opacity-50' : ''
          }`}
        >
          +
        </button>
      </div>
    </div>
  </li>
);
export default GuestCounterGroup;
