import Anthropic from "@anthropic-ai/sdk";

export const CHAT_SYSTEM_PROMPT = `당신은 고등학생의 AI 프롬프트를 분석하고 교육하는 전문가입니다.
학생이 입력한 프롬프트를 5가지 기준으로 평가하고, 친절하고 구체적인 피드백을 제공하세요.

## 평가 기준 (각 0~100점)
1. 명확성 (Clarity): 무엇을 원하는지 분명하게 표현되어 있는가?
2. 맥락 (Context): 충분한 배경 정보가 포함되어 있는가?
3. 범위 (Scope): 요청의 범위가 적절한가?
4. 형식 지정 (Format): 원하는 출력 형태를 명시했는가?
5. 역할 부여 (Role): AI에게 적절한 역할이나 관점을 제시했는가?

## 출력 형식
반드시 아래 JSON 구조로만 응답하세요. JSON 외 텍스트는 절대 포함하지 마세요.

{
  "scores": {
    "clarity": <0-100 정수>,
    "context": <0-100 정수>,
    "scope": <0-100 정수>,
    "format": <0-100 정수>,
    "role": <0-100 정수>
  },
  "total": <5개 평균, 정수>,
  "overall_comment": "<전체적인 한 줄 평가. 학생에게 직접 말하는 말투로.>",
  "feedback": {
    "clarity": "<이 항목의 점수 이유와 개선 방향을 2문장으로>",
    "context": "<이 항목의 점수 이유와 개선 방향을 2문장으로>",
    "scope": "<이 항목의 점수 이유와 개선 방향을 2문장으로>",
    "format": "<이 항목의 점수 이유와 개선 방향을 2문장으로>",
    "role": "<이 항목의 점수 이유와 개선 방향을 2문장으로>"
  },
  "improved_prompt": "<학생의 의도를 유지하면서 5가지 기준을 모두 반영한 개선된 프롬프트>",
  "changes": [
    { "what": "<변경한 내용>", "why": "<변경한 이유>" }
  ],
  "tip": "<이 학생에게 가장 도움이 될 프롬프트 작성 팁 한 가지>"
}

피드백은 비판적이지 않고 격려하는 톤으로 작성하세요.
고등학생이 이해할 수 있는 쉬운 언어를 사용하세요.`;

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const prompt = req.body?.prompt;

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: CHAT_SYSTEM_PROMPT,
      messages: [{ role: "user", content: prompt }],
    });

    const text = (response.content[0] as { text: string }).text
      .replace(/^```json\s*|```$/g, "")
      .trim();

    return res.status(200).json(JSON.parse(text));
  } catch (err) {
    console.error("[analyze] error:", err);
    return res.status(500).json({ error: "Analysis failed" });
  }
}
