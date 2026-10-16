
const db = require('./database');

try {
    // Find a valid user for the required created_by foreign key.
    const user = db.prepare(
        'SELECT id FROM users ORDER BY id LIMIT 1'
    ).get();

    if (!user) {
        console.error(
            'No users found. Register a user before seeding clubs.'
        );
        process.exitCode = 1;
    } else {
        const clubs = [
            {
                name: 'Technical Club',
                description:
                    'Explore programming, software development, emerging technologies, and technical projects.'
            },
            {
                name: 'Cultural Club',
                description:
                    'Participate in cultural events, music, dance, drama, and campus celebrations.'
            },
            {
                name: 'Sports Club',
                description:
                    'Connect with students through sports, fitness activities, and inter-college competitions.'
            },
            {
                name: 'Photography Club',
                description:
                    'Learn photography, share creative work, and document campus life.'
            },
            {
                name: 'Literary Club',
                description:
                    'Explore writing, reading, poetry, debates, and other literary activities.'
            },
            {
                name: 'Eco Club',
                description:
                    'Promote environmental awareness, sustainability, and campus cleanliness.'
            }
        ];

        const insertClub = db.prepare(`
            INSERT OR IGNORE INTO clubs
                (name, description, created_by)
            VALUES
                (@name, @description, @created_by)
        `);

        const seedClubs = db.transaction(() => {
            for (const club of clubs) {
                insertClub.run({
                    ...club,
                    created_by: user.id
                });
            }
        });

        seedClubs();

        const savedClubs = db.prepare(`
            SELECT id, name, description, created_by
            FROM clubs
            ORDER BY id
        `).all();

        console.log('Club seeding completed.');
        console.log(`Total clubs in database: ${savedClubs.length}`);
        console.table(savedClubs);
    }
} catch (error) {
    console.error('Club seeding failed:', error.message);
    process.exitCode = 1;
} finally {
    db.close();
}