const express = require('express');
const ssr = require('./ssr.js');

const app = express();
app.use(express.static('./dist', { index: false }));

app.get('*', async (req, res) => {
  const { html, ttRenderMs } = await ssr(
    `http://localhost:8081${req.originalUrl}?ssr=1`,
  );
  // Add Server-Timing! See https://w3c.github.io/server-timing/.
  res.set(
    'Server-Timing',
    `Prerender;dur=${ttRenderMs};desc="Headless render time (ms)"`,
  );
  return res.status(200).send(html); // Serve prerendered page as response.
});

app.listen(8080, () => console.log('SSR started 8080'));
