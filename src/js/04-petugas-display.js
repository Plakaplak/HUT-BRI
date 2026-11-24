/* ---------- kerangka aplikasi petugas (bingkai ponsel di desktop) ---------- */
const SIDE = {
  k: ['Aplikasi Petugas Kedatangan', 'Di desktop, aplikasi tampil dalam bingkai ponsel. Di HP tampil layar penuh. Coba: scan Kartika Sari (belum check-in), lalu scan lagi untuk melihat penolakan. Tiket Anda sendiri muncul di daftar setelah Anda mendaftar di mode Peserta.'],
  d: ['Aplikasi Petugas Doorprize', 'Hanya peserta yang sudah check-in yang bisa menerima hadiah, dan satu peserta satu hadiah (usulan aturan). Foto pemenang bersifat opsional di prototipe.'],
};
const shell = (inner, kind) => `<div class="shell"><div class="phone"><div class="pscroll">${inner}</div></div><aside class="shell-side"><h3>${SIDE[kind][0]}</h3><p>${SIDE[kind][1]}</p></aside></div>`;
function appHero(o = {}) {
  return `<div class="app-hero ${o.sm ? 'sm' : ''}"><div class="a im im-art3"></div><div class="l im im-131w" role="img" aria-label="Logo BRI 131 Anniversary"></div><div class="tb">${o.back ? `<button data-go="${o.back}" aria-label="Kembali">${ic('chevL', 24)}</button>` : '<span></span>'}${o.user ? `<span style="width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;color:#fff">${ic('user', 22)}</span>` : ''}</div></div>`;
}
const ro = (l, v, i) => `<div class="ro"><span class="ibox" style="width:40px;height:40px;border-radius:12px">${ic(i, 20)}</span><div><small>${l}</small><b>${esc(v)}</b></div></div>`;
const dfield = (label, path, o = {}) => { const [a, b] = path.split('.'); return `<div class="field"><label for="d-${a}${b}">${label}</label><input id="d-${a}${b}" class="inp ${o.err ? 'err' : ''}" data-d="${path}" type="${o.type || 'text'}" ${o.mode ? `inputmode="${o.mode}"` : ''} placeholder="${o.ph || ''}" value="${esc(D[a][b])}" autocomplete="${o.ac || 'off'}">${o.err ? `<div class="errtxt" role="alert">${esc(o.err)}</div>` : ''}</div>`; };
const emptyHero = (back) => appHero({ sm: true, back });
function scanBox(msgObj, cap) {
  return `<div class="ascan"><div class="vf ${ui.busy ? 'busy' : ''}" style="margin-top:18px" role="img" aria-label="Area pemindaian QR"><i class="cn c1"></i><i class="cn c2"></i><i class="cn c3"></i><i class="cn c4"></i><div class="ghost">${qrSvg('ghostA').replace('#0B2447', '#9ED3FF')}</div><div class="ln"></div></div><div class="vcap ${msgObj ? msgObj.t : ''}" role="status">${esc(ui.busy ? 'Memindai QR…' : msgObj ? msgObj.m : cap)}</div></div>`;
}
const pItem = (p, status, dis, act, extra = '') => `<button class="pitem" data-act="${act}" data-pn="${p.pn}" ${ui.busy ? 'disabled' : ''} ${dis ? 'aria-disabled="true"' : ''}><span class="av" style="width:40px;height:40px;font-size:16px">${esc(p.nama[0])}</span><div class="grow"><b>${esc(p.nama)}${p.me ? ' (Anda)' : ''}</b><small>${p.pn} · ${esc(p.unit)}</small></div>${status}</button>`;
const bdg = (c, t) => `<span class="badge ${c}" style="font-size:11.5px;padding:4px 9px">${t}</span>`;

/* ---------- Petugas Kedatangan ---------- */
function vKSplash() {
  return shell(`<div style="flex:1;position:relative;background:var(--sky);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;text-align:center;padding:30px;min-height:560px"><div class="im im-art3" style="position:absolute;inset:0"></div><div class="im im-131w" style="position:relative;width:210px;height:176px" role="img" aria-label="Logo BRI 131 Anniversary"></div><div style="position:relative;font-weight:800;font-size:28px;line-height:1.15">Scan Kedatangan</div><p style="position:relative;color:#DCEBFF;font-size:14px">Aplikasi petugas registrasi · BRI 131 Anniversary</p><button class="btn btn-w" style="position:relative;margin-top:14px;min-width:210px" data-go="k-login">Mulai</button></div>`, 'k');
}
function vKLogin() {
  const e = D.kl.err || {};
  return shell(`${emptyHero('k-splash')}<div class="app-body"><span class="eyebrow">Halaman login</span><h1>Login Petugas</h1>${dfield('Nomor WhatsApp', 'kl.wa', { type: 'tel', mode: 'tel', ph: '08xxxxxxxxxx', err: e.wa })}${dfield('Kata sandi', 'kl.pw', { type: 'password', ac: 'current-password', err: e.pw })}<div class="note">${ic('info', 20, 2)}<div>Prototipe: login tidak diperiksa. Isi sembarang nomor dan kata sandi, atau pakai akun demo.</div></div><div class="actions" style="margin-top:6px">${btn('Masuk', 'data-act="k-login"', 'btn-p')}${btn('Akun demo', 'data-act="k-demo"', 'btn-o')}</div></div>`, 'k');
}
function vKHome() {
  const reg = registered().length, ci = S.checkins.length, snack = S.checkins.reduce((a, c) => a + c.snack, 0);
  return shell(`${appHero({ user: 1 })}<div class="app-body"><div><span class="eyebrow">Halaman home</span><h1>Scan Kedatangan</h1></div>
   <div class="tile2"><button class="tile p" data-go="k-scan"><span class="ibox">${ic('scan', 30)}</span>Scan Kedatangan</button><button class="tile" data-go="k-history"><span class="ibox">${ic('history', 30)}</span>History Scan</button></div>
   <div class="kpis"><div class="kpi"><b>${reg}</b><small>TERDAFTAR</small></div><div class="kpi"><b>${ci}</b><small>CHECK-IN</small></div><div class="kpi"><b>${snack}</b><small>SNACK</small></div></div>
   <div class="art-card"><div class="a im im-art4"></div></div><button data-act="k-logout" class="row" style="color:var(--nav);font-weight:800;padding:8px 0;font-size:16px">${ic('logout', 22)}Keluar</button></div>`, 'k');
}
function kList() {
  const q = ui.q.trim().toLowerCase();
  const arr = registered().filter(p => !q || p.nama.toLowerCase().includes(q) || p.pn.includes(q));
  return arr.length ? arr.map(p => { const c = checkinOf(p.pn); return pItem(p, c ? bdg('ok', 'Check-in ' + hhmm(c.t)) : bdg('wait', 'Belum'), !!c, 'k-pick'); }).join('') : '<div class="empty">Peserta tidak ditemukan.</div>';
}
function vKScan() {
  const m = ui.msg;
  return shell(`<div class="ascan-wrap" style="flex:1;display:flex;flex-direction:column;background:#041A3F;color:#fff"><div class="scan-top"><button class="iconbtn" data-go="k-home" aria-label="Kembali">${ic('chevL', 26)}</button><b>SCAN KEDATANGAN</b></div>${scanBox(m, 'Arahkan kamera ke QR Code peserta')}</div><div class="sheet" style="margin-top:0"><h3>SIMULASI SCAN · PILIH PESERTA</h3><div class="sbox" style="margin:10px 0"><span>${ic('search', 18)}</span><input data-q="1" placeholder="Cari nama atau PN" value="${esc(ui.q)}" aria-label="Cari peserta"></div><div class="plist" id="plist">${kList()}</div><button class="linkbtn" data-act="badqr" style="display:block;margin:12px auto 0;color:var(--red);font-weight:700;font-size:13px">Coba scan QR yang tidak valid</button></div></div>`, 'k');
}
function vKData() {
  const p = registered().find(x => x.pn === ui.kSel), c = checkinOf(p.pn), fam = p.fam;
  return shell(`${emptyHero('k-scan')}<div class="app-body"><div><span class="eyebrow">Data peserta</span><h1>Validasi kedatangan</h1></div>${c ? `<div class="note warn">${ic('alert', 20, 2)}<div>Peserta ini sudah check-in pukul ${hhmm(c.t)}.</div></div>` : ''}
   ${ro('Nama karyawan', p.nama, 'user')}${ro('PN', p.pn, 'id')}${ro('Unit kerja', p.unit, 'pin')}
   <div class="card" style="padding:16px"><div class="row"><div class="grow"><b style="font-size:15px">Keluarga yang hadir</b><div class="hint">Terdaftar: ${fam} orang</div></div><div class="stepx"><button data-act="k-hadir" data-d="-1" aria-label="Kurangi">−</button><b id="hadir">${ui.hadir}</b><button data-act="k-hadir" data-d="1" aria-label="Tambah">+</button></div></div></div>
   <div class="row" style="background:var(--ice);border-radius:16px;padding:14px 16px">${ic('gift', 24)}<div class="grow"><b>Snack dibagikan</b><div class="hint">1 peserta + ${ui.hadir} keluarga</div></div><b style="font-size:26px;color:var(--nav)">${ui.hadir + 1}</b></div>
   <div style="margin-top:auto;padding-top:8px">${btn(c ? 'Sudah check-in' : 'Submit', 'data-act="k-submit"' + (c ? ' disabled' : ''), 'btn-p btn-l')}</div></div>`, 'k');
}
function vKBerhasil() {
  const c = checkinOf(ui.kSel);
  return shell(`<div class="ok-top" style="flex:none;padding-bottom:40px"><div class="a im im-art3"></div><div class="ok-circle">${ic('check', 46, 3)}</div><h1 style="font-size:28px;font-weight:800;margin-top:14px">Submit berhasil</h1><p style="color:#DCEBFF;margin-top:4px;font-size:14px">Check-in tercatat pukul ${c ? hhmm(c.t) : ''}</p></div>
   <div class="app-body"><div class="card" style="padding:6px 18px">${[['Nama', c.nama], ['Unit kerja', c.unit], ['Keluarga hadir', c.hadir + ' orang']].map(x => `<div class="sumrow"><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}<div class="sumrow"><span>Snack dibagikan</span><b style="font-size:22px;color:var(--nav)">${c.snack}</b></div></div>
   <div style="margin-top:auto;display:flex;flex-direction:column;gap:12px">${btn('Scan berikutnya', 'data-go="k-scan"', 'btn-p btn-l', 'scan')}${btn('Kembali ke home', 'data-go="k-home"', 'btn-o btn-l')}</div></div>`, 'k');
}
function vKHistory() {
  const arr = S.checkins.slice().sort((a, b) => b.t - a.t);
  return shell(`${emptyHero('k-home')}<div class="app-body"><div><span class="eyebrow">History scan</span><h1>${arr.length} peserta check-in</h1></div><div class="card" style="padding:4px 16px">${arr.map(c => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line)"><span class="av" style="width:40px;height:40px;font-size:16px">${esc(c.nama[0])}</span><div class="grow"><b style="font-size:15px;display:block;line-height:1.25">${esc(c.nama)}</b><span class="hint">${esc(c.unit)} · snack ${c.snack}</span></div><b style="color:var(--mut);font-size:13px">${hhmm(c.t)}</b></div>`).join('')}</div></div>`, 'k');
}

/* ---------- Petugas Doorprize ---------- */
function vDLogin() {
  const e = D.dl.err || {};
  return shell(`${appHero({ sm: true })}<div class="app-body"><span class="eyebrow">Pengambilan hadiah</span><h1>Login Petugas Doorprize</h1>${dfield('Nomor WhatsApp', 'dl.wa', { type: 'tel', mode: 'tel', ph: '08xxxxxxxxxx', err: e.wa })}${dfield('Kata sandi', 'dl.pw', { type: 'password', ac: 'current-password', err: e.pw })}<div class="note">${ic('info', 20, 2)}<div>Prototipe: login tidak diperiksa.</div></div><div class="actions" style="margin-top:6px">${btn('Masuk', 'data-act="d-login"', 'btn-p')}${btn('Akun demo', 'data-act="d-demo"', 'btn-o')}</div></div>`, 'd');
}
function vDHome() {
  return shell(`${appHero({ user: 1 })}<div class="app-body"><div><span class="eyebrow">Halaman home</span><h1>Pengambilan Doorprize</h1></div>
   <div class="tile2"><button class="tile p" data-go="d-scan"><span class="ibox">${ic('scan', 30)}</span>Scan Pemenang</button><button class="tile" data-go="d-history"><span class="ibox">${ic('history', 30)}</span>Riwayat Pemenang</button></div>
   <div class="card" style="padding:6px 16px"><div style="padding:10px 0 4px;font-weight:800">Kuota hadiah</div>${PRIZES.map(p => { const n = prizeCount(p.id); return `<div class="row" style="padding:10px 0;border-top:1px solid var(--line)"><span class="ibox" style="width:40px;height:40px;border-radius:12px">${ic(p.icon, 20)}</span><div class="grow"><b style="font-size:14.5px">${p.title}${p.sub ? ' · ' + p.sub : ''}</b><div class="prog" style="margin-top:4px"><i style="width:${Math.round(n / p.quota * 100)}%"></i></div></div><b style="color:var(--nav)">${n}/${p.quota}</b></div>`; }).join('')}</div>
   <button data-act="d-logout" class="row" style="color:var(--nav);font-weight:800;padding:8px 0;font-size:16px">${ic('logout', 22)}Keluar</button></div>`, 'd');
}
function dList() {
  const q = ui.q.trim().toLowerCase();
  const arr = registered().filter(p => !q || p.nama.toLowerCase().includes(q) || p.pn.includes(q));
  return arr.length ? arr.map(p => { const c = checkinOf(p.pn), w = winnerOf(p.pn); const st = w ? bdg('bad', 'Sudah menang') : c ? bdg('ok', 'Check-in') : bdg('wait', 'Belum check-in'); return pItem(p, st, !c || !!w, 'd-pick'); }).join('') : '<div class="empty">Peserta tidak ditemukan.</div>';
}
function vDScan() {
  const m = ui.msg;
  return shell(`<div style="flex:1;display:flex;flex-direction:column;background:#041A3F;color:#fff"><div class="scan-top"><button class="iconbtn" data-go="d-home" aria-label="Kembali">${ic('chevL', 26)}</button><b>SCAN PEMENANG</b></div>${scanBox(m, 'Arahkan kamera ke QR Code pemenang')}</div><div class="sheet" style="margin-top:0"><h3>SIMULASI SCAN · PILIH PESERTA</h3><div class="sbox" style="margin:10px 0"><span>${ic('search', 18)}</span><input data-q="1" placeholder="Cari nama atau PN" value="${esc(ui.q)}" aria-label="Cari peserta"></div><div class="plist" id="plist">${dList()}</div><button class="linkbtn" data-act="badqr" style="display:block;margin:12px auto 0;color:var(--red);font-weight:700;font-size:13px">Coba scan QR yang tidak valid</button></div></div>`, 'd');
}
function vDInput() {
  const p = registered().find(x => x.pn === ui.dSel), sel = ui.dPrize && PRZBY[ui.dPrize];
  return shell(`${emptyHero('d-scan')}<div class="app-body"><div><span class="eyebrow">Input data pemenang</span><h1>Pilih hadiah</h1></div>
   ${ro('Nama pemenang', p.nama, 'user')}${ro('Unit kerja', p.unit, 'pin')}
   <div style="display:flex;flex-direction:column;gap:8px">${PRIZES.map(z => { const left = z.quota - prizeCount(z.id); return `<button class="prizeopt ${ui.dPrize === z.id ? 'on' : ''}" data-act="d-prize" data-id="${z.id}" ${left <= 0 ? 'disabled' : ''} aria-pressed="${ui.dPrize === z.id}"><span class="ibox">${ic(z.icon, 22)}</span><div class="grow"><b>${z.title}${z.sub ? ' · ' + z.sub : ''}</b><small>${left > 0 ? `Sisa ${left} dari ${z.quota}` : 'Kuota habis'}</small></div>${ui.dPrize === z.id ? ic('check', 22, 2.8) : ''}</button>`; }).join('')}</div>
   <label class="photo"><input type="file" accept="image/*" capture="environment" hidden data-photo="1">${ui.dPhoto ? `<img src="${ui.dPhoto}" alt="Foto pemenang">` : `<span class="ph">${ic('camera', 28)}</span>`}<div class="grow"><b style="font-size:14.5px">${ui.dPhoto ? 'Foto terpilih. Ketuk untuk ganti' : 'Foto pemenang (opsional)'}</b><div class="hint">Ambil foto atau pilih dari galeri</div></div></label>
   <div style="margin-top:auto;padding-top:6px">${btn(sel ? 'Submit pemenang' : 'Pilih hadiah dulu', 'data-act="d-submit"' + (sel ? '' : ' disabled'), 'btn-p btn-l')}</div></div>`, 'd');
}
function vDBerhasil() {
  const w = ui.newWin, z = PRZBY[w.prize];
  return shell(`<div class="ok-top" style="flex:none;padding-bottom:40px"><div class="a im im-art3"></div><div class="ok-circle">${ic('check', 46, 3)}</div><h1 style="font-size:28px;font-weight:800;margin-top:14px">Pemenang tersimpan</h1><p style="color:#DCEBFF;margin-top:4px;font-size:14px">Data masuk ke tampilan pemenang</p></div>
   <div class="app-body"><div class="card" style="padding:6px 18px">${[['Pemenang', w.nama], ['Unit kerja', w.unit], ['Hadiah', z.title + (z.sub ? ' · ' + z.sub : '')]].map(x => `<div class="sumrow"><span>${x[0]}</span><b>${esc(x[1])}</b></div>`).join('')}${w.photo ? `<div class="sumrow"><span>Foto</span><img src="${w.photo}" alt="Foto pemenang" style="width:56px;height:56px;border-radius:12px;object-fit:cover"></div>` : ''}</div>
   <div style="margin-top:auto;display:flex;flex-direction:column;gap:12px">${btn('Input pemenang lain', 'data-go="d-scan"', 'btn-p btn-l', 'scan')}${btn('Lihat tampilan pemenang', `data-act="show-prize" data-id="${w.prize}"`, 'btn-o btn-l', 'trophy')}<button data-go="d-home" style="color:var(--nav);font-weight:800;padding:10px">Kembali ke home</button></div></div>`, 'd');
}
function vDHistory() {
  const arr = S.winners.slice().sort((a, b) => b.t - a.t);
  return shell(`${emptyHero('d-home')}<div class="app-body"><div><span class="eyebrow">Riwayat pemenang</span><h1>${arr.length} pemenang</h1></div><div class="card" style="padding:4px 16px">${arr.map(w => `<div class="row" style="padding:12px 0;border-bottom:1px solid var(--line)"><span class="ibox" style="width:40px;height:40px;border-radius:12px">${ic(PRZBY[w.prize].icon, 20)}</span><div class="grow"><b style="font-size:15px;display:block;line-height:1.25">${esc(w.nama)}</b><span class="hint">${PRZBY[w.prize].title} · ${esc(w.unit)}</span></div><b style="color:var(--mut);font-size:13px">${hhmm(w.t)}</b></div>`).join('')}</div></div>`, 'd');
}

/* ---------- Tampilan pemenang (publik) ---------- */
function winRows() {
  const sel = P.prize || ui.dPrize || 'mobil', q = ui.q.trim().toLowerCase();
  const arr = S.winners.filter(w => w.prize === sel).sort((a, b) => a.t - b.t).filter(w => !q || w.nama.toLowerCase().includes(q) || w.unit.toLowerCase().includes(q));
  const photos = S.winners.some(w => w.prize === sel && w.photo), big = isDesk();
  if (!arr.length) return '<div class="empty" style="background:#fff;border:1px solid var(--line);border-radius:20px">Belum ada pemenang untuk hadiah ini.</div>';
  return `<div class="tbl ${photos ? 'wp' : ''} ${big ? 'big' : ''}"><div class="th"><span>NO</span>${photos ? '<span></span>' : ''}<span>NAMA PEMENANG</span><span>UNIT KERJA</span></div>${arr.map((w, i) => `<div class="tr ${ui.newWin && ui.newWin.pn === w.pn && ui.newWin.fresh ? 'new' : ''}"><span style="color:var(--mut)">${i + 1}</span>${photos ? (w.photo ? `<img class="thm" src="${w.photo}" alt="">` : '<span class="thm"></span>') : ''}<b>${esc(w.nama)}</b><span>${esc(w.unit)}</span></div>`).join('')}</div>`;
}
function vDisplay() {
  const desk = isDesk(), sel = P.prize || ui.dPrize || 'mobil', z = PRZBY[sel];
  const showList = desk || R === 'display-list', showTbl = desk || R === 'display-prize';
  const list = `<div><h1 style="font-size:${desk ? 30 : 24}px;line-height:1.2;font-weight:800;letter-spacing:-.4px">Pemenang Doorprize<br>HUT BRI ke-131</h1><p class="muted" style="margin:8px 0 18px;font-size:14.5px">Pilih hadiah untuk melihat daftar pemenangnya.</p><div class="prizegrid">${PRIZES.map(p => `<button class="pz ${desk && p.id === sel ? 'on' : ''}" data-act="show-prize" data-id="${p.id}"><span class="ibox">${ic(p.icon, 30)}</span><div><b>${p.title}${p.sub ? ' · ' + p.sub : ''}</b><div><small>${prizeCount(p.id)}/${p.quota} pemenang</small></div></div></button>`).join('')}</div></div>`;
  const tbl = `<div><div class="row" style="margin-bottom:14px"><span class="ibox" style="width:56px;height:56px;border-radius:18px">${ic(z.icon, 30)}</span><h2 style="font-size:${desk ? 32 : 26}px;font-weight:800;letter-spacing:-.4px;line-height:1.1">${z.title}${z.sub ? ' · ' + z.sub : ''}</h2></div><div class="sbox" style="margin-bottom:14px"><span>${ic('search', 18)}</span><input data-q="w" placeholder="Cari nama atau unit" value="${esc(ui.q)}" aria-label="Cari pemenang"></div><div id="wtable">${winRows()}</div></div>`;
  return `<div class="dsp"><div class="dsp-hero"><div class="a im im-art3"></div><div class="l im im-131w" role="img" aria-label="Logo BRI 131 Anniversary"></div>${!desk && R === 'display-prize' ? `<button data-go="display-list" aria-label="Kembali" style="position:absolute;left:10px;top:10px;width:44px;height:44px;border-radius:50%;background:rgba(255,255,255,.22);color:#fff;display:flex;align-items:center;justify-content:center">${ic('chevL', 24)}</button>` : ''}<div style="position:absolute;left:0;right:0;bottom:14px;text-align:center"><span class="live"><i></i>PEMENANG DOORPRIZE</span></div></div>
   <div class="dsp-in"><div class="dsp-cols">${showList ? list : ''}${showTbl ? tbl : ''}</div></div></div>`;
}

/* ---------- render ---------- */
const VIEWS = { beranda: vBeranda, daftar: vDaftar, tiket: vTiket, hunt: vHunt, leaderboard: vLeaderboard, scan: vScan, berhasil: vBerhasil, 'k-splash': vKSplash, 'k-login': vKLogin, 'k-home': vKHome, 'k-scan': vKScan, 'k-data': vKData, 'k-berhasil': vKBerhasil, 'k-history': vKHistory, 'd-login': vDLogin, 'd-home': vDHome, 'd-scan': vDScan, 'd-input': vDInput, 'd-berhasil': vDBerhasil, 'd-history': vDHistory, 'display-list': vDisplay, 'display-prize': vDisplay };
function render() {
  guard();
  const app = $('#app'); if (!app) return;
  const sy = window.scrollY, ps = $('.pscroll'), psT = ps ? ps.scrollTop : 0, lc = $('.locs'), lcT = lc ? lc.scrollTop : 0, pl = $('.plist'), plT = pl ? pl.scrollTop : 0;
  let body = '';
  try { body = VIEWS[R](); } catch (err) { body = `<div class="formcard"><div class="panel"><h1>Terjadi kesalahan</h1><p class="muted">${esc(err && err.message)}</p><div class="actions">${btn('Kembali ke beranda', 'data-go="beranda"')}</div></div></div>`; console.error(err); }
  app.innerHTML = demoBar() + body + vModal() + '<div class="toast" id="toast" role="status" aria-live="polite"></div>';
  window.scrollTo({ top: sy, behavior: 'instant' });
  const dm = $('.demo-modes'), on = $('.pill.on'); if (dm && on) dm.scrollLeft = on.offsetLeft - (dm.clientWidth - on.offsetWidth) / 2;
  const ps2 = $('.pscroll'); if (ps2) ps2.scrollTop = psT;
  const lc2 = $('.locs'); if (lc2) lc2.scrollTop = lcT;
  const pl2 = $('.plist'); if (pl2) pl2.scrollTop = plT;
  if (ui.pendingScroll) { const el = $('#sec-' + ui.pendingScroll); ui.pendingScroll = null; if (el) { const top = el.getBoundingClientRect().top + window.scrollY - (isDesk() ? 130 : 120); window.scrollTo({ top, behavior: 'smooth' }); } }
}
