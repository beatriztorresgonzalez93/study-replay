import { SUBJECT_COUNT } from "@/lib/constants";

export function SubjectCardsMobile({
  subjectNames,
  borderClass,
  children,
}: {
  subjectNames: string[];
  borderClass: string;
  children: (subjectIndex: number) => React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 md:hidden">
      {Array.from({ length: SUBJECT_COUNT }, (_, si) => (
        <article
          key={si}
          className={`subject-card rounded-2xl border bg-black/25 p-4 ${borderClass}`}
        >
          <h3 className="subject-card-title mb-3 border-b border-white/[0.06] pb-2 font-[family-name:var(--font-syne)] text-base font-semibold leading-snug text-zinc-100">
            {subjectNames[si]}
          </h3>
          {children(si)}
        </article>
      ))}
    </div>
  );
}
