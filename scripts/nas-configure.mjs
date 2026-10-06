import { randomBytes } from 'node:crypto';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createInterface, emitKeypressEvents } from 'node:readline';
import { pathToFileURL } from 'node:url';

function bounded(value, label, maximum = 256) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[\x00-\x1f\x7f]/.test(value)) throw new Error(`Invalid ${label}`);
  return value.trim();
}

export async function configureNas(directory, input) {
  const origin = new URL(input.origin);
  if (origin.protocol !== 'https:' || origin.origin !== input.origin || origin.username || origin.password) throw new Error('Use an exact HTTPS website origin');
  const email = bounded(input.email, 'owner email', 254).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Invalid owner email');
  if (typeof input.password !== 'string' || input.password.length < 12 || input.password.length > 256 || Buffer.byteLength(input.password) > 1024 || /[\x00-\x1f\x7f]/.test(input.password)) throw new Error('Owner password must contain 12 to 256 characters');
  const name = bounded(input.name, 'owner name', 100);
  const organizationName = bounded(input.organizationName, 'organization name', 100);
  const dataDirectory = bounded(input.mongoDataDirectory, 'MongoDB data directory', 2048);
  if (/["'$`\\]/.test(dataDirectory)) throw new Error('MongoDB data directory must be a Linux path without quotes, backslashes or variable substitution');
  const absoluteDataPath = dataDirectory.startsWith('/') || /^[A-Za-z]:\//.test(dataDirectory);
  if (input.existingMongo && (!absoluteDataPath || !input.mongoPassword)) throw new Error('An existing MongoDB database requires its absolute data path and existing password');
  const mongoPassword = input.mongoPassword || randomBytes(32).toString('base64url');
  bounded(mongoPassword, 'MongoDB password', 256);
  const token = input.tunnelToken?.trim() || '';
  if (token && !/^[A-Za-z0-9_=+/.\-]+$/.test(token)) throw new Error('Invalid tunnel token');
  const bindIp = input.bindIp ?? '127.0.0.1';
  if (!['127.0.0.1', '0.0.0.0'].includes(bindIp)) throw new Error('Use loopback or all-interface host binding');
  const secrets = resolve(directory, 'secrets');
  for (const path of [resolve(directory, '.env'), secrets]) {
    const exists = await access(path).then(() => true, () => false);
    if (exists) throw new Error('NAS configuration already exists; existing secrets and vault keys were preserved');
  }
  await mkdir(directory, { recursive: true });
  await mkdir(secrets, { mode: 0o700 });
  const pgPassword = randomBytes(32).toString('base64url');
  const records = {
    postgres_password: pgPassword,
    mongo_password: mongoPassword,
    database_url: `postgresql://control_plane:${pgPassword}@postgres:5432/control_plane?sslmode=verify-full`,
    vault_keys: `v1:${randomBytes(32).toString('base64')}`,
    owner_config: JSON.stringify({ email, name, password: input.password, organizationName }),
    mongo_uri: `mongodb://docdbadmin:${encodeURIComponent(mongoPassword)}@documentdb:27017/?authSource=admin&tls=true&directConnection=true`,
    tunnel_token: token,
  };
  // The private host directory protects files readable by container UIDs.
  // Compose bind-backed secret mounts do not honor an overridden UID or mode.
  for (const [file, value] of Object.entries(records)) await writeFile(resolve(secrets, file), value ? `${value}\n` : '', { flag: 'wx', mode: 0o444 });
  await writeFile(resolve(directory, '.env'), [
    `PUBLIC_ORIGIN=${origin.origin}`, `PUBLIC_HOST=${origin.hostname}`, `WEB_BIND_IP=${bindIp}`,
    'WEB_PORT=8081', 'HTTPS_PORT=8443', `MONGO_DATA_DIR="${dataDirectory}"`, 'APP_TAG=0.1.1',
    'DATABASE_ALLOWED_HOSTS=documentdb', 'DATABASE_ALLOW_PRIVATE=true', '',
  ].join('\n'), { flag: 'wx', mode: 0o600 });
  return { origin: origin.origin, email, tunnelConfigured: Boolean(token) };
}

function prompt(label, hidden = false) {
  if (!hidden) {
    const readline = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolveAnswer => readline.question(label, answer => { readline.close(); resolveAnswer(answer); }));
  }
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new Error('Use an interactive terminal to enter secrets');
  process.stdout.write(label);
  emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.resume();
  return new Promise((resolveAnswer, reject) => {
    let answer = '';
    function finish(error) {
      process.stdin.off('keypress', keypress);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write('\n');
      if (error) reject(error); else resolveAnswer(answer);
    }
    function keypress(character, key) {
      if (key?.ctrl && key.name === 'c') return finish(new Error('Configuration cancelled'));
      if (key?.name === 'return' || key?.name === 'enter') return finish();
      if (key?.name === 'backspace') answer = Array.from(answer).slice(0, -1).join('');
      else if (character && !key?.ctrl && !key?.meta && !/[\x00-\x1f\x7f]/.test(character)) answer += character;
    }
    process.stdin.on('keypress', keypress);
  });
}

async function main() {
  const directory = resolve(process.cwd(), 'deploy/nas');
  process.stdout.write('DataCloud Docker configuration (AMD64 / ARM64). Existing settings will never be overwritten.\n');
  const origin = (await prompt('Website HTTPS origin [https://localhost:8443]: ')).trim() || 'https://localhost:8443';
  const email = (await prompt('Owner email (required): ')).trim();
  const password = await prompt('Owner password (12+ characters, hidden): ', true);
  if (password !== await prompt('Confirm owner password (hidden): ', true)) throw new Error('Passwords do not match');
  const name = (await prompt('Owner name [Administrator]: ')).trim() || 'Administrator';
  const organizationName = (await prompt('Organization name [DataCloud]: ')).trim() || 'DataCloud';
  const existingMongo = (await prompt('Reuse the existing MongoDB data directory? [Y/n]: ')).trim().toLowerCase() !== 'n';
  const mongoDataDirectory = (await prompt(existingMongo ? 'Existing MongoDB absolute path (Linux/macOS /path or Windows C:/path): ' : 'New MongoDB data directory [./data]: ')).trim() || (existingMongo ? '' : './data');
  const mongoPassword = await prompt('Existing MongoDB password (hidden; blank generates one for a NEW database): ', true);
  const tunnelToken = await prompt('Cloudflare tunnel token (hidden; blank keeps tunnel disabled): ', true);
  const bindAll = (await prompt('Publish local HTTPS port to NAS network? [y/N]: ')).trim().toLowerCase() === 'y';
  const result = await configureNas(directory, { origin, email, password, name, organizationName, mongoDataDirectory, mongoPassword, existingMongo, tunnelToken, bindIp: bindAll ? '0.0.0.0' : '127.0.0.1' });
  process.stdout.write(`Configuration ready for ${result.origin}; owner ${result.email}. Start with: sh deploy/nas/start.sh\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
