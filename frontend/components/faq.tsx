'use client'
import { useState, useRef } from 'react'

const faqs = [
    {
        question: "Placeholder Question 1",
        answer: "Placeholder answer 1. Replace this with your actual content."
    },
    {
        question: "Placeholder Question 2",
        answer: "Placeholder answer 2. Replace this with your actual content."
    },
    {
        question: "Placeholder Question 3",
        answer: "Placeholder answer 3. Replace this with your actual content."
    },
    {
        question: "Placeholder Question 4",
        answer: "Placeholder answer 4. Replace this with your actual content."
    },
]

function FAQItem({ faq, isOpen, onToggle }: { faq: { question: string, answer: string }, isOpen: boolean, onToggle: () => void }) {
    const contentRef = useRef<HTMLDivElement>(null)

    return (
        <div className="border-b border-outline-variant/20">
            <button
                onClick={onToggle}
                className="w-full py-8 flex justify-between items-center text-left focus:outline-none"
            >
                <span className="font-body text-lg text-primary">
                    {faq.question}
                </span>
                <span
                    className="material-symbols-outlined text-secondary flex-shrink-0 ml-4 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}
                >
                    add
                </span>
            </button>
            <div
                style={{
                    height: isOpen ? contentRef.current?.scrollHeight : 0,
                    overflow: 'hidden',
                    transition: 'height 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            >
                <div ref={contentRef} className="pb-8">
                    <p className="font-body text-outline leading-relaxed">
                        {faq.answer}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="py-32 bg-surface">
            <div className="px-12 max-w-4xl mx-auto">
                <h2 className="font-serif text-4xl md:text-5xl text-primary mb-16 text-center">
                    Frequently Asked Questions
                </h2>
                <div className="border-t border-outline-variant/20">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            faq={faq}
                            isOpen={openIndex === index}
                            onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}