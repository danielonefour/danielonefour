#!/usr/bin/env node

module.exports = function (migration) {
    // Create a service content type
    const service = migration.createContentType('service', {
        name: 'Service',
        description: 'Coaching and consulting services offered by the company',
        displayField: 'title'
    });

    service
        .createField('title')
        .name('Title')
        .type('Symbol')
        .required(true)
        .validations([
            {
                unique: true
            },
            {
                size: { max: 100 }
            }
        ]);

    service
        .createField('slug')
        .name('Slug')
        .type('Symbol')
        .required(true)
        .validations([
            {
                unique: true
            },
            {
                regexp: {
                    pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$',
                    flags: null
                },
                message: 'Slug must be lowercase, alphanumeric with hyphens'
            }
        ]);

    service
        .createField('description')
        .name('Description')
        .type('Text')
        .required(true)
        .validations([
            {
                size: { max: 200 }
            }
        ]);

    service
        .createField('content')
        .name('Content')
        .type('Text')
        .required(true)
        .validations([
            {
                size: { max: 5000 }
            }
        ]);

    service
        .createField('featuredImage')
        .name('Featured Image')
        .type('Link')
        .linkType('Asset')
        .validations([
            {
                linkMimetypeGroup: ['image']
            }
        ]);

    service
        .createField('benefits')
        .name('Benefits')
        .type('Array')
        .items({
            type: 'Symbol',
            validations: [
                {
                    size: { max: 150 }
                }
            ]
        })
        .validations([
            {
                size: { max: 10 }
            }
        ]);

    service
        .createField('faqs')
        .name('FAQs')
        .type('Array')
        .items({
            type: 'Text',
            validations: [
                {
                    size: { max: 1000 }
                }
            ]
        })
        .validations([
            {
                size: {
                    max: 10
                }
            }
        ]);

    service
        .createField('order')
        .name('Display Order')
        .type('Integer')
        .validations([
            {
                range: {
                    min: 1,
                    max: 100
                }
            }
        ]);

    service
        .createField('featured')
        .name('Featured')
        .type('Boolean')
        .defaultValue({
            'en-US': false
        });

    // Set the order of appearance in the Contentful UI
    service.changeFieldControl('title', 'builtin', 'singleLine', {
        helpText: 'Title of the service (100 characters max)'
    });
    service.changeFieldControl('slug', 'builtin', 'slugEditor', {
        helpText: 'URL-friendly name (auto-generated from title, can be edited)'
    });
    service.changeFieldControl('description', 'builtin', 'multipleLine', {
        helpText: 'Short description for service cards and previews (200 characters max)'
    });
    service.changeFieldControl('content', 'builtin', 'markdown', {
        helpText: 'Full description of the service (formatted with Markdown)'
    });
    service.changeFieldControl('featuredImage', 'builtin', 'assetLinkEditor', {
        helpText: 'Image to display on service cards and the service page'
    });
    service.changeFieldControl('benefits', 'builtin', 'tagEditor', {
        helpText: 'List of benefits (max 10 items, 150 characters each)'
    });
    service.changeFieldControl('faqs', 'builtin', 'entryLinksEditor', {
        helpText: 'Frequently asked questions about this service'
    });
    service.changeFieldControl('order', 'builtin', 'numberEditor', {
        helpText: 'Order in which to display this service (lower numbers appear first)'
    });
    service.changeFieldControl('featured', 'builtin', 'boolean', {
        helpText: 'Whether to highlight this service on the homepage'
    });
}; 