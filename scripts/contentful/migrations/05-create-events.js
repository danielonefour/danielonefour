module.exports = function (migration) {
    const event = migration.createContentType('event', {
        name: 'Event',
        description: 'Workshops, webinars, and other events',
        displayField: 'title'
    });

    event.createField('title', {
        name: 'Title',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 3, max: 100 }
            }
        ]
    });

    event.createField('slug', {
        name: 'Slug',
        type: 'Symbol',
        required: true,
        validations: [
            {
                unique: true
            },
            {
                regexp: {
                    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
                    flags: null
                },
                message: 'Slug must be lowercase with hyphens'
            }
        ]
    });

    event.createField('date', {
        name: 'Date',
        type: 'Date',
        required: true
    });

    event.createField('time', {
        name: 'Time',
        type: 'Symbol',
        required: false
    });

    event.createField('location', {
        name: 'Location',
        type: 'Symbol',
        required: false
    });

    event.createField('description', {
        name: 'Description',
        type: 'Text',
        required: true,
        validations: [
            {
                size: { max: 500 }
            }
        ]
    });

    event.createField('content', {
        name: 'Content',
        type: 'RichText',
        required: true,
        validations: [
            {
                enabledMarks: ['bold', 'italic', 'underline', 'code'],
                enabledNodeTypes: [
                    'heading-1',
                    'heading-2',
                    'heading-3',
                    'heading-4',
                    'heading-5',
                    'heading-6',
                    'ordered-list',
                    'unordered-list',
                    'hr',
                    'blockquote',
                    'embedded-asset-block',
                    'hyperlink',
                    'entry-hyperlink',
                    'asset-hyperlink',
                ]
            }
        ]
    });

    event.createField('image', {
        name: 'Featured Image',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [
            {
                linkMimetypeGroup: ['image']
            }
        ]
    });

    event.createField('category', {
        name: 'Category',
        type: 'Symbol',
        required: false
    });

    event.createField('featured', {
        name: 'Featured',
        type: 'Boolean',
        required: false,
        defaultValue: false
    });

    event.changeFieldControl('title', 'builtin', 'singleLine');
    event.changeFieldControl('slug', 'builtin', 'slugEditor', {
        helpText: 'URL-friendly name for this event (will be prefilled with title)'
    });
    event.changeFieldControl('date', 'builtin', 'datePicker');
    event.changeFieldControl('time', 'builtin', 'singleLine', {
        helpText: 'Specify the time of the event (e.g. "10:00 AM - 2:00 PM")'
    });
    event.changeFieldControl('location', 'builtin', 'singleLine', {
        helpText: 'Physical location or "Online" for virtual events'
    });
    event.changeFieldControl('description', 'builtin', 'multipleLine', {
        helpText: 'A short description of the event (appears on cards)'
    });
    event.changeFieldControl('content', 'builtin', 'richTextEditor');
    event.changeFieldControl('image', 'builtin', 'assetLinkEditor', {
        helpText: 'Image for the event (recommended ratio 16:9)'
    });
    event.changeFieldControl('category', 'builtin', 'singleLine', {
        helpText: 'Category for this event (e.g. Workshop, Webinar, Conference)'
    });
    event.changeFieldControl('featured', 'builtin', 'boolean', {
        helpText: 'Should this event be highlighted in the featured section?'
    });
}; 