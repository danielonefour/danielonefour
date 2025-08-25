"use client";

import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { MessageCircleMore, Plus, Minus } from "lucide-react";
import Logo from "../assets/logo.png";

export default function FAQSection() {
  const faqItems = [
    {
      question: "How is the program structured?",
      answer:
        "MAP is structured over three months with weekly activities, bi-monthly webinars, and dedicated sessions for mentorship and accountability. Participants will follow a guided calendar designed to help them stay on track and achieve their goals.",
    },
    {
      question: "What is the time commitment for MAP?",
      answer:
        "The program requires approximately 2–5 hours per week, depending on the activity for that week. Participants are encouraged to stay consistent to maximize results.",
    },
    {
      question: "Is the program conducted online or in-person?",
      answer:
        "MAP is fully online, making it accessible to participants from anywhere in the world. Sessions will be held via Google, and communication will be maintained through email and WhatsApp.",
    },
    {
      question: "Can I join if I’ve never been in a mentorship program before?",
      answer:
        "Absolutely! MAP is designed for both beginners and those with prior mentorship experience. Our program caters to your unique needs and goals.",
    },
    {
      question: "What happens if I miss a session?",
      answer:
        "Recordings of key sessions will be made available to ensure you can catch up. However, we encourage live participation for maximum engagement and benefit.",
    },
    {
      question: "Is MAP free or paid?",
      answer:
        "MAP is a paid program (#50,000) that offers immense value through structured mentorship, accountability sessions, expert webinars, resources, and certifications. Your investment ensures access to quality mentorship, tools, and a supportive community dedicated to your growth.",
    },

    {
      question: "When does the program commence?",
      answer: "The MAP program is set to commence on Sept 28th, 2025.",
    },
    {
  question: "How do I register for MAP?",
  answer: (
    <>
      Simply choose your{" "}
      <a
        href="#register"
        className="text-brand-pink font-medium hover:underline"
      >
        payment option
      </a>
    </>
  ),
}

  ];

  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleAccordionChange = (value: string) => {
    setOpenItem(value === openItem ? null : value);
  };

  return (
    <div
      id="faq"
      className="min-h-screen bg-cream-bg pt-20 pb-12 px-4 md:px-6 lg:px-8 flex justify-center items-center"
    >
      <div className="w-full max-w-7xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="h-0.5 w-10 bg-gray-700 mr-3"></div>
            <span className="text-gray-700 font-semibold text-sm md:text-base tracking-wide uppercase">
              Find answers to
            </span>
            <div className="h-0.5 w-10 bg-gray-700 ml-3"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-700 leading-tight mb-8 drop-shadow-sm">
            Common FAQS{""}
            <span className="text-brand-accent ml-2"></span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 relative">
            <Accordion
              type="single"
              collapsible
              onValueChange={handleAccordionChange}
            >
              {faqItems.map((item, index) => (
                <AccordionItem
                  key={`item-${index}`}
                  value={`item-${index}`}
                  className={`border-b border-gray-200 ${
                    openItem === `item-${index}`
                      ? "bg-light-yellow-bg"
                      : "bg-white"
                  } transition-colors duration-200 ease-in-out px-6 py-4 rounded-lg mb-4 shadow-sm`}
                >
                  <AccordionTrigger className="text-left flex justify-between text-lg font-medium text-dark-text hover:no-underline">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 text-gray-600">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <Card className="bg-gradient-to-br from-pink-600 to-pink-800 p-6 flex flex-col items-center text-center shadow-md rounded-lg h-fit">
            <CardHeader className="pb-4">
              <div className="flex justify-center">
                <MessageCircleMore className="h-12 w-12 text-gray-100 mb-4" />
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                Didn't Find Your Question?
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <CardDescription className="text-white mb-4">
                If you have any issues or need assistance, feel free to contact
                us{" "}
              </CardDescription>
              <a href="mailto:hello@startwithmap.com">
                <Button className="bg-white hover:bg-hover-purple-btn text-gray-700 font-bold py-3 px-6 rounded-full shadow-lg transition-colors duration-200">
                  GET IN TOUCH
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
