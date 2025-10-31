import React from 'react';
import ShieldCheckIcon from '@/icons/shield-check.svg?react';
import type { translate } from '@/utils/i18n';
import { navigate } from 'astro/virtual-modules/transitions-router.js';

interface UnauthorizedPageProps {
  t: ReturnType<typeof translate>;
}

const UnauthorizedPage: React.FC<UnauthorizedPageProps> = ({ t }) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-white px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-6">
        <div className="bg-primary/10 rounded-full p-4">
          <ShieldCheckIcon className="text-primary h-12 w-12" />
        </div>
        <h1 className="text-center text-2xl font-bold text-gray-900">
          {t.unauthorized.title}
        </h1>
        <p className="text-center text-gray-600">
          {t.unauthorized.description}
        </p>
        <button
          className="bg-primary hover:bg-primary/90 mt-4 cursor-pointer rounded-lg px-6 py-2 font-semibold text-white transition"
          onClick={() => navigate('/')}
        >
          {t.unauthorized.goBack}
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
