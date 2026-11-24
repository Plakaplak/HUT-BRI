/* ---------- router + state UI ---------- */
const ROUTE_MODE = { beranda: 'p', daftar: 'p', tiket: 'p', hunt: 'p', leaderboard: 'p', scan: 'p', berhasil: 'p', 'k-splash': 'k', 'k-login': 'k', 'k-home': 'k', 'k-scan': 'k', 'k-data': 'k', 'k-berhasil': 'k', 'k-history': 'k', 'd-login': 'd', 'd-home': 'd', 'd-scan': 'd', 'd-input': 'd', 'd-berhasil': 'd', 'd-history': 'd', 'display-list': 'x', 'display-prize': 'x' };
let R = 'beranda', P = {};
const ui = { menu: false, modal: null, busy: false, msg: null, scanCat: 'sampah', last: null, lb: 'all', q: '', kSel: null, dSel: null, dPrize: null, dPhoto: null, hadir: 0, newWin: null, toast: null, pendingScroll: null };
const D = { reg: null, kl: { wa: '', pw: '' }, dl: { wa: '', pw: '' } };
function resetReg() { D.reg = { step: 0, pn: '', pw: '', nama: '', unit: '', email: '', hp: '', family: [], agree: false, err: {} }; }
resetReg();
const modeOf = r => ROUTE_MODE[r] || 'p';

function go(r, p) {
  R = r; P = p || {}; ui.menu = false; ui.msg = null; ui.busy = false;
  if (r !== 'scan' && r !== 'k-scan' && r !== 'd-scan') ui.q = '';
  try { if (location.hash !== '#' + r) location.hash = r; } catch (e) { }
  render(); window.scrollTo({ top: 0, behavior: 'instant' });
  const pc = $('.pscroll'); if (pc) pc.scrollTop = 0;
}
window.addEventListener('hashchange', () => { let r = ''; try { r = location.hash.slice(1); } catch (e) { } if (ROUTE_MODE[r] && r !== R) { R = r; P = {}; ui.menu = false; ui.msg = null; render(); window.scrollTo({ top: 0, behavior: 'instant' }); } });
function guard() {
  const m = modeOf(R);
  if (m === 'p') {
    if (R === 'tiket' && !S.user) R = 'daftar';
    else if (R === 'daftar' && S.user) R = 'tiket';
    else if ((R === 'scan' || R === 'berhasil') && !S.user) R = 'hunt';
    else if (R === 'berhasil' && !ui.last) R = 'hunt';
  } else if (m === 'k') {
    if (!S.kLogged && R !== 'k-splash' && R !== 'k-login') R = 'k-login';
    if (S.kLogged && (R === 'k-login' || R === 'k-splash')) R = 'k-home';
    if (R === 'k-data' && !ui.kSel) R = 'k-home';
  } else if (m === 'd') {
    if (!S.dLogged && R !== 'd-login') R = 'd-login';
    if (S.dLogged && R === 'd-login') R = 'd-home';
    if ((R === 'd-input' || R === 'd-berhasil') && !ui.dSel) R = 'd-home';
  }
}
function toast(msg) {
  ui.toast = msg; let el = $('#toast'); if (!el) return;
  el.textContent = msg; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 2600);
}
function vibrate(p) { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } }

/* ---------- kerangka umum ---------- */
function demoBar() {
  const m = modeOf(R);
  const md = [['p', 'Peserta', 'Peserta', 'beranda'], ['k', 'Petugas Kedatangan', 'Kedatangan', 'k-splash'], ['d', 'Petugas Doorprize', 'Doorprize', 'd-login'], ['x', 'Tampilan Pemenang', 'Pemenang', 'display-list']];
  return `<div class="demo"><span class="demo-tag hide-m">PROTOTIPE</span><nav class="demo-modes" aria-label="Mode demo">${md.map(([k, l, s, r]) => `<button class="pill ${m === k ? 'on' : ''}" data-go="${r}"><span class="demo-lbl-l">${l}</span><span class="demo-lbl-s">${s}</span></button>`).join('')}</nav><button class="demo-btn" data-act="guide" aria-label="Panduan uji">${ic('info', 18, 2)}<span class="hide-m">Panduan uji</span></button><button class="demo-btn" data-act="reset" aria-label="Reset data demo">${ic('refresh', 18, 2)}<span class="hide-m">Reset</span></button></div>`;
}
function btn(label, attrs, cls = 'btn-p', icon = '') { return `<button class="btn ${cls}" ${attrs}>${icon ? ic(icon, 18, 2.2) : ''}${label}</button>`; }
function brandRow(dark) { return `<div class="brand"><span class="im ${dark ? 'im-briW' : 'im-briB'}" role="img" aria-label="Bank BRI"></span><span class="im ${dark ? 'im-daW' : 'im-daD'}" role="img" aria-label="Danantara Indonesia"></span></div>`; }

function pHeader() {
  const u = S.user, on = r => R === r ? 'on' : '';
  const links = [['Beranda', 'data-go="beranda"', on('beranda')], ['Alur Registrasi', 'data-act="anchor" data-to="alur"', ''], ['Ketentuan', 'data-act="anchor" data-to="ketentuan"', ''], ['Scavenger Hunt', 'data-go="hunt"', (R === 'hunt' || R === 'leaderboard') ? 'on' : ''], ['Doorprize', 'data-go="display-list"', '']];
  const right = u ? `<button data-go="tiket" class="${on('tiket')}">Tiket Saya</button><button class="btn btn-p" style="min-height:42px;padding:0 18px" data-go="hunt">${ic('user', 16, 2.2)}${esc(u.nama.split(' ')[0])}</button>`
    : `<button data-go="daftar" style="color:var(--nav);font-weight:800">Masuk</button><button class="btn btn-p" style="min-height:42px;padding:0 20px" data-go="daftar">Daftar</button>`;
  return `<header class="hdr"><div class="wrap hdr-in">${brandRow(false)}<nav class="nav" aria-label="Menu utama">${links.map(([l, a, c]) => `<button ${a} class="${c}">${l}</button>`).join('')}${right}</nav><button class="burger" data-act="menu" aria-label="Menu" aria-expanded="${ui.menu}">${ic(ui.menu ? 'x' : 'menu', 26)}</button></div>
  <div class="mnav ${ui.menu ? 'open' : ''}">${links.map(([l, a]) => `<button ${a}>${l}${ic('chevR', 16)}</button>`).join('')}${u ? `<button data-go="tiket">Tiket Saya${ic('chevR', 16)}</button>` : `<button data-go="daftar" style="color:var(--nav)">Masuk / Daftar${ic('chevR', 16)}</button>`}</div></header>`;
}
function tabbar() {
  if (!['beranda', 'tiket', 'hunt', 'leaderboard'].includes(R)) return '';
  const t = (r, ic_, l) => `<button class="${R === r ? 'on' : ''}" data-go="${r}">${ic(ic_, 24)}${l}</button>`;
  return `<nav class="tabbar" aria-label="Navigasi bawah">${t('beranda', 'home', 'Beranda')}${t('hunt', 'target', 'Hunt')}<button class="scanbtn" data-go="scan" aria-label="Scan QR aktivitas"><span>${ic('scan', 28, 2.1)}</span></button>${t('leaderboard', 'trophy', 'Peringkat')}${t('tiket', 'ticket', 'Tiket')}</nav>`;
}
function pFooter() {
  return `<footer class="foot"><div class="wrap">${brandRow(true)}<div><b style="color:#fff">BRI 131 Anniversary</b><br>Tumbuh Berkelanjutan Membangun Negeri<br>16 Desember 2026 · Indonesia Arena, Jakarta</div></div></footer>`;
}

/* ---------- Beranda ---------- */
function vBeranda() {
  const u = S.user;
  const steps = [['globe', 'Registrasi', 'Buka halaman registrasi dari komputer atau ponsel Anda.'], ['menu', 'Halaman Home', 'Pilih Daftar di kanan atas (desktop) atau menu (ponsel).'], ['lock', 'Sign-Up', 'Isi PN 8 digit dan kata sandi BRIStars, email aktif (bukan email korporat), dan nomor HP.'], ['users', 'Daftarkan Keluarga', 'Tambahkan keluarga inti: Istri/Suami dan Anak 1 sampai 3.'], ['ticket', 'Ikuti Event', 'Klik Ikuti Event. Anda mendapat QR Code untuk scan kedatangan.'], ['shield', 'QR Code / Tiket', 'QR dikirim ke email. Wajib dibawa dan ditunjukkan saat hari H.']];
  return `${pHeader()}
  <section class="hero"><div class="hero-band"><div class="a im im-art3"></div><div class="l im im-131w" role="img" aria-label="Logo BRI 131 Anniversary"></div></div>
   <div class="wrap hero-in"><div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start">
     <span class="chip">${ic('trophy', 14, 2.2)} Puncak Perayaan HUT BRI ke-131</span>
     <h1>Tumbuh Berkelanjutan Membangun Negeri</h1>
     <p>Registrasi peserta untuk karyawan BRI dan keluarga inti. Daftar, tambahkan anggota keluarga, lalu simpan QR Code tiket untuk check-in di hari H. Selama acara, kumpulkan poin lewat Scavenger Hunt.</p>
     <div class="hero-meta"><span class="chip">${ic('calendar', 14, 2.2)} 16 Desember 2026</span><span class="chip">${ic('pin', 14, 2.2)} Indonesia Arena, Jakarta</span></div>
     <div class="hero-cta">${u ? btn('Tiket Saya', 'data-go="tiket"', 'btn-w', 'ticket') + btn('Scavenger Hunt', 'data-go="hunt"', 'btn-ow', 'target') : btn('Daftar Sekarang', 'data-go="daftar"', 'btn-w', 'arrowR') + btn('Lihat Alur Pendaftaran', 'data-act="anchor" data-to="alur"', 'btn-ow')}</div>
   </div><div class="hero-card"><div class="im im-art3"></div><div class="im im-kvt" role="img" aria-label="BRI 131 Anniversary, 16 Desember 2026, Indonesia Arena Jakarta"></div></div></div></section>
  <div class="wrap"><div class="info3">
   <div class="info"><span class="ibox">${ic('calendar', 24)}</span><div><small>Tanggal</small><b>Rabu, 16 Desember 2026</b></div></div>
   <div class="info"><span class="ibox">${ic('pin', 24)}</span><div><small>Lokasi</small><b>Indonesia Arena, Jakarta</b></div></div>
   <div class="info"><span class="ibox">${ic('users', 24)}</span><div><small>Peserta</small><b>Karyawan BRI &amp; keluarga inti</b></div></div></div></div>
  <section class="sec" id="sec-alur"><div class="wrap"><h2>Alur Registrasi Peserta</h2><p class="sub">Enam langkah dari registrasi hingga tiket di tangan Anda.</p>
   <div class="grid g3" style="margin-top:22px">${steps.map((s, i) => `<div class="step"><span class="eyebrow"><span class="ibox" style="width:40px;height:40px;border-radius:12px">${ic(s[0], 20)}</span>Langkah ${i + 1}</span><b>${s[1]}</b><p>${s[2]}</p></div>`).join('')}</div>
   <div style="margin-top:22px">${btn(u ? 'Lihat Tiket Saya' : 'Mulai Registrasi', `data-go="${u ? 'tiket' : 'daftar'}"`, 'btn-p', 'arrowR')}</div></div></section>
  <section class="sec" id="sec-ketentuan" style="background:#fff"><div class="wrap"><h2>Ketentuan peserta</h2><p class="sub">Pastikan Anda memenuhi ketentuan sebelum mendaftar.</p>
   <div class="grid g2" style="margin-top:22px"><div class="card" style="padding:22px"><h3 style="font-size:19px;font-weight:800;margin-bottom:6px">Peserta khusus pekerja</h3><div class="list-chk">${['Kantor Pusat', 'RO &amp; RAO Jakarta 1', 'RO &amp; RAO Jakarta 2', 'RO &amp; RAO Jakarta 3'].map(x => `<div><span style="color:var(--grn)">${ic('check', 20, 2.6)}</span>${x}</div>`).join('')}</div><p class="hint" style="margin-top:8px">Tidak termasuk area Kalimantan.</p></div>
   <div class="card" style="padding:22px"><h3 style="font-size:19px;font-weight:800;margin-bottom:6px">Saat hari H</h3><div class="list-chk">${[['ticket', 'QR Code registrasi wajib dibawa dan ditunjukkan, serta tidak diperkenankan disalahgunakan.'], ['scan', 'Petugas melakukan check-in dengan scan QR Code dan memvalidasi jumlah keluarga yang ikut.'], ['gift', 'Peserta mendapat snack saat registrasi, sesuai jumlah keluarga.']].map(x => `<div style="align-items:flex-start;font-weight:500;font-size:14px;line-height:1.55"><span style="color:var(--nav);margin-top:2px">${ic(x[0], 20)}</span>${x[1]}</div>`).join('')}</div></div></div></div></section>
  <section class="sec" id="sec-hunt"><div class="wrap"><div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between"><div><h2>Scavenger Hunt BRI 131</h2><p class="sub" style="max-width:560px">Scan QR di setiap aktivitas selama acara. Semakin banyak scan, semakin banyak poin, dan peringkat Anda tampil di leaderboard.</p></div>${btn('Lihat Leaderboard', 'data-go="leaderboard"', 'btn-p', 'trophy')}</div>
   <div class="grid g4" style="margin-top:22px">${CATS.map(c => `<button class="actcard" data-go="hunt"><span class="ibox">${ic(c.icon, 26)}</span><b>${c.title}</b><p>${c.desc}</p><span class="ptag">+${c.pts} poin / scan</span></button>`).join('')}</div></div></section>
  <section class="sec dark" id="sec-doorprize"><div class="wrap"><div style="display:flex;flex-wrap:wrap;gap:14px;align-items:flex-end;justify-content:space-between"><div><h2 style="color:#fff">Doorprize BRI 131 Anniversary</h2><p class="sub" style="color:#BFD4F5;max-width:560px">Pemenang diumumkan pada halaman ini setelah pengundian di acara puncak.</p></div>${btn('Lihat Daftar Pemenang', 'data-go="display-list"', 'btn-w', 'trophy')}</div>
   <div class="grid g5" style="margin-top:22px">${PRIZES.map(p => `<div class="dp"><span class="ibox">${ic(p.icon, 26)}</span>${p.title}</div>`).join('')}</div></div></section>
  ${pFooter()}`;
}

/* ---------- Registrasi ---------- */
function fld(label, key, o = {}) {
  const e = D.reg.err[key];
  return `<div class="field"><label for="f-${key}">${label}</label>${o.select ? `<select id="f-${key}" class="inp ${e ? 'err' : ''}" data-f="${key}"><option value="">Pilih unit kerja</option>${[...UNITS, 'Wilayah Kalimantan'].map(u => `<option ${D.reg[key] === u ? 'selected' : ''}>${u}</option>`).join('')}</select>`
    : `<input id="f-${key}" class="inp ${e ? 'err' : ''}" data-f="${key}" type="${o.type || 'text'}" ${o.mode ? `inputmode="${o.mode}"` : ''} ${o.max ? `maxlength="${o.max}"` : ''} ${o.ro ? 'readonly' : ''} autocomplete="${o.ac || 'off'}" placeholder="${o.ph || ''}" value="${esc(D.reg[key])}">`}${e ? `<div class="errtxt" role="alert">${esc(e)}</div>` : o.hint ? `<div class="hint">${o.hint}</div>` : ''}</div>`;
}
function vDaftar() {
  const r = D.reg, st = r.step, steps = ['Masuk', 'Data diri', 'Keluarga', 'Ikuti Event'];
  let body = '';
  if (st === 0) body = `<h1>Masuk dengan akun BRIStars</h1><p class="muted" style="margin-top:8px;font-size:14.5px">Gunakan PN 8 digit dan kata sandi BRIStars Anda.</p>${fld('PN (8 digit)', 'pn', { mode: 'numeric', max: 8, ph: 'contoh: 00012345' })}${fld('Kata sandi BRIStars', 'pw', { type: 'password', ac: 'current-password' })}<div class="note">${ic('info', 20, 2)}<div>Prototipe: PN dicek hanya 8 digit dan kata sandi tidak diperiksa. Untuk coba cepat, pakai akun demo.</div></div><div class="actions">${btn('Masuk', 'data-act="reg-next"', 'btn-p')}${btn('Pakai akun demo', 'data-act="reg-demo"', 'btn-o')}</div>`;
  else if (st === 1) { const known = DIRECTORY[r.pn]; body = `<h1>Data diri peserta</h1><p class="muted" style="margin-top:8px;font-size:14.5px">Gunakan email aktif yang bukan email korporat agar tiket mudah dibuka.</p>${fld('Nama karyawan', 'nama', { ro: !!known, hint: known ? 'Terisi otomatis dari BRIStars.' : '' })}${fld('Unit kerja', 'unit', { select: 1 })}${fld('Email aktif', 'email', { type: 'email', ph: 'nama@gmail.com', ac: 'email' })}${fld('Nomor HP aktif', 'hp', { type: 'tel', mode: 'tel', ph: '08xxxxxxxxxx', ac: 'tel' })}<div class="actions">${btn('Kembali', 'data-act="reg-back"', 'btn-o')}${btn('Lanjut', 'data-act="reg-next"', 'btn-p')}</div>`; }
  else if (st === 2) {
    const hasSp = r.family.some(f => f.rel === 'Istri/Suami'), kids = r.family.filter(f => f.rel === 'Anak').length;
    body = `<h1>Daftarkan keluarga inti</h1><p class="muted" style="margin-top:8px;font-size:14.5px">Istri/Suami dan Anak 1 sampai 3. Boleh dilewati jika datang sendiri.</p>
    ${r.family.map((f, i) => `<div class="fam"><span class="ibox" style="width:40px;height:40px;border-radius:12px">${ic('user', 20)}</span><div class="grow"><div class="hint" style="font-weight:700">${f.rel}</div><input class="inp" data-fam="${i}" placeholder="Nama lengkap" value="${esc(f.nama)}" autocomplete="off"></div><button class="xbtn" data-act="fam-del" data-i="${i}" aria-label="Hapus ${f.rel}">${ic('trash', 20)}</button></div>${r.err['fam' + i] ? `<div class="errtxt">${esc(r.err['fam' + i])}</div>` : ''}`).join('')}
    <div class="actions" style="margin-top:14px">${btn('Istri/Suami', 'data-act="fam-add" data-rel="Istri/Suami"' + (hasSp ? ' disabled' : ''), 'btn-o', 'plus')}${btn(`Anak (${kids}/3)`, 'data-act="fam-add" data-rel="Anak"' + (kids >= 3 ? ' disabled' : ''), 'btn-o', 'plus')}</div>
    <div class="actions">${btn('Kembali', 'data-act="reg-back"', 'btn-o')}${btn('Lanjut', 'data-act="reg-next"', 'btn-p')}</div>`;
  } else body = `<h1>Ikuti event ini</h1><p class="muted" style="margin-top:8px;font-size:14.5px">Periksa data Anda, lalu klik Ikuti Event untuk mendapat QR tiket.</p>
    <div style="margin-top:14px">${[['Nama', r.nama], ['PN', r.pn], ['Unit kerja', r.unit], ['Email', r.email], ['No. HP', r.hp], ['Keluarga', r.family.length ? r.family.map(f => `${esc(f.nama)} (${f.rel})`).join('<br>') : 'Tanpa keluarga']].map(x => `<div class="sumrow"><span>${x[0]}</span><b>${x[0] === 'Keluarga' ? x[1] : esc(x[1])}</b></div>`).join('')}</div>
    <label class="chk"><input type="checkbox" data-chk="agree" ${r.agree ? 'checked' : ''}><span>Saya memahami QR Code wajib dibawa saat hari H dan tidak boleh disalahgunakan.</span></label>${r.err.agree ? `<div class="errtxt" style="margin-top:6px">${esc(r.err.agree)}</div>` : ''}
    <div class="actions">${btn('Kembali', 'data-act="reg-back"', 'btn-o')}${btn('Ikuti Event', 'data-act="reg-next"', 'btn-p', 'ticket')}</div>`;
  return `${pHeader()}<main class="formcard"><div class="stepper" aria-label="Langkah ${st + 1} dari 4">${steps.map((s, i) => `<i class="${i <= st ? 'on' : ''}" title="${s}"></i>`).join('')}</div><div class="panel">${body}</div></main>`;
}

/* ---------- Tiket ---------- */
function vTiket() {
  const u = S.user, ci = checkinOf(u.pn), code = ticketCode(u.pn);
  return `${pHeader()}<main class="ticket"><div class="tk"><div class="tk-top"><div class="a im im-art3" style="opacity:.28"></div><span class="chip">${ic('ticket', 14, 2.2)} QR Code / Tiket</span><h1 style="font-size:26px;line-height:1.15;font-weight:800;margin-top:10px">BRI 131 Anniversary</h1><div style="font-size:14px;color:#DCEBFF;margin-top:4px">Rabu, 16 Desember 2026 · Indonesia Arena, Jakarta</div></div>
   <div class="tk-qr">${qrSvg(code)}</div><div class="tk-code">${code}</div>
   <div style="padding:14px 22px 22px"><div style="text-align:center;margin-bottom:6px">${ci ? `<span class="badge ok">${ic('check', 15, 2.8)} Sudah check-in · ${hhmm(ci.t)}</span>` : `<span class="badge wait">${ic('info', 15, 2.4)} Belum check-in</span>`}</div>
   ${[['Nama', u.nama], ['PN', u.pn], ['Unit kerja', u.unit], ['Keluarga terdaftar', u.family.length ? u.family.map(f => `${esc(f.nama)} (${f.rel})`).join('<br>') : 'Tanpa keluarga']].map(x => `<div class="sumrow"><span>${x[0]}</span><b>${x[0] === 'Keluarga terdaftar' ? x[1] : esc(x[1])}</b></div>`).join('')}</div></div>
   <div style="display:flex;flex-direction:column;gap:12px;margin-top:18px">${btn('Mulai Scavenger Hunt', 'data-go="hunt"', 'btn-p btn-l', 'target')}${btn('Lihat contoh email konfirmasi', 'data-act="email"', 'btn-o', 'mail')}<button data-act="logout" style="color:var(--mut);font-weight:700;font-size:14px;padding:12px">Keluar dari akun ini</button></div>
   <p class="hint" style="text-align:center;margin-top:6px">QR di prototipe adalah gambar contoh. Di sistem asli, QR ini yang dibaca petugas.</p></main>${pFooter()}`;
}
