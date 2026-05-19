const sqlite = require('./db');

async function initDatabase() {
  await sqlite.init();
}

module.exports = {
  initDatabase,
};
