module.exports = function (migration) {
    const eventRegistration = migration.createContentType('eventRegistration', {
        name: 'Event Registration',
        description: 'Stores event registration submissions from the website',
        displayField: 'name'
    });

    eventRegistration.createField('name', {
        name: 'Full Name',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { max: 100 }
            }
        ]
    });

    eventRegistration.createField('email', {
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

    eventRegistration.createField('phone', {
        name: 'Phone Number',
        type: 'Symbol',
        required: false
    });

    eventRegistration.createField('organization', {
        name: 'Organization',
        type: 'Symbol',
        required: false
    });

    eventRegistration.createField('message', {
        name: 'Additional Message',
        type: 'Text',
        required: false
    });

    eventRegistration.createField('eventId', {
        name: 'Event ID',
        type: 'Symbol',
        required: true
    });

    eventRegistration.createField('eventTitle', {
        name: 'Event Title',
        type: 'Symbol',
        required: true
    });

    eventRegistration.createField('submissionDate', {
        name: 'Submission Date',
        type: 'Date',
        required: true
    });

    eventRegistration.createField('status', {
        name: 'Status',
        type: 'Symbol',
        required: true,
        validations: [
            {
                in: ['New', 'Contacted', 'Confirmed', 'Cancelled', 'Attended', 'No-Show']
            }
        ]
    });

    eventRegistration.createField('notes', {
        name: 'Admin Notes',
        type: 'Text',
        required: false
    });

    // Set field controls for better editing experience
    eventRegistration.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'Registrant\'s full name'
    });

    eventRegistration.changeFieldControl('email', 'builtin', 'singleLine', {
        helpText: 'Registrant\'s email address'
    });

    eventRegistration.changeFieldControl('phone', 'builtin', 'singleLine', {
        helpText: 'Registrant\'s phone number (if provided)'
    });

    eventRegistration.changeFieldControl('organization', 'builtin', 'singleLine', {
        helpText: 'Registrant\'s organization or company (if provided)'
    });

    eventRegistration.changeFieldControl('message', 'builtin', 'multipleLine', {
        helpText: 'Additional message or requirements from the registrant'
    });

    eventRegistration.changeFieldControl('eventId', 'builtin', 'singleLine', {
        helpText: 'ID of the event they registered for'
    });

    eventRegistration.changeFieldControl('eventTitle', 'builtin', 'singleLine', {
        helpText: 'Title of the event they registered for'
    });

    eventRegistration.changeFieldControl('submissionDate', 'builtin', 'datePicker', {
        helpText: 'Date when the registration was submitted'
    });

    eventRegistration.changeFieldControl('status', 'builtin', 'dropdown', {
        helpText: 'Current status of this registration'
    });

    eventRegistration.changeFieldControl('notes', 'builtin', 'multipleLine', {
        helpText: 'Admin notes about this registration (not visible to the registrant)'
    });
}; 