import { useState, useEffect, useCallback } from 'react';
import type { CommonModalProps } from '../Common/Modal';
import Modal from '../Common/Modal';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { Button } from '@/components/ui/button';

interface PreferredNameModalProps
  extends Omit<CommonModalProps, 'children' | 'title' | 'footer'> {
  onCancel: () => void;
  onSave: (preferredName: string) => void;
  lang: SupportedLanguages;
  preferredName?: string;
}

export default function PreferredNameModal({
  open,
  onClose,
  onCancel,
  onSave,
  lang,
  preferredName = '',
  ...modalProps
}: PreferredNameModalProps) {
  const t = getTranslation(lang);

  const [preferredNameValue, setPreferredNameValue] = useState(preferredName);
  const [preferredNameError, setPreferredNameError] = useState('');

  // Memoize only the input change handler to avoid unnecessary re-renders
  const handlePreferredNameChange = useCallback((value: string) => {
    setPreferredNameValue(value);
    setPreferredNameError('');
  }, []);

  const handleCancel = () => {
    setPreferredNameValue(preferredName);
    setPreferredNameError('');
    onCancel();
  };

  const handleSave = () => {
    const preferredNameTrimmed = preferredNameValue.trim();
    onSave(preferredNameTrimmed);
  };

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setPreferredNameValue(preferredName);
      setPreferredNameError('');
    }
  }, [open, preferredName]);

  // Check if form is valid - preferred name is optional and any character is allowed
  const isFormValid = true; // Always valid since no restrictions

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t.users.addOrModifyPreferredNameTitle}
      showCancelButton={false}
      widthClass="max-w-sm"
      centerContent={false}
      lang={lang}
      {...modalProps}
      footer={
        <div className="flex w-full justify-between gap-4">
          <button
            onClick={handleCancel}
            className="text-base-content flex h-12 cursor-pointer items-center justify-center rounded-[16px] bg-transparent px-4 text-sm font-normal underline"
          >
            {t.users.cancel}
          </button>
          <Button
            onClick={handleSave}
            disabled={!isFormValid}
            className="bg-primary text-primary-content flex h-12 cursor-pointer items-center justify-center rounded-full px-4 font-semibold shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t.users.save}
          </Button>
        </div>
      }
    >
      <form
        id="preferred-name-form"
        className="modal-preferred-name bg-base-150 flex w-full flex-col gap-6 rounded-[40px]"
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        {/* Description */}
        <div className="text-neutral text-xs font-normal">
          {t.users.preferredNameModalDescription}
        </div>

        {/* Input */}
        <div className="text-input flex w-full flex-col gap-0">
          <label className="label-top-container flex items-center px-1">
            <span className="label-main text-neutral text-xs font-normal">
              {t.users.preferredNameLabel}
            </span>
          </label>
          <div className="input-container relative flex min-h-8 items-center gap-2 rounded-[12px] border border-[rgba(31,45,76,0.2)] bg-white px-3 py-1">
            <input
              type="text"
              placeholder={t.users.preferredNamePlaceholderText}
              className="text-base-content placeholder:text-placeholder flex-1 bg-transparent text-xs font-normal outline-none"
              value={preferredNameValue}
              onChange={(e) => handlePreferredNameChange(e.target.value)}
              name="preferredName"
            />
          </div>
          {preferredNameError && (
            <p className="mt-1 px-1 text-xs text-red-500">
              {preferredNameError}
            </p>
          )}
        </div>
      </form>
    </Modal>
  );
}
