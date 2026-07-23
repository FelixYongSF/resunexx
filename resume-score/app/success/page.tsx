import { redirect } from "next/navigation";

export default async function SuccessPage({
  searchParams
}: {
  searchParams: Promise<{ report_id?: string; checkout_id?: string }>;
}) {
  const params = await searchParams;
  const query = new URLSearchParams();
  if (params.report_id) query.set("report_id", params.report_id);
  if (params.checkout_id) query.set("checkout_id", params.checkout_id);
  redirect(`/payment/success${query.size ? `?${query.toString()}` : ""}`);
}
