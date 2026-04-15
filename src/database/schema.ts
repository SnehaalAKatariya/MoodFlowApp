import { appSchema, tableSchema } from '@nozbe/watermelondb';

export default appSchema({
  version: 1,
  tables: [
    tableSchema({ name: 'users', columns: [
      { name: 'supabase_id',        type: 'string', isOptional: true },
      { name: 'wake_time',           type: 'string' },
      { name: 'sleep_time',          type: 'string' },
      { name: 'check_in_interval_h', type: 'number' },
      { name: 'timezone',            type: 'string' },
      { name: 'synced_at',           type: 'number', isOptional: true },
      { name: 'anchor_moods',        type: 'string' }, // Will store stringified JSON array
      { name: 'onboarding_done',     type: 'boolean' }
    ]}),
    tableSchema({ name: 'mood_logs', columns: [
      { name: 'user_id',         type: 'string' },
      { name: 'mood_score',      type: 'number' },
      { name: 'tag',             type: 'string',  isOptional: true },
      { name: 'logged_at',       type: 'number' },
      { name: 'source',          type: 'string' },
      { name: 'follow_up_score', type: 'number',  isOptional: true },
      { name: 'synced',          type: 'boolean' },
    ]}),
    tableSchema({ name: 'day_intentions', columns: [
      { name: 'user_id',     type: 'string' },
      { name: 'target_mood', type: 'string' },
      { name: 'date',        type: 'string' },
      { name: 'playlist_id', type: 'string', isOptional: true },
      { name: 'synced',      type: 'boolean' },
    ]}),
  ],
});
