import CheckboxItem from '@/components/React/Common/CheckboxItem';
import CollapseCard from '@/components/React/Common/CollapseCard';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { useCallback, useMemo, useState } from 'react';
import {
  buildDeleteReasons,
  type DeleteSpaceDict,
  type ReasonCode,
  type ReasonGroupKey,
} from '@/components/React/Utils/edit-listing/deleteReasons';
import { useEditability } from '@/components/React/Host/EditListing/EditabilityContext';

interface Props {
  lang?: SupportedLanguages;
  showManTitle?: boolean;
  initialSelectedCodes?: ReasonCode[];
  onSelectionChange?: (codes: ReasonCode[]) => void;
}

export default function DeleteListing({
  lang = 'es',
  showManTitle = true,
  initialSelectedCodes = [],
  onSelectionChange,
}: Props) {
  const t = getTranslation(lang);
  const { isReadOnly } = useEditability();

  const dict: DeleteSpaceDict = t.hostContent.editListing.content.deleteSpace;

  const groups = useMemo(() => buildDeleteReasons(dict), [dict]);

  const [selected, setSelected] = useState<Set<ReasonCode>>(
    () => new Set(initialSelectedCodes)
  );

  const emitChange = useCallback(
    (next: Set<ReasonCode>) => {
      if (onSelectionChange) {
        onSelectionChange(Array.from(next).sort((a, b) => a - b));
      }
    },
    [onSelectionChange]
  );

  const toggleCode = useCallback(
    (code: ReasonCode) => {
      setSelected((prev) => {
        const next = new Set(prev);
        if (next.has(code)) {
          next.delete(code);
        } else {
          next.add(code);
        }
        emitChange(next);
        return next;
      });
    },
    [emitChange]
  );

  const isChecked = useCallback(
    (code: ReasonCode) => selected.has(code),
    [selected]
  );

  const renderGroup = (title: string, key: ReasonGroupKey) => (
    <CollapseCard title={title}>
      {groups[key].map((item) => (
        <CheckboxItem
          key={item.id}
          id={item.id}
          name={item.name}
          label={item.label}
          checked={isChecked(item.code)}
          onChange={() => toggleCode(item.code)}
          disabled={isReadOnly}
        />
      ))}
    </CollapseCard>
  );

  return (
    <div className="space-y-8 px-1">
      {showManTitle && <h1 className="edit-listing-title">{dict.question}</h1>}

      {renderGroup(dict.noLongerCanHost.title, 'noLongerCanHost')}
      {renderGroup(dict.cannotHost.title, 'cannotHost')}
      {renderGroup(dict.expectedMoreFromHost.title, 'expectedMoreFromHost')}
      {renderGroup(
        dict.expectedToEarnMoreMoney.title,
        'expectedToEarnMoreMoney'
      )}
      {renderGroup(dict.expectedMoreFromGuests.title, 'expectedMoreFromGuests')}
      {renderGroup(dict.duplicateSpace.title, 'duplicateSpace')}
    </div>
  );
}
