import Link from "next/link";
import { productName } from "@/lib/site";

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
    <main className="relative min-h-screen overflow-hidden bg-[#151515] text-[#f3f0e9]">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(243,240,233,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(243,240,233,.18)_1px,transparent_1px)] [background-size:25vw_25vh]" />
      <header className="relative z-10">
        <div className="nexx-shell flex items-center py-7">
          <Link href="/" className="inline-flex items-center gap-2.5 text-sm font-semibold text-[#f3f0e9]">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/80 text-[11px]">R</span>
            {productName}
          </Link>
          <nav className="ml-auto hidden items-center gap-8 text-xs font-bold uppercase tracking-[0.06em] text-white/70 sm:flex">
            <Link href="/#signals" className="transition-colors hover:text-[#d7ff4f]">Signals</Link>
            <Link href="/#report" className="transition-colors hover:text-[#d7ff4f]">The report</Link>
            <Link href="/pricing" className="transition-colors hover:text-[#d7ff4f]">Pricing</Link>
          </nav>
          <Link href="/upload?plan=free" className="ml-7 inline-flex min-h-11 items-center gap-7 bg-[#d7ff4f] px-5 text-xs font-bold uppercase tracking-[0.04em] text-[#151515] transition hover:bg-[#f3f0e9]">
            Start free <span>↗</span>
          </Link>
        </div>
      </header>
      <section className="relative z-10">
        <div className="nexx-shell py-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-4xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#d7ff4f]">[ {eyebrow} ]</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-bold uppercase leading-[0.9] tracking-[-0.075em] text-[#f3f0e9] sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <div className="mt-10 space-y-4 text-sm leading-7 text-white/70">
            {children}
          </div>
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
    <section className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.16)] sm:p-7">
      <h2 className="text-lg font-semibold text-[#f3f0e9]">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
