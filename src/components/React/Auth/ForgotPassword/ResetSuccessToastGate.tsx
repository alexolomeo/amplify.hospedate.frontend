import { useEffect, useRef } from 'react';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { showToast } from '@/components/ui/toast';

interface Props {
  lang: SupportedLanguages;
}

const ResetSuccessToastGate: React.FC<Props> = ({ lang }) => {
  const hasShownRef = useRef(false);

  useEffect(() => {
    if (hasShownRef.current) return;

    const params = new URLSearchParams(window.location.search);
    const isResetOk = params.get('reset') === 'ok';
    if (!isResetOk) return;

    hasShownRef.current = true;

    const t = getTranslation(lang);
    const title = t.forgotPassword?.title;
    const msg = t.forgotPassword?.resetPage.changedOk;

    showToast.success(msg, title);

    params.delete('reset');
    const qs = params.toString();
    const newUrl =
      window.location.pathname + (qs ? `?${qs}` : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }, [lang]);

  return null;
};

export default ResetSuccessToastGate;
