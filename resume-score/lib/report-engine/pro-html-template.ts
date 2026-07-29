import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { composeReport } from "./report-composer.ts";
import type { ReportEngineInput, ReportFeedbackColumn, ReportPlanCard } from "./types.ts";

const BLUE = "#1557e8";

/**
 * Flow-based PRO and ELITE report template used by the customer PDF download.
 * Chromium owns pagination so card rhythm and footer placement remain stable.
 */
export function renderHtmlReport(input: ReportEngineInput) {
  const report = composeReport(input);
  const { executiveSnapshot: page1, roadmap: page2, playbook: page3 } = report;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
${fontFaces()}
:root { --blue: ${BLUE}; --ink: #121722; --muted: #68738a; --line: #d7deea; --ice: #ebfbff; --paper: #fcfcfb; }
* { box-sizing: border-box; }
@page { size: A4; margin: 0; }
html, body { margin: 0; padding: 0; background: var(--paper); color: var(--ink); font-family: "Roboto", sans-serif; }
body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
.page { width: 210mm; min-height: 297mm; padding: 13mm 14mm 25mm; position: relative; display: flex; flex-direction: column; background: var(--paper); break-after: page; page-break-after: always; overflow: hidden; }
.page:last-child { break-after: auto; page-break-after: auto; }
.report-header { display: flex; align-items: center; justify-content: space-between; min-height: 10mm; }
.brand { font-size: 18pt; font-weight: 700; letter-spacing: -.45pt; color: #090d16; }
.brand span { color: var(--blue); }
.header-meta { display: flex; align-items: center; gap: 12pt; font-size: 7.5pt; letter-spacing: 1.6pt; font-weight: 500; color: #42495d; }
.page-number { padding-left: 12pt; border-left: .5pt solid var(--line); color: #151a26; }
.kicker { margin: 13mm 0 5mm; color: var(--blue); font-size: 8.5pt; font-weight: 700; letter-spacing: 1.8pt; }
h1 { max-width: 155mm; margin: 0; font-size: 31pt; line-height: 1.05; font-weight: 400; letter-spacing: -.8pt; }
.intro { max-width: 135mm; margin: 6mm 0 0; color: #4f5870; font-size: 11pt; line-height: 1.45; }
.metrics { display: grid; grid-template-columns: repeat(3, 1fr); margin-top: 10mm; }
.metric { min-height: 27mm; padding: 0 7mm; border-left: .5pt solid var(--line); }
.metric:first-child { border-left: 0; padding-left: 0; }
.metric-value { color: var(--blue); font-size: 37pt; font-weight: 700; line-height: .95; letter-spacing: -1pt; }
.metric-suffix { margin-left: 2pt; color: #454d61; font-size: 11pt; font-weight: 400; }
.metric-rule, .rule { width: 14mm; height: 1.1pt; margin: 4mm 0 3.2mm; background: var(--blue); }
.metric-label { color: #596174; font-size: 7.8pt; font-weight: 500; letter-spacing: 1.35pt; }
.insights { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; margin-top: 7mm; }
.insight { min-height: 53mm; padding: 7mm 8mm; border-radius: 4mm; display: flex; flex-direction: column; break-inside: avoid; }
.insight.strength { color: white; background: linear-gradient(135deg, #0d61da, #003b9f); }
.insight.risk { background: var(--ice); }
.card-label { font-size: 8pt; font-weight: 700; letter-spacing: 1.5pt; }
.insight-headline { max-width: 71mm; margin: 5mm 0 0; font-size: 16pt; font-weight: 400; line-height: 1.28; }
.insight-support { max-width: 70mm; margin: auto 0 0; font-size: 9pt; line-height: 1.42; color: inherit; opacity: .84; }
.section-title { display: flex; align-items: center; gap: 3mm; margin: 7mm 0 4mm; font-size: 8.5pt; font-weight: 700; letter-spacing: 1.7pt; }
.section-title::after { content: ""; height: .5pt; flex: 1; background: var(--line); }
.priority-row, .signal-row { display: grid; grid-template-columns: repeat(3, 1fr); }
.priority { min-height: 27mm; padding: 0 5mm; border-left: .5pt solid var(--line); }
.priority:first-child { padding-left: 0; border-left: 0; }
.priority-number { color: var(--blue); font-size: 8pt; font-weight: 700; }
.priority-title { margin-top: 2mm; font-size: 9.5pt; line-height: 1.3; font-weight: 500; }
.priority-support { margin-top: 2.5mm; color: var(--muted); font-size: 7.3pt; line-height: 1.35; }
.signal-row { grid-template-columns: repeat(5, 1fr); }
.signal { min-height: 19mm; padding: 0 3.5mm; border-left: .5pt solid var(--line); }
.signal:first-child { padding-left: 0; border-left: 0; }
.signal-score { color: var(--blue); font-size: 19pt; font-weight: 700; line-height: 1; }
.signal-score span { color: #657087; font-size: 7.5pt; font-weight: 400; }
.signal-label { margin-top: 2mm; color: #576075; font-size: 6.7pt; font-weight: 500; letter-spacing: 1pt; }
.callout { display: grid; grid-template-columns: 1fr 1.7fr .9fr; gap: 7mm; align-items: center; margin-top: 7mm; padding: 7mm; border-radius: 3mm; background: linear-gradient(110deg, #f0f5ff, #fbfcff); }
.callout-kicker { color: var(--blue); font-size: 7.6pt; font-weight: 700; letter-spacing: 1.2pt; }
.callout-main { color: #153ec6; font-size: 16pt; font-weight: 400; line-height: 1.35; }
.callout-side { padding-left: 6mm; border-left: .5pt solid var(--line); color: #4e5870; font-size: 9pt; line-height: 1.45; }
.grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4mm; margin-top: 4mm; }
.roadmap-card { min-height: 56mm; padding: 6.5mm; border: .7pt solid var(--line); border-radius: 3mm; display: flex; flex-direction: column; break-inside: avoid; }
.card-number { color: var(--blue); font-size: 20pt; font-weight: 700; line-height: 1; }
.roadmap-title { min-height: 11mm; margin-top: 3.2mm; color: #153ec6; font-size: 10.3pt; font-weight: 500; line-height: 1.3; }
.roadmap-action { margin-top: var(--card-title-to-body, 2.5mm); font-size: 8.8pt; line-height: 1.42; }
.roadmap-support { margin-top: auto; color: var(--muted); font-size: 7.6pt; line-height: 1.42; }
.feedback-grid { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 3mm; }
.feedback { min-height: 34mm; padding: 0 4mm; border-left: .5pt solid var(--line); }
.feedback:first-child { padding-left: 0; border-left: 0; }
.feedback-title { font-size: 8.5pt; font-weight: 500; }
.status { display: flex; align-items: center; gap: 2mm; margin-top: 3mm; font-size: 8pt; }
.status-dot { width: 2.4mm; height: 2.4mm; border-radius: 50%; background: #ff541d; }
.status.improving, .status.strong { color: #00984b; }.status.improving .status-dot, .status.strong .status-dot { background: #00984b; }
.feedback-description { margin-top: 3.5mm; color: var(--muted); font-size: 7.7pt; line-height: 1.4; }
.feedback-recommendation { margin-top: 2.6mm; color: var(--muted); font-size: 7.4pt; line-height: 1.38; }
.example { display: grid; grid-template-columns: 1fr 10mm 1.16fr; gap: 4mm; align-items: stretch; margin-top: 3mm; }
.quote-card { min-height: 31mm; padding: 6mm 7mm; border: .7pt solid var(--line); border-radius: 3mm; }
.quote-card.after { border: 0; background: linear-gradient(130deg, #0b55d2, #123fc1); color: white; }
.quote-label { font-size: 7.8pt; font-weight: 700; letter-spacing: 1.7pt; color: var(--blue); }
.after .quote-label { color: white; }
.quote-text { margin: 5mm 0 0; color: #667188; font-size: 10.4pt; font-weight: 400; line-height: 1.45; }
.after .quote-text { color: white; }
.arrow { width: 10mm; height: 10mm; align-self: center; border-radius: 50%; display: grid; place-items: center; background: var(--blue); color: white; font-size: 16pt; font-weight: 500; }
.focus-panel { display: grid; grid-template-columns: 1.85fr .9fr; gap: 8mm; align-items: center; margin-top: 7mm; padding: 7mm; border-radius: 3mm; color: white; background: linear-gradient(120deg, #0d60db, #003aa3); }
.focus-kicker { font-size: 7.8pt; font-weight: 700; letter-spacing: 1.7pt; }
.focus-main { margin-top: 4mm; font-size: 17pt; font-weight: 400; line-height: 1.3; }
.focus-support { padding-left: 6mm; border-left: .5pt solid rgba(255,255,255,.55); font-size: 9.2pt; line-height: 1.5; }
.emphasis { max-width: 130mm; margin: 11mm auto 0; color: var(--blue); font-size: 24pt; font-weight: 400; line-height: 1.22; text-align: center; }
.footer { position: absolute; left: 14mm; right: 14mm; bottom: 7mm; display: grid; grid-template-columns: 8mm 1fr auto; align-items: center; gap: 3mm; margin: 0; padding-top: 5mm; border-top: .5pt solid var(--line); color: #69738a; font-size: 6.8pt; line-height: 1.35; }
.footer-mark { width: 7mm; height: 7mm; border: .8pt solid var(--blue); border-radius: 50%; display: grid; place-items: center; color: var(--blue); font-size: 5.3pt; font-weight: 700; }
.footer-page { font-size: 8pt; }
/* Page 2 has the densest content; these are page-level flow constraints, not per-card overrides. */
.page-roadmap .kicker { margin: 6mm 0 3mm; }
.page-roadmap h1 { font-size: 24pt; }
.page-roadmap .intro { margin-top: 3mm; font-size: 10pt; }
.page-roadmap .callout { margin-top: 3.5mm; padding: 4.5mm; }
.page-roadmap .callout-main { font-size: 14pt; }
.page-roadmap .callout-side { font-size: 8.2pt; }
.page-roadmap .grid-3 { margin-top: 3mm; }
.page-roadmap .roadmap-card { min-height: 42mm; padding: 4.8mm; }
.page-roadmap .roadmap-title { min-height: 9mm; margin-top: 2.4mm; font-size: 9.4pt; }
.page-roadmap .roadmap-action { --card-title-to-body: 2.5mm; font-size: 8pt; }
.page-roadmap .roadmap-support { font-size: 7pt; }
.page-roadmap .feedback { min-height: 24mm; }
.page-roadmap .feedback-description { margin-top: 2.4mm; font-size: 7pt; }
.page-roadmap .feedback-recommendation { margin-top: 1.8mm; font-size: 6.8pt; }
.page-roadmap .section-title { margin: 3.8mm 0 2.2mm; }
.page-roadmap .example { margin-top: 2.5mm; }
.page-roadmap .quote-card { min-height: 22mm; padding: 3.8mm 5mm; }
.page-roadmap .quote-text { margin-top: 2.8mm; font-size: 8.8pt; line-height: 1.3; }
.page-alignment .kicker { margin: 8mm 0 4mm; }
.page-alignment h1 { font-size: 26pt; }
.page-alignment .intro { margin-top: 4mm; }
.page-alignment .feedback-grid { margin-top: 3mm; }
.page-alignment .feedback { min-height: 31mm; }
.page-alignment .section-title { margin: 6mm 0 3mm; }
.checklist { display: grid; grid-template-columns: 1fr 1fr; gap: 4mm; }
.checklist-box { min-height: 26mm; padding: 4.5mm 6mm; border: .7pt solid var(--line); border-radius: 3mm; }
.checklist-item { display: flex; gap: 3mm; margin-top: 2.2mm; color: #505a71; font-size: 8.5pt; line-height: 1.25; }
.checklist-item:first-child { margin-top: 0; }
.checklist-mark { width: 5mm; height: .8pt; margin-top: 1.6mm; flex: 0 0 auto; background: var(--blue); }
.final-callout { display: grid; grid-template-columns: 1.25fr .9fr; gap: 10mm; align-items: center; margin-top: 5mm; padding: 6mm 7mm; border-radius: 3mm; color: white; background: linear-gradient(120deg, #0d60db, #003aa3); }
.final-callout-title { font-size: 15pt; line-height: 1.25; font-weight: 400; white-space: pre-line; }
.final-callout-support { padding-left: 7mm; border-left: .5pt solid rgba(255,255,255,.55); font-size: 9pt; line-height: 1.45; }
</style>
</head>
<body>
  ${pageOne(page1)}
  ${pageTwo(page2)}
  ${pageThree(page3)}
  ${input.accessPlan === "full" ? pageFour(report.alignment) : ""}
</body>
</html>`;
}

export function renderProHtmlReport(input: Omit<ReportEngineInput, "accessPlan">) {
  return renderHtmlReport({ ...input, accessPlan: "standard" });
}

function pageOne(page: ReturnType<typeof composeReport>["executiveSnapshot"]) {
  return `<main class="page">
    ${header("01")}
    <h1>${escapeHtml(page.headline)}</h1>
    <p class="intro">${escapeHtml(page.introduction)}</p>
    <section class="metrics">${page.metrics.map(metric).join("")}</section>
    <section class="insights">${insight(page.topStrength, "strength")}${insight(page.mainRisk, "risk")}</section>
    <h2 class="section-title">PRIORITY FIXES</h2>
    <section class="priority-row">${page.priorities.map(priority).join("")}</section>
    <h2 class="section-title">SIGNAL BREAKDOWN</h2>
    <section class="signal-row">${page.signals.map(signal).join("")}</section>
    ${footer(page.footerNote, "Page 01")}
  </main>`;
}

function pageTwo(page: ReturnType<typeof composeReport>["roadmap"]) {
  return `<main class="page page-roadmap">
    ${header("02")}
    <div class="kicker">${escapeHtml(page.kicker)}</div>
    <h1>${escapeHtml(page.headline)}</h1>
    <p class="intro">${escapeHtml(page.introduction)}</p>
    <section class="callout"><div class="callout-kicker">EXECUTIVE DIRECTION</div><div class="callout-main">${escapeHtml(page.executiveDirection)}</div><div class="callout-side">${escapeHtml(page.executiveSupport)}</div></section>
    <h2 class="section-title">YOUR 3-STEP PRIORITY ROADMAP</h2>
    <section class="grid-3">${page.priorities.map(roadmapCard).join("")}</section>
    <h2 class="section-title">SECTION FEEDBACK</h2>
    <section class="feedback-grid">${page.feedback.map(feedback).join("")}</section>
    <h2 class="section-title">EXAMPLE IMPROVEMENT</h2>
    ${beforeAfter(page.improvement.before, page.improvement.after)}
    ${footer(page.footerNote, "Page 02")}
  </main>`;
}

function pageThree(page: ReturnType<typeof composeReport>["playbook"]) {
  return `<main class="page">
    ${header("03")}
    <div class="kicker">${escapeHtml(page.kicker)}</div>
    <h1>${escapeHtml(page.headline)}</h1>
    <p class="intro">${escapeHtml(page.introduction)}</p>
    <section class="focus-panel"><div><div class="focus-kicker">30-DAY FOCUS</div><div class="focus-main">${escapeHtml(page.focus)}</div></div><div class="focus-support">${escapeHtml(page.focusSupport)}</div></section>
    <h2 class="section-title">YOUR IMPLEMENTATION PLAN</h2>
    <section class="grid-3">${page.implementation.map(roadmapCard).join("")}</section>
    <div class="emphasis">${escapeHtml(page.emphasis)}</div>
    ${footer(page.footerNote, "Page 03")}
  </main>`;
}

function pageFour(page: ReturnType<typeof composeReport>["alignment"]) {
  const checklistColumns = [page.checklist.slice(0, 3), page.checklist.slice(3)];
  return `<main class="page page-alignment">
    ${header("04")}
    <div class="kicker">${escapeHtml(page.kicker)}</div>
    <h1>${escapeHtml(page.headline)}</h1>
    <p class="intro">${escapeHtml(page.introduction)}</p>
    <h2 class="section-title">ROLE ALIGNMENT SNAPSHOT</h2>
    <section class="feedback-grid">${page.alignment.map(feedback).join("")}</section>
    <h2 class="section-title">EXAMPLE IMPROVEMENT</h2>
    ${beforeAfter(page.improvement.before, page.improvement.after)}
    <h2 class="section-title">APPLICATION CHECKLIST</h2>
    <section class="checklist">${checklistColumns.map((items) => `<div class="checklist-box">${items.map(checklistItem).join("")}</div>`).join("")}</section>
    <section class="final-callout"><div class="final-callout-title">${escapeHtml(page.callout)}</div><div class="final-callout-support">${escapeHtml(page.calloutSupport)}</div></section>
    ${footer(page.footerNote, "Page 04")}
  </main>`;
}

function header(page: string) {
  return `<header class="report-header"><div class="brand">Resu<span>Nexx</span></div><div class="header-meta">RESUME INTELLIGENCE REPORT <span class="page-number">${page}</span></div></header>`;
}

function footer(note: string, page: string) {
  return `<footer class="footer"><div class="footer-mark">RN</div><div>${escapeHtml(note)}</div><div class="footer-page">${page}</div></footer>`;
}

function metric(item: { label: string; value: string; suffix?: string }) {
  return `<div class="metric"><div class="metric-value">${escapeHtml(item.value)}<span class="metric-suffix">${escapeHtml(item.suffix || "")}</span></div><div class="metric-rule"></div><div class="metric-label">${escapeHtml(item.label)}</div></div>`;
}

function insight(item: { label: string; headline: string; support: string }, kind: "strength" | "risk") {
  return `<article class="insight ${kind}"><div class="card-label">${escapeHtml(item.label)}</div><div class="insight-headline">${escapeHtml(item.headline)}</div><div class="insight-support">${escapeHtml(item.support)}</div></article>`;
}

function priority(item: { number: string; title: string; support: string }) {
  return `<article class="priority"><div class="priority-number">${escapeHtml(item.number)}</div><div class="priority-title">${escapeHtml(item.title)}</div><div class="priority-support">${escapeHtml(item.support)}</div></article>`;
}

function signal(item: { label: string; score: number }) {
  return `<article class="signal"><div class="signal-score">${item.score}<span>/100</span></div><div class="signal-label">${escapeHtml(item.label)}</div></article>`;
}

function roadmapCard(item: ReportPlanCard) {
  return `<article class="roadmap-card"><div class="card-number">${escapeHtml(item.number)}</div><div class="roadmap-title">${escapeHtml(item.title)}</div><div class="roadmap-action">${escapeHtml(item.action)}</div><div class="roadmap-support">${escapeHtml(item.support)}</div></article>`;
}

function feedback(item: ReportFeedbackColumn) {
  const label = item.status === "needs-work" ? "Needs Improvement" : item.status === "high-priority" ? "High Priority" : item.status === "improving" ? "Improving" : "Strong";
  return `<article class="feedback"><div class="feedback-title">${escapeHtml(item.title)}</div><div class="status ${escapeHtml(item.status)}"><span class="status-dot"></span>${label}</div><div class="feedback-description">${escapeHtml(item.description)}</div><div class="feedback-recommendation">${escapeHtml(item.recommendation)}</div></article>`;
}

function beforeAfter(before: string, after: string) {
  return `<section class="example"><article class="quote-card"><div class="quote-label">BEFORE</div><div class="quote-text">${escapeHtml(before)}</div></article><div class="arrow">&#8594;</div><article class="quote-card after"><div class="quote-label">AFTER</div><div class="quote-text">${escapeHtml(after)}</div></article></section>`;
}

function checklistItem(item: string) {
  return `<div class="checklist-item"><span class="checklist-mark"></span><span>${escapeHtml(item)}</span></div>`;
}

function fontFaces() {
  return (["Regular", "Medium", "Bold"] as const).map((name) => {
    const data = readFileSync(resolve(process.cwd(), "assets/fonts", `Roboto-${name}.ttf`)).toString("base64");
    const weight = name === "Regular" ? 400 : name === "Medium" ? 500 : 700;
    return `@font-face { font-family: "Roboto"; src: url("data:font/ttf;base64,${data}") format("truetype"); font-weight: ${weight}; font-style: normal; font-display: block; }`;
  }).join("\n");
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character] || character).replace(/\n/g, "<br />");
}
