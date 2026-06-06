import { SECRETS } from './secrets.js';

/**
 * Persistently exports application-wide configuration parsed from environments.
 */
export const CONFIG = {
  API_KEY: SECRETS.EXTENSION_API_KEY || '',
  DEBUG: SECRETS.DEBUG_MODE !== undefined ? SECRETS.DEBUG_MODE : false,
};

if (CONFIG.DEBUG) {
  console.log('[PasswordViewer Config Loaded]', CONFIG);
}
