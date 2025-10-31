import clsx from 'clsx';

interface ModalProps {
  id: string;
  title: string;
  titleSize?: string;
  showHeader?: boolean;
  maxWidth?: string;
  maxHeight?: string;
  maxHeightBody?: string;
  bgColor?: string;
  children: React.ReactNode;
}
export function Modal({
  id = 'default-modal',
  title = '',
  titleSize = 'text-xl md:text-2xl lg:text-3xl',
  showHeader = true,
  maxWidth = 'max-w-md',
  maxHeight = 'max-h-[80vh]',
  maxHeightBody = 'max-h-[70vh]',
  bgColor = 'bg-base-100',
  children,
}: ModalProps) {
  return (
    <dialog id={id} className="modal">
      <div
        className={clsx(
          'modal-box relative rounded-[40px]',
          maxWidth,
          bgColor,
          maxHeight
        )}
      >
        {showHeader && (
          <div className="sticky top-0 z-10 pt-4">
            <div className="mb-4 flex items-center justify-between">
              <div
                className={clsx('self-stretch leading-9 font-bold', titleSize)}
                data-testid={`test-${id}-title`}
              >
                {title}
              </div>
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-soft btn-primary">
                  ✕
                </button>
              </form>
            </div>
          </div>
        )}
        <div className={clsx('overflow-y-auto', maxHeightBody)}>{children}</div>
      </div>
    </dialog>
  );
}
