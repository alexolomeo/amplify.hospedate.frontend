import React from 'react';
import { getListingStatusReasons } from '@/services/host/edit-listing/listingstate';
import { AppModal } from '@/components/React/Profile/components/AppModal';
import DeleteListing from '../Content/Preferences/DeleteListing';
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedReasonIds: number[]) => void;
  title: string;
  ctaLabel: string;
  cancelLabel?: string;
}
export default function UnpublishReasonsModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  ctaLabel,
}: Props) {
  const [loading, setLoading] = React.useState(false);
  const [, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Record<number, boolean>>({});

  React.useEffect(() => {
    if (!isOpen) {
      setSelected({});
      setError(null);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setError(null);
    getListingStatusReasons(ctrl.signal)
      .catch((e) => setError(e?.message))
      .finally(() => setLoading(false));
    return () => ctrl.abort();
  }, [isOpen]);

  const handleSelectionChange = React.useCallback((codes: number[]) => {
    const next: Record<number, boolean> = {};
    codes.forEach((c) => {
      next[c] = true;
    });
    setSelected(next);
  }, []);

  const selectedIds = React.useMemo(
    () =>
      Object.keys(selected)
        .map(Number)
        .filter((k) => selected[k]),
    [selected]
  );

  const footer = (
    <div className="flex w-full justify-end gap-3">
      <button
        type="button"
        onClick={() => onConfirm(selectedIds)}
        disabled={loading || selectedIds.length === 0}
        className="rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60"
      >
        {ctaLabel}
      </button>
    </div>
  );

  return (
    <AppModal
      id="unpublish-reasons"
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-[500px]"
      maxHeight="max-h-[100vh]"
      maxHeightBody="max-h-[72vh]"
      titleSize="text-lg md:text-xl font-extrabold"
      footer={footer}
      showCloseButton
      showHeader
    >
      <div className="flex flex-col gap-4">
        <DeleteListing
          showManTitle={false}
          onSelectionChange={handleSelectionChange}
        />
      </div>
    </AppModal>
  );
}
