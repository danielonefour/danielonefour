module.exports = function (migration) {
    const result = migration.createContentType('result', {
        name: 'Result',
        description: 'Numerical statistics and results to showcase achievements',
        displayField: 'title'
    });

    result.createField('number', {
        name: 'Number',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 1, max: 20 }
            }
        ]
    });

    result.createField('title', {
        name: 'Title',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 3, max: 50 }
            }
        ]
    });

    result.createField('description', {
        name: 'Description',
        type: 'Text',
        required: true,
        validations: [
            {
                size: { min: 10, max: 200 }
            }
        ]
    });

    result.createField('order', {
        name: 'Display Order',
        type: 'Integer',
        required: false,
        validations: [
            {
                range: { min: 1, max: 100 }
            }
        ]
    });

    result.changeFieldControl('number', 'builtin', 'singleLine', {
        helpText: 'The numerical value (e.g., "58+", "100%", "2x", etc.)'
    });
    result.changeFieldControl('title', 'builtin', 'singleLine', {
        helpText: 'A short title describing the statistic (e.g., "Satisfied Clients")'
    });
    result.changeFieldControl('description', 'builtin', 'multipleLine', {
        helpText: 'A brief description or context for this result'
    });
    result.changeFieldControl('order', 'builtin', 'numberEditor', {
        helpText: 'Position in the list (lower numbers appear first)'
    });
}; 