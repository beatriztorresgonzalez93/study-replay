import { AppHeader } from "@/components/AppHeader";
import { SectionNav } from "@/components/SectionNav";

export function PageLayout({
  children,
  title,
  backHref = "/",
  subtitle,
  description,
  wide = false,
}: {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  subtitle?: string;
  description?: string;
  wide?: boolean;
}) {
  const isHome = !title;

  return (
    <>
      <AppHeader
        title={title}
        backHref={isHome ? undefined : backHref}
        subtitle={subtitle}
      />
      <main className={`page-main mx-auto ${wide ? "max-w-6xl" : "max-w-3xl"}`}>
        <div className="hidden md:block">
          <SectionNav />
        </div>
        {description && (
          <p className="page-description">{description}</p>
        )}
        {children}
      </main>
    </>
  );
}
