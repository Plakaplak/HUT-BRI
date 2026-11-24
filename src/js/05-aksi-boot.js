/* ---------- aksi ---------- */
const DEMO_USER = () => ({ pn: '00012345', nama: 'Budi Santoso', unit: 'Kantor Pusat', email: 'budi.santoso@gmail.com', hp: '081234567890', family: [{ rel: 'Istri/Suami', nama: 'Sari Santoso' }, { rel: 'Anak', nama: 'Rafi Santoso' }], regAt: Date.now() });
function refreshList() { const el = $('#plist'); if (el) el.innerHTML = R === 'k-scan' ? kList() : dList(); }
function afterBusy(fn) { const r0 = R; setTimeout(() => { if (R !== r0) return; ui.busy = false; fn(); }, 700); }
function startBusy() { ui.busy = true; ui.msg = null; render(); }
function clearUserData(pn) { S.checkins = S.checkins.filter(c => c.pn !== pn); S.winners = S.winners.filter(w => w.pn !== pn); }

const ACT = {
  menu() { ui.menu = !ui.menu; render(); },
  anchor(el) { const to = el.dataset.to; ui.menu = false; if (R !== 'beranda') { ui.pendingScroll = to; go('beranda'); } else { ui.pendingScroll = to; render(); } },
  guide() { ui.modal = 'guide'; render(); },
  reset() { ui.modal = 'reset'; render(); },
  'modal-close'() { ui.modal = null; render(); },
  'modal-bg'() { ui.modal = null; render(); },
  'modal-go'(el) { ui.modal = null; go(el.dataset.to); },
  'reset-do'() { try { localStorage.removeItem(KEY); } catch (e) { } S = defaults(); resetReg(); Object.assign(ui, { modal: null, last: null, kSel: null, dSel: null, dPrize: null, dPhoto: null, newWin: null, q: '', lb: 'all', scanCat: 'sampah' }); D.kl = { wa: '', pw: '' }; D.dl = { wa: '', pw: '' }; go('beranda'); toast('Data demo dikembalikan ke awal.'); },
  email() { ui.modal = 'email'; render(); },
  logout() { const pn = S.user && S.user.pn; if (pn) clearUserData(pn); S.user = null; S.scans = []; ui.last = null; save(); go('beranda'); toast('Anda sudah keluar.'); },
  quick(el) { S.user = DEMO_USER(); S.scans = []; clearUserData('00012345'); save(); go(el.dataset.to || 'tiket'); toast('Masuk sebagai akun demo: Budi Santoso.'); },
  /* registrasi */
  'reg-demo'() { const r = D.reg; r.pn = '00012345'; r.pw = 'demo'; r.err = {}; ACT['reg-next'](); },
  'reg-back'() { D.reg.step = Math.max(0, D.reg.step - 1); D.reg.err = {}; render(); },
  'fam-add'(el) { D.reg.family.push({ rel: el.dataset.rel, nama: '' }); render(); const i = $(`[data-fam="${D.reg.family.length - 1}"]`); if (i) i.focus(); },
  'fam-del'(el) { D.reg.family.splice(+el.dataset.i, 1); D.reg.err = {}; render(); },
  'reg-next'() {
    const r = D.reg, e = r.err = {};
    if (r.step === 0) {
      if (!/^\d{8}$/.test(r.pn)) e.pn = 'PN harus 8 digit angka.';
      if (!r.pw) e.pw = 'Kata sandi wajib diisi.';
      if (!Object.keys(e).length) { const k = DIRECTORY[r.pn]; if (k) { r.nama = k.nama; r.unit = k.unit; r.email = r.email || 'budi.santoso@gmail.com'; r.hp = r.hp || '081234567890'; } r.step = 1; }
    } else if (r.step === 1) {
      if (!r.nama.trim()) e.nama = 'Nama wajib diisi.';
      if (!r.unit) e.unit = 'Pilih unit kerja.'; else if (r.unit === 'Wilayah Kalimantan') e.unit = 'Peserta area Kalimantan tidak termasuk dalam acara ini.';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) e.email = 'Format email belum benar.'; else if (/@bri\.co\.id$/i.test(r.email)) e.email = 'Gunakan email aktif yang bukan email korporat.';
      if (!/^(0|62)\d{8,12}$/.test(r.hp.replace(/[\s-]/g, ''))) e.hp = 'Nomor HP belum benar (9 sampai 13 digit, mulai 0 atau 62).';
      if (!Object.keys(e).length) r.step = 2;
    } else if (r.step === 2) {
      r.family.forEach((f, i) => { if (!f.nama.trim()) e['fam' + i] = 'Nama ' + f.rel + ' wajib diisi atau hapus barisnya.'; });
      if (!Object.keys(e).length) r.step = 3;
    } else {
      if (!r.agree) e.agree = 'Centang persetujuan untuk melanjutkan.';
      else {
        S.user = { pn: r.pn, nama: r.nama.trim(), unit: r.unit, email: r.email.trim(), hp: r.hp.trim(), family: r.family.map(f => ({ rel: f.rel, nama: f.nama.trim() })), regAt: Date.now() };
        S.scans = []; clearUserData(r.pn); save(); resetReg(); go('tiket'); toast('Pendaftaran berhasil. QR tiket dikirim ke email Anda.'); return;
      }
    }
    render(); const fe = $('.errtxt'); if (fe) fe.scrollIntoView({ block: 'center', behavior: 'smooth' });
  },
  /* scavenger hunt */
  'scan-cat'(el) { ui.scanCat = el.dataset.cat; go('scan'); },
  'scan-tab'(el) { ui.scanCat = el.dataset.cat; ui.msg = null; render(); },
  pick(el) {
    if (ui.busy) return; const cat = el.dataset.cat, i = +el.dataset.i; startBusy();
    afterBusy(() => { const r = doScan(cat, i); if (r.ok) { ui.last = r; vibrate(40); go('berhasil'); } else { ui.msg = { t: 'bad', m: 'QR ini sudah pernah Anda scan. Satu QR hanya dihitung sekali.' }; vibrate([60, 40, 60]); render(); } });
  },
  badqr() {
    if (ui.busy) return; startBusy();
    afterBusy(() => { ui.msg = { t: 'bad', m: 'QR tidak dikenali. Pastikan Anda scan QR resmi.' }; vibrate([60, 40, 60]); render(); });
  },
  lbf(el) { ui.lb = el.dataset.k; render(); },
  /* petugas kedatangan */
  'k-demo'() { D.kl.wa = '081200000001'; D.kl.pw = 'demo'; ACT['k-login'](); },
  'k-login'() { const l = D.kl, e = l.err = {}; if (!/^\d{9,14}$/.test((l.wa || '').replace(/[\s+-]/g, ''))) e.wa = 'Nomor WhatsApp belum benar.'; if (!l.pw) e.pw = 'Kata sandi wajib diisi.'; if (Object.keys(e).length) { render(); return; } S.kLogged = true; save(); go('k-home'); },
  'k-logout'() { S.kLogged = false; save(); go('k-splash'); },
  'k-pick'(el) {
    if (ui.busy) return; const pn = el.dataset.pn; startBusy();
    afterBusy(() => { const c = checkinOf(pn), p = registered().find(x => x.pn === pn); if (c) { ui.msg = { t: 'bad', m: `${p.nama} sudah check-in pukul ${hhmm(c.t)}.` }; vibrate([60, 40, 60]); render(); } else { ui.kSel = pn; ui.hadir = p.fam; ui.msg = { t: 'good', m: 'Scan Berhasil' }; vibrate(40); render(); setTimeout(() => { if (R === 'k-scan') go('k-data'); }, 450); } });
  },
  'k-hadir'(el) { const p = registered().find(x => x.pn === ui.kSel); ui.hadir = Math.max(0, Math.min(p.fam, ui.hadir + (+el.dataset.d))); render(); },
  'k-submit'() { const p = registered().find(x => x.pn === ui.kSel); if (!p || checkinOf(p.pn)) return; S.checkins.push({ pn: p.pn, nama: p.nama, unit: p.unit, hadir: ui.hadir, snack: ui.hadir + 1, t: Date.now() }); save(); go('k-berhasil'); },
  /* petugas doorprize */
  'd-demo'() { D.dl.wa = '081200000002'; D.dl.pw = 'demo'; ACT['d-login'](); },
  'd-login'() { const l = D.dl, e = l.err = {}; if (!/^\d{9,14}$/.test((l.wa || '').replace(/[\s+-]/g, ''))) e.wa = 'Nomor WhatsApp belum benar.'; if (!l.pw) e.pw = 'Kata sandi wajib diisi.'; if (Object.keys(e).length) { render(); return; } S.dLogged = true; save(); go('d-home'); },
  'd-logout'() { S.dLogged = false; save(); go('d-login'); },
  'd-pick'(el) {
    if (ui.busy) return; const pn = el.dataset.pn; startBusy();
    afterBusy(() => {
      const p = registered().find(x => x.pn === pn), c = checkinOf(pn), w = winnerOf(pn);
      if (!c) { ui.msg = { t: 'bad', m: `${p.nama} belum check-in. Arahkan ke meja registrasi.` }; vibrate([60, 40, 60]); render(); }
      else if (w) { ui.msg = { t: 'bad', m: `${p.nama} sudah memenangkan ${PRZBY[w.prize].title}. Satu peserta satu hadiah.` }; vibrate([60, 40, 60]); render(); }
      else { ui.dSel = pn; ui.dPrize = null; ui.dPhoto = null; ui.msg = { t: 'good', m: 'Scan Berhasil' }; vibrate(40); render(); setTimeout(() => { if (R === 'd-scan') go('d-input'); }, 450); }
    });
  },
  'd-prize'(el) { ui.dPrize = el.dataset.id; render(); },
  'd-submit'() {
    const p = registered().find(x => x.pn === ui.dSel), z = PRZBY[ui.dPrize]; if (!p || !z || winnerOf(p.pn) || prizeCount(z.id) >= z.quota) return;
    const w = { prize: z.id, pn: p.pn, nama: p.nama, unit: p.unit, t: Date.now(), photo: ui.dPhoto || null }; S.winners.push(w); save(); ui.newWin = Object.assign({}, w); go('d-berhasil');
  },
  'show-prize'(el) { const id = el.dataset.id; ui.dPrize = id; ui.q = ''; if (ui.newWin) { ui.newWin.fresh = true; setTimeout(() => { if (ui.newWin) ui.newWin.fresh = false; }, 3000); } go('display-prize', { prize: id }); },
};
/* ---------- event ---------- */
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); if (ui.modal) ui.modal = null; go(g.dataset.go); return; }
  const a = e.target.closest('[data-act]'); if (!a) return;
  if (a.dataset.act === 'modal-bg' && e.target !== a) return;
  if (a.getAttribute('aria-disabled') === 'true' && !a.dataset.act.endsWith('pick')) return;
  const f = ACT[a.dataset.act]; if (f) f(a, e);
});
document.addEventListener('input', e => {
  const t = e.target;
  if (t.dataset.f) { let v = t.value; if (t.dataset.f === 'pn') { v = v.replace(/\D/g, '').slice(0, 8); if (v !== t.value) t.value = v; } D.reg[t.dataset.f] = v; }
  else if (t.dataset.fam !== undefined) D.reg.family[+t.dataset.fam].nama = t.value;
  else if (t.dataset.d) { const [a, b] = t.dataset.d.split('.'); D[a][b] = t.value; }
  else if (t.dataset.q !== undefined) { ui.q = t.value; if (R === 'k-scan' || R === 'd-scan') refreshList(); else { const el = $('#wtable'); if (el) el.innerHTML = winRows(); } }
});
document.addEventListener('change', e => {
  const t = e.target;
  if (t.dataset.chk === 'agree') { D.reg.agree = t.checked; D.reg.err.agree = ''; }
  else if (t.dataset.photo && t.files && t.files[0]) {
    const file = t.files[0], fr = new FileReader();
    fr.onload = () => { const im = new Image(); im.onload = () => { try { const s = 180, k = Math.max(s / im.width, s / im.height), c = document.createElement('canvas'); c.width = c.height = s; const x = c.getContext('2d'); x.drawImage(im, (s - im.width * k) / 2, (s - im.height * k) / 2, im.width * k, im.height * k); ui.dPhoto = c.toDataURL('image/jpeg', .7); } catch (er) { ui.dPhoto = null; } render(); }; im.onerror = () => toast('Foto tidak bisa dibaca.'); im.src = fr.result; };
    fr.readAsDataURL(file);
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.matches('.inp') && !e.target.matches('select')) { const b = e.target.closest('.panel,.app-body'); const p = b && b.querySelector('.btn-p:not([disabled])'); if (p) { e.preventDefault(); p.click(); } }
  if (e.key === 'Escape' && ui.modal) { ui.modal = null; render(); }
});
window.addEventListener('storage', e => { if (e.key === KEY) { load(); if (modeOf(R) === 'x') render(); } });
try { window.matchMedia('(min-width:900px)').addEventListener('change', () => render()); } catch (e) { }
/* ---------- mulai ---------- */
(function boot() { let r = ''; try { r = location.hash.slice(1); } catch (e) { } if (ROUTE_MODE[r]) R = r; render(); })();
