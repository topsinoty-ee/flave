"use client";

import { useState } from "react";
import { Button } from "@/components";

interface CollapseProps {
  title: string;
  content: string;
  className?: string;
}

export const Collapse = ({ title, content, className = "" }: CollapseProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-5 text-left flex justify-between items-center bg-gray hover:bg-gray-light transition-colors"
      >
        <span className="font-medium">{title}</span>
        <span className="transform transition-transform duration-200">
          {isOpen ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 15l7-7 7 7"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          )}
        </span>
      </Button>
      <div
        className={`transition-all duration-200 overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}
      >
        <div className="p-4 bg-white">{content}</div>
      </div>
    </div>
  );
};

import { DisplayResource } from "@/components";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQBlockProps {
  faqs?: FAQItem[];
}

export const FAQBlock = ({ faqs }: FAQBlockProps) => {
  const defaultFAQs: FAQItem[] = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unused products.",
    },
    {
      question: "How do I track my order?",
      answer:
        "You'll receive a tracking number via email once your order ships.",
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide.",
    },
  ];

  const questions = faqs || defaultFAQs;

  return (
    <DisplayResource
      data={questions}
      Component={(questions: FAQItem[]) => (
        <div className="flex flex-col gap-2.5 max-w-2xl mx-auto">
          {questions.map((item, index) => (
            <Collapse key={index} title={item.question} content={item.answer} />
          ))}
        </div>
      )}
    />
  );
};
