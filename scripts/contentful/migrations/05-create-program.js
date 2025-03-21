module.exports = function (migration) {
    // Create a 'program' content type
    const program = migration.createContentType('program')
        .name('Program')
        .description('A coaching or training program offering')
        .displayField('title');

    // Add fields to the content type
    program
        .createField('title')
        .name('Title')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                unique: true,
            },
            {
                size: {
                    min: 3,
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    program
        .createField('slug')
        .name('Slug')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                unique: true,
            },
            {
                regexp: {
                    pattern: '^[a-z0-9-]+$',
                    flags: null,
                },
                message: 'Slug must be lowercase alphanumeric with hyphens',
            },
        ])
        .disabled(false)
        .omitted(false);

    program
        .createField('shortDescription')
        .name('Short Description')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 10,
                    max: 250,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    program
        .createField('fullDescription')
        .name('Full Description')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 50,
                    max: 1500,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    program
        .createField('image')
        .name('Image')
        .type('Link')
        .localized(false)
        .required(true)
        .validations([
            {
                linkMimetypeGroup: ['image'],
            },
        ])
        .linkType('Asset')
        .disabled(false)
        .omitted(false);

    program
        .createField('duration')
        .name('Duration')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([])
        .disabled(false)
        .omitted(false);

    program
        .createField('sessions')
        .name('Sessions')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([])
        .disabled(false)
        .omitted(false);

    program
        .createField('benefits')
        .name('Benefits')
        .type('Array')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 1,
                    max: 10,
                },
            },
        ])
        .items({
            type: 'Symbol',
            validations: [
                {
                    size: {
                        min: 5,
                        max: 100,
                    },
                },
            ],
        })
        .disabled(false)
        .omitted(false);

    program
        .createField('features')
        .name('Features')
        .type('Array')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 1,
                    max: 10,
                },
            },
        ])
        .items({
            type: 'Symbol',
            validations: [
                {
                    size: {
                        min: 5,
                        max: 100,
                    },
                },
            ],
        })
        .disabled(false)
        .omitted(false);

    program
        .createField('testimonials')
        .name('Testimonials')
        .type('Array')
        .localized(false)
        .required(false)
        .validations([
            {
                size: {
                    max: 5,
                },
            },
        ])
        .items({
            type: 'Symbol',
            validations: [
                {
                    size: {
                        min: 10,
                        max: 500,
                    },
                },
            ],
        })
        .disabled(false)
        .omitted(false);

    program
        .createField('pricing')
        .name('Pricing (Display)')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([])
        .disabled(false)
        .omitted(false);

    // Add a numeric price field for payment processing
    program
        .createField('price')
        .name('Price')
        .type('Number')
        .localized(false)
        .required(true)
        .validations([
            {
                range: {
                    min: 0,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    // Add a currency selection field
    program
        .createField('currency')
        .name('Currency')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                in: ['USD', 'EUR', 'GBP'],
            },
        ])
        .disabled(false)
        .omitted(false);

    program
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

    program
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
    program.changeFieldControl('title', 'builtin', 'singleLine', {});
    program.changeFieldControl('slug', 'builtin', 'slugEditor', {});
    program.changeFieldControl('shortDescription', 'builtin', 'singleLine', {});
    program.changeFieldControl('fullDescription', 'builtin', 'markdown', {});
    program.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
    program.changeFieldControl('duration', 'builtin', 'singleLine', {});
    program.changeFieldControl('sessions', 'builtin', 'singleLine', {});
    program.changeFieldControl('benefits', 'builtin', 'tagEditor', {});
    program.changeFieldControl('features', 'builtin', 'tagEditor', {});
    program.changeFieldControl('testimonials', 'builtin', 'tagEditor', {});
    program.changeFieldControl('pricing', 'builtin', 'singleLine', {});
    program.changeFieldControl('price', 'builtin', 'numberEditor', {});
    program.changeFieldControl('currency', 'builtin', 'dropdown', {});
    program.changeFieldControl('featured', 'builtin', 'boolean', {});
    program.changeFieldControl('order', 'builtin', 'numberEditor', {});
}; 