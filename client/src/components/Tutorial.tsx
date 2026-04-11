import { useState } from "react";
import s from "./Tutorial.module.css";

interface Props {
  onStart: () => void;
}

const QUIZ = [
  {
    context: "영어 수행평가 에세이를 도움받고 싶을 때",
    A: "영어 에세이 써줘",
    B: "고1 학생이에요. 수행평가로 '환경 보호'를 주제로 한 영어 에세이를 250단어로 써야 해요. 서론-본론-결론 형식으로 작성해줘.",
    answer: "B" as const,
    why: "B는 학년, 목적(수행평가), 주제, 분량, 형식을 모두 알려줬어요. AI가 딱 맞는 에세이를 써줄 수 있어요.",
  },
  {
    context: "팀 발표 준비가 필요할 때",
    A: "발표 자료 도와줘",
    B: "다음 주 수요일에 팀장님께 분기 실적 보고를 해야 해요. 5분 발표용으로 핵심만 담은 3페이지 슬라이드 구성을 잡아줘.",
    answer: "B" as const,
    why: "B는 청중(팀장님), 목적(분기 실적 보고), 시간 제약, 분량, 형식을 모두 담았어요. AI가 딱 맞는 구성을 바로 잡아줄 수 있어요.",
  },
];

const CRITERIA = [
  {
    icon: "solar:target-bold",
    label: "명확성",
    color: "#6366f1",
    border: "#c7d2fe",
    desc: "무엇을 원하는지 정확히 표현하기",
    example: '"에세이 써줘" → "설득력 있는 영어 에세이 써줘"',
  },
  {
    icon: "solar:layers-bold",
    label: "맥락",
    color: "#0ea5e9",
    border: "#bae6fd",
    desc: "내 상황과 배경 알려주기",
    example: '"고2 학생이고, 이번 주 중간고사예요." 또는 "팀 발표가 3일 뒤예요."',
  },
  {
    icon: "solar:maximize-square-bold",
    label: "범위",
    color: "#10b981",
    border: "#bbf7d0",
    desc: "질문 크기를 적절하게",
    example: '"공부 방법" → "수학 미적분 단기 공부법"',
  },
  {
    icon: "solar:document-text-bold",
    label: "형식",
    color: "#f59e0b",
    border: "#fde68a",
    desc: "어떤 형태로 받고 싶은지",
    example: '"표로 정리해줘", "단계별로 설명해줘"',
  },
  {
    icon: "solar:user-speak-rounded-bold",
    label: "역할",
    color: "#ec4899",
    border: "#fbcfe8",
    desc: "AI의 관점이나 역할 지정하기",
    example: '"수학 선생님처럼 설명해줘"',
  },
];

const FEATURES = [
  {
    icon: "solar:chart-square-bold",
    title: "5가지 기준 점수 분석",
    desc: "명확성·맥락·범위·형식·역할 부여. 내 질문이 어디서 막혔는지 바로 알 수 있어요.",
  },
  {
    icon: "solar:magic-stick-3-bold",
    title: "개선된 프롬프트 제안",
    desc: "무엇을 왜 바꿨는지 설명과 함께 더 나은 버전을 제시해드려요.",
  },
  {
    icon: "solar:pen-new-round-bold",
    title: "직접 다시 써보기",
    desc: "피드백을 보고 직접 고쳐보면 점수가 올랐는지 바로 확인할 수 있어요.",
  },
];

export default function Tutorial({ onStart }: Props) {
  // step 0 = welcome, step 1~5 = tutorial
  const [step, setStep] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [picked, setPicked] = useState<"A" | "B" | null>(null);
  const [correct, setCorrect] = useState(0);
  const [allDone, setAllDone] = useState(false);

  function pickAnswer(opt: "A" | "B") {
    if (picked !== null) return;
    if (opt === QUIZ[quizIdx].answer) setCorrect((c) => c + 1);
    setPicked(opt);
  }

  function nextQuestion() {
    if (quizIdx < QUIZ.length - 1) {
      setQuizIdx((i) => i + 1);
      setPicked(null);
    } else {
      setAllDone(true);
    }
  }

  function goToStep(n: number) {
    if (n === 4) {
      setQuizIdx(0);
      setPicked(null);
      setCorrect(0);
      setAllDone(false);
    }
    setStep(n);
  }

  const q = QUIZ[quizIdx];
  const isCorrect = picked === q?.answer;

  /* ── Welcome screen ── */
  if (step === 0) {
    return (
      <div className={s.welcomePage}>
        <div className={s.welcomeContainer}>

          <div className={s.welcomeLeft}>
            <div className={s.welcomeBadge}>AI 프롬프트 학습 도우미</div>
            <h1 className={s.welcomeTitle}>
              AI 답변이<br />
              달라지는<br />
              질문의 차이
            </h1>
            <p className={s.welcomeDesc}>
              같은 질문도 어떻게 쓰느냐에 따라<br />
              AI의 답변 품질이 완전히 달라집니다.<br />
              Think Prompt가 내 질문을 분석하고<br />
              더 나은 방법을 알려드려요.
            </p>

            <div className={s.welcomeActions}>
              <button className={s.welcomeBtnPrimary} onClick={() => setStep(1)}>
                <iconify-icon icon="solar:book-2-bold" width="16" height="16" />
                1분 튜토리얼 시작
              </button>
              <button className={s.welcomeBtnSecondary} onClick={onStart}>
                바로 시작하기
                <iconify-icon icon="solar:arrow-right-bold" width="14" height="14" />
              </button>
            </div>
          </div>

          <div className={s.welcomeRight}>
            {FEATURES.map((f) => (
              <div key={f.title} className={s.featureCard}>
                <div className={s.featureIcon}>
                  <iconify-icon icon={f.icon} width="20" height="20" />
                </div>
                <div>
                  <p className={s.featureTitle}>{f.title}</p>
                  <p className={s.featureDesc}>{f.desc}</p>
                </div>
              </div>
            ))}

            <div className={s.exampleBox}>
              <p className={s.exampleLabel}>직접 보면 바로 알 수 있어요</p>
              <div className={s.exampleRow}>
                <div className={s.exampleBefore}>
                  <span className={s.exampleTag} data-type="before">전</span>
                  <span className={s.exampleText}>"수학 공부 방법 알려줘"</span>
                </div>
                <iconify-icon icon="solar:arrow-right-bold" width="14" height="14" style={{ color: "var(--gray-400)", flexShrink: 0 }} />
                <div className={s.exampleAfter}>
                  <span className={s.exampleTag} data-type="after">후</span>
                  <span className={s.exampleText}>"고2, 수능 수학 2등급. 미적분이 약한데 3개월 1등급 목표 주차별 계획 짜줘."</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    );
  }

  /* ── Tutorial steps 1–5 ── */
  return (
    <div className={s.page}>
      <div className={s.container}>

        {/* Top bar */}
        <div className={s.topBar}>
          <div className={s.stepDots}>
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={`${s.dot} ${n === step ? s.dotActive : n < step ? s.dotDone : ""}`}
              />
            ))}
          </div>
          <button className={s.skipBtn} onClick={onStart}>건너뛰기</button>
        </div>

        {/* Progress bar */}
        <div className={s.progressTrack}>
          <div className={s.progressFill} style={{ width: `${(step / 5) * 100}%` }} />
        </div>

        {/* Card */}
        <div className={s.card}>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <div className={s.stepContent}>
              <div className={s.stepMeta}>
                <span className={s.stepNum}>01</span>
                <span className={s.stepTag}>개념</span>
              </div>
              <h2 className={s.title}>프롬프트가 뭔가요?</h2>
              <p className={s.desc}>AI에게 보내는 질문이나 지시를 <strong>프롬프트</strong>라고 해요.</p>

              <div className={s.compareGrid}>
                <div className={s.compareCell}>
                  <div className={s.compareIcon}>
                    <iconify-icon icon="solar:user-bold" width="20" height="20" />
                  </div>
                  <p className={s.compareTitle}>친구에게</p>
                  <p className={s.compareQuote}>"에세이 어떻게 써?"</p>
                  <p className={s.compareNote}>눈치껏 상황을 파악해줘요</p>
                </div>
                <div className={s.compareDivider}>
                  <span className={s.vsText}>vs</span>
                </div>
                <div className={s.compareCell}>
                  <div className={s.compareIcon}>
                    <iconify-icon icon="solar:cpu-bolt-bold" width="20" height="20" />
                  </div>
                  <p className={s.compareTitle}>AI에게</p>
                  <p className={s.compareQuote}>"에세이 어떻게 써?"</p>
                  <p className={s.compareNote}>어떤 에세이인지 몰라요</p>
                </div>
              </div>

              <div className={s.keyPoint}>
                <iconify-icon icon="solar:lightbulb-bolt-bold" width="16" height="16" style={{ color: "var(--primary)", flexShrink: 0 }} />
                <span>AI는 내가 쓴 말 그대로만 이해해요. <strong>좋은 질문 = 좋은 답변.</strong></span>
              </div>
            </div>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <div className={s.stepContent}>
              <div className={s.stepMeta}>
                <span className={s.stepNum}>02</span>
                <span className={s.stepTag}>비교</span>
              </div>
              <h2 className={s.title}>이런 차이가 있어요</h2>
              <p className={s.desc}>같은 목적이라도 프롬프트가 다르면 결과가 완전히 달라져요.</p>

              <div className={s.diffBlock}>
                <div className={s.diffBadge} data-type="bad">아쉬운 프롬프트</div>
                <p className={s.diffPrompt}>"수학 공부 방법 알려줘"</p>
                <div className={s.diffReaction}>
                  <span className={s.diffReactionLabel}>AI 입장</span>
                  몇 학년? 어떤 단원? 시험이 언제? — 두루뭉술한 답변만 줄 수 있어요.
                </div>
              </div>

              <div className={s.diffBlock} data-good>
                <div className={s.diffBadge} data-type="good">좋은 프롬프트</div>
                <p className={s.diffPrompt}>
                  "고2 학생인데 수능 수학 2등급이에요. 미적분이 약한데, 남은 3개월 동안 1등급 올리기 위한 주차별 학습 계획을 짜줘."
                </p>
                <div className={s.diffReaction}>
                  <span className={s.diffReactionLabel}>AI 입장</span>
                  딱 맞는 3개월 학습 계획을 바로 줄 수 있어요.
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3 ── */}
          {step === 3 && (
            <div className={s.stepContent}>
              <div className={s.stepMeta}>
                <span className={s.stepNum}>03</span>
                <span className={s.stepTag}>원칙</span>
              </div>
              <h2 className={s.title}>좋은 프롬프트의<br />5가지 기준</h2>
              <p className={s.desc}>이 5가지를 넣으면 훨씬 나은 답변을 받을 수 있어요.</p>

              <div className={s.criteriaList}>
                {CRITERIA.map((c) => (
                  <div key={c.label} className={s.criteriaRow} style={{ borderLeftColor: c.border }}>
                    <div className={s.criteriaIconWrap} style={{ color: c.color }}>
                      <iconify-icon icon={c.icon} width="18" height="18" />
                    </div>
                    <div className={s.criteriaBody}>
                      <span className={s.criteriaLabel} style={{ color: c.color }}>{c.label}</span>
                      <span className={s.criteriaDesc}>{c.desc}</span>
                      <span className={s.criteriaExample}>{c.example}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Quiz ── */}
          {step === 4 && (
            <div className={s.stepContent}>
              <div className={s.stepMeta}>
                <span className={s.stepNum}>04</span>
                <span className={s.stepTag}>퀴즈</span>
              </div>
              <h2 className={s.title}>어떤 질문이<br />더 나을까요?</h2>

              {!allDone ? (
                <>
                  <div className={s.quizMeta}>
                    <span className={s.quizProgress}>{quizIdx + 1} / {QUIZ.length}</span>
                    <p className={s.quizContext}>{q.context}</p>
                  </div>

                  <div className={s.quizOptions}>
                    {(["A", "B"] as const).map((opt) => {
                      const isPickedOpt = picked === opt;
                      const isAnswerOpt = opt === q.answer;
                      let optClass = s.quizOption;
                      if (picked === null) {
                        optClass = `${s.quizOption} ${s.quizOptionIdle}`;
                      } else if (isPickedOpt && isAnswerOpt) {
                        optClass = `${s.quizOption} ${s.quizOptionCorrect}`;
                      } else if (isPickedOpt && !isAnswerOpt) {
                        optClass = `${s.quizOption} ${s.quizOptionWrong}`;
                      } else if (!isPickedOpt && isAnswerOpt) {
                        optClass = `${s.quizOption} ${s.quizOptionReveal}`;
                      } else {
                        optClass = `${s.quizOption} ${s.quizOptionDim}`;
                      }
                      return (
                        <button key={opt} className={optClass} onClick={() => pickAnswer(opt)} disabled={picked !== null}>
                          <span className={s.quizOptLabel}>{opt}</span>
                          <span className={s.quizOptText}>{q[opt]}</span>
                        </button>
                      );
                    })}
                  </div>

                  {picked !== null && (
                    <div className={`${s.quizFeedback} ${isCorrect ? s.quizFeedbackCorrect : s.quizFeedbackWrong}`}>
                      <div className={s.quizFeedbackTitle}>
                        <iconify-icon icon={isCorrect ? "solar:check-circle-bold" : "solar:close-circle-bold"} width="18" height="18" />
                        {isCorrect ? "정답이에요" : "아쉬워요"}
                      </div>
                      <p className={s.quizFeedbackText}>{q.why}</p>
                      <button className={s.nextQuizBtn} onClick={nextQuestion}>
                        {quizIdx < QUIZ.length - 1 ? "다음 문제" : "결과 보기"}
                        <iconify-icon icon="solar:arrow-right-bold" width="14" height="14" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className={s.quizResult}>
                  <div className={s.quizResultScore}>
                    <span className={s.quizScoreNum}>{correct}</span>
                    <span className={s.quizScoreTotal}>/ {QUIZ.length}</span>
                  </div>
                  <p className={s.quizResultLabel}>
                    {correct === QUIZ.length ? "모두 맞혔어요" : `${QUIZ.length}문제 중 ${correct}개 정답`}
                  </p>
                  <p className={s.quizResultMsg}>
                    {correct === QUIZ.length
                      ? "완벽해요. 이제 직접 프롬프트를 분석해봐요."
                      : "직접 분석하면서 감각을 키워봐요."}
                  </p>
                  <button className={s.primaryBtn} onClick={() => goToStep(5)}>
                    다음 단계로
                    <iconify-icon icon="solar:arrow-right-bold" width="15" height="15" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── Step 5: Start ── */}
          {step === 5 && (
            <div className={s.stepContent}>
              <div className={s.stepMeta}>
                <span className={s.stepNum}>05</span>
                <span className={s.stepTag}>시작</span>
              </div>
              <h2 className={s.title}>이제 직접<br />해봐요</h2>
              <p className={s.desc}>
                평소 AI에게 보내던 질문을 그대로 입력해보세요.<br />
                5가지 기준으로 분석하고 더 나은 프롬프트를 제안해드려요.
              </p>

              <div className={s.flowList}>
                {["질문 입력", "5가지 분석", "개선안 확인", "직접 다시 써보기"].map((t, i) => (
                  <div key={t} className={s.flowItem}>
                    <span className={s.flowNum}>{i + 1}</span>
                    <span className={s.flowText}>{t}</span>
                  </div>
                ))}
              </div>

              <button className={s.primaryBtn} onClick={onStart}>
                분석 시작하기
                <iconify-icon icon="solar:arrow-right-bold" width="15" height="15" />
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className={s.navRow}>
          <div>
            {step > 1 && (
              <button className={s.prevBtn} onClick={() => goToStep(step - 1)}>
                <iconify-icon icon="solar:arrow-left-bold" width="14" height="14" />
                이전
              </button>
            )}
            {step === 1 && (
              <button className={s.prevBtn} onClick={() => setStep(0)}>
                <iconify-icon icon="solar:arrow-left-bold" width="14" height="14" />
                처음으로
              </button>
            )}
          </div>
          <div>
            {step < 5 && step !== 4 && (
              <button className={s.nextBtn} onClick={() => goToStep(step + 1)}>
                다음
                <iconify-icon icon="solar:arrow-right-bold" width="14" height="14" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
