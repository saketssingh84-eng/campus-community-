
const db = require('./database');

// Default discussion categories
const discussionCategories = [
    {
        name: 'General Discussion',
        description: 'General campus conversations and questions'
    },
    {
        name: 'Academic Help',
        description: 'Academic questions and peer support'
    },
    {
        name: 'Technical Discussion',
        description: 'Programming and technology discussions'
    },
    {
        name: 'Campus Life',
        description: 'Hostel life and campus experiences'
    },
    {
        name: 'Events and Clubs',
        description: 'Campus events, clubs, and activities'
    }
];

// Default tags
const tags = [
    'Academic',
    'Workshop',
    'Technical',
    'Cultural',
    'Sports',
    'Competition',
    'Important',
    'Placement',
    'General'
];

// Sample announcements for development
const sampleAnnouncements = [
    {
        title: 'Tech Club Recruitment 2026',
        content: 'The Technical Club is inviting students to join upcoming coding events, hackathons, and projects. Apply before the deadline.'
    },
    {
        title: 'Freshers Welcome Event 2026',
        content: 'Welcome to campus! Join us for an exciting freshers event filled with performances, games, and opportunities to meet fellow students.'
    },
    {
        title: '24-Hour Campus Hackathon',
        content: 'Form your team, select a problem statement, and build an innovative project. Check with the organizers for registration details.'
    },
    {
        title: 'Inter-College Cricket Tournament',
        content: 'Our campus is hosting an inter-college cricket tournament. Contact the Sports Club for registration details.'
    },
    {
        title: 'Library Extended Hours',
        content: 'The campus library will have extended opening hours during the examination period. Check the official library notice for timings.'
    }
];

const seedDatabase = db.transaction(() => {
    const insertCategory = db.prepare(`
        INSERT OR IGNORE INTO discussion_categories
        (name, description)
        VALUES (?, ?)
    `);

    const insertTag = db.prepare(`
        INSERT OR IGNORE INTO tags (name)
        VALUES (?)
    `);

    for (const category of discussionCategories) {
        insertCategory.run(category.name, category.description);
    }

    for (const tag of tags) {
        insertTag.run(tag);
    }

    // Add sample announcements only when the table is empty.
    const announcementCount = db.prepare(`
        SELECT COUNT(*) AS count FROM announcements
    `).get().count;

    if (announcementCount === 0) {
        // Use an existing user to satisfy the created_by foreign key.
        const user = db.prepare(`
            SELECT id FROM users ORDER BY id LIMIT 1
        `).get();

        if (!user) {
            console.log(
                'No users found. Sample announcements were skipped. ' +
                'Register a user and run the seed command again.'
            );
        } else {
            const insertAnnouncement = db.prepare(`
                INSERT INTO announcements (title, content, created_by)
                VALUES (?, ?, ?)
            `);

            for (const announcement of sampleAnnouncements) {
                insertAnnouncement.run(
                    announcement.title,
                    announcement.content,
                    user.id
                );
            }

            console.log('Sample announcements added successfully.');
        }
    } else {
        console.log(
            `Announcements already exist (${announcementCount}); skipping sample announcements.`
        );
    }
});

try {
    seedDatabase();
    console.log('Default discussion categories and tags added successfully.');
} catch (error) {
    console.error('Database seeding failed:', error.message);
    process.exitCode = 1;
} finally {
    db.close();
}