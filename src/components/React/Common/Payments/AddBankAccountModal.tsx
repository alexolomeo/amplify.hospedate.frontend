import { useEffect, useMemo, useState } from 'react';
import Dropdown from '@/components/React/Common/Dropdown';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import { AppModal } from '../../Profile/components/AppModal';
import AppButton from '@/components/React/Common/AppButton';

import {
  getPaymentCatalogs,
  type CatalogsResponse,
  type BankCatalog,
  type AccountTypeCatalog,
} from '@/services/payments/catalogs';

export type AddBankForm = {
  bankName: string;
  accountType: string;
  accountNumber: string;
  holderName: string;
  alias: string;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (data: AddBankForm) => void;
  lang?: SupportedLanguages;
}

export default function AddBankAccountModal({
  isOpen,
  onClose,
  onVerify,
  lang = 'es',
}: Props) {
  const t = getTranslation(lang);
  const [catalogs, setCatalogs] = useState<CatalogsResponse | null>(null);
  const [loadingCat, setLoadingCat] = useState(false);
  const [catErr, setCatErr] = useState<string | null>(null);

  const [bankName, setBankName] = useState('');
  const [accountType, setAccountType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [holderName, setHolderName] = useState('');
  const [alias, setAlias] = useState('');

  useEffect(() => {
    if (isOpen) {
      setBankName('');
      setAccountType('');
      setAccountNumber('');
      setHolderName('');
      setAlias('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const c = new AbortController();
    setLoadingCat(true);
    setCatErr(null);

    getPaymentCatalogs(c.signal)
      .then((data) => {
        const uniqBanks = Array.from(
          new Map<string, BankCatalog>(
            data.banks.map((b) => [b.id, b])
          ).values()
        );
        const uniqAccountTypes = Array.from(
          new Map<string, AccountTypeCatalog>(
            data.accountTypes.map((a) => [a.id, a])
          ).values()
        );
        setCatalogs({ banks: uniqBanks, accountTypes: uniqAccountTypes });
      })
      .catch((e) => setCatErr(e?.message ?? 'Error cargando catálogos'))
      .finally(() => setLoadingCat(false));

    return () => c.abort();
  }, [isOpen]);

  const bankOptions = catalogs?.banks?.map((b) => b.name) ?? [];
  const accountTypeOptions = (catalogs?.accountTypes ?? []).map((a) =>
    t.earnings.accountTypes &&
    Object.prototype.hasOwnProperty.call(t.earnings.accountTypes, a.id)
      ? t.earnings.accountTypes[a.id as keyof typeof t.earnings.accountTypes]
      : a.name
  );
  const canSubmit =
    !loadingCat &&
    !!bankName.trim() &&
    !!accountType.trim() &&
    !!accountNumber.trim() &&
    !!holderName.trim() &&
    !!alias.trim();

  const norm = (s: string) => s.trim().toLowerCase();

  const bankNameToId = useMemo(() => {
    const map = new Map<string, string>();
    (catalogs?.banks ?? []).forEach((b) => map.set(norm(b.name), b.id));
    return map;
  }, [catalogs?.banks]);

  const accountTypeNameToId = useMemo(() => {
    const map = new Map<string, string>();
    (catalogs?.accountTypes ?? []).forEach((a) => {
      const original = a.name;
      const translated =
        t.earnings.accountTypes &&
        Object.prototype.hasOwnProperty.call(t.earnings.accountTypes, a.id)
          ? t.earnings.accountTypes[
              a.id as keyof typeof t.earnings.accountTypes
            ]
          : a.name;

      map.set(norm(original), a.id);
      map.set(norm(translated), a.id);
    });
    return map;
  }, [catalogs?.accountTypes, t]);

  const bankIdFromName = (name: string) => bankNameToId.get(norm(name)) ?? '';
  const accountTypeIdFromName = (name: string) =>
    accountTypeNameToId.get(norm(name)) ?? '';

  return (
    <AppModal
      id="add-bank-account"
      isOpen={isOpen}
      onClose={onClose}
      showHeader={true}
      title={t.earnings.addBankAccount}
      titleSize="text-xl"
      maxWidth="max-w-[560px]"
      maxHeight="max-h-[92vh]"
      maxHeightBody="max-h-[66vh]"
      footer={
        <div className="flex items-center justify-between">
          <AppButton
            type="button"
            label={t.hostContent.editListing.content.deleteSpace.cancel}
            variant="link"
            size="sm"
            onClick={onClose}
            className="!text-neutral hover:!text-base-content underline"
          />
          <AppButton
            type="button"
            label={t.earnings.setUp}
            onClick={() =>
              onVerify({
                bankName: bankIdFromName(bankName),
                accountType: accountTypeIdFromName(accountType),
                accountNumber,
                holderName,
                alias,
              })
            }
            size="md"
            rounded
            fontSemibold
            disabled={!canSubmit}
          />
        </div>
      }
    >
      <div className="space-y-4 pt-8">
        <div className="space-y-2">
          <label className="text-neutral block text-sm">
            {t.earnings.financialInstitution}
          </label>
          <Dropdown
            options={bankOptions}
            value={bankName}
            onChange={setBankName}
            lang={lang}
            className="w-full"
            buttonClassName="rounded-[16px]"
            buttonHeight="h-12"
            labelFontSize="text-base font-normal"
            disabled={loadingCat || !!catErr}
            placeholder={t.earnings.financialInstitution}
          />
        </div>

        {/* Account type */}
        <div className="space-y-2">
          <label className="text-neutral block text-sm">
            {t.earnings.accountType}
          </label>
          <Dropdown
            options={accountTypeOptions}
            value={accountType}
            onChange={setAccountType}
            lang={lang}
            className="w-full"
            buttonClassName="rounded-[16px]"
            buttonHeight="h-12"
            labelFontSize="text-base font-normal"
            disabled={loadingCat || !!catErr}
            placeholder={t.earnings.accountType}
          />
        </div>

        {/*Account number*/}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-neutral block text-sm">
              {t.earnings.accountNumber}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="2354325532"
              className="border-base-200 focus:border-primary h-12 w-full rounded-full border bg-white px-4 text-base outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-neutral block text-sm">
              {t.earnings.holderName}
            </label>
            <input
              type="text"
              value={holderName}
              onChange={(e) => setHolderName(e.target.value)}
              placeholder="Juan Ignacio Guzmán Palenque"
              className="border-base-200 focus:border-primary h-12 w-full rounded-full border bg-white px-4 text-base outline-none"
            />
          </div>
        </div>

        {/* Alias */}
        <div className="space-y-2">
          <label className="text-neutral block text-sm">
            {t.earnings.alias}
          </label>
          <input
            type="text"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder="Juan BCP"
            className="border-base-200 focus:border-primary h-12 w-full rounded-full border bg-white px-4 text-base outline-none"
          />
        </div>
      </div>
    </AppModal>
  );
}
