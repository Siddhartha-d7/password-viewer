const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env');
const configDir = path.join(__dirname, '..', 'config');
const secretsPath = path.join(configDir, 'secrets.js');

function buildConfig() {
  console.log('Generating local secrets file from .env...');

  // Ensure config directory exists
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }

  let envData = '';
  if (fs.existsSync(envPath)) {
    envData = fs.readFileSync(envPath, 'utf8');
  } else {
    console.warn('.env file not found! Falling back to empty configuration.');
  }

  const lines = envData.split(/\r?\n/);
  const config = {};

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines or comments
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const index = trimmed.indexOf('=');
    if (index !== -1) {
      const key = trimmed.substring(0, index).trim();
      let value = trimmed.substring(index + 1).trim();

      // Remove surrounding quotes if any
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }

      // Convert truthy string values to booleans
      if (value.toLowerCase() === 'true') {
        config[key] = true;
      } else if (value.toLowerCase() === 'false') {
        config[key] = false;
      } else {
        config[key] = value;
      }
    }
  }

  // Generate Javascript ESM content
  const secretsContent = `// Automatically generated from .env. Do not edit directly.
export const SECRETS = ${JSON.stringify(config, null, 2)};
`;

  fs.writeFileSync(secretsPath, secretsContent, 'utf8');
  console.log(`Successfully generated secrets file at: ${secretsPath}`);
}

try {
  buildConfig();
} catch (error) {
  console.error('Failed to generate secrets config file:', error);
  process.exit(1);
}
