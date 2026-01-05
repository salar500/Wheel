// ======================= app.js =======================

// Canvas setup
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const namesInput = document.getElementById("names");

const SIZE = canvas.width;
const CX = SIZE / 2;
const CY = SIZE / 2;
const RADIUS = SIZE / 2 - 10;

let rotation = 0;
let spinning = false;

// ----------- UTILITIES -----------

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function random(min, max) {
  return Math.random() * (max - min) + min;
}

// ----------- DATA MODEL -----------

function getEntries() {
  const lines = namesInput.value
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const count = lines.length;
  const anglePerSlice = (Math.PI * 2) / count;

  return lines.map((label, i) => ({
    label,
    startAngle: i * anglePerSlice,
    angle: anglePerSlice,
    color: `hsl(${(i * 360) / count}, 80%, 60%)`
  }));
}

// ----------- DRAWING -----------

function drawWheel() {
  const entries = getEntries();
  if (!entries.length) return;

  ctx.clearRect(0, 0, SIZE, SIZE);

  entries.forEach(entry => {
    ctx.beginPath();
    ctx.moveTo(CX, CY);
    ctx.arc(
      CX,
      CY,
      RADIUS,
      rotation + entry.startAngle,
      rotation + entry.startAngle + entry.angle
    );
    ctx.fillStyle = entry.color;
    ctx.fill();

    // Draw text
    ctx.save();
    ctx.translate(CX, CY);
    ctx.rotate(rotation + entry.startAngle + entry.angle / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#000";
    ctx.font = "14px system-ui";
    ctx.fillText(entry.label, RADIUS - 12, 5);
    ctx.restore();
  });

  // Center hub
  ctx.beginPath();
  ctx.arc(CX, CY, 35, 0, Math.PI * 2);
  ctx.fillStyle = "#fff";
  ctx.fill();

  // Center text
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
  ctx.closePath();
  ctx.fill();
}

// ----------- WINNER LOGIC -----------

function getWinner() {
  const entries = getEntries();
  const normalized =
    (Math.PI * 2 - (rotation % (Math.PI * 2))) % (Math.PI * 2);

  let acc = 0;
  for (const entry of entries) {
    acc += entry.angle;
    if (normalized <= acc) return entry.label;
  }
}

// ----------- SPIN -----------

function spinWheel() {
  if (spinning) return;
  const entries = getEntries();
  if (!entries.length) return;

  spinning = true;

  const spinDuration = random(4500, 6000);
  const spinAngle = random(8, 12) * Math.PI * 2;
  const start = performance.now();
  const initialRotation = rotation;

  function animate(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / spinDuration, 1);
    const eased = easeOutCubic(progress);

    rotation = initialRotation + spinAngle * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      spinning = false;
      const winner = getWinner();
      console.log("Winner:", winner);
    }
  }

  requestAnimationFrame(animate);
}

// ----------- EVENTS -----------

spinBtn.addEventListener("click", spinWheel);
namesInput.addEventListener("input", drawWheel);

// Initial draw
drawWheel();
