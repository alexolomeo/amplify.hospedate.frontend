import type { RoomsAndBeds } from '@/types/search';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import QuantitySelector from '../../Common/QuantitySelector';

interface Props {
  maxBaths: number;
  maxBedrooms: number;
  maxBeds: number;
  baths: number;
  bedrooms: number;
  beds: number;
  lang?: SupportedLanguages;
  onUpdateRooms: (baths: number, bedrooms: number, beds: number) => void;
}

export default function Rooms({
  maxBaths,
  maxBedrooms,
  maxBeds,
  baths,
  bedrooms,
  beds,
  lang = 'es',
  onUpdateRooms,
}: Props) {
  const roomsTypes: (keyof RoomsAndBeds)[] = ['baths', 'bedrooms', 'beds'];
  const t = getTranslation(lang);
  const maxValues: Record<keyof RoomsAndBeds, number> = {
    baths: maxBaths,
    bedrooms: maxBedrooms,
    beds: maxBeds,
  };

  const handleChange = (
    type: keyof RoomsAndBeds,
    currentValue: number,
    change: number
  ) => {
    const newValue = currentValue + change;

    if (newValue < 0 || newValue > maxValues[type]) {
      return;
    }

    if (newValue === currentValue) {
      return;
    }
    const updatedBaths = type === 'baths' ? newValue : baths;
    const updatedBedrooms = type === 'bedrooms' ? newValue : bedrooms;
    const updatedBeds = type === 'beds' ? newValue : beds;

    onUpdateRooms(updatedBaths, updatedBedrooms, updatedBeds);
  };

  const currentValues: Record<keyof RoomsAndBeds, number> = {
    baths,
    bedrooms,
    beds,
  };

  return (
    <div className="mx-auto w-full space-y-3">
      <p className="text-sm font-bold" data-testid="test-rooms-title">
        {t.filter.roomsAndBeds}
      </p>
      <ul className="space-y-2">
        {roomsTypes.map((roomType) => (
          <QuantitySelector
            key={roomType}
            title={translate(t, t.filter[roomType])}
            value={currentValues[roomType]}
            onDecrement={() =>
              handleChange(roomType, currentValues[roomType], -1)
            }
            onIncrement={() =>
              handleChange(roomType, currentValues[roomType], 1)
            }
            min={0}
            max={maxValues[roomType]}
            titleClassName={'leading-3 font-normal'}
          ></QuantitySelector>
        ))}
      </ul>
    </div>
  );
}
