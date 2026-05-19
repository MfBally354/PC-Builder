// =========================================
// PC BUILDER - QUIZ MODULE
// =========================================

const quizData = [
  {
    q: 'Komponen mana yang disebut sebagai "otak" dari sebuah komputer?',
    icon: 'bi bi-cpu-fill',
    opts: ['GPU (Graphics Card)', 'CPU (Processor)', 'RAM', 'Motherboard'],
    correct: 1,
  },
  {
    q: 'Apa kepanjangan dari RAM dalam konteks komputer?',
    icon: 'bi bi-memory',
    opts: ['Read Access Memory', 'Random Access Memory', 'Rapid Action Memory', 'Random Allocation Memory'],
    correct: 1,
  },
  {
    q: 'Komponen mana yang bertanggung jawab untuk mengubah listrik AC menjadi DC untuk komponen PC?',
    icon: 'bi bi-lightning-fill',
    opts: ['Motherboard', 'CPU Cooler', 'PSU (Power Supply Unit)', 'GPU'],
    correct: 2,
  },
  {
    q: 'Slot PCIe pada motherboard biasanya digunakan untuk memasang komponen apa?',
    icon: 'bi bi-gpu-card',
    opts: ['RAM', 'SSD M.2', 'GPU (Kartu Grafis)', 'CPU'],
    correct: 2,
  },
  {
    q: 'Apa fungsi utama dari CPU Cooler?',
    icon: 'bi bi-thermometer-snow',
    opts: ['Meningkatkan kecepatan CPU', 'Mengurangi panas yang dihasilkan CPU', 'Menyimpan data sementara', 'Menghubungkan CPU ke RAM'],
    correct: 1,
  },
  {
    q: 'Form factor motherboard mana yang paling umum digunakan untuk PC gaming standar?',
    icon: 'bi bi-motherboard',
    opts: ['Mini-ITX', 'Micro-ATX', 'ATX', 'E-ATX'],
    correct: 2,
  },
  {
    q: 'Apa perbedaan utama antara SSD dan HDD?',
    icon: 'bi bi-hdd-fill',
    opts: [
      'SSD lebih lambat tapi lebih murah',
      'SSD menggunakan flash memory, HDD menggunakan piringan magnetik',
      'HDD lebih kecil dari SSD',
      'Tidak ada perbedaan signifikan',
    ],
    correct: 1,
  },
  {
    q: 'Berapa banyak pin konektor daya utama motherboard modern?',
    icon: 'bi bi-plug-fill',
    opts: ['16-pin', '20-pin', '24-pin', '32-pin'],
    correct: 2,
  },
  {
    q: 'Apa yang dimaksud dengan "dual channel" pada RAM?',
    icon: 'bi bi-memory',
    opts: [
      'RAM yang memiliki dua kecepatan berbeda',
      'Konfigurasi dua RAM untuk meningkatkan bandwidth',
      'RAM dengan dua jenis memori berbeda',
      'RAM yang dapat diakses dua pengguna sekaligus',
    ],
    correct: 1,
  },
  {
    q: 'Komponen apa yang menghubungkan semua bagian komputer menjadi satu kesatuan?',
    icon: 'bi bi-motherboard',
    opts: ['CPU', 'GPU', 'PSU', 'Motherboard'],
    correct: 3,
  },
];

let currentQ = 0;
let score = 0;
let correctCount = 0;
let wrongCount = 0;
let answered = false;

function startQuiz() {
  currentQ = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;
  answered = false;

  document.getElementById('quizStart').classList.add('d-none');
  document.getElementById('quizResult').classList.add('d-none');
  document.getElementById('quizQuestion').classList.remove('d-none');

  renderQuestion();
}

function renderQuestion() {
  const q = quizData[currentQ];
  answered = false;

  document.getElementById('quizQNum').textContent = `Soal ${currentQ + 1} / ${quizData.length}`;
  document.getElementById('quizProgressFill').style.width = ((currentQ + 1) / quizData.length * 100) + '%';
  document.getElementById('quizScoreLive').textContent = 'Skor: ' + score;
  document.getElementById('quizQIcon').innerHTML = `<i class="${q.icon}"></i>`;
  document.getElementById('quizQText').textContent = q.q;

  const letters = ['A', 'B', 'C', 'D'];
  document.getElementById('quizOptions').innerHTML = q.opts.map((opt, i) => `
    <button class="quiz-opt-btn" onclick="selectAnswer(${i})">
      <div class="opt-letter">${letters[i]}</div>
      <span>${opt}</span>
    </button>
  `).join('');
}

function selectAnswer(selectedIdx) {
  if (answered) return;
  answered = true;

  const q = quizData[currentQ];
  const buttons = document.querySelectorAll('.quiz-opt-btn');

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) {
      btn.classList.add('correct');
    } else if (i === selectedIdx && selectedIdx !== q.correct) {
      btn.classList.add('wrong');
    }
  });

  if (selectedIdx === q.correct) {
    score += 10;
    correctCount++;
  } else {
    wrongCount++;
  }

  document.getElementById('quizScoreLive').textContent = 'Skor: ' + score;

  setTimeout(() => {
    currentQ++;
    if (currentQ < quizData.length) {
      renderQuestion();
    } else {
      showResult();
    }
  }, 1200);
}

function showResult() {
  document.getElementById('quizQuestion').classList.add('d-none');
  document.getElementById('quizResult').classList.remove('d-none');

  document.getElementById('resultScoreBig').textContent = score;
  document.getElementById('resCorrect').textContent = correctCount;
  document.getElementById('resWrong').textContent = wrongCount;

  let trophy, title, grade, gradeStyle;

  if (score >= 90) {
    trophy = 'gold';
    title = '🏆 Luar Biasa!';
    grade = 'A+ Expert Builder';
    gradeStyle = 'background:rgba(245,158,11,0.15);color:#F59E0B;border:1px solid rgba(245,158,11,0.3)';
  } else if (score >= 70) {
    trophy = 'silver';
    title = '🥈 Bagus Sekali!';
    grade = 'B Intermediate Builder';
    gradeStyle = 'background:rgba(148,163,184,0.1);color:#94A3B8;border:1px solid rgba(148,163,184,0.3)';
  } else if (score >= 50) {
    trophy = 'bronze';
    title = '🥉 Cukup Baik!';
    grade = 'C Beginner Builder';
    gradeStyle = 'background:rgba(205,127,50,0.1);color:#CD7F32;border:1px solid rgba(205,127,50,0.3)';
  } else {
    trophy = 'fail';
    title = '📚 Perlu Belajar Lagi!';
    grade = 'D Perlu Latihan';
    gradeStyle = 'background:rgba(239,68,68,0.1);color:#EF4444;border:1px solid rgba(239,68,68,0.3)';
  }

  const trophyEl = document.getElementById('resultTrophy');
  trophyEl.className = 'result-trophy ' + trophy;
  document.getElementById('resultTitle').textContent = title;
  const gradeEl = document.getElementById('resultGrade');
  gradeEl.textContent = grade;
  gradeEl.style = gradeStyle;
}
