import { getTranslation, type SupportedLanguages } from '@/utils/i18n.ts';
import Rooms from './Filters/Rooms';
import { getSafeArray } from '@/utils/displayHelpers';
import SelectAmenities from './Filters/SelectAmenities';
import SelectTypes from './Filters/SelectTypes';
import { useFilterState } from '../Hooks/Search/useFilterState';
import { useSearchInit } from '../Hooks/Search/useSearchInit';
import { useStore } from '@nanostores/react';
import { $filters } from '@/stores/searchStore';
import type { FilterState } from '@/types/search';
import RangePrice from './Filters/RangePrice';
import { useCallback } from 'react';

export interface Props {
  lang?: SupportedLanguages;
  onUpdateFilters: (state: FilterState) => void;
}
const ModalFilter: React.FC<Props> = ({ lang = 'es', onUpdateFilters }) => {
  const filters = useStore($filters);
  const t = getTranslation(lang);
  const { state, actions } = useFilterState();
  const { loading, error } = useSearchInit(actions.loadFromUrl);

  const handleChange = useCallback(() => {
    actions.analyzeFilterCount();
    onUpdateFilters(state);
  }, [actions, onUpdateFilters, state]);

  if (loading) {
    return <></>;
  }
  if (error) {
    return <></>;
  }
  if (!filters) {
    return <></>;
  }

  const amenities = getSafeArray(filters.amenities, []);
  const reservations = getSafeArray(filters.reservationOptions, []);
  const propertyTypes = getSafeArray(filters.propertyTypes, []);

  return (
    <>
      <dialog id="filter-modal" className="modal">
        <div className="modal-box bg-base-100 relative max-h-[100vh] max-w-md rounded-[40px]">
          <div className="sticky top-0 z-10">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-center font-bold">{t.filter.title}</p>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-soft btn-primary">
                  ✕
                </button>
              </form>
            </div>
          </div>
          <div className="max-h-[70vh] overflow-y-auto">
            <div className="flex w-full flex-col gap-y-5 px-2 py-2">
              {/* Rango de precios */}
              <RangePrice
                currentMinPrice={state.price.min}
                currentMaxPrice={state.price.max}
                minAllowedPrice={filters.priceRange.min}
                maxAllowedPrice={filters.priceRange.max}
                currency={filters.priceRange.currency}
                onUpdatePrices={actions.updatePrice}
                lang={lang}
              ></RangePrice>
              <div className="border-base-200 border-b"></div>
              {/* Habtaciones y Camas */}
              <Rooms
                maxBaths={filters.roomsAndBeds.baths ?? 8}
                maxBedrooms={filters.roomsAndBeds.bedrooms ?? 8}
                maxBeds={filters.roomsAndBeds.beds ?? 8}
                baths={state.rooms.baths}
                bedrooms={state.rooms.bedrooms}
                beds={state.rooms.beds}
                lang={lang}
                onUpdateRooms={actions.updateRooms}
              ></Rooms>
              <div className="border-base-200 border-b"></div>
              {/* Amenidades */}
              <SelectAmenities
                selectId={state.amenities}
                amenities={amenities}
                lang={lang}
                onUpdateAmenities={actions.setAmenities}
              ></SelectAmenities>
              <div className="border-base-200 border-b"></div>
              {/* Opciones de Reserva */}
              <SelectTypes
                types={reservations}
                lang={lang}
                title={t.filter.reservationOptions}
                onUpdateTypes={actions.setReservations}
                selectId={state.reservations}
                folder="reservation-options"
                featureTypes="reservationOptions"
              ></SelectTypes>
              <div className="border-base-200 border-b"></div>
              {/* Tipos de propiedad*/}
              <SelectTypes
                types={propertyTypes}
                lang={lang}
                title={t.filter.propertyType}
                onUpdateTypes={actions.setPropertyTypes}
                selectId={state.propertyTypeGroups}
                folder="place-types"
                featureTypes="placeTypes"
              ></SelectTypes>
            </div>
          </div>
          <div className="sticky bottom-0 z-10">
            <div className="border-base-200 border-b"></div>
            <div className="flex justify-between pt-3">
              <button className="btn btn-ghost" onClick={actions.resetFilters}>
                {t.filter.clearData}
              </button>
              <form method="dialog">
                <button
                  className="btn btn-primary mx-5 rounded-full"
                  onClick={handleChange}
                >
                  {t.filter.showResults}
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalFilter;
