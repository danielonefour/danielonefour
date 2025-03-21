module.exports = function (migration) {
    // Create an 'event' content type
    const event = migration.createContentType('event')
        .name('Event')
        .description('Upcoming events, workshops, and webinars')
        .displayField('title');

    // Add fields to the content type
    event
        .createField('title')
        .name('Title')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                unique: true,
            },
            {
                size: {
                    min: 3,
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    event
        .createField('slug')
        .name('Slug')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                unique: true,
            },
            {
                regexp: {
                    pattern: '^[a-z0-9-]+$',
                    flags: null,
                },
                message: 'Slug must be lowercase alphanumeric with hyphens',
            },
        ])
        .disabled(false)
        .omitted(false);

    event
        .createField('description')
        .name('Short Description')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 10,
                    max: 250,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    event
        .createField('content')
        .name('Content')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 50,
                    max: 5000,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    event
        .createField('date')
        .name('Event Date')
        .type('Date')
        .localized(false)
        .required(true)
        .validations([])
        .disabled(false)
        .omitted(false);

    event
        .createField('time')
        .name('Event Time')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([])
        .disabled(false)
        .omitted(false);

    event
        .createField('location')
        .name('Location')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 3,
                    max: 150,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    event
        .createField('image')
        .name('Image')
        .type('Link')
        .localized(false)
        .required(false)
        .validations([
            {
                linkMimetypeGroup: ['image'],
            },
        ])
        .linkType('Asset')
        .disabled(false)
        .omitted(false);

    event
        .createField('registrationLink')
        .name('Registration Link')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                regexp: {
                    pattern: '^(ftp|http|https):\\/\\/[^ "]+$',
                    flags: null,
                },
                message: 'Must be a valid URL starting with http://, https://, or ftp://'
            }
        ])
        .disabled(false)
        .omitted(false);

    event
        .createField('featured')
        .name('Featured')
        .type('Boolean')
        .localized(false)
        .required(false)
        .defaultValue({
            'en-US': false
        })
        .disabled(false)
        .omitted(false);

    event
        .createField('order')
        .name('Order')
        .type('Integer')
        .localized(false)
        .required(false)
        .validations([
            {
                range: {
                    min: 1,
                    max: 100,
                },
            },
        ])
        .disabled(false)
        .omitted(false);

    // Set up the editor interface
    event.changeFieldControl('title', 'builtin', 'singleLine', {});
    event.changeFieldControl('slug', 'builtin', 'slugEditor', {});
    event.changeFieldControl('description', 'builtin', 'singleLine', {});
    event.changeFieldControl('content', 'builtin', 'markdown', {});
    event.changeFieldControl('date', 'builtin', 'datePicker', {});
    event.changeFieldControl('time', 'builtin', 'singleLine', {});
    event.changeFieldControl('location', 'builtin', 'singleLine', {});
    event.changeFieldControl('image', 'builtin', 'assetLinkEditor', {});
    event.changeFieldControl('registrationLink', 'builtin', 'urlEditor', {});
    event.changeFieldControl('featured', 'builtin', 'boolean', {});
    event.changeFieldControl('order', 'builtin', 'numberEditor', {});
}; 