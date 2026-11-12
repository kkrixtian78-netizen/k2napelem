import http from 'node:http';
import { spawn } from 'node:child_process';

const url = 'http://127.0.0.1:4321/arajanlat';

function openBrowser() {
  const child =
    process.platform === 'win32'
      ? spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore', windowsHide: true })
      : spawn('xdg-open', [url], { detached: true, stdio: 'ignore' });
  child.unref();
}

function attempt(left) {
  const req = http.get(url, (res) => {
    res.resume();
    openBrowser();
  });
  req.setTimeout(2500, () => req.destroy());
  req.on('error', () => {
    if (left <= 0) return;
    setTimeout(() => attempt(left - 1), 1000);
  });
}

setTimeout(() => attempt(120), 1500);
