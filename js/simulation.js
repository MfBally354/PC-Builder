// =========================================
// PC BUILDER - SIMULATION MODULE (Stage-based)
// Motherboard di tengah -> drag komponen -> PC fullset
// =========================================

// Komponen yang bisa di-drag (urutan perakitan yang benar).
// Motherboard tidak ada di sini karena sudah jadi base/stage awal.
const simComponents = [
  { id: 'cpu',     name: 'Processor (CPU)', icon: 'bi bi-cpu-fill',          color: '#2563EB' },
  { id: 'ram',     name: 'RAM',             icon: 'bi bi-memory',            color: '#8B5CF6' },
  { id: 'cooler',  name: 'CPU Cooler',      icon: 'bi bi-thermometer-snow',  color: '#22D3EE' },
  { id: 'gpu',     name: 'GPU',             icon: 'bi bi-gpu-card',          color: '#10B981' },
  { id: 'storage', name: 'SSD / Storage',   icon: 'bi bi-hdd-fill',          color: '#F59E0B' },
  { id: 'psu',     name: 'PSU',             icon: 'bi bi-lightning-fill',    color: '#EF4444' },
  { id: 'casing',  name: 'Case + Fans',     icon: 'bi bi-fan',               color: '#A78BFA' },
];

// Caption tiap stage (index = jumlah komponen terpasang)
const stageCaptions = [
  'Motherboard kosong — siap dirakit',
  'CPU terpasang di socket motherboard',
  'RAM terpasang di slot memori',
  'CPU Cooler menutup processor',
  'GPU terpasang di slot PCIe',
  'Storage (SSD) terpasang',
  'PSU terhubung, daya mengalir',
  '🎉 PC Fullset selesai dirakit!',
];

const guideMessages = [
  'Pasang <strong>Processor (CPU)</strong> ke socket di motherboard.',
  'Masukkan <strong>RAM</strong> ke slot memori.',
  'Pasang <strong>CPU Cooler</strong> di atas processor.',
  'Pasang <strong>GPU</strong> ke slot PCIe utama.',
  'Pasang <strong>Storage (SSD)</strong> di motherboard.',
  'Pasang <strong>PSU</strong> dan hubungkan kabel daya.',
  'Pasang <strong>Casing + Fans</strong> untuk finishing!',
  '🎉 <strong>Selamat!</strong> Semua komponen berhasil terpasang.',
];

const hintMessages = [
  'Drag CPU ke motherboard untuk memulai',
  'Sekarang masukkan RAM',
  'Pasang CPU Cooler di atas CPU',
  'Saatnya pasang GPU',
  'Pasang Storage / SSD',
  'Hubungkan PSU',
  'Terakhir, pasang casing dan fans!',
  'Perakitan selesai 🎉',
];

let placedOrder = [];   // urutan id yang sudah benar terpasang
let draggedId = null;

function nextComponent() {
  return simComponents[placedOrder.length];
}

// ----- INIT -----
function initSimulation() {
  renderSimComponents();
  renderChecklist();
  updateStage();
  updateGuide();
  updateProgress();
  updateTutorialHint();
}

function renderSimComponents() {
  const list = document.getElementById('simComponentsList');
  if (!list) return;
  const next = nextComponent();
  list.innerHTML = simComponents.map((c, i) => {
    const isPlaced = placedOrder.includes(c.id);
    const isNext = next && next.id === c.id;
    const isLocked = !isPlaced && !isNext;
    return `
      <div class="sim-comp-item ${isPlaced ? 'placed' : ''} ${isNext ? 'is-next' : ''} ${isLocked ? 'locked' : ''}"
           id="drag-${c.id}"
           draggable="${isNext}"
           ondragstart="onDragStart(event, '${c.id}')"
           ondragend="onDragEnd(event)"
           title="${isLocked ? 'Selesaikan komponen sebelumnya dulu' : c.name}">
        <div class="sim-comp-icon"><i class="${c.icon}" style="color:${c.color}"></i></div>
        <div class="sim-comp-name">${i + 1}. ${c.name}</div>
        ${isPlaced ? '<i class="bi bi-check-circle-fill ms-auto" style="color:#10B981"></i>' :
          isNext ? '<i class="bi bi-arrow-right-circle-fill ms-auto" style="color:var(--cyan);animation:pulseArrow 1.2s infinite"></i>' :
          '<i class="bi bi-lock-fill ms-auto" style="color:#555"></i>'}
      </div>
    `;
  }).join('');
}

function renderChecklist() {
  const cl = document.getElementById('simChecklist');
  if (!cl) return;
  cl.innerHTML = simComponents.map(c => {
    const done = placedOrder.includes(c.id);
    return `
      <div class="checklist-item ${done ? 'done' : ''}">
        <div class="ci-icon">${done ? '<i class="bi bi-check"></i>' : ''}</div>
        <span>${c.name}</span>
      </div>
    `;
  }).join('');
}

// ----- DRAG & DROP -----
function onDragStart(e, compId) {
  const next = nextComponent();
  if (!next || next.id !== compId) { e.preventDefault(); return; }
  draggedId = compId;
  e.dataTransfer.setData('text/plain', compId);
  setTimeout(() => {
    const el = document.getElementById('drag-' + compId);
    if (el) el.classList.add('dragging');
  }, 10);
  const stage = document.getElementById('simStage');
  if (stage) stage.classList.add('drop-ready');
}

function onDragEnd() {
  if (draggedId) {
    const el = document.getElementById('drag-' + draggedId);
    if (el) el.classList.remove('dragging');
  }
  const stage = document.getElementById('simStage');
  if (stage) stage.classList.remove('drop-ready', 'dragover');
  draggedId = null;
}

function onStageDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}
function onStageDragLeave(e) {
  e.currentTarget.classList.remove('dragover');
}
function onStageDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const droppedId = e.dataTransfer.getData('text/plain') || draggedId;
  const next = nextComponent();

  if (next && droppedId === next.id) {
    placedOrder.push(droppedId);
    updateStage(true);
    updateProgress();
    updateGuide();
    updateTutorialHint();
    renderSimComponents();
    renderChecklist();
    showToast('✅ ' + next.name + ' berhasil dipasang!', 'success');

    if (placedOrder.length === simComponents.length) {
      setTimeout(() => {
        try { new bootstrap.Modal(document.getElementById('successModal')).show(); } catch(_) {}
      }, 900);
    }
  } else {
    const stage = document.getElementById('simStage');
    if (stage) {
      stage.classList.add('wrong-flash');
      setTimeout(() => stage.classList.remove('wrong-flash'), 500);
    }
    showToast('❌ Bukan giliran komponen ini! Ikuti urutan perakitan.', 'error');
  }
  draggedId = null;
}

// ----- STAGE / IMAGE -----
function updateStage(animate) {
  const img = document.getElementById('simStageImg');
  const cap = document.getElementById('stageCaption');
  const hint = document.getElementById('stageHint');
  const idx = placedOrder.length;
  if (!img) return;
  const newSrc = `assets/sim/stage-${idx}.png`;
  if (animate) {
    img.classList.remove('pop');
    // force reflow
    void img.offsetWidth;
    img.classList.add('pop');
  }
  img.src = newSrc;
  if (cap) cap.textContent = stageCaptions[idx];
  if (hint) hint.style.display = idx >= simComponents.length ? 'none' : '';
}

// ----- PROGRESS -----
function updateProgress() {
  const count = placedOrder.length;
  const total = simComponents.length;
  const pct = Math.round((count / total) * 100);
  const t = document.getElementById('simProgressText');
  const f = document.getElementById('simProgressFill');
  if (t) t.textContent = count + '/' + total;
  if (f) f.style.width = pct + '%';
}

// ----- GUIDE -----
function updateGuide() {
  const guide = document.getElementById('guideStep');
  if (!guide) return;
  const idx = placedOrder.length;
  if (idx >= simComponents.length) {
    guide.innerHTML = `
      <div class="guide-icon"><i class="bi bi-check-circle-fill" style="color:#10B981"></i></div>
      <p>${guideMessages[guideMessages.length - 1]}</p>`;
  } else {
    guide.innerHTML = `
      <div class="guide-icon"><i class="bi bi-hand-index-fill"></i></div>
      <p>${guideMessages[idx]}</p>`;
  }
}

function updateTutorialHint() {
  const hint = document.getElementById('tbarHint');
  if (hint) hint.textContent = hintMessages[Math.min(placedOrder.length, hintMessages.length - 1)];
}

// ----- RESET -----
function resetSimulation() {
  placedOrder = [];
  draggedId = null;
  initSimulation();
  showToast('🔄 Simulasi direset. Mulai dari awal!', 'info');
}

// ----- TUTORIAL BAR (tetap) -----
let tutorialPlaying = false, tutorialTimer = null, tutorialProgress = 0, tutorialTime = 0;
function toggleTutorialVideo() {
  tutorialPlaying = !tutorialPlaying;
  const icon = document.getElementById('tbarPlayIcon');
  if (!icon) return;
  if (tutorialPlaying) { icon.className = 'bi bi-pause-fill'; startTutorialProgress(); }
  else { icon.className = 'bi bi-play-fill'; clearInterval(tutorialTimer); }
}
function startTutorialProgress() {
  clearInterval(tutorialTimer);
  tutorialTimer = setInterval(() => {
    tutorialTime++;
    const mins = Math.floor(tutorialTime / 60), secs = tutorialTime % 60;
    const tEl = document.getElementById('tbarTime');
    if (tEl) tEl.textContent = mins + ':' + String(secs).padStart(2, '0');
    const totalDuration = 420;
    tutorialProgress = Math.min((tutorialTime / totalDuration) * 100, 100);
    const fEl = document.getElementById('tbarFill');
    if (fEl) fEl.style.width = tutorialProgress + '%';
    if (tutorialTime >= totalDuration) {
      clearInterval(tutorialTimer); tutorialPlaying = false;
      const pi = document.getElementById('tbarPlayIcon');
      if (pi) pi.className = 'bi bi-play-fill';
      tutorialTime = 0; tutorialProgress = 0;
    }
  }, 1000);
}
let tutorialBarCollapsed = false;
function toggleTutorialBar() {
  tutorialBarCollapsed = !tutorialBarCollapsed;
  const bar = document.getElementById('tutorialBar');
  const chevron = document.getElementById('tbarChevron');
  if (!bar || !chevron) return;
  if (tutorialBarCollapsed) { bar.style.maxHeight = '44px'; bar.style.overflow = 'hidden'; chevron.className = 'bi bi-chevron-down'; }
  else { bar.style.maxHeight = ''; bar.style.overflow = ''; chevron.className = 'bi bi-chevron-up'; }
}

// ----- TOAST -----
function showToast(message, type) {
  const toast = document.getElementById('simToast');
  const body = document.getElementById('simToastBody');
  if (!toast || !body) return;
  body.textContent = message;
  toast.className = 'toast align-items-center border-0 text-white';
  if (type === 'success') toast.classList.add('bg-success');
  else if (type === 'error') toast.classList.add('bg-danger');
  else toast.classList.add('bg-primary');
  try { new bootstrap.Toast(toast, { delay: 2500 }).show(); } catch(_) {}
}

// ----- AUTO INIT ON PAGE SWITCH -----
const origShowPage = window.showPage;
window.showPage = function(pageId) {
  if (origShowPage) origShowPage(pageId);
  if (pageId === 'simulation') setTimeout(initSimulation, 100);
};

// Styles injected for new stage UI
const _simStyle = document.createElement('style');
_simStyle.textContent = `
@keyframes wrongShake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)} }
@keyframes pulseArrow { 0%,100%{transform:translateX(0);opacity:1} 50%{transform:translateX(4px);opacity:0.6} }
@keyframes stagePop { 0%{transform:scale(0.85);opacity:0.3;filter:brightness(1.6)} 60%{transform:scale(1.05);opacity:1} 100%{transform:scale(1);filter:brightness(1)} }
@keyframes stageGlowPulse { 0%,100%{opacity:0.35} 50%{opacity:0.7} }

.sim-stage-wrapper{display:flex;flex-direction:column;align-items:center;gap:14px;width:100%;}
.sim-stage{
  position:relative;width:min(520px,100%);aspect-ratio:1/1;
  border-radius:24px;
  background:radial-gradient(circle at 50% 45%, rgba(34,211,238,0.12), rgba(15,23,42,0.4) 60%, rgba(15,23,42,0.85));
  border:2px dashed rgba(34,211,238,0.25);
  display:flex;align-items:center;justify-content:center;
  transition:border-color .25s, box-shadow .25s, transform .25s;
  overflow:hidden;
}
.sim-stage.drop-ready{border-color:rgba(34,211,238,0.7);box-shadow:0 0 40px rgba(34,211,238,0.25) inset, 0 0 30px rgba(34,211,238,0.2);}
.sim-stage.dragover{transform:scale(1.02);border-color:#22D3EE;box-shadow:0 0 60px rgba(34,211,238,0.4) inset;}
.sim-stage.wrong-flash{border-color:#EF4444 !important;box-shadow:0 0 40px rgba(239,68,68,0.4) inset !important;animation:wrongShake .4s ease;}
.sim-stage .stage-glow{
  position:absolute;inset:10%;border-radius:50%;
  background:radial-gradient(circle, rgba(139,92,246,0.25), transparent 70%);
  filter:blur(20px);animation:stageGlowPulse 3s ease-in-out infinite;pointer-events:none;
}
.sim-stage-img{position:relative;z-index:1;max-width:92%;max-height:92%;object-fit:contain;filter:drop-shadow(0 8px 20px rgba(0,0,0,0.5));}
.sim-stage-img.pop{animation:stagePop .55s cubic-bezier(.2,.9,.3,1.2);}
.stage-hint{
  position:absolute;bottom:14px;left:50%;transform:translateX(-50%);
  font-family:var(--font-display);font-size:.78rem;color:rgba(255,255,255,0.6);
  background:rgba(15,23,42,0.7);padding:6px 12px;border-radius:999px;
  display:flex;align-items:center;gap:6px;z-index:2;backdrop-filter:blur(6px);
}
.stage-caption{
  font-family:var(--font-display);font-size:.95rem;color:var(--text-dim);
  text-align:center;letter-spacing:.3px;
}
.sim-comp-item.is-next{border-color:rgba(34,211,238,0.5)!important;box-shadow:0 0 18px rgba(34,211,238,0.18);}
.sim-comp-item.locked{opacity:.4;cursor:not-allowed;filter:grayscale(.7);}
.sim-comp-item.locked:hover{transform:none;box-shadow:none;}
`;
document.head.appendChild(_simStyle);
