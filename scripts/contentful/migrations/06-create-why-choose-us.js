module.exports = function (migration) {
    // Create a 'whyChooseUs' content type
    const whyChooseUs = migration.createContentType('whyChooseUs')
        .name('Why Choose Us')
        .description('Content for the Why Choose Us section')
        .displayField('title');

    // Add fields to the content type
    whyChooseUs
        .createField('title')
        .name('Title')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 3,
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    whyChooseUs
        .createField('content')
        .name('Content')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 10,
                    max: 1000,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    whyChooseUs
        .createField('order')
        .name('Order')
        .type('Integer')
        .localized(false)
        .required(false)
        .validations([
            {
                range: {
                    min: 1,
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    // Set up the editor interface
    whyChooseUs.changeFieldControl('title', 'builtin', 'singleLine', {});
    whyChooseUs.changeFieldControl('content', 'builtin', 'markdown', {});
    whyChooseUs.changeFieldControl('order', 'builtin', 'numberEditor', {});
}; 