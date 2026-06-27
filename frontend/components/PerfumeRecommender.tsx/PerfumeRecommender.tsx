"use client";
import { authapiPost } from "@/context/api";
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

    // HYDRATION FIX: Use a reference to trigger element focus securely on the client side
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

// ─── Main Component ───────────────────────────────────────────────────────────
export default function PerfumeRecommender() {
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [current, setCurrent] = useState(0);
    const [answers, setAnswers] = useState<SurveyAnswers>({});
    const [families, setFamilies] = useState<string[]>([]);
    const [isDone, setIsDone] = useState(false);
    const [results, setResults] = useState<Results[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    // HYDRATION FIX: Keep component isolated until client mount occurs
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
        const payload = {
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

        setIsDone(true);
        setIsLoading(true);
        setError(false);

        try {
            const res = await authapiPost("/api/airecommend/", payload);

            // Check for API errors or Auth failure blocks early
            if (!res.ok) {
                setError(true);
                setResults([]);
                return;
            }

            const data = await res.json();
            // UNDEFINED RUNTIME BUG FIX: Defensively fall back to empty list if key missing
            setResults(data.recommendations || []);
        } catch {
            setError(true);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }

    function handleReset() {
        setAnswers({});
        setCurrent(0);
        setIsDone(false);
        setResults([]);
        setError(false);
        setIsLoading(false);
    }

    if (!mounted) return null;

    const step = STEPS[current];
    const progress = isDone ? 100 : Math.round((current / STEPS.length) * 100);
    const isLastStep = current === STEPS.length - 1;
    const canGoNext = isDone || canProceed(step, answers);

    return (
        <div ref={panelRef} className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">

            {/* Floating panel */}
            <div
                className={`w-[320px] bg-white border border-outline-variant rounded-xl overflow-hidden transition-all duration-300 origin-bottom-left ${isOpen
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
                <div className="px-4 pt-5 pb-3 min-h-[200px]">
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
                            ) : results && results.length > 0 ? ( // SAFE LENGTH CHECK
                                <div className="flex flex-col gap-2">
                                    {results.map((r, i) => (
                                        <a
                                            key={i}
                                            href={r.link || "#"}
                                            className="block p-3 rounded-xl border border-outline-variant hover:border-outline transition-colors"
                                        >
                                            <p className="text-sm font-medium text-primary">{r.name}</p>
                                            <p className="text-xs text-outline mb-1">{r.brand}</p>
                                            <p className="text-xs text-outline leading-relaxed">{r.reason}</p>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center">
                                    <p className="text-sm text-outline">No matches found. Try adjusting your preferences.</p>
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
                className="flex items-center gap-2 px-4 h-[52px] rounded-full bg-primary text-[#fbf9f5] hover:scale-105 active:scale-95 transition-transform shadow-sm"
            >
                <span className="text-sm font-label whitespace-nowrap">Find your scent</span>
                <span className="text-xl">✦</span>
            </button>
        </div>
    );
}