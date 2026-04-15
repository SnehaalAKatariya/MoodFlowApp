import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class MoodLog extends Model {
  static table = 'mood_logs';

  @text('user_id') userId: string;
  @field('mood_score') moodScore: number;
  @text('tag') tag?: string;
  @field('logged_at') loggedAt: number;
  @text('source') source: string;
  @field('follow_up_score') followUpScore?: number;
  @field('synced') synced: boolean;
}
