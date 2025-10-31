import React, { createContext, useContext } from 'react';
import type { ListingStatus } from '@/types/host/edit-listing/editListingValues';
import {
  getEditModeForStatus,
  type EditMode,
} from '@/components/React/Utils/edit-listing/editability';

type Editability = {
  status?: ListingStatus;
  mode: EditMode;
  isReadOnly: boolean;
};

const EditabilityContext = createContext<Editability | undefined>(undefined);

export function useEditability(): Editability {
  const ctx = useContext(EditabilityContext);
  if (ctx) return ctx;

  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'EditabilityProvider is missing. Falling back to read-only mode to avoid unintended edits.'
    );
  }
  return { status: undefined, mode: 'readOnly', isReadOnly: true };
}

export function EditabilityProvider({
  status,
  children,
}: {
  status?: ListingStatus;
  children: React.ReactNode;
}) {
  const mode = getEditModeForStatus(status);
  return (
    <EditabilityContext.Provider
      value={{ status, mode, isReadOnly: mode === 'readOnly' }}
    >
      {children}
    </EditabilityContext.Provider>
  );
}
