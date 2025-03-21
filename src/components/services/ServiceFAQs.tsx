'use client';

import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

// FAQ Accordion Item Component
const AccordionItem = ({ 
  title, 
  content, 
  isOpen, 
  onClick 
}: { 
  title: string; 
  content: string; 
  isOpen: boolean; 
  onClick: () => void 
}) => {
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-4 text-left font-semibold focus:outline-none"
        onClick={onClick}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        {isOpen ? (
          <FiChevronUp className="text-primary" />
        ) : (
          <FiChevronDown className="text-primary" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-96 pb-4' : 'max-h-0'
        }`}
        aria-hidden={!isOpen}
      >
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};

interface ParsedFAQ {
  question: string;
  answer: string;
}

interface ServiceFAQsProps {
  faqs: string[] | ParsedFAQ[]; // Can be either JSON strings or already parsed objects
}

export default function ServiceFAQs({ faqs }: ServiceFAQsProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  
  // Handle accordion click
  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  // Parse the FAQ data if it's in string format
  const parsedFaqs = faqs.map((faq) => {
    if (typeof faq === 'string') {
      try {
        return JSON.parse(faq) as ParsedFAQ;
      } catch (error) {
        console.error('Error parsing FAQ JSON:', error);
        return { question: 'Error loading question', answer: 'Error loading answer' };
      }
    }
    return faq as ParsedFAQ;
  });

  return (
    <div className="bg-gray-50 p-6 rounded-md mb-8">
      {parsedFaqs.map((faq, index) => (
        <AccordionItem 
          key={index}
          title={faq.question || 'Question not available'}
          content={faq.answer || 'Answer not available'}
          isOpen={openFaqIndex === index}
          onClick={() => toggleFaq(index)}
        />
      ))}
    </div>
  );
} 