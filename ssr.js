const puppeteer = require('puppeteer');

const RENDER_CACHE = new Map();

async function ssr(url) {
  if (RENDER_CACHE.has(url)) {
    console.info(`Headless rendered page ${url} in: 0 ms`);
    return { html: RENDER_CACHE.get(url), ttRenderMs: 0 };
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const start = Date.now();
  try {
    await page.goto(url, { waitUntil: 'networkidle0' });
  } catch (err) {
    console.error(err);
    throw new Error('page.goto/waitForSelector timed out.');
  }

  const html = await page.content();


  const ttRenderMs = Date.now() - start;
  console.info(`Headless rendered page ${url} in: ${ttRenderMs}ms`);

  await browser.close();

  RENDER_CACHE.set(url, html);

  return { html, ttRenderMs };
}

module.exports = ssr;