"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FAQItem {
  question: string
  answer: string
}

interface ToolReviewFAQProps {
  faqs: FAQItem[]
}

export default function ToolReviewFAQ({ faqs }: ToolReviewFAQProps) {
  if (!faqs || faqs.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-4">Questions fréquentes</h2>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <p className="text-gray-600">{faq.answer}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
} 