// Grava o vídeo "como funciona" do site em tela de celular (390x844), com legendas.
// Uso: rode o site em modo demonstração desligado (build com NEXT_PUBLIC_DEMO=false) na porta 3400 e:
//   node scripts/gravar-video.cjs <pasta-saida>
// Depois converta com ffmpeg para public/videos/como-funciona.mp4 (ver README).
// Grava o passo a passo do site em tela de celular, com legendas e indicador de toque.
const { chromium } = require('playwright');
const BASE = 'http://localhost:3400';
const W = 390, H = 844;

const OVERLAY = () => {
  if (window.__capInit) return; window.__capInit = true;
  const mk = () => {
    if (document.getElementById('__cap')) return;
    const st = document.createElement('style');
    st.textContent = `#__cap{position:fixed;left:12px;right:12px;top:14px;pointer-events:none;z-index:99999;background:rgba(116,122,70,.96);color:#fff;
      font:600 17px/1.3 Montserrat,system-ui,sans-serif;padding:12px 16px;border-radius:16px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,.25);
      transition:opacity .35s, transform .35s;opacity:0;transform:translateY(-8px)}
      #__cap.on{opacity:1;transform:none}
      #__tap{position:fixed;z-index:99998;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;background:rgba(255,255,255,.55);
      border:3px solid rgba(116,122,70,.95);pointer-events:none;opacity:0;transform:scale(.4);transition:opacity .2s, transform .35s}
      #__tap.on{opacity:1;transform:scale(1)}
      nextjs-portal{display:none!important}`;
    document.head.appendChild(st);
    const c = document.createElement('div'); c.id = '__cap'; document.body.appendChild(c);
    const t = document.createElement('div'); t.id = '__tap'; document.body.appendChild(t);
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', mk) : mk();
  window.__cap = (txt) => { mk(); const c = document.getElementById('__cap'); if (!txt) { c.classList.remove('on'); return; } c.textContent = txt; c.classList.add('on'); };
  window.__tap = (x, y) => { mk(); const t = document.getElementById('__tap'); t.style.left = x + 'px'; t.style.top = y + 'px'; t.classList.add('on'); setTimeout(() => t.classList.remove('on'), 650); };
};

(async () => {
  const b = await chromium.launch({ args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
  const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 1, isMobile: true, hasTouch: true,
    recordVideo: { dir: process.argv[2], size: { width: W, height: H } } });
  await ctx.addInitScript(OVERLAY);
  const p = await ctx.newPage();
  const wait = (ms) => p.waitForTimeout(ms);
  const cap = (t) => p.evaluate((t) => window.__cap(t), t);
  async function tap(loc) {
    await loc.scrollIntoViewIfNeeded();
    await wait(350);
    const bb = await loc.boundingBox();
    await p.evaluate(([x, y]) => window.__tap(x, y), [bb.x + bb.width / 2, bb.y + bb.height / 2]);
    await wait(450);
    await loc.click();
  }
  async function smoothScrollTo(y, ms = 1200) {
    await p.evaluate(([y, ms]) => new Promise((r) => { const y0 = scrollY, t0 = performance.now();
      const f = (now) => { const k = Math.min(1, (now - t0) / ms); const e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; scrollTo(0, y0 + (y - y0) * e); k < 1 ? requestAnimationFrame(f) : r(); }; requestAnimationFrame(f); }), [y, ms]);
  }

  // 0. capa
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.evaluate(() => localStorage.clear());
  await wait(2600);
  await cap('Bem-vindo ao Chá dos Noivos da Kaw e do Than!');
  await wait(2200);
  // 1. lista
  await cap('1. Toque em “Ver a lista de presentes”');
  await tap(p.getByRole('link', { name: 'Ver a lista de presentes' }).first());
  await p.waitForURL('**/presentes');
  await wait(1800);
  await cap('A casinha mostra o que já foi escolhido. Ninguém vê quem deu.');
  await wait(2400);
  // 2. escolher
  await cap('2. Escolha um presente (pode ser mais de um!)');
  const card = p.locator('[data-gift="airfryer"]');
  const y = await card.evaluate((el) => el.getBoundingClientRect().top + scrollY - 140);
  await smoothScrollTo(y, 1800);
  await wait(800);
  await tap(card.getByRole('button', { name: /Escolher este presente/ }));
  await wait(700);
  // 3. nome
  await cap('3. Coloque seu nome');
  await p.getByRole('textbox', { name: 'Seu nome' }).pressSequentially('Tia Lúcia', { delay: 110 });
  await wait(500);
  await tap(p.getByRole('button', { name: 'Continuar' }));
  await wait(700);
  // 4. confirmar
  await cap('4. Confirme. Os noivos não vão saber que foi você.');
  await wait(1600);
  await tap(p.getByRole('dialog').getByRole('button', { name: 'Confirmar' }));
  await cap('Pronto! O presente entra na casinha.');
  await wait(5200);
  // 5. dúvida
  await cap('Dúvida sobre cor ou modelo? Fale com a Rayssa pelo WhatsApp.');
  const fab = p.getByRole('link', { name: /Fale com a Rayssa/ });
  if (await fab.count()) { const bb = await fab.boundingBox(); await p.evaluate(([x, y]) => window.__tap(x, y), [bb.x + bb.width / 2, bb.y + bb.height / 2]); }
  await wait(2800);
  // 6. recado
  await cap('5. Quer deixar um recado para a Kawany?');
  await p.goto(BASE + '/recado', { waitUntil: 'networkidle' });
  await cap('5. Quer deixar um recado para a Kawany?');
  await wait(1200);
  await tap(p.getByLabel('Recado'));
  await p.getByLabel('Recado').pressSequentially('Que a casa de vocês seja cheia de amor e de café!', { delay: 45 });
  await wait(400);
  await tap(p.getByRole('button', { name: 'Enviar recado' }));
  await wait(1200);
  await cap('O recado vai só para a noiva. Obrigada por fazer parte!');
  await wait(3000);
  await ctx.close();
  await b.close();
})();
