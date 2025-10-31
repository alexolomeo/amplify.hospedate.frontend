import clsx from 'clsx';

export default function EditListingShell({
  banner,
  showSidebar,
  showFooter,
  sidebar,
  content,
  footer,
}: {
  banner?: React.ReactNode;
  showSidebar: boolean;
  showFooter: boolean;
  sidebar: React.ReactNode;
  content: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div
      className={clsx(
        'grid h-screen md:h-full',
        showSidebar
          ? showFooter
            ? 'grid-rows-[auto_45%_1fr_auto]'
            : 'grid-rows-[auto_45%_55%]'
          : showFooter
            ? 'grid-rows-[auto_1fr_auto]'
            : 'grid-rows-[auto_1fr]',
        showSidebar ? 'md:grid-cols-[492px_1fr]' : 'md:grid-cols-1',
        showFooter ? 'md:grid-rows-[auto_1fr_auto]' : 'md:grid-rows-[auto_1fr]'
      )}
    >
      <div className="col-span-full">{banner}</div>

      {showSidebar && (
        <aside
          className={clsx(
            'md:row-span-2',
            'bg-[var(--color-base-150)] px-4 pt-6 md:mt-10 md:ml-30 md:pt-8',
            'overflow-y-auto',
            '[border-radius:var(--doc-spacing-component-gap,_40px)_var(--doc-spacing-component-gap,_40px)_0_0]',
            'border-base-200 border'
          )}
        >
          {sidebar}
        </aside>
      )}

      <main
        className={clsx(
          'bg-base-100 min-w-0 overflow-hidden',
          showSidebar && 'md:col-start-2'
        )}
      >
        {content}
      </main>

      {showFooter && (
        <div className={clsx(showSidebar && 'md:col-start-2')}>{footer}</div>
      )}
    </div>
  );
}
