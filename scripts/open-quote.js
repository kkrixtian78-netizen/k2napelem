import net from 'node:net';
import { exec } from 'node:child_process';

const url = 'http://127.0.0.1:4321/arajanlat';

function openBrowser() {
  exec('start "" "' + url + '"');
}

function wait(left) {
  const socket = net.connect({ host: '127.0.0.1', port: 4321 });
  let settled = false;
  const finish = (ok) => {
    if (settled) return;
    settled = true;
    socket.destroy();
    if (ok) {
      openBrowser();
      return;
    }
    if (left <= 0) return;
    setTimeout(() => wait(left - 1), 500);
  };
  socket.setTimeout(1000);
  socket.once('connect', () => finish(true));
  socket.once('timeout', () => finish(false));
  socket.once('error', () => finish(false));
}

setTimeout(() => wait(120), 500);
