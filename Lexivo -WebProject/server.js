require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Minimal user model example for the server - create models/User.js if you need a full schema
// For now, this server file is a starting point. Move the User model to models/User.js as needed.
let User;
try { User = require('./models/User'); } catch (e) { console.warn('No models/User.js found yet. Create it to persist users.'); }

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

// connect to Mongo (if configured)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(()=> {
    console.log('MongoDB connected');
  }).catch(err => {
    console.error('MongoDB connection error', err);
  });
} else {
  console.log('MONGO_URI not set; skipping Mongo connection');
}

// Example signup/login endpoints (require models/User.js for persistence)
app.post('/api/signup', async (req, res) => {
  if (!User) return res.status(500).json({ error: 'User model missing on server' });
  try {
    const { username, email, password } = req.body;
    if (!email || !password || !username) return res.status(400).json({ error: 'username, email and password required' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, passwordHash: hash });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  if (!User) return res.status(500).json({ error: 'User model missing on server' });
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, ()=> console.log(`Server listening on ${PORT}`));
