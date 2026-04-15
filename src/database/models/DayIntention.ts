import { Model } from '@nozbe/watermelondb';
import { field, text } from '@nozbe/watermelondb/decorators';

export default class DayIntention extends Model {
  static table = 'day_intentions';

  @text('user_id') userId: string;
  @text('target_mood') targetMood: string;
  @text('date') date: string;
  @text('playlist_id') playlistId?: string;
  @field('synced') synced: boolean;
}
