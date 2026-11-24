/* ---------- Scavenger Hunt ---------- */
function gate(title) {
  return `${pHeader()}<main class="formcard"><div class="panel" style="text-align:center"><span class="ibox" style="margin:0 auto 14px;width:64px;height:64px;border-radius:20px">${ic('target', 34)}</span><h1>${title}</h1><p class="muted" style="margin-top:10px;font-size:14.5px">Daftar sebagai peserta dulu supaya poin Anda tercatat. Untuk uji cepat, pakai akun demo.</p><div class="actions" style="flex-direction:column">${btn('Daftar sebagai peserta', 'data-go="daftar"', 'btn-p')}${btn('Masuk cepat (akun demo)', 'data-act="quick" data-to="hunt"', 'btn-o', 'zap')}${btn('Lihat leaderboard saja', 'data-go="leaderboard"', 'btn-o')}</div></div></main>${tabbar()}`;
}
function actRow(c) {
  const s = catStat(c.id), pc = Math.round(s.n / s.tot * 100);
  return `<button class="actrow" data-act="scan-cat" data-cat="${c.id}"><span class="ibox">${ic(c.icon, 28)}</span><div class="grow"><b>${c.title}</b><p>${c.desc}</p><div class="prog" aria-hidden="true"><i style="width:${pc}%"></i></div><div class="prog-t ${s.n ? '' : 'zero'}">${s.n}/${s.tot} titik · ${s.pts} poin</div></div><div class="ptsbox"><b>+${c.pts}</b><span>poin / scan</span></div></button>`;
}
function lbRow(x, rank) {
  return `<div class="lbrow ${x.me ? 'me' : ''}"><span class="rk">${rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}</span><span class="av" style="width:40px;height:40px;font-size:16px">${esc(x.name[0])}</span><div class="grow"><b>${esc(x.name)}${x.me ? ' (Anda)' : ''}</b><small>${esc(x.unit)}</small></div><div class="pt">${x.pts}<small>poin</small></div></div>`;
}
function vHunt() {
  const u = S.user; if (!u) return gate('Scavenger Hunt BRI 131');
  const pts = myPts(), rank = myRank(), kinds = CATS.filter(c => catStat(c.id).n > 0).length, hist = S.scans.slice().reverse().slice(0, 5);
  const b = board().slice(0, 10);
  const lbPrev = `<div><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px"><h2 class="h2s">Leaderboard</h2><button data-go="leaderboard" style="color:var(--nav);font-weight:800;font-size:14px">Lihat semua</button></div><div class="lbbox">${b.map((x, i) => lbRow(x, i + 1)).join('')}${rank > 10 ? `<div style="text-align:center;color:var(--mut);padding:6px;border-top:1px solid var(--line);background:#fff">⋯</div>${lbRow(board()[rank - 1], rank)}` : ''}</div></div>`;
  return `${pHeader()}<main class="hunt"><div class="hunt-cols"><div>
   <div class="hhero"><div class="a im im-art3"></div><span class="chip">${ic('target', 14, 2.2)} Scavenger Hunt</span><h1>Kumpulkan poin,<br>naik leaderboard</h1><p>Scan QR di setiap aktivitas selama acara. Semakin banyak scan, semakin banyak poin.</p></div>
   <div class="pcard"><div class="row"><span class="av" style="width:48px;height:48px;font-size:20px">${esc(u.nama[0])}</span><div class="grow"><b style="font-size:17px">${esc(u.nama)}</b><div class="muted" style="font-size:13px">${esc(u.unit)}</div></div><span class="rankpill">${ic('trophy', 16, 2.2)}#${rank}</span></div>
   <div class="stats"><div><small>TOTAL POIN</small><b class="big" id="ptsnum">${pts}</b></div><i></i><div><small>SCAN</small><b>${S.scans.length}x</b></div><i></i><div><small>AKTIVITAS</small><b>${kinds}/4</b></div></div>
   <div style="margin-top:6px" class="prog" aria-hidden="true"><i style="width:${Math.min(100, Math.round(pts / MAXPTS * 100))}%"></i></div><div class="hint" style="margin-top:6px;text-align:center">${pts} dari maksimal ${MAXPTS} poin</div></div>
   <div style="display:flex;flex-direction:column;gap:12px;margin:18px 0 6px">${btn('Scan QR Aktivitas', 'data-go="scan"', 'btn-p btn-l', 'scan')}<div class="only-m">${btn('Lihat Leaderboard', 'data-go="leaderboard"', 'btn-o btn-l', 'trophy')}</div></div>
   <h2 class="h2s" style="margin:22px 0 12px">Aktivitas dan poin</h2><div style="display:flex;flex-direction:column;gap:12px">${CATS.map(actRow).join('')}</div>
   <div class="hist" style="margin-top:18px"><h2 class="h2s" style="margin-bottom:8px">Riwayat scan</h2>${hist.length ? hist.map(s => `<div class="h"><span class="ibox" style="width:40px;height:40px;border-radius:12px">${ic(CATBY[s.cat].icon, 22)}</span><div class="grow"><b style="font-size:15px;display:block;line-height:1.25">${esc(s.loc)}</b><span class="hint">${s.label} · pukul ${hhmm(s.t)}</span></div><b style="color:var(--grn);font-size:16px">+${s.pts}</b></div>`).join('') : `<div class="empty">Belum ada scan. Mulai dari tombol Scan QR Aktivitas.</div>`}</div>
   <div class="note">${ic('info', 22, 2)}<div>Setiap QR aktivitas hanya dapat di-scan satu kali per peserta (usulan aturan). Poin dan peringkat diperbarui otomatis.</div></div></div>
   <div class="stick hide-m">${lbPrev}</div></div></main>${tabbar()}`;
}

/* ---------- Scan QR aktivitas (disimulasikan) ---------- */
function vScan() {
  const c = CATBY[ui.scanCat], m = ui.msg;
  const cap = ui.busy ? 'Memindai QR…' : m ? m.m : 'Arahkan kamera ke QR Code di titik aktivitas';
  return `${pHeader()}<div class="scanwrap"><div class="scanv"><div class="scan-top"><button class="iconbtn" data-go="hunt" aria-label="Kembali">${ic('chevL', 26)}</button><b>SCAN AKTIVITAS</b></div>
   <div class="vf ${ui.busy ? 'busy' : ''}" role="img" aria-label="Area pemindaian QR"><i class="cn c1"></i><i class="cn c2"></i><i class="cn c3"></i><i class="cn c4"></i><div class="ghost">${qrSvg('ghost-' + ui.scanCat).replace('#0B2447', '#9ED3FF')}</div><div class="ln"></div></div>
   <div class="vcap ${m ? m.t : ''}" role="status">${esc(cap)}</div>
   <div class="sheet"><h3>SIMULASI SCAN · PILIH QR DI LOKASI</h3><div class="hint" style="margin-top:4px">Kamera tidak dipakai di prototipe. Ketuk sebuah titik untuk meniru scan QR-nya.</div>
   <div class="tabs4" role="tablist">${CATS.map(k => `<button role="tab" aria-selected="${k.id === ui.scanCat}" class="${k.id === ui.scanCat ? 'on' : ''}" data-act="scan-tab" data-cat="${k.id}">${ic(k.icon, 24)}${k.title.replace('Belanja di Area ', '').replace('Kunjungan ', '').replace('Ambil ', '').replace('Buang ', '')}</button>`).join('')}</div>
   <div class="locs">${c.locs.map((l, i) => { const d = hasScan(c.id, i); return `<button class="loc ${d ? 'done' : ''}" data-act="pick" data-cat="${c.id}" data-i="${i}" ${ui.busy ? 'disabled' : ''}><span class="grow">${esc(l)}<small>${d ? 'Sudah di-scan' : '+' + c.pts + ' poin'}</small></span>${d ? ic('check', 18, 2.8) : ic('scan', 18)}</button>`; }).join('')}</div>
   <button class="linkbtn" data-act="badqr" ${ui.busy ? 'disabled' : ''}>Coba scan QR yang tidak valid</button></div></div></div>`;
}
function vBerhasil() {
  const r = ui.last, up = r.newRank < r.prevRank;
  return `${pHeader()}<div class="okv"><div class="ok-top"><div class="a im im-art3"></div><div class="ok-circle">${ic('check', 46, 3)}</div><div class="ok-pts">+${r.rec.pts}</div><div style="font-weight:700;font-size:15px;margin-top:6px;color:#DCEBFF">poin berhasil ditambahkan</div><span class="chip" style="margin-top:12px;background:rgba(255,255,255,.22)">${ic(CATBY[r.rec.cat].icon, 14, 2.2)} ${esc(r.rec.loc)}</span></div>
   <div class="ok-card"><div class="sumrow"><span>Total poin</span><b style="font-size:22px;color:var(--nav)">${r.total}</b></div><div class="sumrow"><span>Peringkat</span><b>${up ? `<span class="muted" style="font-weight:600">#${r.prevRank}</span> → <span style="color:var(--grn)">#${r.newRank}</span> ${ic('trendUp', 16, 2.4, 'vertical-align:-3px;color:var(--grn)')}` : `#${r.newRank}`}</b></div><div class="sumrow"><span>Scan hari ini</span><b>${S.scans.length}x</b></div></div>
   <div style="padding:20px 18px 30px;display:flex;flex-direction:column;gap:12px;margin-top:auto">${btn('Scan lagi', 'data-go="scan"', 'btn-p btn-l', 'scan')}${btn('Lihat leaderboard', 'data-go="leaderboard"', 'btn-o btn-l', 'trophy')}<button data-go="hunt" style="color:var(--nav);font-weight:800;padding:10px">Kembali ke misi</button></div></div>`;
}

/* ---------- Leaderboard ---------- */
function vLeaderboard() {
  const f = { all: () => true, pusat: x => x.unit === 'Kantor Pusat', jkt: x => /^R(A)?O/.test(x.unit) }[ui.lb];
  const all = board().filter(f), top = all.slice(0, 20), me = all.findIndex(x => x.me);
  const pod = [1, 0, 2].map(i => { const x = all[i]; if (!x) return ''; const hh = [82, 112, 62][[1, 0, 2].indexOf(i)]; return `<div class="pod"><span class="av" style="width:${i === 0 ? 60 : 50}px;height:${i === 0 ? 60 : 50}px;font-size:${i === 0 ? 24 : 20}px;background:${i === 0 ? '#FFE27A' : '#fff'};color:var(--deep)">${esc(x.name[0])}</span><div class="nm">${esc(x.name)}${x.me ? ' (Anda)' : ''}</div><div class="ps">${x.pts} poin</div><div class="blk" style="height:${hh}px">${i + 1}</div></div>`; }).join('');
  return `${pHeader()}<main class="hunt" style="max-width:760px"><div style="display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><span class="eyebrow">Leaderboard</span><h1 style="font-size:28px;line-height:1.15;font-weight:800;letter-spacing:-.5px;margin-top:2px">Scavenger Hunt BRI 131</h1><p class="muted" style="font-size:14px;margin-top:4px">Diperbarui otomatis setiap ada scan.</p></div>${S.user ? btn('Scan QR', 'data-go="scan"', 'btn-p', 'scan') : btn('Daftar untuk ikut', 'data-go="daftar"', 'btn-p')}</div>
   <div class="seg" role="tablist">${[['all', 'Semua'], ['pusat', 'Kantor Pusat'], ['jkt', 'RO &amp; RAO Jakarta']].map(([k, l]) => `<button role="tab" aria-selected="${ui.lb === k}" class="${ui.lb === k ? 'on' : ''}" data-act="lbf" data-k="${k}">${l}</button>`).join('')}</div>
   <div class="podium">${pod}</div><div class="lbbox" style="margin-top:16px">${top.map((x, i) => lbRow(x, i + 1)).join('')}${me >= 20 ? `<div style="text-align:center;color:var(--mut);padding:6px;border-top:1px solid var(--line)">⋯</div>${lbRow(all[me], me + 1)}` : ''}</div>
   ${S.user ? '' : `<div class="note">${ic('info', 20, 2)}<div>Ini peringkat contoh. Daftar sebagai peserta untuk masuk ke leaderboard.</div></div>`}</main>${tabbar()}`;
}

/* ---------- modal ---------- */
function vModal() {
  const m = ui.modal; if (!m) return '';
  let inner = '';
  if (m === 'guide') inner = `<h2>Panduan uji prototipe</h2><p class="muted" style="font-size:14px;margin-top:6px">Coba urutan ini di HP atau desktop. Semua data tersimpan di perangkat ini; tombol Reset di bilah atas mengembalikan ke awal.</p><ol class="gl">
   <li><div><b>Daftar sebagai peserta.</b> Isi registrasi atau pakai akun demo.<button data-act="modal-go" data-to="daftar">Buka</button></div></li>
   <li><div><b>Scavenger Hunt.</b> Scan beberapa QR aktivitas, coba scan yang sama dua kali dan QR tidak valid.<button data-act="modal-go" data-to="hunt">Buka</button></div></li>
   <li><div><b>Leaderboard.</b> Lihat peringkat Anda naik setelah scan.<button data-act="modal-go" data-to="leaderboard">Buka</button></div></li>
   <li><div><b>Petugas Kedatangan.</b> Scan tiket Anda lalu submit check-in.<button data-act="modal-go" data-to="k-splash">Buka</button></div></li>
   <li><div><b>Petugas Doorprize.</b> Scan peserta yang sudah check-in, pilih hadiah, submit.<button data-act="modal-go" data-to="d-login">Buka</button></div></li>
   <li><div><b>Tampilan Pemenang.</b> Pemenang yang baru dicatat muncul di daftar.<button data-act="modal-go" data-to="display-list">Buka</button></div></li></ol>
   <div class="note warn">${ic('info', 20, 2)}<div>Scan dan QR disimulasikan karena kamera tidak tersedia di halaman ini. Data peserta lain dan leaderboard adalah contoh.</div></div><div class="actions">${btn('Tutup', 'data-act="modal-close"', 'btn-p')}</div>`;
  else if (m === 'reset') inner = `<h2>Reset data demo?</h2><p class="muted" style="margin-top:8px">Akun, poin, check-in, dan pemenang yang Anda buat di perangkat ini akan dihapus dan kembali ke data contoh.</p><div class="actions">${btn('Batal', 'data-act="modal-close"', 'btn-o')}${btn('Ya, reset', 'data-act="reset-do"', 'btn-p')}</div>`;
  else if (m === 'email') { const u = S.user; inner = `<h2>Contoh email konfirmasi</h2><div class="mail"><div class="mail-h"><span class="im im-131w" role="img" aria-label="Logo BRI 131"></span></div><div class="mail-b"><b>Halo ${esc(u.nama)},</b><br>Pendaftaran Anda untuk <b>BRI 131 Anniversary</b> berhasil. Tunjukkan QR Code berikut kepada petugas saat check-in pada 16 Desember 2026 di Indonesia Arena, Jakarta.<div style="width:170px;margin:14px auto">${qrSvg(ticketCode(u.pn))}</div><div style="text-align:center;font-weight:800;font-size:13px;color:var(--mut)">${ticketCode(u.pn)}</div><div class="hint" style="margin-top:12px">Dikirim ke ${esc(u.email)}. Keluarga terdaftar: ${u.family.length}. QR wajib dibawa dan tidak boleh disalahgunakan.</div></div></div><div class="actions">${btn('Tutup', 'data-act="modal-close"', 'btn-p')}</div>`; }
  return `<div class="modal" data-act="modal-bg" role="dialog" aria-modal="true"><div class="mbox">${inner}</div></div>`;
}
