const express = require('express');
const session = require('express-session');
const passport = require('passport');
const ActiveDirectoryStrategy = require('passport-activedirectory');
const { Pool } = require('pg');
const Redis = require('redis');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const redisClient = Redis.createClient({ url: process.env.REDIS_URL });

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new ActiveDirectoryStrategy({
    integrated: false,
    ldap: {
        url: process.env.AD_URL,
        baseDN: process.env.AD_BASE_DN,
        username: process.env.AD_USERNAME,
        password: process.env.AD_PASSWORD,
    }
}, (profile, done) => done(null, profile)));

app.get('/api/data', async (req, res) => {
    const { rows } = await pool.query('SELECT * FROM data');
    res.json(rows);
});

app.listen(3000, () => console.log('API running on port 3000'));
