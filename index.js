require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const dns = require('dns');
const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const urlDatabase = new Map();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res) => {
  const { url } = req.body;
  dns.lookup(new URL(url).hostname, (err, address) => {
    if (err) {
      return res.json({
        error: 'invalid url',
      });
    } else {
      const shortId = nanoid(8);
      urlDatabase.set(shortId, url);
      res.json({
        original_url: url,
        short_url: shortId,
      });
    }
  });
});

app.get('/api/shorturl/:url', (req, res) => {
  const url = req.params.url;
  if (!urlDatabase.has(url)) {
    return res.json({
      error: 'invalid url',
    });
  } else {
    res.redirect(urlDatabase.get(url));
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
