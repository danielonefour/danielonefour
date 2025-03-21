module.exports = function (migration) {
    const testimonial = migration.createContentType('testimonial', {
        name: 'Testimonial',
        description: 'Client testimonials and reviews',
        displayField: 'name'
    });

    testimonial.createField('name', {
        name: 'Client Name',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 50 }
            }
        ]
    });

    testimonial.createField('quote', {
        name: 'Quote',
        type: 'Text',
        required: true,
        validations: [
            {
                size: { min: 10, max: 500 }
            }
        ]
    });

    testimonial.createField('role', {
        name: 'Job Title/Role',
        type: 'Symbol',
        required: false,
        validations: [
            {
                size: { max: 50 }
            }
        ]
    });

    testimonial.createField('company', {
        name: 'Company Name',
        type: 'Symbol',
        required: false,
        validations: [
            {
                size: { max: 50 }
            }
        ]
    });

    testimonial.createField('image', {
        name: 'Client Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [
            {
                linkMimetypeGroup: ['image']
            }
        ]
    });

    testimonial.createField('featured', {
        name: 'Featured',
        type: 'Boolean',
        required: false,
        defaultValue: false
    });

    testimonial.changeFieldControl('name', 'builtin', 'singleLine');
    testimonial.changeFieldControl('quote', 'builtin', 'multipleLine', {
        helpText: 'The testimonial text (client\'s words)'
    });
    testimonial.changeFieldControl('role', 'builtin', 'singleLine', {
        helpText: 'Client\'s job title or role'
    });
    testimonial.changeFieldControl('company', 'builtin', 'singleLine', {
        helpText: 'Client\'s company or organization'
    });
    testimonial.changeFieldControl('image', 'builtin', 'assetLinkEditor', {
        helpText: 'Client\'s photo (ideally a headshot with 1:1 ratio)'
    });
    testimonial.changeFieldControl('featured', 'builtin', 'boolean', {
        helpText: 'Should this testimonial be displayed in the featured section?'
    });
}; 