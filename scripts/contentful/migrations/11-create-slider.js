module.exports = function (migration) {
    const slider = migration.createContentType('slider', {
        name: 'Slider',
        description: 'Slider for hero sections and other carousel displays',
        displayField: 'title'
    });

    slider.createField('title', {
        name: 'Title',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 200 }
            }
        ]
    });

    slider.createField('description', {
        name: 'Description',
        type: 'Text',
        required: true
    });

    slider.createField('buttonText', {
        name: 'Button Text',
        type: 'Symbol',
        required: false,
        validations: [
            {
                size: { min: 2, max: 50 }
            }
        ]
    });

    slider.createField('buttonLink', {
        name: 'Button Link',
        type: 'Symbol',
        required: false,
        validations: [
            {
                regexp: {
                    pattern: '^(\\/[a-z0-9\\-]+)+\\/?$|^\\/$|^https?:\\/\\/[^\\s\\/$.?#].[^\\s]*$',
                    flags: 'i'
                },
                message: 'Please enter a valid URL (starting with /, http:// or https://)'
            }
        ]
    });

    slider.createField('image', {
        name: 'Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [
            {
                linkMimetypeGroup: ['image']
            }
        ]
    });

    slider.createField('order', {
        name: 'Display Order',
        type: 'Integer',
        required: false,
        validations: [
            {
                range: { min: 1, max: 100 }
            }
        ]
    });

    slider.createField('active', {
        name: 'Active',
        type: 'Boolean',
        required: false,
        defaultValue: { 'en-US': true }
    });

    // Set field controls for better editing experience
    slider.changeFieldControl('title', 'builtin', 'singleLine', {
        helpText: 'The main heading displayed on the slide'
    });

    slider.changeFieldControl('description', 'builtin', 'markdown', {
        helpText: 'Description text displayed on the slide'
    });

    slider.changeFieldControl('buttonText', 'builtin', 'singleLine', {
        helpText: 'Text to display on the call-to-action button (optional)'
    });

    slider.changeFieldControl('buttonLink', 'builtin', 'singleLine', {
        helpText: 'Link for the call-to-action button. Use relative paths (/contact) or full URLs'
    });

    slider.changeFieldControl('image', 'builtin', 'assetLinkEditor', {
        helpText: 'Background image for the slide (1920x1080 recommended)'
    });

    slider.changeFieldControl('order', 'builtin', 'numberEditor', {
        helpText: 'Position in the slider (lower numbers appear first)'
    });

    slider.changeFieldControl('active', 'builtin', 'boolean', {
        helpText: 'Whether this slide is currently active and should be displayed'
    });
}; 