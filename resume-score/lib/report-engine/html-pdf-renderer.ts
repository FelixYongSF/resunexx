import chromium from "@sparticuz/chromium";
import { resolve } from "node:path";
import puppeteer from "puppeteer-core";
import type { ReportPlan } from "../report-plan.ts";
import { renderHtmlReport } from "./pro-html-template.ts";
import type { ReportApplicant, ReportEngineInput } from "./types.ts";

const LOCAL_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/**
 * Renders the approved, flow-based report template through Chromium. Keeping
 * this separate from the legacy coordinate renderer makes the downloadable
 * customer report use the same layout that passed visual QA.
 */
export async function renderHtmlReportPdf(
  report: ReportEngineInput["report"],
  accessPlan: Extract<ReportPlan, "standard" | "full">,
  applicant?: ReportApplicant
) {
  const isVercel = Boolean(process.env.VERCEL);
  const browser = await puppeteer.launch({
    args: isVercel ? chromium.args : [],
    executablePath: await getExecutablePath(isVercel),
    headless: true
  });

  try {
    const page = await browser.newPage();
    await page.setContent(
      renderHtmlReport({ report, accessPlan, applicant }),
      { waitUntil: "load" }
    );
    await page.emulateMediaType("screen");

    return Buffer.from(await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" }
    }));
  } finally {
    await browser.close();
  }
}

async function getExecutablePath(isVercel: boolean) {
  if (isVercel) return chromium.executablePath(resolve(process.cwd(), "assets/chromium"));
  return process.env.PUPPETEER_EXECUTABLE_PATH || LOCAL_CHROME;
}
