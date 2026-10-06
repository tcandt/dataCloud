import { randomBytes } from 'node:crypto';
import { access, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createInterface, emitKeypressEvents } from 'node:readline';
import { pathToFileURL } from 'node:url';
import { isIP } from 'node:net';

function bounded(value, label, maximum = 256) {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || /[\x00-\x1f\x7f]/.test(value)) throw new Error(`Invalid ${label}`);
  return value.trim();
}

export async function configureNas(directory, input) {
  const deploymentMode = input.deploymentMode ?? 'local';
  if (!['local', 'external'].includes(deploymentMode)) throw new Error('Invalid deployment mode');
  const external = deploymentMode === 'external';
  const authMode = input.authMode ?? 'mixed';
  if (!['mixed', 'google-only'].includes(authMode)) throw new Error('Invalid authentication mode');
  const googleOnly = authMode === 'google-only';
  const googleClientId = input.googleClientId?.trim() || '';
  const googleClientSecret = input.googleClientSecret?.trim() || '';
  if (googleOnly || googleClientId || googleClientSecret) {
    bounded(googleClientId, 'Google client ID', 1024);
    bounded(googleClientSecret, 'Google client secret', 4096);
  }
  const smtp = input.smtp;
  if (smtp) {
    if (!/^[a-zA-Z0-9.-]+$/.test(bounded(smtp.host, 'SMTP host', 253))) throw new Error('Invalid SMTP host');
    if (![465, 587].includes(smtp.port)) throw new Error('Use SMTP port 465 (TLS) or 587 (STARTTLS)');
    if (!/^[^@\s<>'"]+@[^@\s<>'"]+\.[^@\s<>'"]+$/.test(bounded(smtp.from, 'SMTP sender', 254))) throw new Error('Use a plain SMTP sender email address');
    bounded(smtp.user, 'SMTP username', 320);
    bounded(smtp.password, 'SMTP password', 4096);
  }
  const integrations = googleOnly || Boolean(googleClientId) || Boolean(smtp);
  const allowedHosts = input.allowedHosts ?? (external ? '' : 'documentdb');
  if (typeof allowedHosts !== 'string' || allowedHosts.length > 4096 || (allowedHosts && allowedHosts.split(',').some(host => !isIP(host) && !/^(?=.{1,253}$)[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?$/.test(host)))) throw new Error('Use comma-separated database hostnames or IP addresses without spaces or ports');
  const origin = new URL(input.origin);
  if (origin.protocol !== 'https:' || origin.origin !== input.origin || origin.username || origin.password) throw new Error('Use an exact HTTPS website origin');
  const email = bounded(input.email, 'owner email', 254).toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Invalid owner email');
  if (!googleOnly && (typeof input.password !== 'string' || input.password.length < 12 || input.password.length > 256 || Buffer.byteLength(input.password) > 1024 || /[\x00-\x1f\x7f]/.test(input.password))) throw new Error('Owner password must contain 12 to 256 characters');
  const name = bounded(input.name, 'owner name', 100);
  const organizationName = bounded(input.organizationName, 'organization name', 100);
  const dataDirectory = external ? './data' : bounded(input.mongoDataDirectory, 'MongoDB data directory', 2048);
  if (/["'$`\\]/.test(dataDirectory)) throw new Error('MongoDB data directory must be a Linux path without quotes, backslashes or variable substitution');
  const absoluteDataPath = dataDirectory.startsWith('/') || /^[A-Za-z]:\//.test(dataDirectory);
  if (!external && input.existingMongo && (!absoluteDataPath || !input.mongoPassword)) throw new Error('An existing MongoDB database requires its absolute data path and existing password');
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
    ...(!external ? { mongo_password: mongoPassword } : {}),
    database_url: `postgresql://control_plane:${pgPassword}@postgres:5432/control_plane?sslmode=verify-full`,
    vault_keys: `v1:${randomBytes(32).toString('base64')}`,
    owner_config: JSON.stringify({ email, name, ...(!googleOnly ? { password: input.password } : {}), organizationName, authMode }),
    ...(!external ? { mongo_uri: `mongodb://docdbadmin:${encodeURIComponent(mongoPassword)}@documentdb:27017/?authSource=admin&tls=true&directConnection=true` } : {}),
    tunnel_token: token,
    ...(integrations ? { google_client_id: googleClientId, google_client_secret: googleClientSecret, smtp_user: smtp?.user || '', smtp_password: smtp?.password || '', smtp_ca: '' } : {}),
  };
  // The private host directory protects files readable by container UIDs.
  // Compose bind-backed secret mounts do not honor an overridden UID or mode.
  for (const [file, value] of Object.entries(records)) await writeFile(resolve(secrets, file), value ? `${value}\n` : '', { flag: 'wx', mode: 0o444 });
  await writeFile(resolve(directory, '.env'), [
    `PUBLIC_ORIGIN=${origin.origin}`, `PUBLIC_HOST=${origin.hostname}`, `WEB_BIND_IP=${bindIp}`,
    'WEB_PORT=8081', 'HTTPS_PORT=8443', ...(!external ? [`MONGO_DATA_DIR="${dataDirectory}"`] : []), 'APP_TAG=0.1.7',
    `DEPLOYMENT_MODE=${deploymentMode}`, 'DATACLOUD_EDITION=selfhost', 'COMPOSE_PATH_SEPARATOR=:', `COMPOSE_FILE=${external ? 'compose.external.yaml' : 'compose.yaml'}${integrations ? ':compose.integrations.yaml' : ''}`,
    `AUTH_MODE=${authMode}`,
    ...(smtp ? [`SMTP_HOST=${smtp.host}`, `SMTP_PORT=${smtp.port}`, `SMTP_SECURE=${smtp.port === 465}`, `SMTP_FROM='${smtp.from}'`] : []),
    `DATABASE_ALLOWED_HOSTS=${allowedHosts}`, 'DATABASE_ALLOW_PRIVATE=true', '',
  ].join('\n'), { flag: 'wx', mode: 0o600 });
  return { origin: origin.origin, email, deploymentMode, authMode, emailConfigured: Boolean(smtp), tunnelConfigured: Boolean(token) };
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
  const authAnswer = (await prompt('Google-only sign-in or password/Google sign-in? [G/m]: ')).trim().toLowerCase();
  if (!['', 'g', 'm'].includes(authAnswer)) throw new Error('Choose G for Google-only or m for mixed sign-in');
  const authMode = authAnswer === 'm' ? 'mixed' : 'google-only';
  let password, googleClientId, googleClientSecret;
  if (authMode === 'google-only') {
    process.stdout.write(`Use the owner's actual Google email. OAuth callback: ${origin}/api/v1/auth/google/callback\n`);
    googleClientId = (await prompt('Google web OAuth client ID: ')).trim();
    googleClientSecret = await prompt('Google web OAuth client secret (hidden): ', true);
  } else {
    password = await prompt('Owner password (12+ characters, hidden): ', true);
    if (password !== await prompt('Confirm owner password (hidden): ', true)) throw new Error('Passwords do not match');
  }
  const name = (await prompt('Owner name [Administrator]: ')).trim() || 'Administrator';
  const organizationName = (await prompt('Organization name [DataCloud]: ')).trim() || 'DataCloud';
  const modeAnswer = (await prompt('Manage external databases only, or include a local starter MongoDB? [E/l]: ')).trim().toLowerCase();
  if (!['', 'e', 'l'].includes(modeAnswer)) throw new Error('Choose E for external databases or l for local MongoDB');
  const deploymentMode = modeAnswer === 'l' ? 'local' : 'external';
  const existingMongo = deploymentMode === 'local' && (await prompt('Reuse the existing MongoDB data directory? [y/N]: ')).trim().toLowerCase() === 'y';
  const mongoDataDirectory = deploymentMode === 'local' ? (await prompt(existingMongo ? 'Existing MongoDB absolute path (Linux/macOS /path or Windows C:/path): ' : 'New MongoDB data directory [./data]: ')).trim() || (existingMongo ? '' : './data') : undefined;
  const mongoPassword = existingMongo ? await prompt('Existing MongoDB password (hidden): ', true) : '';
  const allowedHosts = deploymentMode === 'external' ? (await prompt('Approved database hostnames/IPs, comma separated (blank configures later): ')).trim() : 'documentdb';
  const tunnelToken = await prompt('Cloudflare tunnel token (hidden; blank keeps tunnel disabled): ', true);
  let smtp;
  if ((await prompt('Configure SMTP verification/notification delivery? [y/N]: ')).trim().toLowerCase() === 'y') {
    smtp = {
      host: (await prompt('SMTP hostname: ')).trim(),
      port: Number((await prompt('SMTP port: 465 TLS or 587 STARTTLS [465]: ')).trim() || '465'),
      from: (await prompt('Approved sender email: ')).trim(),
      user: (await prompt('SMTP username (hidden): ', true)).trim(),
      password: await prompt('SMTP app password or provider credential (hidden): ', true),
    };
  }
  const bindAll = (await prompt('Publish local HTTPS port to NAS network? [y/N]: ')).trim().toLowerCase() === 'y';
  const result = await configureNas(directory, { origin, email, password, authMode, googleClientId, googleClientSecret, smtp, name, organizationName, deploymentMode, allowedHosts, mongoDataDirectory, mongoPassword, existingMongo, tunnelToken, bindIp: bindAll ? '0.0.0.0' : '127.0.0.1' });
  process.stdout.write(`Configuration ready for ${result.origin}; owner ${result.email}. Start with: sh deploy/nas/start.sh\n`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main().catch(error => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
});
