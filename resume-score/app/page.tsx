import MockupV35Page from "./mockup-v3-5/page";
import { AnalyticsPageView } from "@/components/analytics-page-view";

export default function HomePage() {
  return (
    <>
      <AnalyticsPageView event="landing_page_visit" />
      <MockupV35Page />
    </>
  );
}
