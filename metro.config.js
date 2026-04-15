// metro.config.js
// Ensures the web bundle never tries to load native-only packages
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// For web: alias native-only modules to empty shims
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    // WatermelonDB SQLite adapter tries to pull in better-sqlite3 on web → block it
    if (
      moduleName === 'better-sqlite3' ||
      moduleName.includes('watermelondb/adapters/sqlite/sqlite-node')
    ) {
      return { type: 'empty' };
    }
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
