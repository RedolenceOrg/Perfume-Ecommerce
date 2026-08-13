"use client";
import { ArrowUpRight, Bot } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import {
    Star,
    Heart,
    Gem,
    Crown,
    Check,
    Tag,
    Sparkles,
    Truck,
    Cake,
    UserSearch,
    Package,
    Unlock,
    FlaskConical,
    Droplet,
    LucideIcon,
} from "lucide-react";
import Lenis from 'lenis'

type Perk = { icon: LucideIcon; label: string };

type Tier = {
    nodeIcon: LucideIcon;
    levelLabel: string; // "Level 01 · Bronze Tier"
    noteName: string; // "The Top Note"
    threshold: string; // "NPR 5,500+"
    perks: Perk[];
};

const TIERS: Tier[] = [
    {
        nodeIcon: Star,
        levelLabel: "Level 01 · Bronze Tier",
        noteName: "The Top Note",
        threshold: "NPR 5,500+",
        perks: [
            { icon: Tag, label: "5% flat discount on all orders" },
            { icon: Sparkles, label: "Early access to new drops" },
            { icon: Bot, label: "AI PERFUME RECOMMENDER" },
        ],
    },
    {
        nodeIcon: Heart,
        levelLabel: "Level 02 · Silver Tier",
        noteName: "The Middle Note",
        threshold: "NPR 20,000+",
        perks: [
            { icon: Tag, label: "10% flat discount on all orders" },
            { icon: Truck, label: "Free shipping on every order" },
            { icon: Cake, label: "Birthday gift — 3ml signature decant" },
        ],
    },
    {
        nodeIcon: Gem,
        levelLabel: "Level 03 · Gold Tier",
        noteName: "The Base Note",
        threshold: "NPR 35,000+",
        perks: [
            { icon: Tag, label: "12% flat discount on all orders" },
            { icon: UserSearch, label: "Personal fragrance consultation" },
            { icon: Package, label: "Exclusive access to limited Thrift Batches" },
        ],
    },
    {
        nodeIcon: Crown,
        levelLabel: "Level 04 · Elite Tier",
        noteName: "The Sillage",
        threshold: "NPR 55,000+",
        perks: [
            { icon: Tag, label: "15% flat discount on all orders" },
            { icon: Unlock, label: "Vault access — rare & archived perfumes" },
            { icon: FlaskConical, label: "Complimentary 5ml decant gift" },
            { icon: Droplet, label: "One premium atomizer gifted per cycle" },
        ],
    },
];

const COUNT = TIERS.length;
// node centers as % across the row: for 4 cols -> 12.5, 37.5, 62.5, 87.5
const nodeCenter = (i: number) => ((i + 0.5) / COUNT) * 100;
const TRACK_LEFT = nodeCenter(0); // 12.5%
const TRACK_RIGHT = 100 - nodeCenter(COUNT - 1); // 12.5%
const TRACK_SPAN = 100 - TRACK_LEFT - TRACK_RIGHT; // 75%

function burstConfetti(canvas: HTMLCanvasElement, x: number, y: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = ["#775a19", "#fed488", "#271310", "#ffffff"];
    const particles = Array.from({ length: 45 }).map(() => {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 4.5;
        return {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 3,
            size: 3 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 12,
            life: 1,
        };
    });

    let frame: number;
    function tick() {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let alive = false;
        particles.forEach((p) => {
            if (p.life <= 0) return;
            alive = true;
            p.vy += 0.12;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotationSpeed;
            p.life -= 0.013;
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = Math.max(p.life, 0);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
            ctx.restore();
        });
        if (alive) frame = requestAnimationFrame(tick);
        else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    tick();
    return () => cancelAnimationFrame(frame);
}

export default function GoldenTierTimeline() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const fired = useRef<boolean[]>(TIERS.map(() => false));

    const [fillPct, setFillPct] = useState(0);

    const updateTimeline = useCallback(() => {
        const el = sectionRef.current;
        if (!el) return;

        const rect = el.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        let scrollProgress = windowHeight / 2 - rect.top;
        if (scrollProgress < 0) scrollProgress = 0;
        if (scrollProgress > rect.height + 300) scrollProgress = rect.height + 300;

        const percentage = (scrollProgress / (rect.height + 300)) * 100;
        const clamped = Math.min(Math.max(percentage, 0), 100);
        setFillPct(clamped);

        // fire confetti once per node as the fill crosses its threshold
        TIERS.forEach((_, i) => {
            const threshold = (nodeCenter(i) - TRACK_LEFT) / TRACK_SPAN * 100;
            if (!fired.current[i] && clamped >= threshold) {
                fired.current[i] = true;
                const canvas = canvasRef.current;
                const node = nodeRefs.current[i];
                if (canvas && node) {
                    const canvasRect = canvas.getBoundingClientRect();
                    const nodeRect = node.getBoundingClientRect();
                    burstConfetti(
                        canvas,
                        nodeRect.left - canvasRect.left + nodeRect.width / 2,
                        nodeRect.top - canvasRect.top + nodeRect.height / 2
                    );
                }
            }
            if (fired.current[i] && clamped < threshold - 5) {
                fired.current[i] = false;
            }
        });
    }, []);

    useEffect(() => {
        const lenis = (window as any).Lenis;

        if (lenis) lenis.on("scroll", updateTimeline);
        else window.addEventListener("scroll", updateTimeline, { passive: true });

        const resizeCanvas = () => {
            const canvas = canvasRef.current;
            const section = sectionRef.current;
            if (canvas && section) {
                canvas.width = section.clientWidth;
                canvas.height = section.clientHeight;
            }
        };
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        updateTimeline();

        return () => {
            if (lenis) lenis.off("scroll", updateTimeline);
            else window.removeEventListener("scroll", updateTimeline);
            window.removeEventListener("resize", resizeCanvas);
        };
    }, [updateTimeline]);

    return (
        <section className="w-full bg-background py-24 px-8 lg:px-16">
            {/* Header */}
            <div className="max-w-2xl mx-auto text-center mb-20">
                <h2 className="font-headline text-4xl md:text-5xl text-primary tracking-tight mb-4 text-secondary">
                    Members
                </h2>
                <p className="font-body text-primary/60 text-sm md:text-base leading-relaxed">
                    Every purchase carries you forward. Scroll to see how your
                    collection unlocks each stage of the fragrance — from top note to
                    sillage.
                </p>
            </div>

            {/* Horizontal timeline — desktop */}
            <div ref={sectionRef} className="relative hidden lg:block max-w-6xl mx-auto">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full pointer-events-none z-30"
                />

                {/* Track */}
                <div
                    className="absolute top-5 h-1 rounded-full bg-outline-variant/60 z-0"
                    style={{ left: `${TRACK_LEFT}%`, right: `${TRACK_RIGHT}%` }}
                />
                <div
                    className="absolute top-5 h-1 rounded-full bg-secondary shadow-[0_0_10px_rgba(119,90,25,0.5)] z-0"
                    style={{
                        left: `${TRACK_LEFT}%`,
                        width: `${(fillPct / 100) * TRACK_SPAN}%`,
                        transition: "width 0.1s ease-out",
                    }}
                />

                <div className="grid grid-cols-4 gap-6">
                    {TIERS.map((tier, i) => {
                        const threshold = ((nodeCenter(i) - TRACK_LEFT) / TRACK_SPAN) * 100;
                        const active = fillPct >= threshold - 2;
                        const Icon = tier.nodeIcon;

                        return (
                            <div key={tier.noteName} className="flex flex-col items-center text-center">
                                <div
                                    ref={(el) => {
                                        nodeRefs.current[i] = el;
                                    }}
                                    className={`relative z-10 flex h-10 w-10 items-center justify-center border-2 mb-6 transition-all duration-500 ${active
                                        ? "bg-secondary border-secondary text-white scale-110 shadow-[0_0_20px_rgba(119,90,25,0.5)]"
                                        : "bg-surface-container-lowest border-outline-variant text-primary/30"
                                        }`}
                                >
                                    <Icon size={17} strokeWidth={2} />
                                </div>

                                <span className="font-label text-[11px] uppercase tracking-[0.2em] text-secondary mb-2">
                                    {tier.levelLabel}
                                </span>

                                <div
                                    className={`relative w-full border border-2 bg-surface-container-lowest p-5 text-left transition-all duration-500 ${active
                                        ? "border-secondary shadow-[0_0_30px_rgba(119,90,25,0.15)]"
                                        : "border-outline-variant/50"
                                        }`}
                                >
                                    {active && (
                                        <span className="absolute top-0 right-0 bg-secondary text-white px-2.5 py-1 text-[9px] font-label uppercase tracking-wider">
                                            Unlocked
                                        </span>
                                    )}

                                    <h3 className="font-headline text-lg text-primary mb-1">
                                        {tier.noteName}
                                    </h3>
                                    <p className="font-label text-[10px] uppercase tracking-[0.15em] text-primary/40 mb-4">
                                        {tier.threshold}
                                    </p>

                                    <ul className="space-y-2">
                                        {tier.perks.map((perk) => {
                                            const PerkIcon = perk.icon;
                                            return (
                                                <li
                                                    key={perk.label}
                                                    className="flex items-start gap-2 font-body text-[13px] leading-snug text-primary/70"
                                                >
                                                    <PerkIcon
                                                        size={13}
                                                        className="text-secondary mt-0.5 shrink-0"
                                                    />
                                                    {perk.label}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>


            {/* Fallback: stacked on smaller screens (no scroll-fill, just static state) */}
            <div className="lg:hidden max-w-md mx-auto space-y-8">
                {TIERS.map((tier) => {
                    const Icon = tier.nodeIcon;
                    return (
                        <div
                            key={tier.noteName}
                            className="rounded-2xl border border-outline-variant/50 bg-surface-container-lowest p-6"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary-container text-primary">
                                    <Icon size={16} />
                                </span>
                                <div>
                                    <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary block">
                                        {tier.levelLabel}
                                    </span>
                                    <h3 className="font-headline text-lg text-primary">
                                        {tier.noteName}
                                    </h3>
                                </div>
                            </div>
                            <p className="font-label text-[10px] uppercase tracking-[0.15em] text-primary/40 mb-3">
                                {tier.threshold}
                            </p>
                            <ul className="space-y-2">
                                {tier.perks.map((perk) => {
                                    const PerkIcon = perk.icon;
                                    return (
                                        <li
                                            key={perk.label}
                                            className="flex items-start gap-2 font-body text-sm text-primary/70"
                                        >
                                            <PerkIcon size={14} className="text-secondary mt-0.5 shrink-0" />
                                            {perk.label}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    );
                })}
            </div>
            {/* Discover more CTA */}
            <div className="mt-16 text-center">

                <a href="/members"
                    className="inline-flex items-center gap-3 border border-secondary text-secondary px-8 py-3.5 font-label text-[11px] uppercase tracking-[0.3em] hover:bg-secondary hover:text-white transition-colors duration-500"
                >
                    Discover More
                    <ArrowUpRight
                        size={14}
                        className="transition-transform duration-500 group-hover:translate-x-1"
                    />
                </a>
            </div>

        </section>
    );
}