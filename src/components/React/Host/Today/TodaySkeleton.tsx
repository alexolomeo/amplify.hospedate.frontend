export function WelcomeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 self-stretch rounded-2xl bg-[var(--color-base-150)]"></div>
      <div className="flex items-center justify-between gap-4">
        <div className="bg-base-200 h-8 w-80 rounded-2xl"></div>
        <div className="bg-base-200 h-9 w-56 rounded-[69px]"></div>
      </div>
    </div>
  );
}

export function ReservationEventsSkeleton() {
  return (
    <div className="inline-flex flex-col items-start justify-start gap-14 self-stretch">
      <div className="inline-flex items-center justify-start gap-3">
        <div className="h-7 w-12 rounded-2xl bg-[var(--color-base-150)] md:w-24 lg:w-28"></div>
        <div className="bg-base-200 h-7 w-12 rounded-2xl md:w-24 lg:w-28"></div>
        <div className="h-7 w-12 rounded-2xl bg-[var(--color-base-150)] md:w-24 lg:w-28"></div>
        <div className="h-7 w-12 rounded-2xl bg-[var(--color-base-150)] md:w-24 lg:w-28"></div>
        <div className="h-7 w-12 rounded-2xl bg-[var(--color-base-150)] md:w-24 lg:w-28"></div>
        <div className="h-7 w-12 rounded-2xl bg-[var(--color-base-150)] md:w-24 lg:w-28"></div>
      </div>
      <div className="inline-flex flex-wrap content-start items-start justify-start gap-6 self-stretch">
        <div className="h-44 w-72 rounded-[30.40px] bg-[var(--color-base-150)] p-4"></div>
        <div className="h-44 w-72 rounded-[30.40px] bg-[var(--color-base-150)] p-4"></div>
        <div className="h-44 w-72 rounded-[30.40px] bg-[var(--color-base-150)] p-4"></div>
      </div>
    </div>
  );
}
