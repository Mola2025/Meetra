DROP TABLE IF EXISTS hub_activities CASCADE;
DROP TABLE IF EXISTS hub_messages CASCADE;
DROP TABLE IF EXISTS hub_profiles CASCADE;
DROP TABLE IF EXISTS transcript_segments CASCADE;
DROP TABLE IF EXISTS meeting_transcripts CASCADE;
DROP TABLE IF EXISTS meetings CASCADE;
DROP TABLE IF EXISTS users CASCADE;

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
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT fk_meetings_host
        FOREIGN KEY (host_email)
        REFERENCES users(email)
        ON DELETE CASCADE,
    CONSTRAINT chk_meetings_status
        CHECK (status IN ('scheduled', 'active', 'ended', 'cancelled'))
);

CREATE TABLE meeting_transcripts (
    room_id TEXT PRIMARY KEY,
    active BOOLEAN NOT NULL DEFAULT FALSE,
    language TEXT NOT NULL DEFAULT 'fr-CA',
    started_at BIGINT NULL,
    summary JSONB NULL,
    created_at BIGINT NOT NULL,
    updated_at BIGINT NOT NULL,
    CONSTRAINT fk_transcripts_meeting
        FOREIGN KEY (room_id)
        REFERENCES meetings(room_id)
        ON DELETE CASCADE
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
    created_at BIGINT NOT NULL,
    CONSTRAINT fk_segments_meeting
        FOREIGN KEY (room_id)
        REFERENCES meetings(room_id)
        ON DELETE CASCADE
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
    read_at BIGINT NULL,
    CONSTRAINT fk_hub_message_from
        FOREIGN KEY (from_email)
        REFERENCES hub_profiles(email)
        ON DELETE CASCADE,
    CONSTRAINT fk_hub_message_to
        FOREIGN KEY (to_email)
        REFERENCES hub_profiles(email)
        ON DELETE CASCADE
);

CREATE TABLE hub_activities (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    target_email TEXT NOT NULL,
    actor_email TEXT NULL,
    actor_name TEXT NULL,
    meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at BIGINT NOT NULL,
    CONSTRAINT fk_activity_target
        FOREIGN KEY (target_email)
        REFERENCES hub_profiles(email)
        ON DELETE CASCADE
);

CREATE INDEX idx_users_email ON users(email);

CREATE INDEX idx_meetings_host_email ON meetings(host_email);
CREATE INDEX idx_meetings_status ON meetings(status);
CREATE INDEX idx_meetings_created_at ON meetings(created_at);

CREATE INDEX idx_transcript_segments_room_id ON transcript_segments(room_id);
CREATE INDEX idx_transcript_segments_created_at ON transcript_segments(created_at);

CREATE INDEX idx_hub_profiles_presence ON hub_profiles(presence_status);

CREATE INDEX idx_hub_messages_conversation_key ON hub_messages(conversation_key);
CREATE INDEX idx_hub_messages_from_email ON hub_messages(from_email);
CREATE INDEX idx_hub_messages_to_email ON hub_messages(to_email);
CREATE INDEX idx_hub_messages_created_at ON hub_messages(created_at);

CREATE INDEX idx_hub_activities_target_email ON hub_activities(target_email);
CREATE INDEX idx_hub_activities_type ON hub_activities(type);
CREATE INDEX idx_hub_activities_created_at ON hub_activities(created_at);