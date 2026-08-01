import type { ReportPlan } from "../report-plan.ts";
import { composeReport } from "./report-composer.ts";
import type { AlignmentPage, ExecutiveSnapshot, PlaybookPage, ReportApplicant, ReportEngineInput, RoadmapPage } from "./types.ts";
import { getRobotoFonts, type EmbeddedRobotoFont, type RobotoWeight } from "./roboto-fonts.ts";
import { reportVisualTokens } from "./visual-tokens.ts";

type PdfColor = readonly [number, number, number];
type RenderPage = () => string;
type PdfObject = string | Buffer;
type ReportRenderVariant = "pro" | "elite";

const palette: Record<keyof typeof reportVisualTokens.color, PdfColor> = {
  paper: [0.988, 0.988, 0.984],
  ink: [0.082, 0.09, 0.11],
  muted: [0.412, 0.443, 0.514],
  rule: [0.851, 0.871, 0.906],
  blue: [0.082, 0.369, 0.937],
  deepBlue: [0.024, 0.278, 0.686],
  aqua: [0.902, 0.973, 0.988],
  warning: [1, 0.353, 0.122],
  green: [0.027, 0.584, 0.333],
  white: [1, 1, 1]
};

export function renderReportPdf(input: ReportEngineInput) {
  const composed = composeReport(input);
  const variant: ReportRenderVariant = input.accessPlan === "standard" ? "pro" : "elite";
  const pages: RenderPage[] = [
    () => renderExecutiveSnapshot(composed.executiveSnapshot, variant),
    () => renderRoadmapPage(composed.roadmap, variant),
    () => renderPlaybookPage(composed.playbook, variant)
  ];
  if (input.accessPlan === "full") pages.push(() => renderAlignmentPage(composed.alignment, variant));
  return buildPdf(pages);
}

export function renderReportPdfFromReport(
  report: ReportEngineInput["report"],
  accessPlan: Extract<ReportPlan, "standard" | "full"> = "standard",
  applicant?: ReportApplicant
) {
  return renderReportPdf({ report, accessPlan, applicant });
}

function renderExecutiveSnapshot(snapshot: ExecutiveSnapshot, variant: ReportRenderVariant) {
  const c: string[] = [fillColor("paper"), `0 0 ${reportVisualTokens.page.width} ${reportVisualTokens.page.height} re f`];
  const margin = reportVisualTokens.page.marginX;
  const contentWidth = reportVisualTokens.page.width - margin * 2;

  const layout = reportVisualTokens.spacing.page.executive;
  drawLogo(c, margin, reportVisualTokens.page.headerY);
  drawHeaderMeta(c, snapshot, reportVisualTokens.page.headerY);

  const heroLines = wrap(snapshot.headline, layout.heroSize, layout.heroWidth).slice(0, layout.heroMaxLines);
  drawWrappedText(c, heroLines, margin, layout.heroY, layout.heroSize, "ink", "regular", layout.heroLineHeight);
  drawDivider(c, margin, layout.dividerY);
  drawWrappedText(c, wrap(snapshot.introduction, 12, 330).slice(0, 2), margin, layout.introY, 12, "muted", "regular", 16);

  drawMetrics(c, snapshot, margin, layout.metricsY, contentWidth);
  drawInsightPanels(c, snapshot, margin, layout.insightsY, contentWidth);
  drawPriorities(c, snapshot, margin, layout.prioritiesY, contentWidth);
  // Keep the signal row comfortably above the shared footer rule.
  const footerSpacing = reportVisualTokens.spacing.footer;
  drawSignals(c, snapshot, margin, footerSpacing.ruleY + footerSpacing.safeArea + layout.signalsOffsetFromFooter, contentWidth);
  drawFooter(c, snapshot, margin, contentWidth, variant);

  return c.join("\n");
}

function drawLogo(c: string[], x: number, y: number) {
  text(c, "Resu", x, y, 18, "ink", "medium");
  text(c, "Nexx", x + 42, y, 18, "blue", "medium");
}

function drawHeaderMeta(c: string[], snapshot: ExecutiveSnapshot, y: number) {
  const right = reportVisualTokens.page.width - reportVisualTokens.page.marginX;
  textRight(c, "RESUME INTELLIGENCE REPORT", right - 34, y, 8, "ink", "medium", 1.4);
  line(c, right - 20, y - reportVisualTokens.page.headerMetaRuleBottom, right - 20, y + reportVisualTokens.page.headerMetaRuleTop, "rule", 0.8);
  textRight(c, "01", right, y, 9, "ink", "medium", 1.2);
  const meta = [
    snapshot.applicant.name ? `Prepared for: ${snapshot.applicant.name}` : "",
    snapshot.applicant.email || "",
    snapshot.applicant.generatedAt ? `Generated on ${formatDate(snapshot.applicant.generatedAt)}` : ""
  ].filter(Boolean);
  const spacing = reportVisualTokens.spacing.header;
  meta.forEach((item, index) => textRight(c, item, right, y - spacing.metaFirstOffset - index * spacing.metaRowGap, 6.8, "muted", "regular"));
}

function drawMetrics(c: string[], snapshot: ExecutiveSnapshot, x: number, y: number, width: number) {
  const metricWidth = width / 3;
  snapshot.metrics.forEach((metric, index) => {
    const left = x + index * metricWidth;
    drawScoreBlock(c, metric, left, y);
    if (index < snapshot.metrics.length - 1) {
      const gutter = reportVisualTokens.spacing.score.columnGutter;
      line(c, left + metricWidth - gutter, y - 45, left + metricWidth - gutter, y + 46, "rule", 0.7);
    }
  });
}

function drawScoreBlock(c: string[], metric: ExecutiveSnapshot["metrics"][number], x: number, y: number) {
  const spacing = reportVisualTokens.spacing.score;
  text(c, metric.value, x, y, 40, "blue", "bold");
  text(c, metric.suffix || "", x + Math.min(77, metric.value.length * 26), y + 2, 12, "muted", "regular");
  drawDivider(c, x, y - spacing.valueToDivider);
  text(c, metric.label, x, y - spacing.valueToDivider - spacing.dividerToLabel, 7.2, "muted", "medium", 1.25);
}

function drawInsightPanels(c: string[], snapshot: ExecutiveSnapshot, x: number, y: number, width: number) {
  const spacing = reportVisualTokens.spacing.insight;
  const gap = spacing.gap;
  const panelWidth = (width - gap) / 2;
  const panelHeight = spacing.height;
  panel(c, x, y, panelWidth, panelHeight, "deepBlue");
  panel(c, x + panelWidth + gap, y, panelWidth, panelHeight, "aqua");

  const riskX = x + panelWidth + gap;
  drawInformationCard(c, snapshot.topStrength, x, y, panelWidth, panelHeight, "strength");
  drawInformationCard(c, snapshot.mainRisk, riskX, y, panelWidth, panelHeight, "risk");
}

function drawInformationCard(
  c: string[],
  card: ExecutiveSnapshot["topStrength"],
  x: number,
  y: number,
  width: number,
  height: number,
  variant: "strength" | "risk"
) {
  const spacing = reportVisualTokens.spacing.insight;
  const textX = x + spacing.paddingX + 27;
  const iconColor = variant === "strength" ? "white" : "blue";
  const bodyColor = variant === "strength" ? "white" : "ink";
  const supportColor = variant === "strength" ? "white" : "muted";
  const icon = variant === "strength" ? "*" : "!";
  drawCircleIcon(c, x + spacing.paddingX + 5, y + height - spacing.iconBaselineOffset, icon, iconColor);
  text(c, card.label, textX, y + height - spacing.labelBaselineOffset, 7.2, iconColor, "medium", 1.25);
  drawWrappedText(c, wrap(card.headline, 16, width - 70).slice(0, 3), textX, y + height - spacing.headlineBaselineOffset, 14, bodyColor, "regular", 18);
  drawDivider(c, textX, y + spacing.dividerBaselineOffset, iconColor);
  drawWrappedText(c, wrap(card.support, 7.4, width - 72).slice(0, 3), textX, y + spacing.supportBaselineOffset, 7.4, supportColor, "regular", 10);
}

function drawPriorities(c: string[], snapshot: ExecutiveSnapshot, x: number, y: number, width: number) {
  const spacing = reportVisualTokens.spacing.priority;
  text(c, "PRIORITY FIXES", x, y + spacing.headingRuleOffset - 3, 7.2, "ink", "medium", 1.25);
  line(c, x + spacing.headingRuleStart, y + spacing.headingRuleOffset, x + width, y + spacing.headingRuleOffset, "rule", 0.7);
  const columnWidth = width / 3;
  snapshot.priorities.forEach((item, index) => {
    const left = x + index * columnWidth;
    drawPriorityIcon(c, item.icon, left + spacing.iconX, y + spacing.iconY);
    text(c, item.number, left + spacing.numberX, y + spacing.numberY, 7.2, "blue", "medium");
    drawWrappedText(c, wrap(item.title, 9.3, columnWidth - 52).slice(0, 2), left + spacing.titleX, y + spacing.titleY, 9.3, "ink", "medium", spacing.titleLineHeight);
    drawWrappedText(c, wrap(item.support, 6.7, columnWidth - 52).slice(0, 2), left + spacing.supportX, y + spacing.supportY, 6.7, "muted", "regular", spacing.supportLineHeight);
    if (index < 2) line(c, left + columnWidth - spacing.columnDividerInset, y + spacing.columnDividerBottom, left + columnWidth - spacing.columnDividerInset, y + spacing.columnDividerTop, "rule", 0.7);
  });
}

function drawSignals(c: string[], snapshot: ExecutiveSnapshot, x: number, y: number, width: number) {
  const spacing = reportVisualTokens.spacing.signal;
  text(c, "SIGNAL BREAKDOWN", x, y + spacing.headingRuleOffset - 3, 7.2, "ink", "medium", 1.25);
  line(c, x + spacing.headingRuleStart, y + spacing.headingRuleOffset, x + width, y + spacing.headingRuleOffset, "rule", 0.7);
  const signalWidth = width / 5;
  snapshot.signals.forEach((signal, index) => {
    const left = x + index * signalWidth;
    drawSignalIcon(c, signal.icon, left + spacing.iconX, y + spacing.iconY);
    text(c, String(signal.score), left + spacing.scoreX, y + spacing.scoreY, 19, "blue", "bold");
    text(c, "/100", left + spacing.suffixX, y + spacing.suffixY, 6.5, "muted", "regular");
    text(c, signal.label, left + spacing.labelX, y + spacing.labelY, 6.4, "muted", "medium", 1.1);
    if (index < 4) line(c, left + signalWidth - spacing.columnDividerInset, y + spacing.columnDividerBottom, left + signalWidth - spacing.columnDividerInset, y + spacing.columnDividerTop, "rule", 0.7);
  });
}

function drawFooter(c: string[], snapshot: ExecutiveSnapshot, x: number, width: number, variant: ReportRenderVariant) {
  const spacing = reportVisualTokens.spacing.footer;
  line(c, x, spacing.ruleY, x + width, spacing.ruleY, "rule", 0.7);
  drawFooterMark(c, x, variant);
  drawWrappedText(c, wrap(snapshot.footerNote, 7.2, 340).slice(0, 2), x + spacing.noteX, spacing.noteY, 7.2, "muted", "regular", spacing.noteLineHeight);
  const reportId = snapshot.applicant.reportId ? `ID ${snapshot.applicant.reportId.slice(0, 8)}` : "Report generated by ResuNexx";
  textRight(c, reportId, x + width, spacing.contentY, 6.8, "muted", "regular");
}

function renderRoadmapPage(page: RoadmapPage, variant: ReportRenderVariant) {
  const c: string[] = [fillColor("paper"), `0 0 ${reportVisualTokens.page.width} ${reportVisualTokens.page.height} re f`];
  const x = reportVisualTokens.page.marginX;
  const layout = reportVisualTokens.spacing.page.roadmap;
  const proLayout = variant === "pro" ? layout.pro : null;
  drawRunningHeader(c, 2);
  drawPageHero(c, page.kicker, page.headline, page.introduction, layout.heroY, layout.heroSize, layout.heroWidth);
  drawExecutiveDirection(c, page, x, proLayout?.directionY ?? layout.directionY, 507, proLayout?.directionHeight);
  drawSectionHeading(c, "Your 3-Step Priority Roadmap", x, proLayout?.headingRoadmapY ?? layout.headingRoadmapY);
  drawPlanCards(c, page.priorities, x, proLayout?.cardsY ?? layout.cardsY, 507, proLayout?.cardsHeight ?? layout.cardsHeight, {
    alignDividerToTitle: variant === "pro"
  });
  drawSectionHeading(c, "Section Feedback", x, proLayout?.feedbackHeadingY ?? layout.feedbackHeadingY);
  drawFeedbackColumns(c, page.feedback, x, proLayout?.feedbackY ?? layout.feedbackY, 507, proLayout?.feedbackHeight ?? layout.feedbackHeight);
  drawSectionHeading(c, "Example Improvement", x, proLayout?.exampleHeadingY ?? layout.exampleHeadingY);
  drawBeforeAfter(c, page.improvement.before, page.improvement.after, x, proLayout?.exampleY ?? layout.exampleY, 507, proLayout?.exampleHeight ?? layout.exampleHeight);
  drawPageFooter(c, page.footerNote, 2, variant);
  return c.join("\n");
}

function renderPlaybookPage(page: PlaybookPage, variant: ReportRenderVariant) {
  const c: string[] = [fillColor("paper"), `0 0 ${reportVisualTokens.page.width} ${reportVisualTokens.page.height} re f`];
  const x = reportVisualTokens.page.marginX;
  const layout = reportVisualTokens.spacing.page.playbook;
  drawRunningHeader(c, 3);
  drawPageHero(c, page.kicker, page.headline, page.introduction, layout.heroY, layout.heroSize, layout.heroWidth);
  drawBlueHeroPanel(c, "30-DAY FOCUS", page.focus, page.focusSupport, x, layout.calloutY, 507, layout.calloutHeight);
  drawSectionHeading(c, "Your Implementation Plan", x, layout.headingY);
  drawPlanCards(c, page.implementation, x, layout.cardsY, 507, layout.cardsHeight);
  drawDivider(c, layout.emphasisDividerX, layout.emphasisDividerY);
  const emphasisLines = wrap(page.emphasis, 22, layout.emphasisWidth).slice(0, 2);
  drawWrappedText(c, emphasisLines, layout.emphasisX, layout.emphasisTextY, 22, "blue", "regular", 29);
  drawPageFooter(c, page.footerNote, 3, variant);
  return c.join("\n");
}

function renderAlignmentPage(page: AlignmentPage, variant: ReportRenderVariant) {
  const c: string[] = [fillColor("paper"), `0 0 ${reportVisualTokens.page.width} ${reportVisualTokens.page.height} re f`];
  const x = reportVisualTokens.page.marginX;
  const layout = reportVisualTokens.spacing.page.alignment;
  drawRunningHeader(c, 4);
  drawPageHero(c, page.kicker, page.headline, page.introduction, layout.heroY, layout.heroSize, layout.heroWidth);
  drawSectionHeading(c, "Role Alignment Snapshot", x, layout.headingRoleY);
  drawFeedbackColumns(c, page.alignment, x, layout.feedbackY, 507, layout.feedbackHeight, false);
  drawSectionHeading(c, "Example Rewrite", x, layout.headingExampleY);
  drawBeforeAfter(c, page.improvement.before, page.improvement.after, x, layout.exampleY, 507, layout.exampleHeight);
  drawSectionHeading(c, "Application Checklist", x, layout.headingChecklistY);
  drawChecklist(c, page.checklist, x, layout.checklistY, 507);
  drawBlueHeroPanel(c, "What a recruiter should feel", page.callout, page.calloutSupport, x, layout.calloutY, 507, layout.calloutHeight);
  drawPageFooter(c, page.footerNote, 4, variant);
  return c.join("\n");
}

function drawRunningHeader(c: string[], pageNumber: number) {
  const x = reportVisualTokens.page.marginX;
  const right = reportVisualTokens.page.width - reportVisualTokens.page.marginX;
  const page = reportVisualTokens.page;
  drawLogo(c, x, page.headerY);
  textRight(c, "RESUME INTELLIGENCE REPORT", right - 34, page.headerY, 8, "ink", "medium", 1.4);
  line(c, right - 20, page.headerY - page.headerMetaRuleBottom, right - 20, page.headerY + page.headerMetaRuleTop, "rule", 0.8);
  textRight(c, String(pageNumber).padStart(2, "0"), right, page.headerY, 9, "ink", "medium", 1.2);
}

function drawPageHero(c: string[], kicker: string, headline: string, intro: string, headlineY: number, headlineSize: number, headlineWidth: number) {
  const x = reportVisualTokens.page.marginX;
  text(c, kicker, x, headlineY + 33, 7.4, "blue", "medium", 1.5);
  const lines = wrap(headline, headlineSize, headlineWidth).slice(0, 3);
  drawWrappedText(c, lines, x, headlineY, headlineSize, "ink", "regular", headlineSize + 7);
  const introY = headlineY - lines.length * (headlineSize + 7) - reportVisualTokens.spacing.section.heroIntroOffset;
  drawWrappedText(c, wrap(intro, 11.2, 415).slice(0, 3), x, introY, 11.2, "muted", "regular", 16);
}

function drawSectionHeading(c: string[], value: string, x: number, y: number) {
  text(c, value, x, y, 12.5, "ink", "medium");
}

function drawExecutiveDirection(c: string[], page: RoadmapPage, x: number, y: number, width: number, height: number = reportVisualTokens.spacing.executiveDirection.height) {
  const spacing = reportVisualTokens.spacing.executiveDirection;
  const top = y + height;
  panel(c, x, y, width, height, "aqua");
  text(c, "EXECUTIVE DIRECTION", x + spacing.labelX, top - (spacing.height - spacing.labelY), 6.8, "blue", "medium", 1.1);
  drawDivider(c, x + spacing.dividerX, top - (spacing.height - spacing.dividerY));
  // Leave a deliberate gutter before the divider so the final line never feels attached to it.
  drawWrappedText(c, wrap(page.executiveDirection, 14.2, spacing.messageWidth).slice(0, 3), x + spacing.messageX, top - (spacing.height - spacing.messageY), 14.2, "blue", "regular", 20);
  line(c, x + spacing.verticalDividerX, y + spacing.verticalDividerBottom, x + spacing.verticalDividerX, top - (spacing.height - spacing.verticalDividerTop), "rule", 0.7);
  drawWrappedText(c, wrap(page.executiveSupport, 8.8, spacing.supportWidth).slice(0, 4), x + spacing.supportX, top - (spacing.height - spacing.supportY), 8.8, "muted", "regular", 13);
}

function drawPlanCards(
  c: string[],
  cards: Array<{ number: string; title: string; action: string; support: string }>,
  x: number,
  y: number,
  width: number,
  height: number,
  options: { alignDividerToTitle?: boolean } = {}
) {
  const spacing = reportVisualTokens.spacing.card;
  const gap = reportVisualTokens.spacing.card.gap;
  const cardWidth = (width - gap * 2) / 3;
  cards.forEach((card, index) => {
    const left = x + index * (cardWidth + gap);
    outlinedPanel(c, left, y, cardWidth, height);
    const contentX = left + spacing.paddingX + spacing.contentInset;
    text(c, card.number, contentX, y + height - spacing.numberBaselineOffset, 16, "blue", "medium");
    const titleLines = wrap(card.title, 9.4, cardWidth - 26).slice(0, 2);
    const titleY = y + height - spacing.titleBaselineOffset;
    drawWrappedText(c, titleLines, contentX, titleY, 9.4, "blue", "medium", 13);
    const dividerY = options.alignDividerToTitle
      ? titleY - (titleLines.length - 1) * 13 - (titleLines.length > 1 ? reportVisualTokens.spacing.card.proRoadmapMultilineTitleToDivider : reportVisualTokens.spacing.card.proRoadmapTitleToDivider)
      : y + height - spacing.dividerBaselineOffset;
    drawDivider(c, contentX, dividerY);
    const actionLines = wrap(card.action, 8.4, cardWidth - 26).slice(0, 3);
    const actionY = options.alignDividerToTitle ? dividerY - spacing.proRoadmapDividerToBody : y + height - spacing.bodyBaselineOffset;
    drawWrappedText(c, actionLines, contentX, actionY, 8.4, "ink", "regular", 12);
    const supportLines = wrap(card.support, 7.7, cardWidth - 26).slice(0, 3);
    const actionBottom = actionY - Math.max(0, actionLines.length - 1) * 12;
    const supportFloor = y + spacing.paddingBottom + Math.max(0, supportLines.length - 1) * spacing.supportLineHeight;
    const supportY = Math.max(supportFloor, actionBottom - (options.alignDividerToTitle ? spacing.proRoadmapBodyToSupport : spacing.bodyToSupport));
    drawWrappedText(c, supportLines, contentX, supportY, 7.7, "muted", "regular", spacing.supportLineHeight);
  });
}

function drawFeedbackColumns(c: string[], columns: Array<{ title: string; status: "needs-work" | "high-priority" | "improving" | "strong"; description: string; recommendation: string }>, x: number, y: number, width: number, height: number, includeRecommendation = true) {
  const spacing = reportVisualTokens.spacing.feedback;
  const columnWidth = width / columns.length;
  columns.forEach((column, index) => {
    const left = x + index * columnWidth;
    text(c, column.title, left + spacing.paddingX, y + height - spacing.titleBaselineOffset, 8.2, "ink", "medium");
    const status = statusStyle(column.status);
    circle(c, left + spacing.statusDotX, y + height - spacing.statusDotBaselineOffset, 3.3, status.color, true, 0.2);
    text(c, status.label, left + spacing.statusTextX, y + height - spacing.statusBaselineOffset, 7.8, status.color, "regular");
    drawDivider(c, left + spacing.paddingX, y + height - spacing.dividerBaselineOffset);
    const descriptionLines = wrap(column.description, 7.5, columnWidth - 18).slice(0, includeRecommendation ? 2 : 3);
    const descriptionY = y + height - spacing.bodyBaselineOffset;
    drawWrappedText(c, descriptionLines, left + spacing.paddingX, descriptionY, 7.5, "muted", "regular", 10.5);
    if (includeRecommendation) {
      const recommendationLines = wrap(column.recommendation, 7.2, columnWidth - 18).slice(0, 2);
      const descriptionBottom = descriptionY - Math.max(0, descriptionLines.length - 1) * 10.5;
      const recommendationY = descriptionBottom - spacing.bodyToRecommendation;
      drawWrappedText(c, recommendationLines, left + spacing.paddingX, recommendationY, 7.2, "muted", "regular", 10);
    }
    if (index < columns.length - 1) line(c, left + columnWidth - 8, y + 8, left + columnWidth - 8, y + height - 8, "rule", 0.7);
  });
}

function drawBeforeAfter(c: string[], before: string, after: string, x: number, y: number, width: number, height: number) {
  const spacing = reportVisualTokens.spacing.beforeAfter;
  const arrowSize = spacing.arrowSize;
  const gap = spacing.gap;
  const cardWidth = (width - gap) / 2;
  outlinedPanel(c, x, y, cardWidth, height);
  panel(c, x + cardWidth + gap, y, cardWidth, height, "deepBlue");
  text(c, "BEFORE", x + spacing.paddingX, y + height - spacing.labelBaselineOffset, 7, "blue", "medium", 1.2);
  text(c, "\"", x + spacing.paddingX, y + height - spacing.quoteBaselineOffset, 22, "blue", "medium");
  drawWrappedText(c, wrap(before, 9, cardWidth - 55).slice(0, 3), x + spacing.bodyX, y + height - spacing.bodyBaselineOffset, 9, "muted", "regular", spacing.bodyLineHeight);
  const afterX = x + cardWidth + gap;
  text(c, "AFTER", afterX + spacing.paddingX, y + height - spacing.labelBaselineOffset, 7, "white", "medium", 1.2);
  text(c, "\"", afterX + spacing.paddingX, y + height - spacing.quoteBaselineOffset, 22, "white", "medium");
  drawWrappedText(c, wrap(after, 9, cardWidth - 55).slice(0, 3), afterX + spacing.bodyX, y + height - spacing.bodyBaselineOffset, 9, "white", "regular", spacing.bodyLineHeight);
  circle(c, x + cardWidth + gap / 2, y + height / 2, arrowSize / 2, "blue", true, 0.2);
  text(c, ">", x + cardWidth + gap / 2 - spacing.arrowTextXOffset, y + height / 2 - spacing.arrowTextYOffset, 11, "white", "regular");
}

function drawBlueHeroPanel(c: string[], label: string, message: string, support: string, x: number, y: number, width: number, height: number) {
  const spacing = reportVisualTokens.spacing.callout;
  panel(c, x, y, width, height, "deepBlue");
  text(c, label, x + spacing.paddingX, y + height - spacing.labelBaselineOffset, 7.2, "white", "medium", 1.2);
  const isStacked = message.includes("\n");
  const messageLines = isStacked ? message.split("\n") : wrap(message, 15, width * 0.58).slice(0, 4);
  const dividerY = y + height - (isStacked ? spacing.stackedDividerBaselineOffset : spacing.dividerBaselineOffset);
  drawDivider(c, x + spacing.paddingX, dividerY, "white");
  const messageBaseline = y + height - (isStacked ? spacing.stackedMessageBaselineOffset : spacing.messageBaselineOffset);
  drawWrappedText(c, messageLines, x + spacing.paddingX, messageBaseline, 15, "white", "regular", isStacked ? 19 : 22);
  line(c, x + width * spacing.columnSplit, y + spacing.dividerInset, x + width * spacing.columnSplit, y + height - spacing.dividerBaselineOffset, "rule", 0.7);
  const supportLines = wrap(support, 10, width * spacing.supportWidthRatio);
  const supportLineHeight = 16;
  const supportBottom = y + Math.max(14, spacing.paddingBottom - 4);
  const supportBaseline = Math.max(
    supportBottom + Math.max(0, supportLines.length - 1) * supportLineHeight,
    y + height - spacing.supportInset - 11
  );
  drawWrappedText(c, supportLines, x + width * spacing.supportXRatio, supportBaseline, 10, "white", "regular", supportLineHeight);
}

function drawChecklist(c: string[], items: string[], x: number, y: number, width: number) {
  const spacing = reportVisualTokens.spacing.checklist;
  const gap = spacing.gap;
  const columnWidth = (width - gap) / 2;
  outlinedPanel(c, x, y, columnWidth, spacing.height);
  outlinedPanel(c, x + columnWidth + gap, y, columnWidth, spacing.height);
  items.forEach((item, index) => {
    const column = index < 3 ? 0 : 1;
    const row = index % 3;
    const left = x + column * (columnWidth + gap) + spacing.paddingX;
    const itemY = y + spacing.firstRowOffset - row * spacing.rowGap;
    line(c, left, itemY + spacing.ruleYOffset, left + spacing.ruleWidth, itemY + spacing.ruleYOffset, "blue", 1.1);
    text(c, item, left + spacing.textX, itemY - spacing.textYOffset, 8.6, "muted", "regular");
  });
}

function drawPageFooter(c: string[], note: string, pageNumber: number, variant: ReportRenderVariant) {
  const spacing = reportVisualTokens.spacing.footer;
  const x = reportVisualTokens.page.marginX;
  const width = reportVisualTokens.page.width - x * 2;
  line(c, x, spacing.ruleY, x + width, spacing.ruleY, "rule", 0.7);
  drawFooterMark(c, x, variant);
  drawWrappedText(c, wrap(note, 7.2, 340).slice(0, 2), x + spacing.noteX, spacing.noteY, 7.2, "muted", "regular", spacing.noteLineHeight);
  textRight(c, `Page ${String(pageNumber).padStart(2, "0")}`, x + width, spacing.contentY, 6.8, "muted", "regular");
}

function drawFooterMark(c: string[], x: number, variant: ReportRenderVariant) {
  const spacing = reportVisualTokens.spacing.footer;
  const centerX = x + spacing.markX;
  circle(c, centerX, spacing.markY, spacing.markRadius, "blue", false, 0.8);

  if (variant === "pro") {
    const labelSize = 5.5;
    const labelWidth = estimateTextWidth("RN", labelSize, "medium");
    text(c, "RN", centerX - labelWidth / 2, spacing.markY - 2, labelSize, "blue", "medium");
    return;
  }

  text(c, "RN", x + spacing.markTextX, spacing.contentY - spacing.markTextYOffset, 5.5, "blue", "medium");
}

function statusStyle(status: "needs-work" | "high-priority" | "improving" | "strong") {
  if (status === "needs-work") return { label: "Needs Improvement", color: "warning" as const };
  if (status === "high-priority") return { label: "High Priority", color: "warning" as const };
  if (status === "improving") return { label: "Improving", color: "green" as const };
  return { label: "Strong", color: "green" as const };
}

function buildPdf(pages: RenderPage[]) {
  const fonts = getRobotoFonts();
  const objects: PdfObject[] = [];
  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  // Reserve the page tree object before allocating the three embedded font families.
  objects[2] = "";
  const fontResources = registerRobotoFonts(objects, fonts);
  const pageIds: number[] = [];
  pages.forEach((render) => {
    const pageId = objects.length;
    const streamId = pageId + 1;
    pageIds.push(pageId);
    const stream = render();
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${reportVisualTokens.page.width} ${reportVisualTokens.page.height}] /Resources << /Font << ${fontResources} >> >> /Contents ${streamId} 0 R >>`;
    objects[streamId] = `<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`;
  });
  objects[2] = `<< /Type /Pages /Kids [${pageIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageIds.length} >>`;

  const chunks: Buffer[] = [Buffer.from("%PDF-1.4\n% ResuNexx Report Engine\n", "ascii")];
  const offsets = [0];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = Buffer.concat(chunks).length;
    chunks.push(Buffer.from(`${id} 0 obj\n`, "ascii"), objectBuffer(objects[id]), Buffer.from("\nendobj\n", "ascii"));
  }
  const xrefOffset = Buffer.concat(chunks).length;
  chunks.push(Buffer.from(`xref\n0 ${objects.length}\n0000000000 65535 f \n`, "ascii"));
  for (let id = 1; id < objects.length; id += 1) chunks.push(Buffer.from(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`, "ascii"));
  chunks.push(Buffer.from(`trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`, "ascii"));
  return Buffer.concat(chunks);
}

function registerRobotoFonts(objects: PdfObject[], fonts: Record<RobotoWeight, EmbeddedRobotoFont>) {
  const resourceNames: Record<RobotoWeight, string> = { regular: "F1", medium: "F2", bold: "F3" };
  const entries: string[] = [];

  (Object.keys(resourceNames) as RobotoWeight[]).forEach((weight) => {
    const type0Id = objects.length;
    const cidFontId = type0Id + 1;
    const descriptorId = type0Id + 2;
    const fontFileId = type0Id + 3;
    const toUnicodeId = type0Id + 4;
    const font = fonts[weight];
    const [xMin, yMin, xMax, yMax] = font.bbox.map((value) => Math.round((value / font.unitsPerEm) * 1000));
    const ascent = Math.round((font.ascent / font.unitsPerEm) * 1000);
    const descent = Math.round((font.descent / font.unitsPerEm) * 1000);
    const widths = Array.from(font.widths.entries())
      .sort(([a], [b]) => a - b)
      .map(([glyphId, width]) => `${glyphId} [${Math.round(width)}]`)
      .join(" ");

    objects[type0Id] = `<< /Type /Font /Subtype /Type0 /BaseFont /${font.postscriptName} /Encoding /Identity-H /DescendantFonts [${cidFontId} 0 R] /ToUnicode ${toUnicodeId} 0 R >>`;
    objects[cidFontId] = `<< /Type /Font /Subtype /CIDFontType2 /BaseFont /${font.postscriptName} /CIDSystemInfo << /Registry (Adobe) /Ordering (Identity) /Supplement 0 >> /FontDescriptor ${descriptorId} 0 R /DW 500 /W [${widths}] /CIDToGIDMap /Identity >>`;
    objects[descriptorId] = `<< /Type /FontDescriptor /FontName /${font.postscriptName} /Flags 32 /FontBBox [${xMin} ${yMin} ${xMax} ${yMax}] /ItalicAngle 0 /Ascent ${ascent} /Descent ${descent} /CapHeight ${ascent} /StemV 80 /FontFile2 ${fontFileId} 0 R >>`;
    objects[fontFileId] = Buffer.concat([Buffer.from(`<< /Length ${font.data.length} >>\nstream\n`, "ascii"), font.data, Buffer.from("\nendstream", "ascii")]);
    objects[toUnicodeId] = unicodeMap(font);
    entries.push(`/${resourceNames[weight]} ${type0Id} 0 R`);
  });

  return entries.join(" ");
}

function unicodeMap(font: EmbeddedRobotoFont) {
  const mappings = Array.from(font.glyphs.entries())
    .sort(([a], [b]) => a - b)
    .map(([codePoint, glyphId]) => `<${hex(glyphId, 4)}> <${hex(codePoint, 4)}>`)
    .join("\n");
  const source = [
    "/CIDInit /ProcSet findresource begin",
    "12 dict begin",
    "begincmap",
    "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
    "/CMapName /Adobe-Identity-UCS def",
    "/CMapType 2 def",
    "1 begincodespacerange",
    "<0000> <FFFF>",
    "endcodespacerange",
    `${font.glyphs.size} beginbfchar`,
    mappings,
    "endbfchar",
    "endcmap",
    "CMapName currentdict /CMap defineresource pop",
    "end",
    "end"
  ].join("\n");
  return `<< /Length ${Buffer.byteLength(source, "ascii")} >>\nstream\n${source}\nendstream`;
}

function objectBuffer(value: PdfObject | undefined) {
  if (value === undefined) throw new Error("Report PDF object generation failed.");
  return Buffer.isBuffer(value) ? value : Buffer.from(value, "utf8");
}

function panel(c: string[], x: number, y: number, width: number, height: number, color: keyof typeof palette) {
  roundedRect(c, x, y, width, height, reportVisualTokens.radius.panel, color);
}

function outlinedPanel(c: string[], x: number, y: number, width: number, height: number) {
  roundedRectPath(c, x, y, width, height, reportVisualTokens.radius.panel, false, "rule", 0.8);
}

function roundedRect(c: string[], x: number, y: number, width: number, height: number, radius: number, color: keyof typeof palette) {
  roundedRectPath(c, x, y, width, height, radius, true, color);
}

function roundedRectPath(c: string[], x: number, y: number, width: number, height: number, radius: number, filled: boolean, color: keyof typeof palette, strokeWidth = 0.8) {
  const r = Math.min(radius, width / 2, height / 2);
  const k = 0.5522847498 * r;
  c.push(
    filled ? fillColor(color) : strokeColor(color),
    `${strokeWidth} w`,
    `${x + r} ${y} m ` +
      `${x + width - r} ${y} l ` +
      `${x + width - r + k} ${y} ${x + width} ${y + r - k} ${x + width} ${y + r} c ` +
      `${x + width} ${y + height - r} l ` +
      `${x + width} ${y + height - r + k} ${x + width - r + k} ${y + height} ${x + width - r} ${y + height} c ` +
      `${x + r} ${y + height} l ` +
      `${x + r - k} ${y + height} ${x} ${y + height - r + k} ${x} ${y + height - r} c ` +
      `${x} ${y + r} l ` +
      `${x} ${y + r - k} ${x + r - k} ${y} ${x + r} ${y} c ${filled ? "f" : "S"}`
  );
}

function text(c: string[], value: string, x: number, y: number, size: number, color: keyof typeof palette, weight: RobotoWeight, spacing = 0) {
  c.push(fillColor(color), `BT /${fontResource(weight)} ${size} Tf ${spacing} Tc 1 0 0 1 ${x} ${y} Tm ${encodeRobotoText(value, weight)} Tj ET`);
}

function textRight(c: string[], value: string, right: number, y: number, size: number, color: keyof typeof palette, weight: RobotoWeight, spacing = 0) {
  text(c, value, right - estimateTextWidth(value, size, weight, spacing), y, size, color, weight, spacing);
}

function drawWrappedText(c: string[], lines: string[], x: number, y: number, size: number, color: keyof typeof palette, weight: RobotoWeight, lineHeight: number) {
  lines.forEach((value, index) => text(c, value, x, y - index * lineHeight, size, color, weight));
}

function line(c: string[], x1: number, y1: number, x2: number, y2: number, color: keyof typeof palette, width: number) {
  c.push(strokeColor(color), `${width} w ${x1} ${y1} m ${x2} ${y2} l S`);
}

function drawDivider(c: string[], x: number, y: number, color: "blue" | "white" = "blue") {
  const { width, thickness } = reportVisualTokens.spacing.divider;
  line(c, x, y, x + width, y, color, thickness);
}

function circle(c: string[], x: number, y: number, radius: number, color: keyof typeof palette, filled: boolean, width: number) {
  const k = 0.5522847498 * radius;
  c.push(filled ? fillColor(color) : strokeColor(color), `${width} w ${x + radius} ${y} m ${x + radius} ${y + k} ${x + k} ${y + radius} ${x} ${y + radius} c ${x - k} ${y + radius} ${x - radius} ${y + k} ${x - radius} ${y} c ${x - radius} ${y - k} ${x - k} ${y - radius} ${x} ${y - radius} c ${x + k} ${y - radius} ${x + radius} ${y - k} ${x + radius} ${y} c ${filled ? "f" : "S"}`);
}

function drawCircleIcon(c: string[], x: number, y: number, value: string, color: keyof typeof palette) {
  circle(c, x, y, 12, color, false, 0.8);
  text(c, value, x - (value === "!" ? 1.5 : 2.2), y - 3, 9, color, "regular");
}

function drawPriorityIcon(c: string[], icon: "target" | "search" | "edit", x: number, y: number) {
  if (icon === "target") {
    circle(c, x, y, 7, "blue", false, 0.8);
    line(c, x - 11, y, x + 11, y, "blue", 0.8);
    line(c, x, y - 11, x, y + 11, "blue", 0.8);
  } else if (icon === "search") {
    circle(c, x - 2, y + 2, 7, "blue", false, 0.8);
    line(c, x + 4, y - 4, x + 12, y - 12, "blue", 0.8);
  } else {
    line(c, x - 8, y - 8, x + 8, y + 8, "blue", 1.2);
    line(c, x - 10, y - 10, x - 6, y - 8, "blue", 0.8);
  }
}

function drawSignalIcon(c: string[], icon: "list" | "message" | "key" | "target" | "spark", x: number, y: number) {
  if (icon === "list") {
    [-5, 0, 5].forEach((offset) => {
      circle(c, x, y + offset, 1, "blue", true, 0.5);
      line(c, x + 4, y + offset, x + 14, y + offset, "blue", 0.7);
    });
  } else if (icon === "message") {
    line(c, x, y - 5, x + 15, y - 5, "blue", 0.7);
    line(c, x + 15, y - 5, x + 15, y + 7, "blue", 0.7);
    line(c, x + 15, y + 7, x, y + 7, "blue", 0.7);
    line(c, x, y + 7, x, y - 5, "blue", 0.7);
  } else if (icon === "key") {
    circle(c, x + 3, y + 4, 4, "blue", false, 0.7);
    line(c, x + 6, y + 1, x + 16, y - 9, "blue", 0.8);
  } else if (icon === "target") {
    circle(c, x + 7, y, 6, "blue", false, 0.7);
    line(c, x - 2, y, x + 16, y, "blue", 0.7);
    line(c, x + 7, y - 9, x + 7, y + 9, "blue", 0.7);
  } else {
    line(c, x + 7, y - 9, x + 7, y + 9, "blue", 0.7);
    line(c, x - 2, y, x + 16, y, "blue", 0.7);
    line(c, x, y - 7, x + 14, y + 7, "blue", 0.7);
    line(c, x, y + 7, x + 14, y - 7, "blue", 0.7);
  }
}

function fillColor(color: keyof typeof palette) {
  return `${palette[color].join(" ")} rg`;
}

function strokeColor(color: keyof typeof palette) {
  return `${palette[color].join(" ")} RG`;
}

function wrap(value: string, size: number, maxWidth: number) {
  const words = sanitizeText(value).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (current && estimateTextWidth(candidate, size, "regular") > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function estimateTextWidth(value: string, size: number, weight: RobotoWeight, spacing = 0) {
  const font = getRobotoFonts()[weight];
  const fallbackWidth = font.widths.get(font.glyphs.get(0x3f) ?? 0) ?? 500;
  const width = Array.from(sanitizeText(value)).reduce((total, character) => {
    const glyphId = font.glyphs.get(character.codePointAt(0) ?? 0x3f) ?? font.glyphs.get(0x3f) ?? 0;
    return total + (font.widths.get(glyphId) ?? fallbackWidth);
  }, 0);
  return (width / 1000) * size + Math.max(0, value.length - 1) * spacing;
}

function fontResource(weight: RobotoWeight) {
  if (weight === "bold") return "F3";
  if (weight === "medium") return "F2";
  return "F1";
}

function encodeRobotoText(value: string, weight: RobotoWeight) {
  const font = getRobotoFonts()[weight];
  const fallbackGlyph = font.glyphs.get(0x3f) ?? 0;
  const glyphs = Array.from(sanitizeText(value)).map((character) => {
    const codePoint = character.codePointAt(0) ?? 0x3f;
    return hex(font.glyphs.get(codePoint) ?? fallbackGlyph, 4);
  });
  return `<${glyphs.join("")}>`;
}

function hex(value: number, width: number) {
  return value.toString(16).toUpperCase().padStart(width, "0");
}

function sanitizeText(value: string) {
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}
