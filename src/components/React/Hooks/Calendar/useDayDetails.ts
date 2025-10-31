import { useState, useEffect } from 'react';
import {
  fetchCalendarAvailability,
  updateCalendarAvailability,
} from '@/services/host/calendar';
import {
  SelectedType,
  type Availability,
  type UpdateAvailability,
} from '@/types/host/calendar/availability';
import type { SelectedDayInfo } from '../../Host/Calendar/CalendarContainer';

interface UseDayDetailsProps {
  dayInfo: SelectedDayInfo | null;
  listingId: number;
  refetchCalendar: () => Promise<void>;
  priceMin: number;
  priceMax: number;
  priceErrorMessage: string;
}

const initialData: UpdateAvailability = {
  availabilitySection: { availability: null },
  priceSection: { nightlyPrice: null },
  note: '',
};

export const useDayDetails = ({
  dayInfo,
  listingId,
  refetchCalendar,
  priceMax,
  priceMin,
  priceErrorMessage,
}: UseDayDetailsProps) => {
  const [availabilityData, setAvailabilityData] = useState<Availability | null>(
    null
  );
  const [isPriceTouched, setIsPriceTouched] = useState(false);
  const [initialUpdateAvailability, setInitialUpdateAvailability] =
    useState<UpdateAvailability | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [updateAvailability, setUpdateAvailability] =
    useState<UpdateAvailability>(initialData);

  useEffect(() => {
    const getData = async () => {
      if (!dayInfo || !dayInfo.dates || dayInfo.dates.length === 0) {
        setAvailabilityData(null);
        return;
      }
      setValidationError(null);
      setIsLoading(true);
      setError(null);
      setAvailabilityData(null);
      try {
        const data = await fetchCalendarAvailability(listingId, dayInfo.dates);
        if (data) {
          setAvailabilityData(data);
          setError(null);
        } else {
          setError('Failed to load availability data.');
        }
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, [dayInfo, listingId]);

  useEffect(() => {
    if (availabilityData) {
      const availability: UpdateAvailability = {
        availabilitySection: {
          availability:
            availabilityData.availabilitySection.selectedType ===
            SelectedType.Simple
              ? (availabilityData.availabilitySection.availability ?? null)
              : null,
        },
        priceSection: {
          nightlyPrice:
            availabilityData.priceSection.selectedType === SelectedType.Simple
              ? (availabilityData.priceSection.nightlyPrice ?? null)
              : null,
        },
        note: availabilityData.note ?? '',
      };
      setUpdateAvailability(availability);
      setInitialUpdateAvailability(availability);
    }
  }, [availabilityData]);

  const handleSave = async () => {
    if (
      updateAvailability.priceSection?.nightlyPrice &&
      (updateAvailability.priceSection?.nightlyPrice < priceMin ||
        updateAvailability.priceSection?.nightlyPrice > priceMax)
    ) {
      setValidationError(priceErrorMessage);
      return;
    }
    setValidationError(null);
    setIsSaving(true);
    setError(null);
    try {
      if (dayInfo && dayInfo.dates) {
        const initialData: UpdateAvailability = {
          availabilitySection:
            initialUpdateAvailability?.availabilitySection?.availability ===
            updateAvailability?.availabilitySection?.availability
              ? undefined
              : updateAvailability?.availabilitySection,
          priceSection:
            initialUpdateAvailability?.priceSection?.nightlyPrice ===
            updateAvailability?.priceSection?.nightlyPrice
              ? undefined
              : updateAvailability?.priceSection,
          note:
            initialUpdateAvailability?.note === updateAvailability?.note
              ? undefined
              : updateAvailability?.note,
        };
        const success = await updateCalendarAvailability(
          listingId,
          dayInfo.dates,
          initialData
        );
        if (success) {
          refetchCalendar();
          setInitialUpdateAvailability(updateAvailability);
        } else {
          setError('Failed to save changes. Please try again.');
        }
      }
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvailabilityChange = (isAvailable: boolean) => {
    setUpdateAvailability((prev) => ({
      ...prev,
      availabilitySection: { availability: isAvailable },
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPriceTouched(true);
    const value = e.target.value;
    const numberValue = Number(value);
    let validatedValue: number | null = null;
    if (value === '') {
      validatedValue = null;
    } else if (Number.isFinite(numberValue) && numberValue > 0) {
      validatedValue = numberValue;
    }
    const shouldValidate =
      isPriceTouched &&
      (validatedValue === null ||
        validatedValue < priceMin ||
        validatedValue > priceMax);

    if (shouldValidate) {
      setValidationError(priceErrorMessage);
    } else {
      setValidationError(null);
    }
    setUpdateAvailability((prev) => ({
      ...prev,
      priceSection: { nightlyPrice: validatedValue },
    }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateAvailability((prev) => ({
      ...prev,
      note: e.target.value === '' ? null : e.target.value,
    }));
  };

  const isEnabledNote =
    dayInfo &&
    dayInfo.dates.length === 1 &&
    updateAvailability.availabilitySection &&
    updateAvailability.availabilitySection.availability === false;

  return {
    availabilityData,
    isLoading,
    isSaving,
    error,
    updateAvailability,
    initialUpdateAvailability,
    validationError,
    handleSave,
    handleAvailabilityChange,
    handlePriceChange,
    handleNoteChange,
    isEnabledNote,
  };
};
