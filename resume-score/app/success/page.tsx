import Link from "next/link";
import { redirect } from "next/navigation";
import { getReport, markReportPaid } from "@/lib/report-store";
import { getPaddleTransaction, isPaidPaddleTransaction } from "@/lib/paddle";

export const runtime = "nodejs";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ transaction_id?: string; report_id?: string }>;
}) {
  const { transaction_id: transactionId, report_id: reportIdFromUrl } = await searchParams;

  if (!transactionId && !reportIdFromUrl) {
    return <StatusCard title="Missing checkout details." actionHref="/upload" actionLabel="Start again" />;
  }

  let reportId = reportIdFromUrl;
  let verifiedReportId = "";

  if (transactionId) {
    try {
      const transaction = await getPaddleTransaction(transactionId);
      const transactionReportId = transaction.custom_data?.reportId;

      if (!transactionReportId || (reportIdFromUrl && transactionReportId !== reportIdFromUrl)) {
        throw new Error("Paddle transaction does not match this report.");
      }

      reportId = transactionReportId;

      if (isPaidPaddleTransaction(transaction, transactionReportId)) {
        const unlockedReport = await markReportPaid(transactionReportId, transaction.id);
        if (unlockedReport) verifiedReportId = transactionReportId;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Paddle could not verify this payment.";
      console.error("[paddle:success] payment verification failed", { error: message });
      const userMessage = message.includes("Paddle is not configured")
        ? `Payment verification is not configured yet. ${message}`
        : "Payment verification failed. Please return to your preview and try again, or contact support if payment was completed.";

      return (
        <StatusCard
          title="Payment not verified."
          message={userMessage}
          actionHref={reportId ? `/preview/${reportId}` : "/upload"}
          actionLabel={reportId ? "Back to preview" : "Start again"}
        />
      );
    }
  }

  if (verifiedReportId) redirect(`/report/${verifiedReportId}`);

  if (reportId) {
    const report = await getReport(reportId);
    if (report?.paid) redirect(`/report/${reportId}`);
  }

  if (transactionId && !reportId) {
    return (
      <StatusCard
        title="Report could not be found."
        message="Your payment was verified, but this report is no longer available in local storage. Please upload again or contact support."
        actionHref="/upload"
        actionLabel="Upload again"
      />
    );
  }

  return (
    <StatusCard
      title="Payment is being confirmed."
      message="Paddle accepted the checkout, but the report has not been unlocked yet. This usually resolves after the webhook arrives."
      actionHref={reportId ? `/preview/${reportId}` : "/upload"}
      actionLabel={reportId ? "Back to preview" : "Start again"}
    />
  );
}

function StatusCard({
  title,
  message,
  actionHref,
  actionLabel
}: {
  title: string;
  message?: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-5">
      <section className="max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
        {message ? <p className="mt-3 text-sm leading-6 text-slate-600">{message}</p> : null}
        <Link href={actionHref} className="nexx-button-primary mt-6">
          {actionLabel}
        </Link>
      </section>
    </main>
  );
}
