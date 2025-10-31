import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import ToastComponent from '../Common/Toast';

interface Toast {
  type: 'error' | 'warning' | 'success';
  message: string;
  autoClose?: boolean;
  duration?: number;
}

interface ConfirmToastOptions extends Toast {
  primaryLabel?: string;
  secondaryLabel?: string;
}

interface ToastContextProps {
  showToast: (toast: Toast) => void;
  hideToast: () => void;
  confirmToast: (toast: ConfirmToastOptions) => Promise<boolean>;
}

interface InternalToast extends ConfirmToastOptions {
  id: number;
  resolve?: (value: boolean) => void;
}

interface ToastProviderProps {
  children: ReactNode;
  /** Opcional: clases extra para posicionar el contenedor del toast (e.g., "bottom-20 md:bottom-24", "top-6 md:top-10") */
  containerClassName?: string;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
}

export function ToastProvider({
  children,
  containerClassName = '',
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<InternalToast[]>([]);
  const currentToast = toasts[0];

  useEffect(() => {
    if (currentToast?.autoClose) {
      const timeout = setTimeout(() => {
        setToasts((prevToasts) => prevToasts.slice(1));
      }, currentToast.duration ?? 4000);
      return () => clearTimeout(timeout);
    }
  }, [currentToast]);

  const removeCurrentToast = useCallback(
    (resolutionValue: boolean) => {
      if (currentToast?.resolve) {
        currentToast.resolve(resolutionValue);
      }
      setToasts((prevToasts) => prevToasts.slice(1));
    },
    [currentToast]
  );

  const showToast = useCallback((toast: Toast) => {
    setToasts((prev) => [...prev, { ...toast, id: Date.now() }]);
  }, []);

  const confirmToast = useCallback(
    (toast: ConfirmToastOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        setToasts((prev) => [...prev, { ...toast, id: Date.now(), resolve }]);
      });
    },
    []
  );

  const hideToast = useCallback(() => {
    removeCurrentToast(false);
  }, [removeCurrentToast]);

  const handlePrimary = useCallback(() => {
    removeCurrentToast(true);
  }, [removeCurrentToast]);

  const handleSecondary = useCallback(() => {
    removeCurrentToast(false);
  }, [removeCurrentToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, confirmToast }}>
      {children}
      {currentToast && (
        <div
          className={`fixed right-4 bottom-4 left-4 z-50 transition-all md:right-8 md:bottom-8 md:left-auto md:w-auto md:max-w-md ${containerClassName}`}
        >
          <ToastComponent
            type={currentToast.type}
            message={currentToast.message}
            visible={true}
            showButtons={!!currentToast.resolve}
            onPrimaryClick={handlePrimary}
            onSecondaryClick={handleSecondary}
            onClose={hideToast}
            primaryLabel={currentToast.primaryLabel}
            secondaryLabel={currentToast.secondaryLabel}
          />
        </div>
      )}
    </ToastContext.Provider>
  );
}
