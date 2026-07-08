import { analyzeResume } from "@/lib/engines/resume/resumeEngine";
import { ResumeReport } from "@/lib/report-schema";

export async function analyzeResumeText(resumeText: string): Promise<ResumeReport> {
  return analyzeResume({ resumeText });
}
