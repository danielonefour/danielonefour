module.exports = function (migration) {
    const client = migration.createContentType('client', {
        name: 'Client',
        description: 'Client or partner organization information',
        displayField: 'name'
    });

    client.createField('name', {
        name: 'Name',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 100 }
            }
        ]
    });

    client.createField('logo', {
        name: 'Logo',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [
            {
                linkMimetypeGroup: ['image']
            }
        ]
    });

    client.createField('website', {
        name: 'Website URL',
        type: 'Symbol',
        required: false,
        validations: [
            {
                regexp: {
                    pattern: '^(https?|ftp):\\/\\/[^\\s/$.?#].[^\\s]*$',
                    flags: 'i'
                },
                message: 'Please enter a valid URL (starting with http:// or https://)'
            }
        ]
    });

    client.createField('featured', {
        name: 'Featured',
        type: 'Boolean',
        required: false,
        defaultValue: { 'en-US': false }
    });

    client.createField('order', {
        name: 'Display Order',
        type: 'Integer',
        required: false,
        validations: [
            {
                range: { min: 1, max: 100 }
            }
        ]
    });

    client.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'Name of the client or organization'
    });
    client.changeFieldControl('logo', 'builtin', 'assetLinkEditor', {
        helpText: 'Logo image of the client (preferably with transparent background)'
    });
    client.changeFieldControl('website', 'builtin', 'urlEditor', {
        helpText: 'Client\'s website URL (optional)'
    });
    client.changeFieldControl('featured', 'builtin', 'boolean', {
        helpText: 'Should this client be displayed in featured sections?'
    });
    client.changeFieldControl('order', 'builtin', 'numberEditor', {
        helpText: 'Position in the list (lower numbers appear first)'
    });
}; 