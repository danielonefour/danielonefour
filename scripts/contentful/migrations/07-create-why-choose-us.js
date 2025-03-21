module.exports = function (migration) {
    const whyChooseUsItem = migration.createContentType('whyChooseUsItem', {
        name: 'Why Choose Us Item',
        description: 'Features, benefits, or reasons to choose our services',
        displayField: 'title'
    });

    whyChooseUsItem.createField('title', {
        name: 'Title',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 3, max: 100 }
            }
        ]
    });

    whyChooseUsItem.createField('description', {
        name: 'Description',
        type: 'Text',
        required: true,
        validations: [
            {
                size: { min: 10, max: 300 }
            }
        ]
    });

    whyChooseUsItem.createField('icon', {
        name: 'Icon',
        type: 'Link',
        linkType: 'Asset',
        required: false,
        validations: [
            {
                linkMimetypeGroup: ['image']
            }
        ]
    });

    whyChooseUsItem.createField('order', {
        name: 'Display Order',
        type: 'Integer',
        required: false,
        validations: [
            {
                range: { min: 1, max: 100 }
            }
        ]
    });

    whyChooseUsItem.changeFieldControl('title', 'builtin', 'singleLine');
    whyChooseUsItem.changeFieldControl('description', 'builtin', 'multipleLine', {
        helpText: 'Brief description of this feature/benefit'
    });
    whyChooseUsItem.changeFieldControl('icon', 'builtin', 'assetLinkEditor', {
        helpText: 'Icon image representing this feature (SVG preferred)'
    });
    whyChooseUsItem.changeFieldControl('order', 'builtin', 'numberEditor', {
        helpText: 'Position in the list (lower numbers appear first)'
    });
}; 