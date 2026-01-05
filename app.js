// ======================= app.js =======================
const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const spinBtn = document.getElementById("spinBtn");
const namesInput = document.getElementById("names");

let rotation = 0;
let spinning = false;

function getEntries() {
  return namesInput.value
    .split("\n")
    .filter(n => n.trim())
    .map((n, i) => ({
      label: n.trim(),
      color: `hsl(${i * 40},80%,60%)`
    }));
}

function draw() {
  const entries = getEntries();
  if (!entries.length) return;

  const angle = Math.PI * 2 / entries.length;
  ctx.clearRect(0,0,320,320);

  entries.forEach((e,i)=>{
    ctx.beginPath();
    ctx.moveTo(160,160);
    ctx.arc(160,160,150,rotation+i*angle,rotation+(i+1)*angle);
    ctx.fillStyle = e.color;
    ctx.fill();

    ctx.save();
    ctx.translate(160,160);
    ctx.rotate(rotation+(i+0.5)*angle);
    ctx.fillStyle="#000";
    ctx.fillText(e.label,60,5);
    ctx.restore();
  });
}

function spin() {
  if (spinning) return;
  spinning = true;
  const start = performance.now();
  const duration = 5000;
  const target = Math.random()*Math.PI*10+Math.PI*10;

  function animate(t){
    const p = Math.min((t-start)/duration,1);
    rotation += (1-Math.pow(1-p,3))*0.1;
    draw();
    if(p<1) requestAnimationFrame(animate);
    else spinning=false;
  }
  requestAnimationFrame(animate);
}

spinBtn.onclick = spin;
namesInput.oninput = draw;
draw();

