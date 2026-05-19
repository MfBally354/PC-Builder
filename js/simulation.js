// =========================================
// PC BUILDER - SIMULATION MODULE
// =========================================

const simComponents = [
  { id: 'mobo', name: 'Motherboard', icon: 'bi bi-motherboard', color: '#06B6D4', slot: 'slot-mobo', order: 1 },
  { id: 'cpu', name: 'Processor', icon: 'bi bi-cpu-fill', color: '#2563EB', slot: 'slot-cpu', order: 2 },
  { id: 'ram', name: 'RAM', icon: 'bi bi-memory', color: '#8B5CF6', slot: 'slot-ram', order: 3 },
  { id: 'cooler', name: 'CPU Cooler', icon: 'bi bi-thermometer-snow', color: '#22D3EE', slot: 'slot-cooler', order: 4 },
  { id: 'gpu', name: 'GPU', icon: 'bi bi-gpu-card', color: '#10B981', slot: 'slot-gpu', order: 5 },
  { id: 'storage', name: 'SSD/HDD', icon: 'bi bi-hdd-fill', color: '#F59E0B', slot: 'slot-storage', order: 6 },
  { id: 'psu', name: 'PSU', icon: 'bi bi-lightning-fill', color: '#EF4444', slot: 'slot-psu', order: 7 },
  { id: 'casing', name: 'Case Fans', icon: 'bi bi-fan', color: '#A78BFA', slot: 'slot-fans', order: 8 },
];

const slots = [
  { id: 'slot-mobo', label: 'Motherboard', acceptsId: 'mobo' },
  { id: 'slot-cpu', label: 'Processor', acceptsId: 'cpu' },
  { id: 'slot-ram', label: 'RAM Slot', acceptsId: 'ram' },
  { id: 'slot-cooler', label: 'CPU Cooler', acceptsId: 'cooler' },
  { id: 'slot-gpu', label: 'GPU / PCIe', acceptsId: 'gpu' },
  { id: 'slot-storage', label: 'Storage', acceptsId: 'storage' },
  { id: 'slot-psu', label: 'Power Supply', acceptsId: 'psu' },
  { id: 'slot-fans', label: 'Case Fans', acceptsId: 'casing' },
];

const guideMessages = [
  'Mulai dengan memasang <strong>Motherboard</strong> ke dalam casing terlebih dahulu.',
  'Pasang <strong>Processor (CPU)</strong> ke soket pada motherboard.',
  'Masukkan <strong>RAM</strong> ke dalam slot memori di motherboard.',
  'Pasang <strong>CPU Cooler</strong> di atas prosesor untuk pendinginan.',
  'Masukkan <strong>GPU</strong> ke slot PCIe pada motherboard.',
  'Pasang <strong>Storage (SSD/HDD)</strong> ke bay penyimpanan.',
  'Hubungkan <strong>PSU</strong> dan pasang kabel ke semua komponen.',
  'Pasang <strong>Case Fans</strong> untuk sirkulasi udara yang optimal.',
];

const hintMessages = [
  'Drag komponen dari panel kiri ke slot yang sesuai di area tengah',
  'Motherboard adalah fondasi — pasang ini dahulu!',
  'Pastikan CPU dipasang ke slot yang benar',
  'RAM perlu dipasang di slot yang tersedia pada motherboard',
  'CPU Cooler dipasang setelah CPU terpasang',
  'GPU masuk ke slot PCIe terbesar di motherboard',
  'SSD/HDD dipasang di bay storage pada casing',
  'PSU memberikan daya ke semua komponen',
];

let placed = {};
let draggedId = null;
let tutorialPlaying = false;
let tutorialTimer = null;
let tutorialProgress = 0;
let tutorialTime = 0;

// ----- INIT SIMULATION -----
function initSimulation() {
  renderSimComponents();
  renderSimSlots();
  renderChecklist();
  updateGuide();
}

function renderSimComponents() {
  const list = document.getElementById('simComponentsList');
  if (!list) return;
  list.innerHTML = simComponents.map(c => `
    <div class="sim-comp-item ${placed[c.id] ? 'placed' : ''}"
         id="drag-${c.id}"
         draggable="${!placed[c.id]}"
         ondragstart="onDragStart(event, '${c.id}')"
         ondragend="onDragEnd(event)">
      <div class="sim-comp-icon"><i class="${c.icon}" style="color:${c.color}"></i></div>
      <div class="sim-comp-name">${c.name}</div>
    </div>
  `).join('');
}

function renderSimSlots() {
  const slotsEl = document.getElementById('simSlots');
  if (!slotsEl) return;
  slotsEl.innerHTML = slots.map(s => {
    const compId = s.acceptsId;
    const comp = simComponents.find(c => c.id === compId);
    const isFilled = !!placed[compId];
    return `
      <div class="sim-slot ${isFilled ? 'filled' : ''}"
           id="${s.id}"
           ondragover="onDragOver(event)"
           ondragleave="onDragLeave(event)"
           ondrop="onDrop(event, '${s.id}', '${compId}')">
        ${isFilled
          ? `<div class="slot-filled-icon"><i class="${comp.icon}" style="color:${comp.color};filter:drop-shadow(0 0 8px ${comp.color})"></i></div>
             <div class="slot-label" style="color:${comp.color}">${s.label}</div>
             <div class="slot-check"><i class="bi bi-check"></i></div>`
          : `<div class="slot-icon"><i class="bi bi-plus-lg"></i></div>
             <div class="slot-label">${s.label}</div>`
        }
      </div>
    `;
  }).join('');
}

function renderChecklist() {
  const cl = document.getElementById('simChecklist');
  if (!cl) return;
  cl.innerHTML = simComponents.map(c => `
    <div class="checklist-item ${placed[c.id] ? 'done' : ''}" id="check-${c.id}">
      <div class="ci-icon">${placed[c.id] ? '<i class="bi bi-check"></i>' : ''}</div>
      <span>${c.name}</span>
    </div>
  `).join('');
}

// ----- DRAG & DROP -----
function onDragStart(e, compId) {
  draggedId = compId;
  e.dataTransfer.setData('text/plain', compId);
  setTimeout(() => {
    const el = document.getElementById('drag-' + compId);
    if (el) el.classList.add('dragging');
  }, 10);
}

function onDragEnd(e) {
  if (draggedId) {
    const el = document.getElementById('drag-' + draggedId);
    if (el) el.classList.remove('dragging');
  }
}

function onDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('dragover');
}

function onDragLeave(e) {
  e.currentTarget.classList.remove('dragover');
}

function onDrop(e, slotId, acceptsId) {
  e.preventDefault();
  e.currentTarget.classList.remove('dragover');
  const droppedId = e.dataTransfer.getData('text/plain') || draggedId;

  if (droppedId === acceptsId) {
    // Correct!
    placed[droppedId] = true;
    updateProgress();
    updateGuide();
    updateTutorialHint();
    renderSimComponents();
    renderSimSlots();
    renderChecklist();
    showToast('✅ ' + simComponents.find(c => c.id === droppedId).name + ' berhasil dipasang!', 'success');

    if (Object.keys(placed).length === simComponents.length) {
      setTimeout(() => {
        new bootstrap.Modal(document.getElementById('successModal')).show();
      }, 600);
    }
  } else {
    // Wrong slot
    const slotEl = document.getElementById(slotId);
    if (slotEl) {
      slotEl.classList.add('wrong-flash');
      setTimeout(() => slotEl.classList.remove('wrong-flash'), 500);
    }
    const dragEl = document.getElementById('drag-' + droppedId);
    if (dragEl) {
      dragEl.style.animation = 'wrongShake 0.3s ease';
      setTimeout(() => dragEl.style.animation = '', 300);
    }
    showToast('❌ Komponen tidak sesuai dengan slot ini!', 'error');
  }
  draggedId = null;
}

// ----- PROGRESS -----
function updateProgress() {
  const count = Object.keys(placed).length;
  const total = simComponents.length;
  const pct = Math.round((count / total) * 100);
  document.getElementById('simProgressText').textContent = count + '/' + total;
  document.getElementById('simProgressFill').style.width = pct + '%';
}

// ----- GUIDE -----
function updateGuide() {
  const count = Object.keys(placed).length;
  const guide = document.getElementById('guideStep');
  if (!guide) return;
  if (count >= simComponents.length) {
    guide.innerHTML = `
      <div class="guide-icon"><i class="bi bi-check-circle-fill" style="color:#10B981"></i></div>
      <p>🎉 <strong>Selamat!</strong> Semua komponen berhasil terpasang dengan sempurna!</p>
    `;
    return;
  }
  const nextComp = simComponents.find(c => !placed[c.id]);
  if (nextComp) {
    const msgIdx = Math.min(count, guideMessages.length - 1);
    guide.innerHTML = `
      <div class="guide-icon"><i class="bi bi-hand-index-fill"></i></div>
      <p>${guideMessages[msgIdx]}</p>
    `;
  }
}

function updateTutorialHint() {
  const count = Object.keys(placed).length;
  const hint = document.getElementById('tbarHint');
  if (hint) hint.textContent = hintMessages[Math.min(count, hintMessages.length - 1)];
}

// ----- RESET -----
function resetSimulation() {
  placed = {};
  draggedId = null;
  updateProgress();
  updateGuide();
  updateTutorialHint();
  renderSimComponents();
  renderSimSlots();
  renderChecklist();
  showToast('🔄 Simulasi direset. Mulai dari awal!', 'info');
}

// ----- TUTORIAL VIDEO BAR -----
function toggleTutorialVideo() {
  tutorialPlaying = !tutorialPlaying;
  const icon = document.getElementById('tbarPlayIcon');
  if (tutorialPlaying) {
    icon.className = 'bi bi-pause-fill';
    startTutorialProgress();
  } else {
    icon.className = 'bi bi-play-fill';
    clearInterval(tutorialTimer);
  }
}

function startTutorialProgress() {
  clearInterval(tutorialTimer);
  tutorialTimer = setInterval(() => {
    tutorialTime++;
    const mins = Math.floor(tutorialTime / 60);
    const secs = tutorialTime % 60;
    document.getElementById('tbarTime').textContent = mins + ':' + String(secs).padStart(2, '0');
    const totalDuration = 420; // 7 minutes
    tutorialProgress = Math.min((tutorialTime / totalDuration) * 100, 100);
    document.getElementById('tbarFill').style.width = tutorialProgress + '%';
    if (tutorialTime >= totalDuration) {
      clearInterval(tutorialTimer);
      tutorialPlaying = false;
      document.getElementById('tbarPlayIcon').className = 'bi bi-play-fill';
      tutorialTime = 0;
      tutorialProgress = 0;
    }
  }, 1000);
}

let tutorialBarCollapsed = false;
function toggleTutorialBar() {
  tutorialBarCollapsed = !tutorialBarCollapsed;
  const bar = document.getElementById('tutorialBar');
  const chevron = document.getElementById('tbarChevron');
  if (tutorialBarCollapsed) {
    bar.style.maxHeight = '44px';
    bar.style.overflow = 'hidden';
    chevron.className = 'bi bi-chevron-down';
  } else {
    bar.style.maxHeight = '';
    bar.style.overflow = '';
    chevron.className = 'bi bi-chevron-up';
  }
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
  const bsToast = new bootstrap.Toast(toast, { delay: 2500 });
  bsToast.show();
}

// ----- AUTO INIT ON PAGE SWITCH -----
const origShowPage = window.showPage;
window.showPage = function(pageId) {
  if (origShowPage) origShowPage(pageId);
  if (pageId === 'simulation') {
    setTimeout(initSimulation, 100);
  }
};

// Add CSS for wrong shake animation
const style = document.createElement('style');
style.textContent = `
@keyframes wrongShake {
  0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 75%{transform:translateX(6px)}
}`;
document.head.appendChild(style);
