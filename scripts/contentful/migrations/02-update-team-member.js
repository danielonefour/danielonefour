#!/usr/bin/env node

module.exports = function (migration) {
    // This migration will only run after the team member content type has been created and published
    console.log('Checking if team member model needs updates...');

    try {
        // Get the existing published team member content type
        const teamMember = migration.editContentType('teamMember');

        // Publish the content type if it's not already published
        // Note: There's no direct way to check if it's published, 
        // but we can try to update field controls which would fail if not published

        // Just set a few basic field controls to be safe
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

        console.log('Team member model is up to date.');
    } catch (error) {
        console.error('Error in team member update migration:', error.message);
        // If the content type doesn't exist yet, we'll skip this migration
        if (error.message.includes('could not be found')) {
            console.log('Team member content type not found. This is expected if running for the first time.');
        } else {
            throw error;
        }
    }
}; 