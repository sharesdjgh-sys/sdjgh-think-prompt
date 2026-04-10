import { useState } from "react";
import type { ChatAnalysisResult } from "./lib/analyzer";
import { analyzeChatPrompt } from "./lib/analyzer";
import AnalysisResult from "./components/AnalysisResult";
import Tutorial from "./components/Tutorial";
import styles from "./App.module.css";

type Step = "tutorial" | "input" | "loading" | "result";

const CRITERIA = [
  { label: "명확성", desc: "원하는 것을 분명히", color: "#6366f1", bg: "#eef2ff", border: "#c7d2fe" },
  { label: "맥락",   desc: "배경 정보 포함",    color: "#0ea5e9", bg: "#f0f9ff", border: "#bae6fd" },
  { label: "범위",   desc: "적절한 질문 크기",  color: "#10b981", bg: "#f0fdf4", border: "#bbf7d0" },
  { label: "형식",   desc: "출력 형태 지정",    color: "#f59e0b", bg: "#fffbeb", border: "#fde68a" },
  { label: "역할",   desc: "AI 역할 부여",      color: "#ec4899", bg: "#fdf2f8", border: "#fbcfe8" },
];

const HOW_TO = [
  {
    step: "01",
    title: "평소 쓰던 질문 입력",
    desc: "AI에게 보내려던 질문을 수정 없이 그대로 입력하세요. 짧아도 괜찮아요.",
    color: "#6366f1",
  },
  {
    step: "02",
    title: "5가지 기준으로 분석",
    desc: "명확성, 맥락, 범위, 형식, 역할 부여 — 5가지 관점에서 점수와 피드백을 받아요.",
    color: "#0ea5e9",
  },
  {
    step: "03",
    title: "개선된 프롬프트 확인",
    desc: "무엇이 왜 바뀌었는지 설명과 함께 더 나은 프롬프트를 제안해드려요.",
    color: "#10b981",
  },
  {
    step: "04",
    title: "직접 다시 써보기",
    desc: "피드백을 참고해서 직접 고쳐보고 점수가 올랐는지 확인하세요.",
    color: "#f59e0b",
  },
];

export default function App() {
  const [step, setStep] = useState<Step>("tutorial");
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<ChatAnalysisResult | null>(null);
  const [error, setError] = useState("");

  async function handleAnalyze() {
    if (!prompt.trim()) return;
    setStep("loading");
    setError("");
    try {
      const res = await analyzeChatPrompt(prompt);
      setResult(res);
      setStep("result");
    } catch {
      setError("분석 중 오류가 발생했어요. 다시 시도해주세요.");
      setStep("input");
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleAnalyze();
  }

  if (step === "tutorial") {
    return <Tutorial onStart={() => setStep("input")} />;
  }

  if (step === "result" && result) {
    return <AnalysisResult original={prompt} result={result} onReset={() => { setStep("input"); setPrompt(""); setResult(null); }} />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* 왼쪽: 헤더 + 분석 기준 */}
        <div className={styles.left}>
          <div className={styles.header}>
            <div className={styles.badge}>AI 프롬프트 학습 도우미</div>
            <h1 className={styles.title}>Think<br />Prompt</h1>
            <p className={styles.subtitle}>
              AI에게 보내려던 질문을 그대로 입력하면<br />
              더 좋은 질문으로 만드는 방법을 알려드려요.
            </p>
          </div>

          <div className={styles.criteriaSection}>
            <p className={styles.sectionTitle}>분석 기준</p>
            <div className={styles.criteria}>
              {CRITERIA.map((c) => (
                <div
                  key={c.label}
                  className={styles.criteriaItem}
                  style={{ background: c.bg, borderColor: c.border }}
                >
                  <span className={styles.criteriaLabel} style={{ color: c.color }}>{c.label}</span>
                  <span className={styles.criteriaDesc}>{c.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 입력 + 버튼 + 사용 방법 */}
        <div className={styles.right}>
          <div className={`${styles.card} ${step === "loading" ? styles.cardLoading : ""}`}>
            <label className={styles.label}>질문 입력</label>
            <textarea
              className={styles.textarea}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"예) 영어 에세이는 어떻게 써야 하나요?\n예) 수학 공부를 잘하려면 어떻게 해야 하나요?\n예) 수행평가 발표는 어떻게 준비하면 좋을까요?\n예) 중간고사 시험 공부 계획을 짜주세요"}
              disabled={step === "loading"}
              rows={5}
            />
            <p className={styles.hint}>Ctrl+Enter로 빠르게 분석할 수 있어요</p>
            {error && <p className={styles.error}>{error}</p>}
          </div>

          <button
            className={`${styles.btn} ${step === "loading" ? styles.btnLoading : !prompt.trim() ? styles.btnDisabled : ""}`}
            onClick={handleAnalyze}
            disabled={step === "loading" || !prompt.trim()}
          >
            {step === "loading" ? (
              <span className={styles.loadingRow}>
                <span className={styles.spinner} />
                AI가 분석하는 중<span className={styles.dots}><span>.</span><span>.</span><span>.</span></span>
              </span>
            ) : "프롬프트 분석하기 →"}
          </button>

          <div className={styles.howToSection}>
            <p className={styles.sectionTitle}>이렇게 활용하세요</p>
            <div className={styles.howToGrid}>
              {HOW_TO.map((h) => (
                <div key={h.step} className={styles.howToItem}>
                  <div
                    className={styles.howToStep}
                    style={{ color: h.color, borderColor: h.color + "33", background: h.color + "11" }}
                  >
                    {h.step}
                  </div>
                  <div>
                    <p className={styles.howToTitle}>{h.title}</p>
                    <p className={styles.howToDesc}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
