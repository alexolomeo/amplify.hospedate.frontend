import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import CollapseCard from '../../Common/CollapseCard';
import ToggleSwitch from '../../Common/ToggleSwitch';
import {
  EnumAdvanceNoticeHours,
  type AvailabilitySection,
  type CalendarPreferenceSettingCatalog,
} from '@/types/host/calendar/preferenceSetting';
import SelectField from '@/components/React/Common/SelectField';

interface Props {
  lang: SupportedLanguages;
  availability: AvailabilitySection;
  onAvailabilityChange: (newPrices: AvailabilitySection) => void;
  catalog: CalendarPreferenceSettingCatalog;
}

export default function AvailabilityPanel({
  lang,
  availability,
  onAvailabilityChange,
  catalog,
}: Props) {
  const t = getTranslation(lang);
  const availabilityText = t.hostContent.calendar;
  const handleTripDurationChange = (field: 'min' | 'max', value: string) => {
    const v = Number(value);
    const nextVal = Number.isFinite(v) && v >= 0 ? v : 0;
    const { min, max } = availability.tripDuration;

    let nextMin = min;
    let nextMax = max;

    if (field === 'min') {
      nextMin = nextVal;
      if (nextMax !== 0 && nextMin > nextMax) {
        nextMax = nextMin;
      }
    } else {
      nextMax = nextVal;
      if (nextMax !== 0 && nextMax < nextMin) {
        nextMin = nextMax;
      }
    }

    onAvailabilityChange({
      ...availability,
      tripDuration: {
        ...availability.tripDuration,
        min: nextMin,
        max: nextMax,
      },
    });
  };
  const handleToggleChange = (checked: boolean) => {
    onAvailabilityChange({
      ...availability,
      notice: {
        ...availability.notice,
        allowRequestSameDay: checked,
      },
    });
  };

  const currentCutoffName =
    catalog.availabilitySection?.sameDayAdvanceNoticeTime.find(
      (opt) => opt.id === availability.notice.sameDayAdvanceNoticeTime
    )?.name || '';

  const handleCutoffChange = (selectedName: string) => {
    const selectedOption =
      catalog.availabilitySection?.sameDayAdvanceNoticeTime.find(
        (opt) => opt.name === selectedName
      );
    if (selectedOption) {
      onAvailabilityChange({
        ...availability,
        notice: {
          ...availability.notice,
          sameDayAdvanceNoticeTime: selectedOption.id,
        },
      });
    }
  };

  const currentNoticeName =
    catalog.availabilitySection?.advanceNoticeHours.find(
      (opt) => opt.id === availability.notice.advanceNoticeHours
    )?.name || '';

  const translatedCurrentNotice = currentNoticeName
    ? t.hostContent.calendar.noticeOptions[
        currentNoticeName as keyof typeof t.hostContent.calendar.noticeOptions
      ]
    : '';

  const translatedNoticeOptions =
    catalog.availabilitySection.advanceNoticeHours.map(
      (opt) =>
        t.hostContent.calendar.noticeOptions[
          opt.name as keyof typeof t.hostContent.calendar.noticeOptions
        ]
    );
  const handleNoticeChange = (selectedTranslation: string) => {
    const selectedOption = catalog.availabilitySection.advanceNoticeHours.find(
      (opt) => {
        const translation =
          t.hostContent.calendar.noticeOptions[
            opt.name as keyof typeof t.hostContent.calendar.noticeOptions
          ];
        return translation === selectedTranslation;
      }
    );
    if (selectedOption) {
      onAvailabilityChange({
        ...availability,
        notice: {
          ...availability.notice,
          advanceNoticeHours: selectedOption.id,
        },
      });
    }
  };
  return (
    <div className="flex flex-col items-center justify-center gap-y-4 p-1">
      <CollapseCard title={availabilityText.stayDuration}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-neutral text-sm">
              {availabilityText.minNights}
            </label>
            <input
              type="number"
              value={
                availability.tripDuration.min === 0
                  ? ''
                  : availability.tripDuration.min
              }
              onChange={(e) => handleTripDurationChange('min', e.target.value)}
              min={0}
              className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-neutral text-sm">
              {availabilityText.maxNights}
            </label>
            <input
              type="number"
              value={
                availability.tripDuration.max === 0
                  ? ''
                  : availability.tripDuration.max
              }
              onChange={(e) => handleTripDurationChange('max', e.target.value)}
              min={0}
              className="input focus:border-primary w-full rounded-full text-base font-semibold outline-none focus:ring-0 focus:outline-none"
            />
          </div>
        </div>
      </CollapseCard>

      <CollapseCard title={availabilityText.notice}>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-neutral pb-1 text-xs leading-none tracking-tight">
              {availabilityText.noticeDescription}
            </p>
            <SelectField
              options={translatedNoticeOptions}
              value={translatedCurrentNotice}
              onChange={handleNoticeChange}
            />
          </div>
          {availability.notice.advanceNoticeHours ===
            EnumAdvanceNoticeHours.SAME_DAY && (
            <div>
              <p className="text-neutral pb-1 text-xs leading-none tracking-tight">
                {availabilityText.sameDayCheckin}
              </p>
              <SelectField
                options={catalog.availabilitySection.sameDayAdvanceNoticeTime.map(
                  (opt) => opt.name
                )}
                value={currentCutoffName}
                onChange={handleCutoffChange}
              />
            </div>
          )}

          <ToggleSwitch
            title={availabilityText.allowSameDayRequests}
            description={availabilityText.reviewAndApprove}
            checked={availability.notice.allowRequestSameDay}
            onChange={handleToggleChange}
          />
        </div>
      </CollapseCard>
    </div>
  );
}
