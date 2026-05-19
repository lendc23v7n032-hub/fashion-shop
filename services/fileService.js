const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');

// Lock management
const locks = {};

async function acquireLock(filename) {
  const lockFile = path.join(dataDir, `${filename}.lock`);
  const maxAttempts = 50;
  const delay = 50;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await fs.writeFile(lockFile, String(process.pid), { flag: 'wx' });
      locks[filename] = true;
      return true;
    } catch (err) {
      if (err.code === 'EEXIST') {
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw err;
    }
  }
  throw new Error(`Không thể acquire lock cho ${filename}`);
}

async function releaseLock(filename) {
  const lockFile = path.join(dataDir, `${filename}.lock`);
  try {
    await fs.unlink(lockFile);
    delete locks[filename];
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

// Read JSON file
async function readJSON(filename) {
  const file = path.join(dataDir, filename);
  try {
    const text = await fs.readFile(file, 'utf8');
    return JSON.parse(text || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

// Write JSON file
async function writeJSON(filename, data) {
  const file = path.join(dataDir, filename);
  const tempFile = path.join(dataDir, `${filename}.tmp`);
  try {
    await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf8');
    await fs.rename(tempFile, file);
  } catch (err) {
    try { await fs.unlink(tempFile); } catch (_) { }
    throw err;
  }
}

// Atomic transaction for multiple files
async function transaction(operations) {
  const filenames = operations.map(op => op.filename);
  const tempFiles = {};

  try {
    for (const filename of filenames) {
      await acquireLock(filename);
    }

    const reads = {};
    for (const op of operations) {
      reads[op.filename] = await readJSON(op.filename);
    }

    for (const op of operations) {
      const data = await op.mutate(reads[op.filename]);
      const tempFile = path.join(dataDir, `${op.filename}.tmp`);
      await fs.writeFile(tempFile, JSON.stringify(data, null, 2), 'utf8');
      tempFiles[op.filename] = tempFile;
    }

    for (const op of operations) {
      const file = path.join(dataDir, op.filename);
      const tempFile = tempFiles[op.filename];
      await fs.rename(tempFile, file);
    }

    return reads;
  } catch (err) {
    for (const filename of Object.keys(tempFiles)) {
      try { await fs.unlink(tempFiles[filename]); } catch (_) { }
    }
    throw err;
  } finally {
    for (const filename of filenames) {
      await releaseLock(filename);
    }
  }
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

module.exports = {
  readJSON,
  writeJSON,
  transaction,
  ensureDataDir,
};
