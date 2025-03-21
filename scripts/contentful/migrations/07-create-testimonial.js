module.exports = function (migration) {
    // Create a 'testimonial' content type
    const testimonial = migration.createContentType('testimonial')
        .name('Testimonial')
        .description('Client testimonials and reviews')
        .displayField('name');

    // Add fields to the content type
    testimonial
        .createField('name')
        .name('Name')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 2,
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    testimonial
        .createField('quote')
        .name('Quote')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 10,
                    max: 500,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    testimonial
        .createField('role')
        .name('Role')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                size: {
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    testimonial
        .createField('company')
        .name('Company')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                size: {
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    testimonial
        .createField('image')
        .name('Image')
        .type('Link')
        .localized(false)
        .required(false)
        .validations([
            {
                linkMimetypeGroup: ['image'],
            },
        ])
        .linkType('Asset')
        .disabled(false)
        .omitted(false);

    testimonial
        .createField('featured')
        .name('Featured')
        .type('Boolean')
        .localized(false)
        .required(false)
        .defaultValue({
            'en-US': false
        })
        .disabled(false)
        .omitted(false);

    testimonial
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
    testimonial.changeFieldControl('name', 'builtin', 'singleLine', {});
    testimonial.changeFieldControl('quote', 'builtin', 'markdown', {});
    testimonial.changeFieldControl('role', 'builtin', 'singleLine', {});
    testimonial.changeFieldControl('company', 'builtin', 'singleLine', {});
    testimonial.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
    testimonial.changeFieldControl('featured', 'builtin', 'boolean', {});
    testimonial.changeFieldControl('order', 'builtin', 'numberEditor', {});
}; 