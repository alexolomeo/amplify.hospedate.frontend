import React from 'react';
import { ToastProvider } from './toast';

const GlobalToastProvider: React.FC = () => {
  return (
    <ToastProvider>
      <div style={{ display: 'none' }} />
    </ToastProvider>
  );
};

export default GlobalToastProvider;
