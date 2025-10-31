import { Flexible } from '@/types/search';
import {
  getTranslation,
  translate,
  type SupportedLanguages,
} from '@/utils/i18n';
import React, { useCallback, useState } from 'react';
import AppButton from '../../Common/AppButton';
interface SelectDateProps {
  lang?: SupportedLanguages;
  flexible: Flexible | null;
  onUpdate: (flexible: Flexible) => void;
}
const TabFlexible: React.FC<SelectDateProps> = ({
  flexible,
  lang = 'es',
  onUpdate,
}) => {
  const t = getTranslation(lang);
  const [flexibleLocal, setFlexibleLocal] = useState<Flexible | null>(flexible);
  const handleSortChange = useCallback(
    (value: Flexible) => {
      setFlexibleLocal(value);
      onUpdate(value);
    },
    [onUpdate]
  );
  return (
    <div className="tab-content space-y-4 pt-8">
      <p className="text-center">{t.search.dates.howLongStay}</p>
      <div className="flex flex-wrap items-center justify-center gap-y-2">
        {Object.values(Flexible).map((type) => (
          <AppButton
            key={type}
            size="md"
            label={translate(t, `search.dates.${type.toLowerCase()}`)}
            outline={flexibleLocal != type}
            className={'btn-secondary mx-2'}
            onClick={() => handleSortChange(type)}
            data-testid={`test-tab-flexible-${type}`}
          ></AppButton>
        ))}
      </div>
    </div>
  );
};

export default TabFlexible;
