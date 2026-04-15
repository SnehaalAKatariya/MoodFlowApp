import { Platform } from 'react-native';
import { Database } from '@nozbe/watermelondb';
import schema from './schema';
import User from './models/User';
import MoodLog from './models/MoodLog';
import DayIntention from './models/DayIntention';

const modelClasses = [User, MoodLog, DayIntention];

function createDatabase(): Database {
  if (Platform.OS === 'web') {
    // Use LokiJS adapter for web (no native SQLite required)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const LokiJSAdapter = require('@nozbe/watermelondb/adapters/lokijs').default;
    const adapter = new LokiJSAdapter({
      schema,
      useWebWorker: false,
      useIncrementalIndexedDB: false,
      dbName: 'moodflow',
    });
    return new Database({ adapter, modelClasses });
  } else {
    // Use SQLite adapter for iOS / Android
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const SQLiteAdapter = require('@nozbe/watermelondb/adapters/sqlite').default;
    const adapter = new SQLiteAdapter({
      schema,
      jsi: true,
      onSetUpError: (error: Error) => {
        console.error('SQLiteAdapter setup error:', error);
      },
    });
    return new Database({ adapter, modelClasses });
  }
}

export const database = createDatabase();
