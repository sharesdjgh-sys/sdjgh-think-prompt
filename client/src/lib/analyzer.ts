export interface ChatAnalysisResult {
  scores: {
    clarity: number;
    context: number;
    scope: number;
    format: number;
    role: number;
  };
  total: number;
  overall_comment: string;
  feedback: {
    clarity: string;
    context: string;
    scope: string;
    format: string;
    role: string;
  };
  improved_prompt: string;
  changes: { what: string; why: string }[];
  tip: string;
}

export async function analyzeChatPrompt(userPrompt: string): Promise<ChatAnalysisResult> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: userPrompt }),
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
}
