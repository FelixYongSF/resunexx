import { Header } from "@/components/header";

export function LegalPage({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-[#fbfaf7]">
      <Header />
      <section className="nexx-shell py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <p className="nexx-eyebrow">{eyebrow}</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-normal text-[#171714] sm:text-5xl">
            {title}
          </h1>
          <div className="nexx-card mt-8 space-y-7 p-6 text-sm leading-7 text-[#625c52] sm:p-8">
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}

export function LegalSection({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#171714]">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
