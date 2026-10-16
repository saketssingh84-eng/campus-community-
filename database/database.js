const Database = require('better-sqlite3');

const db = new Database('database/campus.db');

db.pragma('foreign_keys = ON');

console.log('Database connected successfully!');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Users table created successfully!');




//new code

db.exec(`
  CREATE TABLE IF NOT EXISTS clubs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
      REFERENCES users(id)
);
`);

console.log('Clubs table created successfully!');





db.exec(`
  CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
      REFERENCES users(id)
  )
`);

console.log('Announcements table created successfully!');




db.exec(`
  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    event_date DATETIME NOT NULL,
    location TEXT,
    club_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (club_id)
      REFERENCES clubs(id),

    FOREIGN KEY (created_by)
      REFERENCES users(id)
  )
`);

console.log('Events table created successfully!');




db.exec(`
  CREATE TABLE IF NOT EXISTS reminders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    reminder_date DATETIME NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
      REFERENCES users(id)
  )
`);

console.log('Reminders table created successfully!');







db.exec(`
  CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    day TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    location TEXT,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (created_by)
      REFERENCES users(id)
  )
`);

console.log('Schedules table created successfully!');




db.exec(`
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (uploaded_by)
      REFERENCES users(id)
  )
`);

console.log('Resources table created successfully!');





db.exec(`
  CREATE TABLE IF NOT EXISTS discussion_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Discussion categories table created successfully!');





db.exec(`
  CREATE TABLE IF NOT EXISTS discussion_threads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
      REFERENCES discussion_categories(id),

    FOREIGN KEY (created_by)
      REFERENCES users(id)
  )
`);

console.log('Discussion threads table created successfully!');




db.exec(`
  CREATE TABLE IF NOT EXISTS discussion_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    thread_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (thread_id)
      REFERENCES discussion_threads(id)
      ON DELETE CASCADE,

    FOREIGN KEY (created_by)
      REFERENCES users(id)
  )
`);

console.log('Discussion posts table created successfully!');


db.exec(`
  CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log('Tags table created successfully!');



db.exec(`
  CREATE TABLE IF NOT EXISTS announcement_tags (
    announcement_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (announcement_id, tag_id),

    FOREIGN KEY (announcement_id)
      REFERENCES announcements(id)
      ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
      REFERENCES tags(id)
      ON DELETE CASCADE
  )
`);

console.log('Announcement tags table created successfully!');



db.exec(`
  CREATE TABLE IF NOT EXISTS event_tags (
    event_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (event_id, tag_id),

    FOREIGN KEY (event_id)
      REFERENCES events(id)
      ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
      REFERENCES tags(id)
      ON DELETE CASCADE
  )
`);

console.log('Event tags table created successfully!');



db.exec(`
  CREATE TABLE IF NOT EXISTS club_tags (
    club_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (club_id, tag_id),

    FOREIGN KEY (club_id)
      REFERENCES clubs(id)
      ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
      REFERENCES tags(id)
      ON DELETE CASCADE
  )
`);

console.log('Club tags table created successfully!');


db.exec(`
  CREATE TABLE IF NOT EXISTS resource_tags (
    resource_id INTEGER NOT NULL,
    tag_id INTEGER NOT NULL,

    PRIMARY KEY (resource_id, tag_id),

    FOREIGN KEY (resource_id)
      REFERENCES resources(id)
      ON DELETE CASCADE,

    FOREIGN KEY (tag_id)
      REFERENCES tags(id)
      ON DELETE CASCADE
  )
`);

console.log('Resource tags table created successfully!');

db.exec(`
  CREATE TABLE IF NOT EXISTS pinned_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_type TEXT NOT NULL,
    item_id INTEGER NOT NULL,
    pinned_by INTEGER NOT NULL,
    pinned_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (pinned_by)
      REFERENCES users(id)
  )
`);

console.log('Pinned items table created successfully!');


db.exec(`
  CREATE INDEX IF NOT EXISTS idx_announcements_created_by
  ON announcements(created_by);

  CREATE INDEX IF NOT EXISTS idx_events_club_id
  ON events(club_id);

  CREATE INDEX IF NOT EXISTS idx_events_event_date
  ON events(event_date);

  CREATE INDEX IF NOT EXISTS idx_resources_uploaded_by
  ON resources(uploaded_by);

  CREATE INDEX IF NOT EXISTS idx_threads_category_id
  ON discussion_threads(category_id);

  CREATE INDEX IF NOT EXISTS idx_posts_thread_id
  ON discussion_posts(thread_id);

  CREATE INDEX IF NOT EXISTS idx_announcement_tags_tag_id
  ON announcement_tags(tag_id);

  CREATE INDEX IF NOT EXISTS idx_event_tags_tag_id
  ON event_tags(tag_id);

  CREATE INDEX IF NOT EXISTS idx_club_tags_tag_id
  ON club_tags(tag_id);

  CREATE INDEX IF NOT EXISTS idx_resource_tags_tag_id
  ON resource_tags(tag_id);
`);

console.log('Database indexes created successfully!');

module.exports = db;