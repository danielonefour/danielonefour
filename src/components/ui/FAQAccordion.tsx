import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion";
  
  interface FAQAccordionProps {
    type: "tenant" | "landlord";
    searchQuery: string;
  }
  
  const tenantFAQs = [
    {
      question: "How do I search for properties?",
      answer: "Use the search bar on our homepage to filter properties by location, price range, and amenities. You can view results in either a grid or list view and further refine your search using the filters sidebar."
    },
    {
      question: "How do I contact a landlord?",
      answer: "Each property listing has a 'Message Landlord' button. Click this to open the messaging interface. Once you create an account, you can message landlords directly through our platform."
    },
    {
      question: "Are application fees refundable?",
      answer: "Application fees vary by property. Some landlords may refund fees if your application is not approved, while others consider it a processing fee. The refund policy will be clearly stated during the application process."
    },
    {
      question: "How do I pay my rent?",
      answer: "Once your lease is active, you can pay rent directly through your tenant dashboard. We accept various payment methods including credit/debit cards and bank transfers."
    },
    {
      question: "How do I submit a maintenance request?",
      answer: "Log into your tenant dashboard, navigate to the 'Maintenance' section, and click 'New Request'. Fill out the form with details about the issue, and you can even attach photos if needed."
    }
  ];
  
  const landlordFAQs = [
    {
      question: "How do I list my property?",
      answer: "Create a landlord account, then click 'Add Property' in your dashboard. Fill out the property details, upload high-quality photos, set your lease terms, and publish when you're ready."
    },
    {
      question: "What fees does MyLandlord charge?",
      answer: "We offer various subscription plans for landlords. Basic listings are free, while premium features like featured listings and advanced tenant screening have associated costs. Visit our pricing page for detailed information."
    },
    {
      question: "How do I screen tenants?",
      answer: "Our platform offers integrated tenant screening tools that include credit checks, background checks, and rental history verification. These features are available on our Professional and Premium landlord plans."
    },
    {
      question: "How do I receive rent payments?",
      answer: "Rent payments are processed through our secure payment system and deposited directly into your linked bank account. You can track all payments through your landlord dashboard."
    },
    {
      question: "Can I manage multiple properties?",
      answer: "Yes! Our landlord dashboard is designed to help you manage multiple properties efficiently. You can view all properties at a glance and dive into details for each one with just one click."
    }
  ];
  
  const FAQAccordion = ({ type, searchQuery }: FAQAccordionProps) => {
    const faqs = type === "tenant" ? tenantFAQs : landlordFAQs;
    
    const filteredFAQs = searchQuery
      ? faqs.filter(faq => 
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : faqs;
    
    return (
      <Accordion type="single" collapsible className="w-full">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-b border-neutral-200">
              <AccordionTrigger className="text-left font-medium py-4 hover:text-brand-600 transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-neutral-700 pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))
        ) : (
          <p className="text-neutral-500 italic py-2">No matching FAQs found.</p>
        )}
      </Accordion>
    );
  };
  
  export default FAQAccordion;
  