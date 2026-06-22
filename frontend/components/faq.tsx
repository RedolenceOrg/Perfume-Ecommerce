'use client'
import { useState, useRef } from 'react'

const faqs = [
    {
        question: "What types of perfumes do you sell?",
        answer: "We offer a curated collection of high-quality fragrances, specializing in Arabic, designer, and niche perfumes. Whether you are looking for a highly sought-after designer scent, a unique artisanal niche blend, or a rich and long-lasting Arabic fragrance, we have something to suit every preference."
    },
    {
        question: "Do you offer sample or travel-sized perfumes?",
        answer: "Yes! We understand that you might want to wear a fragrance before committing to a full bottle. We offer travel-sized decants of our perfumes in 3ml, 5ml, 10ml, and 20ml options, perfect for testing, traveling, or carrying in your bag."
    },
    {
        question: "Can I test the fragrances before buying?",
        answer: "Absolutely. We provide in-store trials for our entire fragrance collection. We invite you to visit our store, explore the scents in person, and discover how they develop on your skin before making a purchase."
    },
    {
        question: "Do you buy or accept used (thrift) perfumes?",
        answer: "Yes, we do accept thrift perfumes, but we are highly selective to ensure quality and safety for our customers. We do not accept all perfumes, and every submission is subject to our in-store approval process."
    },
    {
        question: "What are the requirements for thrift perfumes?",
        answer: "To be considered for our thrift program, the perfume must be in a transparent bottle. Opaque bottles are not accepted. We must be able to clearly see the liquid to verify its condition, color, and remaining volume."
    }
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