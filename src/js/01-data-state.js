/* ===== Prototipe HUT BRI 131: microsite peserta, Scavenger Hunt, aplikasi petugas, tampilan pemenang ===== */
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ic = (n, size = 20, sw = 1.9, st = '') => `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="${st}">${ICONS[n] || ''}</svg>`;
const isDesk = () => window.matchMedia('(min-width:900px)').matches;
const pad2 = n => String(n).padStart(2, '0');
const hhmm = t => { const d = new Date(t); return pad2(d.getHours()) + '.' + pad2(d.getMinutes()); };

/* ---------- data ---------- */
const UNITS = ['Kantor Pusat', 'RO Jakarta 1', 'RO Jakarta 2', 'RO Jakarta 3', 'RAO Jakarta 1', 'RAO Jakarta 2', 'RAO Jakarta 3'];
const DIRECTORY = { '00012345': { nama: 'Budi Santoso', unit: 'Kantor Pusat' } };
const CATS = [
  { id: 'sampah', icon: 'trash', title: 'Buang Sampah', pts: 10, desc: 'Scan QR di titik tempat sampah', locs: ['Gate 1', 'Gate 2', 'Food Court', 'Lobi Barat', 'Area Parkir', 'Tribun Timur'], prefix: 'Titik Sampah' },
  { id: 'air', icon: 'droplet', title: 'Ambil Air Minum', pts: 10, desc: 'Scan QR di stasiun air minum', locs: ['Lobi Utama', 'Gate 1', 'Food Court', 'Tribun Barat', 'Area Booth'], prefix: 'Stasiun Air' },
  { id: 'booth', icon: 'flag', title: 'Kunjungan Booth', pts: 20, desc: 'Scan QR di setiap booth yang dikunjungi', locs: ['BRImo', 'QLOLA', 'Britama', 'KUR', 'BRILink', 'Wealth', 'Kartu Kredit', 'Asuransi', 'BRI Peduli', 'UMKM Showcase'], prefix: 'Booth' },
  { id: 'fnb', icon: 'coffee', title: 'Belanja di Area F&B', pts: 30, desc: 'Scan QR di kasir tenant F&B', locs: ['Kopi Nusantara', 'Bakso Senayan', 'Nasi Padang', 'Es Teler', 'Roti Bakar', 'Sate Ayam', 'Mie Aceh', 'Jajanan Pasar'], prefix: 'Tenant' },
];
const CATBY = Object.fromEntries(CATS.map(c => [c.id, c]));
const PRIZES = [
  { id: 'mobil', icon: 'car', title: 'Hadiah Utama', sub: 'Mobil', quota: 1 },
  { id: 'motor', icon: 'bike', title: 'Sepeda Motor', sub: '', quota: 3 },
  { id: 'hp', icon: 'phone', title: 'Smartphone', sub: '', quota: 10 },
  { id: 'laptop', icon: 'laptop', title: 'Laptop', sub: '', quota: 5 },
  { id: 'voucher', icon: 'ticket', title: 'Voucher', sub: '', quota: 20 },
];
const PRZBY = Object.fromEntries(PRIZES.map(p => [p.id, p]));
const SEED_PEOPLE = [
  ['10020001', 'Adi Nugroho', 'Kantor Pusat', 3], ['10020002', 'Bunga Lestari', 'RO Jakarta 1', 2], ['10020003', 'Candra Wijaya', 'RAO Jakarta 2', 4],
  ['10020004', 'Dewi Anggraini', 'Kantor Pusat', 1], ['10020005', 'Eko Prasetyo', 'RO Jakarta 3', 0], ['10020006', 'Fitri Handayani', 'RAO Jakarta 1', 2],
  ['10020007', 'Gilang Ramadhan', 'Kantor Pusat', 3], ['10020008', 'Hana Permata', 'RO Jakarta 2', 1], ['10020009', 'Indra Kurniawan', 'RAO Jakarta 3', 2],
  ['10020010', 'Julia Safitri', 'Kantor Pusat', 0],
  ['10020011', 'Kartika Sari', 'RO Jakarta 1', 2], ['10020012', 'Lukman Hakim', 'Kantor Pusat', 3], ['10020013', 'Maya Putri', 'RAO Jakarta 2', 1],
  ['10020014', 'Nanda Pratama', 'RO Jakarta 3', 4], ['10020015', 'Oka Wiratama', 'RAO Jakarta 1', 0], ['10020016', 'Putri Amelia', 'RO Jakarta 2', 2],
].map(([pn, nama, unit, fam]) => ({ pn, nama, unit, fam }));
const LB_SEED = [
  ['Adi Nugroho', 'Kantor Pusat', 520], ['Bunga Lestari', 'RO Jakarta 1', 490], ['Candra Wijaya', 'RAO Jakarta 2', 470], ['Dewi Anggraini', 'Kantor Pusat', 455],
  ['Eko Prasetyo', 'RO Jakarta 3', 430], ['Fitri Handayani', 'RAO Jakarta 1', 410], ['Gilang Ramadhan', 'Kantor Pusat', 385], ['Hana Permata', 'RO Jakarta 2', 360],
  ['Indra Kurniawan', 'RAO Jakarta 3', 340], ['Julia Safitri', 'Kantor Pusat', 325],
  ['Kartika Sari', 'RO Jakarta 1', 305], ['Lukman Hakim', 'Kantor Pusat', 290], ['Maya Putri', 'RAO Jakarta 2', 275], ['Nanda Pratama', 'RO Jakarta 3', 260],
  ['Oka Wiratama', 'RAO Jakarta 1', 245], ['Putri Amelia', 'RO Jakarta 2', 230], ['Qori Ananda', 'RAO Jakarta 3', 215], ['Rangga Saputra', 'Kantor Pusat', 200],
  ['Sinta Maharani', 'RO Jakarta 1', 185], ['Teguh Firmansyah', 'RAO Jakarta 2', 170], ['Umi Kalsum', 'RO Jakarta 3', 160], ['Vino Alamsyah', 'RAO Jakarta 1', 150],
  ['Winda Lestari', 'Kantor Pusat', 140], ['Xavier Pratama', 'RO Jakarta 2', 130], ['Yuni Astuti', 'RAO Jakarta 3', 120], ['Zaki Mubarok', 'Kantor Pusat', 110],
  ['Ayu Ningrum', 'RO Jakarta 1', 100], ['Bagus Wicaksono', 'RAO Jakarta 2', 85], ['Citra Dewi', 'RO Jakarta 3', 70], ['Dimas Anggara', 'RAO Jakarta 1', 55],
].map(([name, unit, pts]) => ({ name, unit, pts }));
const MAXPTS = CATS.reduce((a, c) => a + c.locs.length * c.pts, 0);
const TOTLOC = CATS.reduce((a, c) => a + c.locs.length, 0);

const seedCheckins = () => SEED_PEOPLE.slice(0, 10).map((p, i) => ({ pn: p.pn, nama: p.nama, unit: p.unit, hadir: p.fam, snack: p.fam + 1, t: Date.now() - (95 - i * 7) * 60000, seed: true }));
const seedWinners = () => [['motor', 2], ['hp', 3], ['hp', 4], ['hp', 5], ['laptop', 6], ['laptop', 7]].map(([prize, i], k) => ({ prize, pn: SEED_PEOPLE[i].pn, nama: SEED_PEOPLE[i].nama, unit: SEED_PEOPLE[i].unit, t: Date.now() - (50 - k * 5) * 60000, seed: true }));
const defaults = () => ({ user: null, scans: [], checkins: seedCheckins(), winners: seedWinners(), kLogged: false, dLogged: false });

/* ---------- state (localStorage bila tersedia, kalau tidak hanya di memori) ---------- */
const KEY = 'bri131-proto-v1';
let S = defaults();
function load() { try { const r = localStorage.getItem(KEY); if (r) S = Object.assign(defaults(), JSON.parse(r)); } catch (e) { } }
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
load();

/* ---------- logika bisnis ---------- */
function board() {
  const arr = LB_SEED.map(x => ({ name: x.name, unit: x.unit, pts: x.pts }));
  if (S.user) arr.push({ name: S.user.nama, unit: S.user.unit, pts: myPts(), me: true });
  return arr.map((x, i) => Object.assign(x, { _i: i })).sort((a, b) => b.pts - a.pts || a._i - b._i);
}
function myPts() { return S.scans.reduce((a, s) => a + s.pts, 0); }
function myRank() { const b = board(); return b.findIndex(x => x.me) + 1; }
function catStat(id) { const c = CATBY[id]; const n = S.scans.filter(s => s.cat === id).length; return { n, tot: c.locs.length, pts: n * c.pts }; }
function locName(cat, i) { const c = CATBY[cat]; return c.prefix + ' · ' + c.locs[i]; }
function hasScan(cat, i) { return S.scans.some(s => s.cat === cat && s.idx === i); }
function doScan(cat, i) {
  if (hasScan(cat, i)) return { ok: false, dup: true };
  const before = myRank();
  const c = CATBY[cat];
  const rec = { cat, idx: i, pts: c.pts, label: c.title, loc: locName(cat, i), t: Date.now() };
  S.scans.push(rec); save();
  return { ok: true, rec, prevRank: before, newRank: myRank(), total: myPts() };
}
function ticketCode(pn) { let h = 0; for (const ch of pn + 'bri131') h = (h * 31 + ch.charCodeAt(0)) >>> 0; return 'BRI131-' + pn + '-' + (h % 9000 + 1000); }
function registered() { // peserta terdaftar (contoh + pengguna ini)
  const arr = SEED_PEOPLE.map(p => ({ pn: p.pn, nama: p.nama, unit: p.unit, fam: p.fam }));
  if (S.user) arr.push({ pn: S.user.pn, nama: S.user.nama, unit: S.user.unit, fam: S.user.family.length, me: true });
  return arr;
}
const checkinOf = pn => S.checkins.find(c => c.pn === pn);
const winnerOf = pn => S.winners.find(w => w.pn === pn);
const prizeCount = id => S.winners.filter(w => w.prize === id).length;

/* ---------- gambar QR contoh (visual saja) ---------- */
function qrSvg(seedStr) {
  let h = 2166136261; for (const ch of seedStr) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  const rnd = () => { h += 0x6D2B79F5; let t = h; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const n = 29, m = Array.from({ length: n }, () => Array.from({ length: n }, () => rnd() < .48));
  const fin = (x, y) => { for (let i = -1; i < 8; i++) for (let j = -1; j < 8; j++) { const xx = x + i, yy = y + j; if (xx >= 0 && xx < n && yy >= 0 && yy < n) m[yy][xx] = (i >= 0 && i <= 6 && j >= 0 && j <= 6) && (i === 0 || i === 6 || j === 0 || j === 6 || (i >= 2 && i <= 4 && j >= 2 && j <= 4)); } };
  fin(0, 0); fin(n - 7, 0); fin(0, n - 7);
  let p = ''; for (let y = 0; y < n; y++) { let x = 0; while (x < n) { if (m[y][x]) { const s = x; while (x < n && m[y][x]) x++; p += `M${s} ${y}h${x - s}v1h-${x - s}z`; } else x++; } }
  return `<svg viewBox="0 0 ${n} ${n}" shape-rendering="crispEdges" role="img" aria-label="QR Code contoh"><path d="${p}" fill="#0B2447"/></svg>`;
}
