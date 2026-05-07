const Datastore = require('nedb-promises');
const path = require('path');
const os = require('os');

// Use /tmp for Vercel compatibility
const dbPath = process.env.VERCEL ? os.tmpdir() : path.join(__dirname, '../data');

const db = {
  users: Datastore.create({ filename: path.join(dbPath, 'users.db'), autoload: true }),
  projects: Datastore.create({ filename: path.join(dbPath, 'projects.db'), autoload: true }),
  tasks: Datastore.create({ filename: path.join(dbPath, 'tasks.db'), autoload: true })
};

module.exports = db;
