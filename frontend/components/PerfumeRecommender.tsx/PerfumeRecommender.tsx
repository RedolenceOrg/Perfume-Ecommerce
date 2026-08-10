"use client";
import { authapiPost } from "@/context/api";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SurveyAnswers {
    gender?: string;
    price_max?: string;
    collection?: string[];
    family?: string[];
    notes?: string;
    occasion?: string;
}
interface Results {
    name?: string;
    brand?: string;
    link?: string;
    reason?: string;
}
interface ChatMessage {
    role: "user" | "assistant";
    content: string;
    recommendations?: Results[]; // attached to assistant turns that returned picks
}
type StepId = keyof SurveyAnswers;
interface Step {
    id: StepId;
    label: string;
    question: string;
    type: "single" | "multi" | "price" | "text";
    options?: string[];
    placeholder?: string;
    required?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const GENDER_OPTIONS = ["Male", "Female", "Unisex"];
const COLLECTION_OPTIONS = ["Niche", "Designer", "Middle Eastern", "In House"];
const MAX_FOLLOWUPS = 4;
const STEPS: Step[] = [
    { id: "gender", label: "Step 1 of 6", question: "Who is this for?", type: "single", options: GENDER_OPTIONS, required: true },
    { id: "price_max", label: "Step 2 of 6", question: "What's your maximum budget?", type: "price", placeholder: "e.g. 15000", required: true },
    { id: "collection", label: "Step 3 of 6", question: "Which collection interests you?", type: "multi", options: COLLECTION_OPTIONS, required: true },
    { id: "family", label: "Step 4 of 6", question: "What scent family do you like?", type: "multi", options: ["Floral", "Woody", "Amber", "Fresh", "Oriental", "Citrus", "Musk", "Gourmand"], required: true },
    { id: "notes", label: "Step 5 of 6", question: "Any notes you love?", type: "text", placeholder: "vanilla, oud, bergamot...", required: false },
    { id: "occasion", label: "Step 6 of 6", question: "What's the occasion?", type: "text", placeholder: "daily wear, date night, office...", required: false },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function canProceed(step: Step, answers: SurveyAnswers): boolean {
    if (!step.required) return true;
    const val = answers[step.id];
    if (step.type === "single") return !!val;
    if (step.type === "multi") return Array.isArray(val) && val.length > 0;
    if (step.type === "price") return !!val && String(val).trim() !== "";
    return true;
}

function buildBasePayload(answers: SurveyAnswers) {
    return {
        gender: answers.gender?.toLowerCase(),
        price_max: answers.price_max ? Number(answers.price_max) : undefined,
        collection: answers.collection?.map((c) =>
            c === "Middle Eastern" ? "middle_eastern"
                : c === "In House" ? "in_house"
                    : c.toLowerCase()
        ),
        family: answers.family,
        notes: answers.notes,
        occasion: answers.occasion,
    };
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Chip({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-3 py-1.5 rounded-full border text-sm font-body transition-colors cursor-pointer select-none ${selected
                ? "bg-primary text-[#fbf9f5] border-primary"
                : "bg-background text-primary border-outline-variant hover:border-outline"
                }`}
        >
            {label}
        </button>
    );
}

function StepContent({ step, answers, families, onChange }: {
    step: Step;
    answers: SurveyAnswers;
    families: string[];
    onChange: (id: StepId, value: string | string[]) => void;
}) {
    const options = step.id === "family" && families.length > 0 ? families : step.options ?? [];
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [step.id]);

    if (step.type === "single") {
        return (
            <div className="flex flex-wrap gap-2">
                {options.map((opt) => (
                    <Chip key={opt} label={opt} selected={answers[step.id] === opt} onClick={() => onChange(step.id, opt)} />
                ))}
            </div>
        );
    }

    if (step.type === "multi") {
        const selected = (answers[step.id] as string[]) ?? [];
        return (
            <div className="flex flex-wrap gap-2">
                {options.length === 0 ? (
                    <p className="text-sm text-outline">Loading...</p>
                ) : (
                    options.map((opt) => (
                        <Chip
                            key={opt}
                            label={opt}
                            selected={selected.includes(opt)}
                            onClick={() => {
                                const next = selected.includes(opt)
                                    ? selected.filter((s) => s !== opt)
                                    : [...selected, opt];
                                onChange(step.id, next);
                            }}
                        />
                    ))
                )}
            </div>
        );
    }

    if (step.type === "price") {
        return (
            <input
                ref={inputRef as React.RefObject<HTMLInputElement>}
                type="number"
                min={0}
                placeholder={step.placeholder}
                value={(answers[step.id] as string) ?? ""}
                onChange={(e) => onChange(step.id, e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-background text-sm text-primary font-body placeholder:text-outline focus:outline-none focus:border-outline"
            />
        );
    }

    if (step.type === "text") {
        return (
            <textarea
                ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                rows={3}
                placeholder={step.placeholder}
                value={(answers[step.id] as string) ?? ""}
                onChange={(e) => onChange(step.id, e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-outline-variant bg-background text-sm text-primary font-body placeholder:text-outline focus:outline-none focus:border-outline resize-none leading-relaxed"
            />
        );
    }

    return null;
}

function ResultCard({ r }: { r: Results }) {
    return (
        <a
            href={r.link || "#"}
            className="block p-3 rounded-xl border border-outline-variant hover:border-outline transition-colors bg-white"
        >
            <p className="text-sm font-medium text-primary">{r.name}</p>
            <p className="text-xs text-outline mb-1">{r.brand}</p>
            <p className="text-xs text-outline leading-relaxed">{r.reason}</p>
        </a>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PerfumeRecommender() {
    const { user, loading: authLoading } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<SurveyAnswers>({});
    const [families, setFamilies] = useState<string[]>([]);
    const [isDone, setIsDone] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    // ── chat/follow-up state — every round (initial + each follow-up) lives here ──
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState("");
    const [chatLoading, setChatLoading] = useState(false);
    const [poolExhausted, setPoolExhausted] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        function handleOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        }
        if (isOpen) document.addEventListener("mousedown", handleOutside);
        return () => document.removeEventListener("mousedown", handleOutside);
    }, [isOpen]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, chatLoading]);

    function handleChange(id: StepId, value: string | string[]) {
        setAnswers((prev) => ({ ...prev, [id]: value }));
    }

    function handleNext() {
        if (current < STEPS.length - 1) {
            setCurrent((c) => c + 1);
        } else {
            handleSubmit();
        }
    }

    function handleBack() {
        if (current > 0) setCurrent((c) => c - 1);
    }

    async function handleSubmit() {
        setIsDone(true);
        setIsLoading(true);
        setError(false);

        try {
            const res = await authapiPost("/api/airecommend/", buildBasePayload(answers));

            if (!res.ok) {
                setError(true);
                return;
            }

            const data = await res.json();
            const recs: Results[] = data.recommendations || [];

            // Seed the chat with the initial results as the first assistant turn
            setChatMessages([
                {
                    role: "assistant",
                    content: recs.length > 0 ? "Here's what I found for you:" : "No matches found. Try adjusting your preferences.",
                    recommendations: recs,
                },
            ]);
            if (data.exhausted) setPoolExhausted(true);
        } catch {
            setError(true);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleChatSend() {
        const text = chatInput.trim();
        const followupCount = chatMessages.filter((m) => m.role === "user").length;
        if (!text || chatLoading || followupCount >= MAX_FOLLOWUPS || poolExhausted) return;

        const nextMessages: ChatMessage[] = [...chatMessages, { role: "user", content: text }];
        setChatMessages(nextMessages);
        setChatInput("");
        setChatLoading(true);

        try {
            const res = await authapiPost("/api/airecommend/", {
                ...buildBasePayload(answers),
                conversation: nextMessages,
                message: text,
            });

            if (!res.ok) {
                setChatMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong — try again?" }]);
                return;
            }

            const data = await res.json();
            const recs: Results[] = Array.isArray(data.recommendations) ? data.recommendations : [];

            // Every round — even empty ones — gets its own bubble, nothing overwrites earlier rounds
            setChatMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.reply || (recs.length > 0 ? "Here's what I found." : "Nothing new to show for that."),
                    recommendations: recs.length > 0 ? recs : undefined,
                },
            ]);
            if (data.exhausted) setPoolExhausted(true);
        } catch {
            setChatMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong — try again?" }]);
        } finally {
            setChatLoading(false);
        }
    }

    function handleReset() {
        setAnswers({});
        setCurrent(0);
        setIsDone(false);
        setError(false);
        setIsLoading(false);
        setChatMessages([]);
        setChatInput("");
        setChatLoading(false);
        setPoolExhausted(false);
    }

    if (!mounted) return null;
    if (authLoading) return null;
    if (!user || !user.rank) return null;

    const step = STEPS[current];
    const progress = isDone ? 100 : Math.round((current / STEPS.length) * 100);
    const isLastStep = current === STEPS.length - 1;
    const canGoNext = isDone || canProceed(step, answers);
    const followupCount = chatMessages.filter((m) => m.role === "user").length;
    const followupsExhausted = followupCount >= MAX_FOLLOWUPS || poolExhausted;
    const hasAnyResults = chatMessages.some((m) => m.recommendations && m.recommendations.length > 0);

    return (
        <div ref={panelRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3 pointer-events-none">

            {/* Floating panel */}
            <div
                className={`w-[420px] bg-white border border-outline-variant rounded-xl overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-90 translate-y-2 pointer-events-none"
                    }`}
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className="bg-primary px-4 py-3 flex items-center justify-between">
                    <span className="text-[#fbf9f5] text-sm font-headline font-medium tracking-wide">
                        Scent finder
                    </span>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close"
                        className="text-outline-variant hover:text-[#fbf9f5] transition-colors text-lg leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Progress bar */}
                <div className="h-0.5 bg-outline-variant">
                    <div
                        className="h-full bg-secondary transition-all duration-400 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Body */}
                <div className="px-4 pt-5 pb-3 min-h-[200px] max-h-[70vh] overflow-y-auto" data-lenis-prevent>
                    {isDone ? (
                        <div className="py-2">
                            {isLoading ? (
                                <div className="text-center">
                                    <p className="text-sm text-outline animate-pulse">Finding your scent...</p>
                                </div>
                            ) : error ? (
                                <div className="text-center">
                                    <p className="text-sm text-outline">Something went wrong. Please try again.</p>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {chatMessages.map((m, i) =>
                                        m.role === "user" ? (
                                            <div
                                                key={i}
                                                className="text-xs px-3 py-2 rounded-xl max-w-[75%] leading-relaxed bg-primary text-[#fbf9f5] self-end ml-auto"
                                            >
                                                {m.content}
                                            </div>
                                        ) : (
                                            <div key={i} className="flex flex-col gap-2 max-w-[90%]">
                                                {m.content && (
                                                    <div className="text-xs px-3 py-2 rounded-xl leading-relaxed bg-background border border-outline-variant text-primary self-start">
                                                        {m.content}
                                                    </div>
                                                )}
                                                {m.recommendations && m.recommendations.length > 0 && (
                                                    <div className="flex flex-col gap-2 pl-1">
                                                        {m.recommendations.map((r, j) => (
                                                            <ResultCard key={j} r={r} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                    {chatLoading && (
                                        <div className="text-xs px-3 py-2 rounded-xl bg-background border border-outline-variant text-outline self-start animate-pulse w-fit">
                                            Thinking...
                                        </div>
                                    )}
                                    <div ref={chatEndRef} />

                                    {hasAnyResults && (
                                        followupsExhausted ? (
                                            <p className="text-[11px] text-outline text-center pt-1">
                                                {poolExhausted
                                                    ? "That's everything matching your filters — retake the quiz to widen the search."
                                                    : "That's all the refinements for this search — start over for a fresh one."}
                                            </p>
                                        ) : (
                                            <div className="flex gap-2 pt-1 sticky bottom-0 bg-white pb-1">
                                                <input
                                                    type="text"
                                                    value={chatInput}
                                                    onChange={(e) => setChatInput(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") handleChatSend();
                                                    }}
                                                    placeholder="e.g. these are too sweet"
                                                    disabled={chatLoading}
                                                    className="flex-1 px-3 py-2 rounded-xl border border-outline-variant bg-background text-xs text-primary font-body placeholder:text-outline focus:outline-none focus:border-outline disabled:opacity-60"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleChatSend}
                                                    disabled={chatLoading || !chatInput.trim()}
                                                    className="px-3 py-2 rounded-xl bg-primary text-[#fbf9f5] text-xs font-label font-medium hover:bg-primary-container transition-colors disabled:bg-outline-variant disabled:cursor-not-allowed"
                                                >
                                                    Send
                                                </button>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <p className="text-[11px] text-outline uppercase tracking-widest mb-1.5 font-label">
                                {step.label}
                            </p>
                            <p className="font-headline text-primary text-[15px] font-medium leading-snug mb-4">
                                {step.question}
                            </p>
                            <StepContent
                                step={step}
                                answers={answers}
                                families={families}
                                onChange={handleChange}
                            />
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-4 pb-4 flex items-center justify-between">
                    {isDone ? (
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full py-2 rounded-xl bg-primary text-[#fbf9f5] text-sm font-label font-medium hover:bg-primary-container transition-colors"
                        >
                            Start over
                        </button>
                    ) : (
                        <>
                            <span className="text-xs text-outline font-label">
                                {current + 1} / {STEPS.length}
                            </span>
                            <div className="flex gap-2">
                                {current > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleBack}
                                        className="px-4 py-2 rounded-xl border border-outline-variant text-sm text-outline font-label hover:border-outline hover:text-primary transition-colors"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={handleNext}
                                    disabled={!canGoNext}
                                    className="px-4 py-2 rounded-xl bg-primary text-[#fbf9f5] text-sm font-label font-medium hover:bg-primary-container transition-colors disabled:bg-outline-variant disabled:cursor-not-allowed"
                                >
                                    {isLastStep ? "Find my scent" : "Next"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {/* Bubble button */}
            <button
                type="button"
                onClick={() => setIsOpen((o) => !o)}
                aria-label="Open scent finder"
                aria-expanded={isOpen}
                className="flex items-center gap-2 px-4 h-[52px] rounded-full bg-primary text-[#fbf9f5] hover:scale-105 active:scale-95 transition-transform shadow-sm pointer-events-auto"
            >
                <span className="text-sm font-label whitespace-nowrap">Find your scent</span>
                <span className="text-xl">✦</span>
            </button>
        </div>
    );
}