import { useStore } from '@nanostores/react';
import { $userStore } from '@/stores/userStore';
import { getTranslation, type SupportedLanguages } from '@/utils/i18n';
import Chevron from '/src/icons/chevron-right.svg?react';
import { useEffect, useState } from 'react';
import { getPayments, type BankAccount } from '@/services/payments/payments';
import AddBankAccountModal, {
  type AddBankForm,
} from '../Common/Payments/AddBankAccountModal';
import ChevronLeftIcon from '/src/icons/chevron-left.svg?react';
import AppButton from '@/components/React/Common/AppButton';
import {
  createBankAccount,
  deleteBankAccount,
} from '@/services/payments/bankAccounts';
import BankAccountSuccessModal from '../Common/Payments/BankAccountSuccessModal';
import { navigate } from 'astro/virtual-modules/transitions-router.js';
import DeleteBankAccountModal from '../Common/Payments/DeleteBankAccountModal';

interface Props {
  lang: SupportedLanguages;
}

export default function EarningsView({ lang }: Props) {
  const user = useStore($userStore);
  const t = getTranslation(lang);

  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [posting, setPosting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectAccount, setSelectAccount] = useState<BankAccount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const c = new AbortController();
    (async () => {
      try {
        const res = await getPayments(c.signal);
        setAccounts(res?.payoutInfo?.bankAccounts ?? []);
      } catch {
        setErr('Error al cargar las cuentas bancarias.');
      } finally {
        setLoading(false);
      }
    })();

    return () => c.abort();
  }, []);

  const mask = (num: string) => num?.replace(/\d(?=\d{4})/g, '•');

  const handleVerify = async (data: AddBankForm) => {
    setPosting(true);
    try {
      const created = await createBankAccount({
        bankName: data.bankName,
        accountType: data.accountType,
        accountNumber: data.accountNumber,
        accountHolderName: data.holderName,
        alias: data.alias,
      });

      setAccounts((prev) => [
        ...prev,
        {
          id: created.id ?? Date.now(),
          alias: created.alias ?? data.alias,
          bankName: created.bankName ?? data.bankName,
          accountNumber: created.accountNumber ?? data.accountNumber,
        },
      ]);

      setOpenAdd(false);
      setOpenSuccess(true);
      try {
        const refreshed = await getPayments();
        setAccounts(refreshed.payoutInfo.bankAccounts);
      } catch {
        setErr('Error');
      }
    } catch {
      setErr('Error al crear la cuenta.');
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectAccount) return;
    const id = selectAccount.id;
    setDeletingId(id);
    setIsDeleting(true);
    try {
      await deleteBankAccount(id);
      const refreshed = await getPayments();
      setAccounts(refreshed.payoutInfo.bankAccounts);
    } catch {
      setErr('Error al eliminar la cuenta.');
    } finally {
      setOpenDelete(false);
      setIsDeleting(false);
      setDeletingId(null);
    }
  };

  const selectDelete = (account: BankAccount) => {
    setSelectAccount(account);
    setOpenDelete(true);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col gap-4 px-4 pt-8 pb-24 sm:px-6 sm:pt-10 md:px-12 md:pt-12 xl:px-[140px]">
      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-2 md:min-w-sm">
          {/* Back button */}
          <div
            className="flex h-8 w-8 cursor-pointer items-center justify-start p-0"
            onClick={() => {
              navigate('/users/account');
            }}
          >
            <ChevronLeftIcon />
          </div>
          <div className="flex items-center text-xl leading-8 font-bold sm:text-2xl">
            {t.hostContent.account.paymentsTitle}
          </div>

          <div className="flex flex-row items-center gap-2">
            <div className="flex h-9 flex-row items-center gap-1.5">
              <div className="text-sm leading-5 font-normal">
                {t.users.loginAndPrivacyBreadcrumbAccount}
              </div>
              <Chevron className="text-gray-400" />
            </div>
            <div className="flex h-9 flex-row items-center gap-1.5">
              <div className="text-sm leading-5 font-normal">
                {t.hostContent.account.personalInfoTitle}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full lg:max-w-lg xl:max-w-2xl">
          <div className="pt-6">
            <h2 className="text-neutral text-2xl">
              {t.hostContent.account.paymentsTitle}
            </h2>

            {!loading && !err && accounts.length === 0 && (
              <div className="mt-6 flex items-center justify-between gap-5">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold">
                    {t.earnings.registerTitle}
                  </p>
                  <p className="text-neutral text-sm">
                    {t.earnings.registerDescription}
                  </p>
                </div>
                <AppButton
                  label={t.earnings.setUp}
                  onClick={() => setOpenAdd(true)}
                  size="md"
                  fontSemibold
                  rounded
                  disabled={posting}
                />
              </div>
            )}

            {!loading && !err && accounts.length > 0 && (
              <>
                <ul className="m-0 mt-4 space-y-3 p-0">
                  {accounts.map((a) => (
                    <li
                      key={a.id}
                      className="mt-2 flex items-center justify-between"
                    >
                      <div className="flex flex-col gap-1 text-sm">
                        <p className="text-neutral">
                          {t.earnings.accountAlias}
                        </p>
                        <p className="text-neutral font-semibold">{a.alias}</p>
                        <p className="text-neutral">
                          {t.earnings.accountLast4Digits}
                        </p>
                        <p className="text-neutral font-semibold">
                          {a.bankName} · {mask(a.accountNumber)}
                        </p>
                        <button
                          className="text-error text-md cursor-pointer pt-4 text-left underline"
                          onClick={() => selectDelete(a)}
                          disabled={deletingId === a.id}
                        >
                          {t.earnings.delete}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
      <AddBankAccountModal
        isOpen={openAdd}
        onClose={() => setOpenAdd(false)}
        onVerify={handleVerify}
        lang={lang}
      />
      <BankAccountSuccessModal
        isOpen={openSuccess}
        onClose={() => setOpenSuccess(false)}
        lang={lang}
      />
      <DeleteBankAccountModal
        isOpen={openDelete}
        lang={lang}
        deleteBankAccount={handleDelete}
        isDeleting={isDeleting}
        onClose={() => !isDeleting && setOpenDelete(false)}
      />
    </div>
  );
}
