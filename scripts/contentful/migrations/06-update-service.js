#!/usr/bin/env node

module.exports = function (migration) {
    // Get the existing service content type
    const service = migration.editContentType('service');

    // Delete the existing faqs field
    service.deleteField('faqs');

    // Create a new faqs field as a Text field (not an array)
    service.createField('faqsJson')
        .name('FAQs (JSON)')
        .type('Text')
        .required(false)
        .validations([
            {
                size: { max: 5000 }
            }
        ]);

    // Update the field control with helpful text
    service.changeFieldControl('faqsJson', 'builtin', 'multipleLine', {
        helpText: 'Add FAQs as a JSON array. Example: [{"question":"What is coaching?","answer":"A collaborative process..."}]'
    });
}; 