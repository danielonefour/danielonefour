module.exports = function (migration) {
    // Check if the content type already exists
    const existingBlogPost = migration.editContentType('blogPost');
    if (existingBlogPost) {
        console.log('Blog Post content type already exists. Skipping creation.');
        return;
    }

    // Create a blog post content type
    const blogPost = migration.createContentType('blogPost', {
        name: 'Blog Post',
        description: 'A blog post with content and metadata',
        displayField: 'title'
    });

    blogPost
        .createField('title')
        .name('Title')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                unique: true
            },
            {
                size: {
                    min: 3,
                    max: 120
                }
            }
        ]);

    blogPost
        .createField('slug')
        .name('Slug')
        .type('Symbol')
        .localized(false)
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
                message: 'Slug must be lowercase, alphanumeric, and can include hyphens (no spaces).'
            }
        ]);

    blogPost
        .createField('excerpt')
        .name('Excerpt')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 10,
                    max: 300
                }
            }
        ]);

    blogPost
        .createField('content')
        .name('Content')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 50
                }
            }
        ]);

    blogPost
        .createField('featuredImage')
        .name('Featured Image')
        .type('Link')
        .linkType('Asset')
        .localized(false)
        .required(false);

    blogPost
        .createField('date')
        .name('Date')
        .type('Date')
        .localized(false)
        .required(true);

    blogPost
        .createField('author')
        .name('Author')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    min: 2,
                    max: 100
                }
            }
        ]);

    blogPost
        .createField('category')
        .name('Category')
        .type('Symbol')
        .localized(false)
        .required(true)
        .validations([
            {
                in: [
                    'Business Coaching',
                    'Leadership Development',
                    'Performance Improvement',
                    'Career Growth',
                    'Personal Development',
                    'Team Building',
                    'Work-Life Balance',
                    'Executive Coaching',
                    'Communication Skills',
                    'Productivity'
                ]
            }
        ]);

    blogPost
        .createField('tags')
        .name('Tags')
        .type('Array')
        .items({
            type: 'Symbol',
            validations: [
                {
                    size: {
                        min: 1,
                        max: 20
                    }
                }
            ]
        })
        .validations([
            {
                size: {
                    min: 0,
                    max: 10
                }
            }
        ]);

    blogPost
        .createField('featured')
        .name('Featured')
        .type('Boolean')
        .localized(false)
        .required(false)
        .defaultValue({
            'en-US': false
        });

    // Set the order of appearance in the Contentful UI
    blogPost.changeFieldControl('title', 'builtin', 'singleLine');
    blogPost.changeFieldControl('slug', 'builtin', 'slugEditor');
    blogPost.changeFieldControl('excerpt', 'builtin', 'multipleLine');
    blogPost.changeFieldControl('content', 'builtin', 'markdown');
    blogPost.changeFieldControl('featuredImage', 'builtin', 'assetLinkEditor');
    blogPost.changeFieldControl('date', 'builtin', 'datePicker');
    blogPost.changeFieldControl('author', 'builtin', 'singleLine');
    blogPost.changeFieldControl('category', 'builtin', 'dropdown');
    blogPost.changeFieldControl('tags', 'builtin', 'tagEditor');
    blogPost.changeFieldControl('featured', 'builtin', 'boolean');
}; 