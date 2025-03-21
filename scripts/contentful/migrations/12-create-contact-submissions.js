module.exports = function (migration) {
    const contactSubmission = migration.createContentType('contactSubmission', {
        name: 'Contact Form Submission',
        description: 'Submissions from the website contact form',
        displayField: 'name'
    });

    contactSubmission.createField('name', {
        name: 'Name',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 100 }
            }
        ]
    });

    contactSubmission.createField('email', {
        name: 'Email',
        type: 'Symbol',
        required: true,
        validations: [
            {
                regexp: {
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                    flags: 'i'
                },
                message: 'Please enter a valid email address'
            }
        ]
    });

    contactSubmission.createField('subject', {
        name: 'Subject',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 200 }
            }
        ]
    });

    contactSubmission.createField('message', {
        name: 'Message',
        type: 'Text',
        required: true
    });

    contactSubmission.createField('phone', {
        name: 'Phone Number',
        type: 'Symbol',
        required: false
    });

    contactSubmission.createField('sourceUrl', {
        name: 'Source URL',
        type: 'Symbol',
        required: false,
        validations: [
            {
                regexp: {
                    pattern: '^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$',
                    flags: 'i'
                },
                message: 'Please enter a valid URL'
            }
        ]
    });

    contactSubmission.createField('ipAddress', {
        name: 'IP Address',
        type: 'Symbol',
        required: false
    });

    contactSubmission.createField('submittedAt', {
        name: 'Submitted At',
        type: 'Date',
        required: true
    });

    contactSubmission.createField('status', {
        name: 'Status',
        type: 'Symbol',
        required: true,
        validations: [
            {
                in: ['new', 'read', 'replied', 'archived']
            }
        ],
        defaultValue: { 'en-US': 'new' }
    });

    // Set field controls for better editing experience
    contactSubmission.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'Name of the person submitting the form'
    });

    contactSubmission.changeFieldControl('email', 'builtin', 'singleLine', {
        helpText: 'Email address of the sender'
    });

    contactSubmission.changeFieldControl('subject', 'builtin', 'singleLine', {
        helpText: 'Subject of the inquiry'
    });

    contactSubmission.changeFieldControl('message', 'builtin', 'multipleLine', {
        helpText: 'Message content'
    });

    contactSubmission.changeFieldControl('phone', 'builtin', 'singleLine', {
        helpText: 'Phone number if provided'
    });

    contactSubmission.changeFieldControl('sourceUrl', 'builtin', 'urlEditor', {
        helpText: 'The page URL where the form was submitted'
    });

    contactSubmission.changeFieldControl('ipAddress', 'builtin', 'singleLine', {
        helpText: 'IP address of the sender for spam prevention'
    });

    contactSubmission.changeFieldControl('submittedAt', 'builtin', 'datePicker', {
        helpText: 'Date and time when the form was submitted'
    });

    contactSubmission.changeFieldControl('status', 'builtin', 'dropdown', {
        helpText: 'Current status of this contact submission'
    });
}; 