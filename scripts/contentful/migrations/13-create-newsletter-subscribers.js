module.exports = function (migration) {
    const newsletterSubscriber = migration.createContentType('newsletterSubscriber', {
        name: 'Newsletter Subscriber',
        description: 'Subscribers to the website newsletter',
        displayField: 'email'
    });

    newsletterSubscriber.createField('email', {
        name: 'Email',
        type: 'Symbol',
        required: true,
        validations: [
            {
                unique: true
            },
            {
                regexp: {
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                    flags: 'i'
                },
                message: 'Please enter a valid email address'
            }
        ]
    });

    newsletterSubscriber.createField('name', {
        name: 'Name',
        type: 'Symbol',
        required: false,
        validations: [
            {
                size: { max: 100 }
            }
        ]
    });

    newsletterSubscriber.createField('subscriptionDate', {
        name: 'Subscription Date',
        type: 'Date',
        required: true
    });

    newsletterSubscriber.createField('active', {
        name: 'Active',
        type: 'Boolean',
        required: true,
        defaultValue: { 'en-US': true }
    });

    newsletterSubscriber.createField('sourceUrl', {
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

    newsletterSubscriber.createField('ipAddress', {
        name: 'IP Address',
        type: 'Symbol',
        required: false
    });

    newsletterSubscriber.createField('confirmationToken', {
        name: 'Confirmation Token',
        type: 'Symbol',
        required: false
    });

    newsletterSubscriber.createField('confirmed', {
        name: 'Confirmed',
        type: 'Boolean',
        required: true,
        defaultValue: { 'en-US': false }
    });

    newsletterSubscriber.createField('externalId', {
        name: 'External Service ID',
        type: 'Symbol',
        required: false
    });

    // Set field controls for better editing experience
    newsletterSubscriber.changeFieldControl('email', 'builtin', 'singleLine', {
        helpText: 'Email address of the subscriber (must be unique)'
    });

    newsletterSubscriber.changeFieldControl('name', 'builtin', 'singleLine', {
        helpText: 'Subscriber\'s name if provided'
    });

    newsletterSubscriber.changeFieldControl('subscriptionDate', 'builtin', 'datePicker', {
        helpText: 'Date when the user subscribed'
    });

    newsletterSubscriber.changeFieldControl('active', 'builtin', 'boolean', {
        helpText: 'Whether this subscriber is currently active'
    });

    newsletterSubscriber.changeFieldControl('sourceUrl', 'builtin', 'urlEditor', {
        helpText: 'The page URL where the subscription occurred'
    });

    newsletterSubscriber.changeFieldControl('ipAddress', 'builtin', 'singleLine', {
        helpText: 'IP address for verification purposes'
    });

    newsletterSubscriber.changeFieldControl('confirmationToken', 'builtin', 'singleLine', {
        helpText: 'Token used for subscription confirmation'
    });

    newsletterSubscriber.changeFieldControl('confirmed', 'builtin', 'boolean', {
        helpText: 'Whether the email address has been confirmed'
    });

    newsletterSubscriber.changeFieldControl('externalId', 'builtin', 'singleLine', {
        helpText: 'ID from external email service provider (e.g., Mailchimp, SendGrid)'
    });
}; 