// ======================= SETUP =======================

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const namesInput = document.getElementById("names");

const entriesTab = document.getElementById("entriesTab");
const resultsTab = document.getElementById("resultsTab");
const entriesPanel = document.getElementById("entriesPanel");
const resultsPanel = document.getElementById("resultsPanel");
const resultsList = document.getElementById("resultsList");

const SIZE = canvas.width;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = SIZE / 2 - 10;

let rotation = 0;
let spinning = false;
let results = [];

// ======================= DEFAULT NAMES =======================

const DEFAULT_NAMES = [
  "Ali", "Beatriz", "Charles", "Diana", "Ethan",
  "Fatima", "George", "Hana", "Ivan", "Julia"
];

namesInput.value = DEFAULT_NAMES.join("\n");

// ======================= UTILITIES =======================

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ======================= ENTRIES =======================

function getEntries() {
  const lines = namesInput.value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const count = lines.length;
  const angle = (Math.PI * 2) / count;

  return lines.map((label, i) => ({
    label,
    start: i * angle,
    angle,
    color: `hsl(${(i * 360) / count},80%,60%)`
  }));
}

// ======================= DRAW =======================

function drawWheel() {
  const entries = getEntries();
  if (!entries.length) return;

  ctx.clearRect(0, 0, SIZE, SIZE);

  entries.forEach(e => {
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(CX, CY, RADIUS, rotation + e.start, rotation + e.start + e.angle);
    ctx.fillStyle = e.color;
    ctx.fill();

    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(rotation + e.start + e.angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "14px system-ui";
    ctx.fillText(e.label, RADIUS - 12, 5);
    ctx.restore();
  });

  // Center hub
  ctx.beginPath();
  ctx.arc(CX, CY, 35, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  ctx.fillStyle = "#333";
  ctx.font = "bold 14px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Tap to spin", CX, CY + 5);

  // Pointer
  ctx.fillStyle = "#1e90ff";
  ctx.beginPath();
  ctx.moveTo(SIZE - 5, CY);
  ctx.lineTo(SIZE - 25, CY - 10);
  ctx.lineTo(SIZE - 25, CY + 10);
  ctx.fill();
}

// ======================= WINNER =======================

function getWinner() {
  const entries = getEntries();
  const norm = (Math.PI * 2 - rotation % (Math.PI * 2)) % (Math.PI * 2);
  let acc = 0;

  for (const e of entries) {
    acc += e.angle;
    if (norm <= acc) return e.label;
  }
}

// ======================= SPIN =======================

function spinWheel() {
  if (spinning) return;
  if (!getEntries().length) return;

  spinning = true;
  const duration = rand(4500, 6000);
  const spinAngle = rand(8, 12) * Math.PI * 2;
  const start = performance.now();
  const base = rotation;

  function animate(now) {
    const t = Math.min((now - start) / duration, 1);
    rotation = base + spinAngle * easeOutCubic(t);
    drawWheel();

    if (t < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const winner = getWinner();
      results.unshift(winner);
      updateResults();
    }
  }
  requestAnimationFrame(animate);
}

// ======================= RESULTS =======================

function updateResults() {
  resultsList.innerHTML = "";
  results.forEach(r => {
    const li = document.createElement("li");
    li.textContent = r;
    resultsList.appendChild(li);
  });

  resultsTab.textContent = `Results (${results.length})`;
}

// ======================= TABS =======================

entriesTab.onclick = () => {
  entriesTab.classList.add("active");
  resultsTab.classList.remove("active");
  entriesPanel.classList.add("active");
  resultsPanel.classList.remove("active");
};

resultsTab.onclick = () => {
  resultsTab.classList.add("active");
  entriesTab.classList.remove("active");
  resultsPanel.classList.add("active");
  entriesPanel.classList.remove("active");
};

// ======================= EVENTS =======================

spinBtn.onclick = spinWheel;
namesInput.oninput = () => {
  const count = getEntries().length;
  entriesTab.textContent = `Entries (${count})`;
  drawWheel();
};

// Initial draw
drawWheel();
