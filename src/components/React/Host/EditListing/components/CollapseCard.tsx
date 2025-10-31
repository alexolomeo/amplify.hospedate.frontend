import type { ReactNode } from 'react';

interface Props {
  title: string;
  children: ReactNode;
}

export default function CollapseCard({ title, children }: Props) {
  return (
    <div className="outline-base-200 bg-base-100 collapse relative rounded-2xl outline">
      <input type="checkbox" className="peer" />

      <div className="collapse-title pr-10 text-base font-semibold">
        {title}
      </div>

      <div className="collapse-content">{children}</div>

      <svg
        className="pointer-events-none absolute top-4 right-4 h-4 w-4 transition-transform duration-200 peer-checked:rotate-180"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
  );
}
