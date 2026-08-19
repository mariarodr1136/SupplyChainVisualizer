/*
 * Regenerates the landing-page product screenshots.
 *
 * Drives the already-installed Chrome over the DevTools Protocol (no npm
 * deps) at 1360x850 with deviceScaleFactor 2, matching the 2720x1700 the
 * previous assets were captured at. Guest mode and the theme are both plain
 * localStorage keys, so each shot is just: seed storage -> navigate -> settle
 * -> capture.
 */
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333;
const ORIGIN = 'http://localhost:3000';
const OUT_DIR = process.argv[2];
const WIDTH = 1360;
const HEIGHT = 850;
const SCALE = 2;

const PAGES = [
  { name: 'dashboard', path: '/', settle: 2000 },
  { name: 'map', path: '/map', settle: 5000 },
  { name: 'shipments', path: '/shipments', settle: 1500 },
  { name: 'analytics', path: '/analytics', settle: 1500 },
];
const THEMES = ['light', 'dark'];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForDevTools() {
  for (let i = 0; i < 60; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/version`);
      if (res.ok) return (await res.json()).webSocketDebuggerUrl;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('Chrome DevTools endpoint never came up');
}

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.id = 0;
    this.pending = new Map();
    this.listeners = [];
    ws.addEventListener('message', (ev) => {
      const msg = JSON.parse(ev.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      } else if (msg.method) {
        this.listeners.forEach((fn) => fn(msg));
      }
    });
  }

  send(method, params = {}, sessionId) {
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) }));
    });
  }

  once(method, sessionId) {
    return new Promise((resolve) => {
      const fn = (msg) => {
        if (msg.method === method && (!sessionId || msg.sessionId === sessionId)) {
          this.listeners = this.listeners.filter((l) => l !== fn);
          resolve(msg.params);
        }
      };
      this.listeners.push(fn);
    });
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  const profile = mkdtempSync(join(tmpdir(), 'nexus-shots-'));

  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    `--window-size=${WIDTH},${HEIGHT}`,
    '--hide-scrollbars',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-extensions',
    '--force-color-profile=srgb',
    'about:blank',
  ], { stdio: 'ignore' });

  const browserWs = await waitForDevTools();
  const ws = new WebSocket(browserWs);
  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve, { once: true });
    ws.addEventListener('error', reject, { once: true });
  });
  const cdp = new CDP(ws);

  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });

  await cdp.send('Page.enable', {}, sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride', {
    width: WIDTH,
    height: HEIGHT,
    deviceScaleFactor: SCALE,
    mobile: false,
  }, sessionId);

  const goto = async (url, settle) => {
    const loaded = cdp.once('Page.loadEventFired', sessionId);
    await cdp.send('Page.navigate', { url }, sessionId);
    await loaded;
    await sleep(settle);
  };

  // Land on the origin once so localStorage is writable for it.
  await goto(`${ORIGIN}/`, 300);

  for (const theme of THEMES) {
    for (const page of PAGES) {
      await cdp.send('Runtime.evaluate', {
        expression: `
          localStorage.setItem('user', JSON.stringify({ id: 'guest', username: 'Guest', isGuest: true }));
          localStorage.setItem('nexus-theme', ${JSON.stringify(theme)});
        `,
      }, sessionId);

      await goto(ORIGIN + page.path, page.settle);

      const { data } = await cdp.send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: false,
        optimizeForSpeed: false,
      }, sessionId);

      const file = join(OUT_DIR, `${page.name}-${theme}.png`);
      writeFileSync(file, Buffer.from(data, 'base64'));
      console.log(`captured ${page.name}-${theme}.png`);
    }
  }

  await cdp.send('Target.closeTarget', { targetId });
  ws.close();
  chrome.kill();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
