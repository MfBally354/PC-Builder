// =========================================
// PC BUILDER - MAIN SCRIPT
// =========================================

// ----- PAGE NAVIGATION -----
function showPage(pageId) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
}

// ----- PARTICLE SYSTEM -----
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.3;
    this.vx = (Math.random() - 0.5) * 0.3;
    this.vy = (Math.random() - 0.5) * 0.3;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = ['#2563EB','#06B6D4','#8B5CF6'][Math.floor(Math.random() * 3)];
  }

  function init() {
    particles = [];
    for (let i = 0; i < 80; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = '#06B6D4';
          ctx.globalAlpha = (1 - dist / 120) * 0.06;
          ctx.lineWidth = 0.5;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); init(); });
  resize(); init(); draw();
})();

// ----- NAVBAR SCROLL EFFECT -----
window.addEventListener('scroll', () => {
  const navbar = document.querySelector('.navbar-glass');
  if (navbar) {
    navbar.style.background = window.scrollY > 20
      ? 'rgba(10,15,30,0.95)'
      : 'rgba(10,15,30,0.8)';
  }
});

// ----- COMPONENT DATA -----
const components = [
  {
    id: 'cpu',
    name: 'CPU (Processor)',
    icon: '🔲',
    iconClass: 'bi bi-cpu-fill',
    color: '#2563EB',
    desc: 'Otak dari setiap komputer. Memproses semua instruksi dan perhitungan.',
    fullDesc: 'Central Processing Unit (CPU) adalah komponen inti yang melakukan semua pemrosesan data pada komputer. Kecepatan, jumlah core, dan cache sangat mempengaruhi performa sistem.',
    functions: [
      'Menjalankan instruksi program',
      'Melakukan kalkulasi aritmatika dan logika',
      'Mengontrol alur data antar komponen',
      'Menjalankan sistem operasi dan aplikasi',
    ],
    specs: [
      { label: 'Socket', value: 'LGA 1700 / AM5' },
      { label: 'Core Count', value: '4 - 24 Core' },
      { label: 'Clock Speed', value: '3.0 - 6.0+ GHz' },
      { label: 'Cache', value: 'Hingga 36MB' },
    ],
    badge: 'Komponen Utama',
    driveId: '1Jvs_-95d-Lf_0vMXfvkhMuXFMQPa1_Ti',
    videoLabel: 'Cara Memasang CPU ke Motherboard',
  },
  {
    id: 'motherboard',
    name: 'Motherboard',
    icon: '🔶',
    iconClass: 'bi bi-motherboard',
    color: '#06B6D4',
    desc: 'Papan sirkuit utama yang menghubungkan semua komponen PC menjadi satu.',
    fullDesc: 'Motherboard adalah fondasi dari sebuah PC. Semua komponen terhubung ke motherboard melalui slot dan konektor yang tersedia. Chipset, VRM, dan form factor menentukan kompatibilitas.',
    functions: [
      'Menghubungkan semua komponen PC',
      'Mendistribusikan daya ke semua part',
      'Menyediakan slot PCIe, RAM, M.2',
      'Mengatur komunikasi antar komponen',
    ],
    specs: [
      { label: 'Form Factor', value: 'ATX / mATX / ITX' },
      { label: 'Socket', value: 'LGA1700 / AM5' },
      { label: 'RAM Slot', value: '2 - 4 Slot DDR5' },
      { label: 'PCIe Slot', value: '1-3 PCIe x16' },
    ],
    badge: 'Fondasi Sistem',
    driveId: '1BKFpj0BSvPD7YF7RLWVbsvNJqh_XX3Hb',
    videoLabel: 'Cara Memasang Motherboard ke Casing',
  },
  {
    id: 'ram',
    name: 'RAM (Memory)',
    icon: '📊',
    iconClass: 'bi bi-memory',
    color: '#8B5CF6',
    desc: 'Memori sementara untuk menyimpan data yang sedang digunakan oleh sistem.',
    fullDesc: 'Random Access Memory (RAM) adalah tempat penyimpanan data sementara yang diakses dengan sangat cepat oleh CPU. Kapasitas dan kecepatan RAM mempengaruhi multitasking.',
    functions: [
      'Menyimpan data yang sedang aktif',
      'Mempercepat akses data CPU',
      'Mendukung multitasking',
      'Buffering data aplikasi',
    ],
    specs: [
      { label: 'Tipe', value: 'DDR4 / DDR5' },
      { label: 'Kapasitas', value: '8GB - 128GB' },
      { label: 'Kecepatan', value: '3200 - 6400 MHz' },
      { label: 'Latency', value: 'CL14 - CL36' },
    ],
    badge: 'Memori Sistem',
    driveId: '1sLfMS7Sco6u0ri4BAJg85lHhX08rY7te',
    videoLabel: 'Cara Memasang RAM ke Motherboard',
  },
  {
    id: 'gpu',
    name: 'GPU (Video Card)',
    icon: '🎮',
    iconClass: 'bi bi-gpu-card',
    color: '#10B981',
    desc: 'Kartu grafis untuk memproses dan menampilkan gambar ke monitor.',
    fullDesc: 'Graphics Processing Unit (GPU) bertanggung jawab atas rendering grafis, gaming, dan komputasi paralel. Memiliki ribuan core kecil yang bekerja paralel.',
    functions: [
      'Memproses dan merender grafis 3D',
      'Menampilkan output video ke monitor',
      'Akselerasi AI dan machine learning',
      'Komputasi paralel massif',
    ],
    specs: [
      { label: 'VRAM', value: '4GB - 24GB GDDR6X' },
      { label: 'Interface', value: 'PCIe 4.0 / 5.0 x16' },
      { label: 'TDP', value: '65W - 450W' },
      { label: 'Output', value: 'HDMI 2.1 / DP 1.4' },
    ],
    badge: 'Kartu Grafis',
    driveId: '1G5p2Ut7gNZ_TXBDNnTiNvLGRzWequCSg',
    videoLabel: 'Cara Memasang GPU ke Motherboard',
  },
  {
    id: 'psu',
    name: 'PSU (Power Supply)',
    icon: '⚡',
    iconClass: 'bi bi-lightning-fill',
    color: '#F59E0B',
    desc: 'Unit catu daya yang mengubah listrik AC menjadi DC untuk semua komponen.',
    fullDesc: 'Power Supply Unit (PSU) mengkonversi arus listrik AC dari stopkontak menjadi arus DC yang dibutuhkan komponen PC. Efisiensi dan wattage menentukan kestabilan sistem.',
    functions: [
      'Konversi listrik AC ke DC',
      'Mendistribusikan daya ke semua komponen',
      'Proteksi dari lonjakan tegangan',
      'Regulasi tegangan yang stabil',
    ],
    specs: [
      { label: 'Wattage', value: '450W - 1600W' },
      { label: 'Sertifikasi', value: '80+ Bronze/Gold/Plat' },
      { label: 'Form Factor', value: 'ATX / SFX' },
      { label: 'Konektor', value: '24-pin, EPS, PCIe' },
    ],
    badge: 'Sumber Daya',
    driveId: '14N_HuVkhBXHfOjjlzVVHqXR0RIC4FJmU',
    videoLabel: 'Cara Memasang PSU ke Casing',
  },
  {
    id: 'storage',
    name: 'Storage (SSD/HDD)',
    icon: '💾',
    iconClass: 'bi bi-hdd-fill',
    color: '#06B6D4',
    desc: 'Penyimpanan permanen untuk sistem operasi, aplikasi, dan data pengguna.',
    fullDesc: 'Storage menyimpan data secara permanen. SSD NVMe jauh lebih cepat dari HDD dan SATA SSD, sehingga cocok untuk OS dan aplikasi. HDD lebih murah per GB untuk penyimpanan data massal.',
    functions: [
      'Menyimpan sistem operasi',
      'Menyimpan aplikasi dan game',
      'Menyimpan file dan dokumen',
      'Boot storage untuk startup',
    ],
    specs: [
      { label: 'Interface', value: 'NVMe / SATA / USB' },
      { label: 'Kapasitas', value: '128GB - 8TB' },
      { label: 'Read Speed', value: 'Hingga 7000 MB/s' },
      { label: 'Form Factor', value: 'M.2 / 2.5" / 3.5"' },
    ],
    badge: 'Penyimpanan Data',
    driveId: '1NSkXbOJW8rfCmzbrIqTg9M3tQmmaM5be',
    videoLabel: 'Cara Memasang SSD NVMe',
  },
  {
    id: 'cooler',
    name: 'CPU Cooler',
    icon: '❄️',
    iconClass: 'bi bi-thermometer-snow',
    color: '#06B6D4',
    desc: 'Sistem pendingin untuk menjaga suhu CPU tetap aman saat beroperasi.',
    fullDesc: 'CPU Cooler menjaga temperatur prosesor dalam batas aman. Ada dua jenis utama: Air Cooler (kipas dan heatsink) dan Liquid Cooler (AIO/custom loop) yang lebih efisien.',
    functions: [
      'Membuang panas dari CPU',
      'Menjaga suhu optimal',
      'Mencegah thermal throttling',
      'Memungkinkan overclocking',
    ],
    specs: [
      { label: 'Tipe', value: 'Air / AIO Liquid / Custom' },
      { label: 'TDP Rating', value: '65W - 400W+' },
      { label: 'Noise Level', value: '20 - 45 dBA' },
      { label: 'RPM', value: '500 - 3000 RPM' },
    ],
    badge: 'Sistem Pendingin',
    driveId: '1_lcbQXkuaDV7IMtZkxXTZepjIlYHrGqz',
    videoLabel: 'Cara Memasang CPU Cooler',
  },
  {
    id: 'casing',
    name: 'PC Case (Casing)',
    icon: '🖥️',
    iconClass: 'bi bi-pc-display',
    color: '#8B5CF6',
    desc: 'Wadah fisik yang menampung dan melindungi semua komponen PC.',
    fullDesc: 'PC Case atau casing adalah struktur fisik yang menampung semua komponen. Airflow, ukuran, dan estetika (panel kaca, RGB) adalah pertimbangan utama dalam memilih casing.',
    functions: [
      'Wadah dan pelindung komponen',
      'Manajemen aliran udara (airflow)',
      'Menyediakan mounting point',
      'Estetika dan tampilan build',
    ],
    specs: [
      { label: 'Form Factor', value: 'Full / Mid / Mini Tower' },
      { label: 'Mobo Support', value: 'ATX / mATX / ITX' },
      { label: 'GPU Clearance', value: 'Hingga 420mm' },
      { label: 'Drive Bay', value: '2-6 Bay 3.5" + 2.5"' },
    ],
    badge: 'Wadah PC',
    driveId: '1aIBaT0BzhncNPiDnsDA3hq7U6xlNHrpu',
    videoLabel: 'Cara Memilih dan Menyiapkan Casing',
  },
];

// ----- RENDER COMPONENT CARDS -----
function renderComponents() {
  const grid = document.getElementById('componentGrid');
  if (!grid) return;
  grid.innerHTML = components.map(c => `
    <div class="col-sm-6 col-lg-3">
      <div class="comp-card" onclick="openComponentModal('${c.id}')">
        <div class="comp-card-visual" style="background: linear-gradient(135deg, ${c.color}10, ${c.color}06)">
          <div class="comp-card-glow" style="background:${c.color}"></div>
          <div class="comp-card-icon" style="color:${c.color}"><i class="${c.iconClass}"></i></div>
        </div>
        <div class="comp-card-body">
          <div class="comp-card-name">${c.name}</div>
          <div class="comp-card-desc">${c.desc}</div>
          <button class="comp-card-btn" style="color:${c.color}">
            Lihat Detail <i class="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

// ----- OPEN COMPONENT MODAL -----
function openComponentModal(id) {
  const c = components.find(x => x.id === id);
  if (!c) return;

  const modalEl = document.getElementById('componentModal');

  document.getElementById('modalIcon').innerHTML = `<i class="${c.iconClass}" style="color:${c.color}"></i>`;
  document.getElementById('modalIcon').style.background = `linear-gradient(135deg, ${c.color}20, ${c.color}10)`;
  document.getElementById('modalIcon').style.border = `1px solid ${c.color}30`;
  document.getElementById('modalTitle').textContent = c.name;
  document.getElementById('modalBadge').textContent = c.badge;
  document.getElementById('modalDesc').textContent = c.fullDesc;
  document.getElementById('modalVisual').innerHTML = `<i class="${c.iconClass}" style="color:${c.color};font-size:72px;filter:drop-shadow(0 0 16px ${c.color})"></i>`;
  document.getElementById('modalFunctions').innerHTML = c.functions.map(f => `<li>${f}</li>`).join('');
  document.getElementById('modalSpecs').innerHTML = c.specs.map(s => `
    <div class="spec-item">
      <div class="spec-label">${s.label}</div>
      <div class="spec-value">${s.value}</div>
    </div>
  `).join('');
  document.getElementById('modalVideoLabel').textContent = c.videoLabel;

  // Render video — embed Google Drive preview jika driveId ada, fallback YouTube videoId, atau placeholder
  const videoEl = document.getElementById('modalVideo');
  if (c.driveId) {
    videoEl.innerHTML = `
      <iframe
        width="100%" height="100%"
        src="https://drive.google.com/file/d/${c.driveId}/preview"
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        style="border-radius:12px; min-height:320px; display:block">
      </iframe>
    `;
  } else if (c.videoId) {
    videoEl.innerHTML = `
      <iframe
        width="100%" height="100%"
        src="https://www.youtube.com/embed/${c.videoId}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
        style="border-radius:12px; min-height:320px; display:block">
      </iframe>
    `;
  } else {
    videoEl.innerHTML = `
      <div class="video-placeholder-inner">
        <div class="play-icon-large"><i class="bi bi-play-fill"></i></div>
        <p>Video Tutorial</p>
        <small>${c.videoLabel}</small>
      </div>
    `;
  }

  // FIX: getOrCreateInstance — tidak membuat instance baru jika sudah ada
  bootstrap.Modal.getOrCreateInstance(modalEl).show();
}

// ----- TUTORIAL DATA -----
const tutorials = [
  {
    id: 1, category: 'cpu',
    title: 'Cara Memasang CPU ke Motherboard',
    desc: 'Panduan lengkap pemasangan prosesor Intel & AMD dengan benar dan aman.',
    icon: '🔲', color: '#2563EB', bg: 'rgba(37,99,235,0.1)',
    duration: '8:42', catLabel: 'CPU',
  },
  {
    id: 2, category: 'motherboard',
    title: 'Memasang Motherboard ke Casing',
    desc: 'Cara memasang standoff, I/O shield, dan motherboard ke dalam casing.',
    icon: '🔶', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',
    duration: '11:05', catLabel: 'Motherboard',
  },
  {
    id: 3, category: 'ram',
    title: 'Instalasi RAM yang Benar',
    desc: 'Cara memasang RAM dual channel untuk performa optimal.',
    icon: '📊', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)',
    duration: '5:20', catLabel: 'RAM',
  },
  {
    id: 4, category: 'gpu',
    title: 'Memasang GPU ke Slot PCIe',
    desc: 'Panduan instalasi kartu grafis dan konektor daya PCIe.',
    icon: '🎮', color: '#10B981', bg: 'rgba(16,185,129,0.1)',
    duration: '7:15', catLabel: 'GPU',
  },
  {
    id: 5, category: 'storage',
    title: 'Instalasi SSD NVMe M.2',
    desc: 'Cara memasang SSD NVMe M.2 ke slot motherboard.',
    icon: '💾', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',
    duration: '4:30', catLabel: 'Storage',
  },
  {
    id: 6, category: 'psu',
    title: 'Memasang dan Merapikan Kabel PSU',
    desc: 'Panduan cable management yang rapi dan terorganisir.',
    icon: '⚡', color: '#F59E0B', bg: 'rgba(245,158,11,0.1)',
    duration: '14:22', catLabel: 'PSU',
  },
  {
    id: 7, category: 'cpu',
    title: 'Aplikasi Thermal Paste yang Tepat',
    desc: 'Teknik aplikasi thermal paste untuk pendinginan optimal.',
    icon: '🌡️', color: '#EF4444', bg: 'rgba(239,68,68,0.1)',
    duration: '6:10', catLabel: 'CPU',
  },
  {
    id: 8, category: 'motherboard',
    title: 'Koneksi Front Panel Header',
    desc: 'Cara menghubungkan kabel front panel tombol power, HDD LED, dll.',
    icon: '🔌', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',
    duration: '9:44', catLabel: 'Motherboard',
  },
];

let activeCategory = 'all';
let searchQuery = '';

function renderTutorials() {
  const grid = document.getElementById('tutorialGrid');
  if (!grid) return;
  let filtered = tutorials;
  if (activeCategory !== 'all') filtered = filtered.filter(t => t.category === activeCategory);
  if (searchQuery) filtered = filtered.filter(t =>
    t.title.toLowerCase().includes(searchQuery) || t.desc.toLowerCase().includes(searchQuery)
  );

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-12 text-center py-5" style="color:var(--text-muted)"><i class="bi bi-search" style="font-size:2rem"></i><p class="mt-2">Tidak ada tutorial ditemukan</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(t => `
    <div class="col-sm-6 col-lg-3">
      <div class="tut-card">
        <div class="tut-thumb">
          <div class="tut-thumb-bg" style="background: linear-gradient(135deg, ${t.bg}, rgba(0,0,0,0.3))"></div>
          <div class="tut-thumb-icon" style="color:${t.color}">${t.icon}</div>
          <div class="tut-play-overlay">
            <div class="tut-play-btn-large"><i class="bi bi-play-fill"></i></div>
          </div>
          <div class="tut-duration">${t.duration}</div>
          <div class="tut-cat-badge" style="background:${t.color}20;color:${t.color};border:1px solid ${t.color}40">${t.catLabel}</div>
        </div>
        <div class="tut-body">
          <div class="tut-title">${t.title}</div>
          <div class="tut-desc">${t.desc}</div>
        </div>
      </div>
    </div>
  `).join('');
}

function filterTutCategory(btn, cat) {
  document.querySelectorAll('.tut-filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeCategory = cat;
  renderTutorials();
}

function filterTutorials() {
  searchQuery = document.getElementById('tutSearch').value.toLowerCase();
  renderTutorials();
}

// ----- TEAM DATA -----
const team = [
  {
    name: 'IQBAL GUNTUR BISMOKO',
    role: 'Lead Developer',
    emoji: '👨‍💻',
    color: '#2563EB',
    desc: 'Bertanggung jawab atas arsitektur sistem, simulasi drag & drop, dan JavaScript.',
  },
  {
    name: 'KEVIN ABHISTA SHANWA RAJENDRA',
    role: 'Co. Developer',
    emoji: '🎨',
    color: '#8B5CF6',
    desc: 'Merancang desain futuristik, animasi, dan pengalaman pengguna yang imersif.',
  },
  {
    name: 'FAIRUS ZAKY AHMADDIEN',
    role: 'Animator',
    emoji: '📚',
    color: '#06B6D4',
    desc: 'membuat konten mengenai video animasi dalam media pembelajaran dan mengisi suara animasi.',
  },
  {
    name: 'FARREL ALENTA HANAN PRAKOSA',
    role: 'Designer',
    emoji: '🔍',
    color: '#10B981',
    desc: 'Merancang desain UI/UX menggunakan canva.',
  },
];

function renderTeam() {
  const grid = document.getElementById('teamGrid');
  if (!grid) return;
  grid.innerHTML = team.map(m => `
    <div class="col-sm-6 col-lg-3">
      <div class="team-card">
        <div class="team-avatar" style="background:${m.color}18;border:2px solid ${m.color}30">
          <span style="font-size:36px">${m.emoji}</span>
        </div>
        <div class="team-name">${m.name}</div>
        <div class="team-role" style="color:${m.color}">${m.role}</div>
        <div class="team-desc">${m.desc}</div>
      </div>
    </div>
  `).join('');
}

// ----- INIT -----
document.addEventListener('DOMContentLoaded', () => {
  showPage('home');
  renderComponents();
  renderTeam();

  // FIX: bersihkan iframe video & sisa backdrop saat modal komponen ditutup
  // supaya modal bisa dibuka lagi untuk komponen lain tanpa nge-stuck (tidak bisa diklik).
  const compModal = document.getElementById('componentModal');
  if (compModal) {
    // Pindahkan focus keluar modal SEBELUM ditutup → hindari warning aria-hidden
    // yang kadang bikin Bootstrap ninggalin state .modal-open di <body>.
    compModal.addEventListener('hide.bs.modal', () => {
      if (compModal.contains(document.activeElement)) {
        document.activeElement.blur();
      }
    });

    compModal.addEventListener('hidden.bs.modal', () => {
      // Stop video YouTube dengan mengosongkan iframe
      const videoEl = document.getElementById('modalVideo');
      if (videoEl) videoEl.innerHTML = '';

      // Bersihkan sisa backdrop / class modal-open yang kadang nyangkut
      // dan memblokir klik pada kartu komponen lain.
      document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
      document.body.classList.remove('modal-open');
      document.body.style.removeProperty('overflow');
      document.body.style.removeProperty('padding-right');
    });
  }
});
