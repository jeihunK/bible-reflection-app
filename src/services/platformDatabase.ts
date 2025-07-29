import { Platform } from 'react-native';
import { databaseService } from './database';
import { webDatabaseService } from './webDatabase';

// Export the appropriate database service based on platform
export const platformDatabase = Platform.OS === 'web' ? webDatabaseService : databaseService;