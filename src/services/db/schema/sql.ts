export const startupSql: string[] = [
    `
  CREATE TABLE IF NOT EXISTS songs ( 
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  title VARCHAR(30), 
  path VARCHAR(100),  
  length FLOAT, 
  created_at DEFAULT CURRENT_TIMESTAMP 
  );
`,
    `
  CREATE TABLE IF NOT EXISTS playlists (
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  playlist_index INTEGER NOT NULL,
  title VARCHAR(30), 
  length INTEGER DEFAULT 0, 
  parent INTEGER, 
  created_at DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY("parent") REFERENCES "folders"("id") 
  );
`,
    `
  CREATE TABLE IF NOT EXISTS folders ( 
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  title VARCHAR(30), 
  length INTEGER DEFAULT 0,
  created_at DEFAULT CURRENT_TIMESTAMP 
  );
`,
    `
  CREATE TABLE IF NOT EXISTS playlist_song_list ( 
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  song_id INTEGER, 
  playlist_id INTEGER, 
  song_index INTEGER, 
  created_at DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY("song_id") REFERENCES "songs"("id"), 
  FOREIGN KEY("playlist_id") REFERENCES "playlists"("id") 
  );
`,
    `
  CREATE TABLE IF NOT EXISTS folder_playlist_list ( 
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  folder_id INTEGER, 
  playlist_id INTEGER, 
  created_at DEFAULT CURRENT_TIMESTAMP, 
  FOREIGN KEY("folder_id") REFERENCES "folders"("id"), 
  FOREIGN KEY("playlist_id") REFERENCES "playlists"("id") 
  );
`,
    `
  CREATE TABLE IF NOT EXISTS preferences ( 
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  wait_between BOOLEAN, 
  created_at DEFAULT CURRENT_TIMESTAMP
  );
`,
    `
  CREATE TABLE IF NOT EXISTS states ( 
  id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE, 
  volume INTEGER DEFAULT 0.5, 
  wait_between INTEGER DEFAULT 0.5, 
  show_explorer BOOLEAN DEFAULT 1, 
  random BOOLEAN DEFAULT 0, 
  current_playlist_id INTEGER DEFAULT 1,
  loop BOOLEAN DEFAULT 1,
  is_prefs_open boolean DEFAULT 0,
  created_at DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY("current_playlist_id") REFERENCES "playlists"("id")
  );
`,
    // `CREATE UNIQUE INDEX IF NOT EXISTS "ui_playlist_songs" ON "playlist_song_list" ("playlist_id", "song_id");`,
];

export const keys: string[] = [
    `CREATE UNIQUE INDEX IF NOT EXISTS "ui_playlist_songs" ON "playlist_song_list" ("playlist_id", "song_id");`,
    // `CREATE UNIQUE INDEX IF NOT EXISTS "ui_playlist_indexs" ON "playlist_song_list" ("playlist_id", "song_index");`,
];
