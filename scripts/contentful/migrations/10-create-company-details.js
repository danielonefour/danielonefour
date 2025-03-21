module.exports = function (migration) {
    const companyDetails = migration.createContentType('companyDetails', {
        name: 'Company Details',
        description: 'Company information and details',
        displayField: 'companyName'
    });

    companyDetails.createField('companyName', {
        name: 'Company Name',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 100 }
            }
        ]
    });

    companyDetails.createField('heroTitle', {
        name: 'Hero Title',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 200 }
            }
        ]
    });

    companyDetails.createField('heroDescription', {
        name: 'Hero Description',
        type: 'Text',
        required: true
    });

    companyDetails.createField('introTitle', {
        name: 'Intro Title',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 200 }
            }
        ]
    });

    companyDetails.createField('introDescription', {
        name: 'Intro Description',
        type: 'Text',
        required: true
    });

    companyDetails.createField('introTagLine', {
        name: 'Intro Tag Line',
        type: 'Symbol',
        required: false,
        validations: [
            {
                size: { max: 150 }
            }
        ]
    });

    companyDetails.createField('primaryPhoneNumber', {
        name: 'Primary Phone Number',
        type: 'Symbol',
        required: true,
        validations: [
            {
                size: { min: 2, max: 200 }
            }
        ]
    });

    companyDetails.createField('primaryEmail', {
        name: 'Primary Email',
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

    companyDetails.createField('secondaryPhoneNumbers', {
        name: 'Secondary Phone Numbers',
        type: 'Array',
        required: false,
        items: {
            type: 'Symbol',
            validations: [
                {
                    size: { min: 2, max: 200 }
                }
            ]
        }
    });

    companyDetails.createField('secondaryEmails', {
        name: 'Secondary Emails',
        type: 'Array',
        required: false,
        items: {
            type: 'Symbol',
            validations: [
                {
                    regexp: {
                        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
                        flags: 'i'
                    },
                    message: 'Please enter a valid email address'
                }
            ]
        }
    });

    companyDetails.createField('streetAddress', {
        name: 'Street Address',
        type: 'Text',
        required: true
    });

    companyDetails.createField('country', {
        name: 'Country',
        type: 'Symbol',
        required: true
    });

    companyDetails.createField('postCode', {
        name: 'Post Code/ZIP',
        type: 'Symbol',
        required: true
    });

    companyDetails.createField('socialMedias', {
        name: 'Social Media Links',
        type: 'Object',
        required: false
    });

    // Set field controls for better editing experience
    companyDetails.changeFieldControl('companyName', 'builtin', 'singleLine', {
        helpText: 'The official name of the company'
    });

    companyDetails.changeFieldControl('heroTitle', 'builtin', 'singleLine', {
        helpText: 'Main title displayed in the hero section'
    });

    companyDetails.changeFieldControl('heroDescription', 'builtin', 'markdown', {
        helpText: 'Description text displayed in the hero section'
    });

    companyDetails.changeFieldControl('introTitle', 'builtin', 'singleLine', {
        helpText: 'Title for the introduction section'
    });

    companyDetails.changeFieldControl('introDescription', 'builtin', 'markdown', {
        helpText: 'Description text for the introduction section'
    });

    companyDetails.changeFieldControl('introTagLine', 'builtin', 'singleLine', {
        helpText: 'A short, catchy tagline for the introduction section (optional)'
    });

    companyDetails.changeFieldControl('primaryPhoneNumber', 'builtin', 'singleLine', {
        helpText: 'Main contact phone number for the company'
    });

    companyDetails.changeFieldControl('primaryEmail', 'builtin', 'singleLine', {
        helpText: 'Main contact email for the company'
    });

    companyDetails.changeFieldControl('secondaryPhoneNumbers', 'builtin', 'tagEditor', {
        helpText: 'Additional phone numbers (optional)'
    });

    companyDetails.changeFieldControl('secondaryEmails', 'builtin', 'tagEditor', {
        helpText: 'Additional email addresses (optional)'
    });

    companyDetails.changeFieldControl('streetAddress', 'builtin', 'multipleLine', {
        helpText: 'Street address of the company'
    });

    companyDetails.changeFieldControl('country', 'builtin', 'singleLine', {
        helpText: 'Country where the company is located'
    });

    companyDetails.changeFieldControl('postCode', 'builtin', 'singleLine', {
        helpText: 'Postal code or ZIP code'
    });

    companyDetails.changeFieldControl('socialMedias', 'builtin', 'objectEditor', {
        helpText: 'Social media profile URLs (e.g., {"facebook": "https://facebook.com/example", "twitter": "https://twitter.com/example"})'
    });
}; 