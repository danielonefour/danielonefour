#!/usr/bin/env node

module.exports = function (migration) {
    // Create a team member content type
    const teamMember = migration.createContentType('teamMember', {
        name: 'Team Member',
        description: 'Team member profiles for the About page',
        displayField: 'name'
    });

    // Add fields to the content type
    teamMember
        .createField('name')
        .name('Name')
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

    teamMember
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

    teamMember
        .createField('role')
        .name('Role')
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

    teamMember
        .createField('photo')
        .name('Photo')
        .type('Link')
        .linkType('Asset')
        .localized(false)
        .required(false);

    teamMember
        .createField('bio')
        .name('Bio')
        .type('Text')
        .localized(false)
        .required(true);

    teamMember
        .createField('shortBio')
        .name('Short Bio')
        .type('Text')
        .localized(false)
        .required(true)
        .validations([
            {
                size: {
                    max: 120
                }
            }
        ]);

    teamMember
        .createField('email')
        .name('Email')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                regexp: {
                    pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
                    flags: null
                },
                message: 'Please enter a valid email address.'
            }
        ]);

    teamMember
        .createField('phone')
        .name('Phone')
        .type('Symbol')
        .localized(false)
        .required(false);

    teamMember
        .createField('linkedinUrl')
        .name('LinkedIn Profile URL')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                regexp: {
                    pattern: '^https://www\\.linkedin\\.com/.*$',
                    flags: null
                },
                message: 'Please enter a valid LinkedIn URL starting with https://www.linkedin.com/.'
            }
        ]);

    teamMember
        .createField('twitterUrl')
        .name('Twitter Profile URL')
        .type('Symbol')
        .localized(false)
        .required(false)
        .validations([
            {
                regexp: {
                    pattern: '^https://twitter\\.com/.*$|^https://x\\.com/.*$',
                    flags: null
                },
                message: 'Please enter a valid Twitter URL starting with https://twitter.com/ or https://x.com/.'
            }
        ]);

    teamMember
        .createField('featured')
        .name('Featured')
        .type('Boolean')
        .localized(false)
        .required(false)
        .defaultValue({
            'en-US': false
        });

    // Set the order of appearance in the Contentful UI
    teamMember.changeFieldControl('name', 'builtin', 'singleLine');
    teamMember.changeFieldControl('slug', 'builtin', 'slugEditor');
    teamMember.changeFieldControl('role', 'builtin', 'singleLine');
    teamMember.changeFieldControl('photo', 'builtin', 'assetLinkEditor');
    teamMember.changeFieldControl('bio', 'builtin', 'multipleLine');
    teamMember.changeFieldControl('shortBio', 'builtin', 'multipleLine');
    teamMember.changeFieldControl('email', 'builtin', 'singleLine');
    teamMember.changeFieldControl('phone', 'builtin', 'singleLine');
    teamMember.changeFieldControl('linkedinUrl', 'builtin', 'urlEditor');
    teamMember.changeFieldControl('twitterUrl', 'builtin', 'urlEditor');
    teamMember.changeFieldControl('featured', 'builtin', 'boolean', {
        helpText: 'Toggle to feature this team member on the homepage'
    });
}; 