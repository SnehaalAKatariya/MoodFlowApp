import { Model } from '@nozbe/watermelondb';
import { field, text, json } from '@nozbe/watermelondb/decorators';

export default class User extends Model {
  static table = 'users';

  @text('supabase_id') supabaseId: string;
  @text('wake_time') wakeTime: string;
  @text('sleep_time') sleepTime: string;
  @field('check_in_interval_h') checkInIntervalH: number;
  @text('timezone') timezone: string;
  @field('synced_at') syncedAt: number;
  
  // Storing anchor moods as a JSON string
  @json('anchor_moods', (raw) => {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }) anchorMoods: string[];
  
  @field('onboarding_done') onboardingDone: boolean;
}
