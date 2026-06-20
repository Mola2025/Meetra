CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    password_hash TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    last_login_at BIGINT NULL,
    CONSTRAINT chk_users_role 
        CHECK (role IN ('admin', 'host', 'member', 'guest'))
);

CREATE TABLE meetings (
    room_id TEXT PRIMARY KEY,
    host_email TEXT NOT NULL,
    locked BOOLEAN NOT NULL DEFAULT FALSE,
    status TEXT NOT NULL DEFAULT 'scheduled',
    source TEXT NOT NULL DEFAULT 'api',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    started_at BIGINT NULL,
    ended_at BIGINT NULL,
    metadata TEXT NOT NULL DEFAULT '{}',
    CONSTRAINT chk_meetings_status
        CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled'))
);

CREATE TABLE meeting_transcripts (
    room_id TEXT PRIMARY KEY,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    language TEXT NOT NULL DEFAULT 'fr-CA',
    started_at BIGINT NULL,
    summary TEXT NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL
);

CREATE TABLE transcript_segments (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    speaker_id TEXT NULL,
    speaker_name TEXT NOT NULL,
    text TEXT NOT NULL,
    is_final BOOLEAN NOT NULL DEFAULT TRUE,
    language TEXT NOT NULL DEFAULT 'fr-CA',
    start_ms BIGINT NULL,
    end_ms BIGINT NULL,
    created_at BIGINT NOT NULL
);

CREATE TABLE hub_profiles (
    email TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'member',
    presence_status TEXT NOT NULL DEFAULT 'available',
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    last_seen_at BIGINT NOT NULL,
    CONSTRAINT chk_hub_role
        CHECK (role IN ('admin', 'host', 'member', 'guest')),
    CONSTRAINT chk_presence_status
        CHECK (presence_status IN ('available', 'busy', 'offline', 'in_meeting'))
);

CREATE TABLE hub_messages (
    id TEXT PRIMARY KEY,
    conversation_key TEXT NOT NULL,
    from_email TEXT NOT NULL,
    from_name TEXT NOT NULL,
    to_email TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at BIGINT NOT NULL,
    read_at BIGINT NULL
);

CREATE TABLE hub_activities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    target_email TEXT NOT NULL,
    actor_email TEXT NULL,
    actor_name TEXT NULL,
    meta TEXT NOT NULL DEFAULT '{}',
    created_at BIGINT NOT NULL
);
