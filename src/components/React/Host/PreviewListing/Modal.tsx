import * as React from 'react';
import clsx from 'clsx';

type ModalProps = {
  id?: string;
  title?: React.ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
  maxWidth?: string; // 'max-w-md' por defecto
  maxHeight?: string; // 'max-h-[80vh]' por defecto
  maxHeightBody?: string; // 'max-h-[70vh]' por defecto
  bgColor?: string; // '' por defecto
  open: boolean; // <- controlado desde afuera
  onClose: () => void; // <- callback al cerrar
  /** Contenido principal (equivalente a <slot name="body" />) */
  children: React.ReactNode;
  /** Footer opcional (si no lo pasas y showFooter=true, se renderiza el botón “Cerrar”) */
  footer?: React.ReactNode;
};

export default function Modal({
  id = 'default-modal',
  title = '',
  showHeader = true,
  showFooter = true,
  maxWidth = 'max-w-md',
  maxHeight = 'max-h-[80vh]',
  maxHeightBody = 'max-h-[70vh]',
  bgColor = '',
  open,
  onClose,
  children,
  footer,
}: ModalProps): React.JSX.Element | null {
  const ref = React.useRef<HTMLDialogElement>(null);

  // Sincroniza <dialog> nativo con la prop `open`
  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Cerrar con ESC o cuando el usuario llama .close()
    const handleClose = () => onClose();
    const handleCancel = (e: Event) => {
      e.preventDefault(); // evita el cierre “por defecto” y delega en onClose()
      onClose();
    };

    node.addEventListener('close', handleClose);
    node.addEventListener('cancel', handleCancel);

    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();

    return () => {
      node.removeEventListener('close', handleClose);
      node.removeEventListener('cancel', handleCancel);
    };
  }, [open, onClose]);

  // Click en backdrop para cerrar
  const onBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  if (!open) return null;

  return (
    <dialog
      id={id}
      ref={ref}
      className="modal"
      onClick={onBackdropClick}
      aria-labelledby={showHeader ? `${id}-title` : undefined}
    >
      <div
        className={clsx(
          'modal-box relative rounded-[40px]',
          maxWidth,
          bgColor,
          maxHeight
        )}
      >
        {/* Header opcional */}
        {showHeader && (
          <div className="sticky top-0 z-10">
            <div className="mb-4 flex items-center justify-between">
              <div
                id={`${id}-title`}
                className="self-stretch text-xl leading-9 font-bold md:text-2xl lg:text-3xl"
              >
                {title}
              </div>
              <button
                type="button"
                className="btn btn-circle"
                aria-label="Cerrar"
                onClick={onClose}
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Body (siempre) */}
        <div className={clsx('overflow-y-auto', maxHeightBody)}>{children}</div>

        {/* Footer opcional */}
        {showFooter && (
          <div className="mt-4 flex justify-end">
            {footer ?? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onClose}
              >
                Cerrar
              </button>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
}
