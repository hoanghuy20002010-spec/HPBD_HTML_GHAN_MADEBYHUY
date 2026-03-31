const screens = {
  quiz: document.getElementById('quiz-screen'),
  pass: document.getElementById('password-screen'),
  matrix: document.getElementById('matrix-screen'),
  galaxy: document.getElementById('galaxy-screen')
};

const optionData = {
  1: { title: 'Ủa có nhầm không vậy con bò 🤣', text: 'Hình như là bạn bấm nhầm r á chứ s mà trẻ như z đc 😁' },
  2: { title: 'VAR ???', text: 'Bò này thích var à, ae 36 lên phím 😤' },
  3: { title: 'sixxxx-sevennnnnnn', text: 'ok bà dà 😇' }
};

const chosen = new Set();
let currentChoice = null;
let runMoved = false;

const optionRow = document.getElementById('option-row');
const detailCard = document.getElementById('option-detail');
const detailTitle = document.getElementById('detail-title');
const detailText = document.getElementById('detail-text');
const backOptionBtn = document.getElementById('back-option');
const pickOptionBtn = document.getElementById('pick-option');
const board = document.getElementById('main-board');
const bigCat = document.getElementById('big-cat');
const runBtn = document.getElementById('run-btn');
const openBtn = document.getElementById('open-btn');
const teasePopup = document.getElementById('tease-popup');
const closeTease = document.getElementById('close-tease');
const floating = document.getElementById('floating-icons');

function showScreen(target) {
  Object.values(screens).forEach((screen) => {
    screen.classList.add('hidden');
    screen.classList.remove('active');
  });
  target.classList.remove('hidden');
  target.classList.add('active');
}

function createFloatingIcons() {
  const icons = ['💖', '✨', '🌸', '🧁', '🎀', '💗'];
  for (let i = 0; i < 32; i += 1) {
    const node = document.createElement('span');
    node.className = 'float-icon';
    node.textContent = icons[Math.floor(Math.random() * icons.length)];
    node.style.left = `${Math.random() * 100}%`;
    node.style.top = `${Math.random() * 100}%`;
    node.style.fontSize = `${12 + Math.random() * 16}px`;
    node.style.animationDuration = `${8 + Math.random() * 8}s`;
    node.style.animationDelay = `${-Math.random() * 8}s`;
    floating.appendChild(node);
  }
}

optionRow.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-option]');
  if (!button) return;

  const optionId = button.dataset.option;
  if (chosen.has(optionId)) return;

  currentChoice = optionId;
  detailTitle.textContent = optionData[optionId].title;
  detailText.textContent = optionData[optionId].text;

  board.classList.add('hidden');
  detailCard.classList.remove('hidden');
});

backOptionBtn.addEventListener('click', () => {
  detailCard.classList.add('hidden');
  board.classList.remove('hidden');
});

pickOptionBtn.addEventListener('click', () => {
  if (!currentChoice) return;
  chosen.add(currentChoice);

  const btn = optionRow.querySelector(`button[data-option="${currentChoice}"]`);
  if (btn) btn.classList.add('hidden');

  detailCard.classList.add('hidden');

  const remaining = optionRow.querySelectorAll('button[data-option]:not(.hidden)');
  if (remaining.length === 0) {
    board.classList.add('hidden');
    bigCat.classList.remove('hidden');
  } else {
    board.classList.remove('hidden');
  }

  currentChoice = null;
});

runBtn.addEventListener('click', () => {
  if (!runMoved) {
    runBtn.classList.add('corner');
    runMoved = true;
  } else {
    teasePopup.classList.remove('hidden');
    runBtn.classList.add('hidden');
  }
});

closeTease.addEventListener('click', () => teasePopup.classList.add('hidden'));
openBtn.addEventListener('click', () => showScreen(screens.pass));

const passDisplay = document.getElementById('pass-display');
const passMsg = document.getElementById('pass-msg');
const keyGrid = document.getElementById('key-grid');
let passRaw = '';
const PASSWORD = '010410';

function buildKeyPad() {
  const buttons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '✓', '0', '✕'];
  buttons.forEach((key) => {
    const btn = document.createElement('button');
    btn.textContent = key;
    if (key === '✓' || key === '✕') btn.classList.add('action');
    btn.addEventListener('click', () => onKeyClick(key));
    keyGrid.appendChild(btn);
  });
}

function onKeyClick(key) {
  if (/\d/.test(key)) {
    if (passRaw.length < 6) {
      passRaw += key;
      passDisplay.value = '•'.repeat(passRaw.length);
    }
    return;
  }

  if (key === '✕') {
    passRaw = passRaw.slice(0, -1);
    passDisplay.value = '•'.repeat(passRaw.length);
    return;
  }

  if (passRaw === PASSWORD) {
    passMsg.textContent = 'Đúng rồi nè, Đoán được hay z 🤩';
    passMsg.style.color = '#0f9b4e';
    setTimeout(startMatrixScene, 550);
  } else {
    passMsg.textContent = 'Sai pass r, mk liên qua mật thiết đến hnay đó nha 😝';
    passMsg.style.color = '#d0004d';
    passRaw = '';
    passDisplay.value = '';
  }
}

const matrixCanvas = document.getElementById('matrix-canvas');
const mctx = matrixCanvas.getContext('2d');
const giftWrap = document.getElementById('gift-btn-wrap');

let matrixCols = 0;
let matrixDrops = [];
let matrixAnim = null;

const textStages = ['chúc mừng', 'sinh nhật', 'vui vẻ', 'tuổi mới', 'sức khỏe', 'xinh đẹp', 'hạnh phúc','Nhé Con BÒOOO'];
let textStageIndex = 0;
let particleState = [];
let targetState = [];
let textInterval = null;
let particleRunning = false;

function resizeMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  const size = 12;
  matrixCols = Math.floor(matrixCanvas.width / size);
  matrixDrops = Array.from({ length: matrixCols }, () => Math.random() * -160);
}

function drawMatrixRain() {
  const size = 12;
  mctx.fillStyle = 'rgba(3,1,12,0.12)';
  mctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);

  mctx.font = `${size}px monospace`;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789あいうえおアイウエオHappyBirthday';

  for (let i = 0; i < matrixCols; i += 1) {
    const x = i * size;
    for (let k = 0; k < 2; k += 1) {
      const char = chars[Math.floor(Math.random() * chars.length)];
      const y = (matrixDrops[i] - k * 2.6) * size;
      mctx.fillStyle = k === 0 ? 'rgba(233,219,255,0.95)' : 'rgba(116,76,196,0.7)';
      mctx.fillText(char, x, y);
    }
    if (matrixDrops[i] * size > matrixCanvas.height && Math.random() > 0.975) matrixDrops[i] = 0;
    matrixDrops[i] += 1.25;
  }
}

function textToPoints(text, width = matrixCanvas.width, height = matrixCanvas.height) {
  const off = document.createElement('canvas');
  off.width = width;
  off.height = height;
  const ctx = off.getContext('2d');

  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${Math.max(76, width * 0.11)}px "Be Vietnam Pro", sans-serif`;
  ctx.fillText(text, width / 2, height / 2);

  const data = ctx.getImageData(0, 0, width, height).data;
  const points = [];
  const gap = 6;
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      const idx = (y * width + x) * 4;
      if (data[idx] > 220) points.push({ x, y });
    }
  }
  return points;
}

function morphToPoints(points) {
  targetState = points;
  while (particleState.length < targetState.length) {
    particleState.push({ x: Math.random() * matrixCanvas.width, y: Math.random() * matrixCanvas.height, vx: 0, vy: 0 });
  }
}

function morphToText(text) {
  morphToPoints(textToPoints(text));
}

function updateParticles() {
  for (let i = 0; i < targetState.length; i += 1) {
    const p = particleState[i];
    const t = targetState[i];
    p.vx += (t.x - p.x) * 0.032;
    p.vy += (t.y - p.y) * 0.032;
    p.vx *= 0.74;
    p.vy *= 0.74;
    p.x += p.vx;
    p.y += p.vy;
  }
}

function drawParticles() {
  for (let i = 0; i < targetState.length; i += 1) {
    const p = particleState[i];
    mctx.fillStyle = i % 7 === 0 ? '#ffd0ee' : '#ffffff';
    mctx.fillRect(p.x, p.y, 2.9, 2.9);
  }
}

function matrixLoop() {
  drawMatrixRain();
  if (particleRunning) {
    updateParticles();
    drawParticles();
  }
  matrixAnim = requestAnimationFrame(matrixLoop);
}

function makeCakePoints() {
  const cx = matrixCanvas.width / 2;
  const cy = matrixCanvas.height / 2 + 30;
  const points = [];

  const rect = (w, h, yOffset, density = 5) => {
    for (let y = -h / 2; y <= h / 2; y += density) {
      for (let x = -w / 2; x <= w / 2; x += density) {
        if (Math.abs(x) > w / 2 - 5 || Math.abs(y) > h / 2 - 5 || Math.random() > 0.55) {
          points.push({ x: cx + x, y: cy + y + yOffset });
        }
      }
    }
  };

  rect(240, 54, 62, 4.5);
  rect(188, 52, 8, 4.5);
  rect(134, 50, -44, 4.5);

  for (let i = -52; i <= 52; i += 6) points.push({ x: cx + i, y: cy - 76 + Math.sin(i * 0.12) * 5 });
  for (let y = -128; y <= -78; y += 4) points.push({ x: cx, y: cy + y });
  for (let a = 0; a < Math.PI * 2; a += 0.2) {
    points.push({ x: cx + Math.cos(a) * 10, y: cy - 140 + Math.sin(a) * 10 });
    if (Math.random() > 0.35) points.push({ x: cx + Math.cos(a) * 5, y: cy - 140 + Math.sin(a) * 5 });
  }
  return points;
}

function startMorphTextSequence() {
  particleRunning = true;
  textStageIndex = 0;
  giftWrap.classList.add('hidden');
  morphToText(textStages[textStageIndex]);

  textInterval = setInterval(() => {
    textStageIndex += 1;
    if (textStageIndex < textStages.length) {
      morphToText(textStages[textStageIndex]);
    } else {
      clearInterval(textInterval);
      setTimeout(() => {
        morphToPoints(makeCakePoints());
        setTimeout(() => giftWrap.classList.remove('hidden'), 1700);
      }, 1200);
    }
  }, 2300);
}

function startMatrixScene() {
  showScreen(screens.matrix);
  resizeMatrix();
  particleState = [];
  targetState = [];
  if (matrixAnim) cancelAnimationFrame(matrixAnim);
  matrixLoop();
  startMorphTextSequence();
}

const giftBtn = document.getElementById('gift-btn');
const transitionLayer = document.getElementById('scene-transition');

giftBtn.addEventListener('click', () => {
  transitionLayer.classList.remove('hidden');
  requestAnimationFrame(() => transitionLayer.classList.add('active'));

  setTimeout(() => {
    showScreen(screens.galaxy);
    if (!galaxyInitialized) {
      initGalaxyScene();
    }
  }, 320);

  setTimeout(() => {
    transitionLayer.classList.remove('active');
    setTimeout(() => transitionLayer.classList.add('hidden'), 520);
  }, 820);
});

let galaxyInitialized = false;
let renderer;
let scene;
let camera;
let controls;
let starCore;
let starField;
let wishesGroup;
let sunShaderUniforms;
let coronaInnerMat;
let coronaOuterMat;

function randomWish(i) {
  const base = 
  [
   'Chúc bạn tuổi mới luôn vui vẻ, hạnh phúc và đạt được mọi điều mong muốn!', 
   'Sinh nhật vui vẻ nhé! Mong mọi điều tốt đẹp sẽ đến với bạn.', 
   'Chúc bạn ngày càng xinh đẹp và thành công trong cuộc sống!', 
   'Happy Birthday! Chúc bạn luôn cười thật nhiều mỗi ngày.', 
   'Sinh nhật vui vẻ! Nhớ lớn rồi thì bớt báo đời nha.', 
   'Sinh nhật vui vẻ! Chúc bạn hết ế… nhưng chắc còn lâu 🤣',
   'Mong năm nay bạn bớt lười, bớt ngủ, bớt ăn… à thôi chắc không được.',
   'Chúc bạn tiền nhiều như tóc… nhưng mà đừng rụng nha 💀',
   'Chúc bạn luôn vui vẻ, dù cuộc đời có “troll” bạn như mình 😎',
   'Mong bạn bớt nhây lại một chút… à mà thôi, mất chất 🤣',
   'Chúc bạn tuổi mới bớt giận lại nhé… không là ế dài dài 😏',
   'Sinh nhật vui vẻ! Nhớ là vẫn nợ mình một chầu đó nha 😎',
   'Ngày của bò, spotlight của Hân.',
   'Không già đi, chỉ nâng cấp.',
   'Upgrade completed.',
   'Tuổi mới bớt stress, thêm nhiều niềm vui nhé!',
   'Chúc bạn có thật nhiều kỷ niệm đẹp trong tuổi mới.',
   'Chúc bạn luôn thành công trên con đường bạn đã chọn.',
   'Thêm tuổi mới, mong bạn trưởng thành hơn… chứ hiện tại hơi tẻn 😭'
  ];
  return `${base[i % base.length]} #${i + 1}`;
}

function startGalaxyFallback(container, reasonText = '') {
  container.innerHTML = '';
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  container.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  const stars = Array.from({ length: 800 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: 0.5 + Math.random() * 1.8,
    a: Math.random() * Math.PI * 2,
    s: 0.2 + Math.random() * 0.8
  }));

  let f = 0;
  function draw() {
    f += 0.016;
    const g = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 20, canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) * 0.6);
    g.addColorStop(0, '#182653');
    g.addColorStop(1, '#040814');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;

    stars.forEach((s) => {
      s.y += s.s;
      if (s.y > canvas.height) s.y = -4;
      const blink = 0.4 + (Math.sin(f + s.a) + 1) * 0.3;
      ctx.fillStyle = `rgba(210,230,255,${blink})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 120);
    glow.addColorStop(0, 'rgba(255,255,255,0.95)');
    glow.addColorStop(0.5, 'rgba(180,255,220,0.45)');
    glow.addColorStop(1, 'rgba(180,255,220,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(cx, cy, 120, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(draw);
  }

  draw();

  if (reasonText) {
    const msg = document.createElement('div');
    msg.style.position = 'absolute';
    msg.style.bottom = '14px';
    msg.style.left = '14px';
    msg.style.padding = '10px 12px';
    msg.style.borderRadius = '10px';
    msg.style.background = 'rgba(0,0,0,0.35)';
    msg.style.color = '#fff';
    msg.style.font = '600 13px "Be Vietnam Pro", sans-serif';
    msg.textContent = reasonText;
    container.appendChild(msg);
  }
}

function makeTextSprite(message) {
  const fontSize = 52;
  const font = `700 ${fontSize}px "Be Vietnam Pro", sans-serif`;
  const padding = { x: 60, y: 44 };
  const maxWidth = 900;

  // Đo chiều rộng text thật
  const measurer = document.createElement('canvas').getContext('2d');
  measurer.font = font;
  const textWidth = Math.min(measurer.measureText(message).width, maxWidth);

  const canvasW = textWidth + padding.x * 2;
  const canvasH = fontSize + padding.y * 2;

  const canvas = document.createElement('canvas');
  canvas.width  = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext('2d');

  // Nền bo góc
  ctx.fillStyle = 'rgba(255,255,255,0.95)';
  ctx.strokeStyle = 'rgba(220,220,235,1)';
  ctx.lineWidth = 8;
  const r = 28;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(canvasW, 0,     canvasW, canvasH, r);
  ctx.arcTo(canvasW, canvasH, 0,     canvasH, r);
  ctx.arcTo(0,       canvasH, 0,     0,       r);
  ctx.arcTo(0,       0,       canvasW, 0,     r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Text
  ctx.fillStyle = '#101522';
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(message, canvasW / 2, canvasH / 2, maxWidth);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = Math.min(8, renderer?.capabilities?.getMaxAnisotropy?.() || 8);

  const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(material);

  // Scale tỉ lệ theo đúng canvas để không bị méo
  const aspect = canvasW / canvasH;
  sprite.scale.set(aspect * 1.4, 1.4, 1);
  return sprite;
}

function createSunTexture(size = 2048) {
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d');
  const center = size / 2;
  const radius = size * 0.49;

  const plasma = Array.from({ length: 2600 }, () => ({
    a: Math.random() * Math.PI * 2,
    r: Math.pow(Math.random(), 0.55) * radius,
    drift: 0.2 + Math.random() * 1.2,
    pulse: Math.random() * Math.PI * 2,
    size: 1 + Math.random() * 10,
    hot: Math.random() > 0.35
  }));

  const prominences = Array.from({ length: 220 }, () => ({
    a: Math.random() * Math.PI * 2,
    h: size * (0.02 + Math.random() * 0.08),
    w: 0.4 + Math.random() * 2.8,
    phase: Math.random() * Math.PI * 2,
    speed: 0.4 + Math.random() * 2.2
  }));

  const draw = (time = 0) => {
    const t = time * 0.001;

    ctx.clearRect(0, 0, size, size);

    const base = ctx.createRadialGradient(center, center, size * 0.03, center, center, radius);
    base.addColorStop(0, '#ffe79a');
    base.addColorStop(0.22, '#ffc86a');
    base.addColorStop(0.48, '#ff9c3d');
    base.addColorStop(0.74, '#e96b1f');
    base.addColorStop(1, '#b43a0f');
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, size, size);

    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, radius * 0.98, 0, Math.PI * 2);
    ctx.clip();

    for (let i = 0; i < 9; i += 1) {
      const swirl = ctx.createRadialGradient(
        center + Math.sin(t * 0.14 + i * 0.9) * radius * 0.35,
        center + Math.cos(t * 0.17 + i * 1.1) * radius * 0.35,
        10,
        center,
        center,
        radius
      );
      swirl.addColorStop(0, `rgba(255,255,180,${0.035 + (i % 3) * 0.01})`);
      swirl.addColorStop(1, 'rgba(255,120,10,0)');
      ctx.fillStyle = swirl;
      ctx.fillRect(0, 0, size, size);
    }

    plasma.forEach((p, i) => {
      const pulse = 0.45 + 0.55 * Math.sin(t * p.drift + p.pulse + i * 0.0007);
      const ang = p.a + Math.sin(t * 0.28 + p.pulse) * 0.03;
      const rr = p.r + Math.sin(t * 0.8 + p.pulse) * 7;
      const x = center + Math.cos(ang) * rr;
      const y = center + Math.sin(ang) * rr;
      const alpha = 0.06 + pulse * 0.24;
      const s = p.size * (0.6 + pulse * 0.9);

      ctx.fillStyle = p.hot ? `rgba(255,70,0,${alpha})` : `rgba(255,230,120,${alpha * 0.88})`;
      ctx.beginPath();
      ctx.arc(x, y, s, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < 480; i += 1) {
      const a = (i / 480) * Math.PI * 2;
      const wave = Math.sin(a * 9 + t * 0.7) * 8 + Math.sin(a * 23 - t * 0.55) * 4;
      const r1 = radius * 0.2 + Math.abs(Math.sin(a * 3 + t * 0.3)) * radius * 0.55;
      const x1 = center + Math.cos(a) * r1;
      const y1 = center + Math.sin(a) * r1;
      const x2 = center + Math.cos(a + 0.03) * (r1 + wave);
      const y2 = center + Math.sin(a + 0.03) * (r1 + wave);
      ctx.strokeStyle = `rgba(255,140,30,${0.03 + Math.abs(wave) * 0.004})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();

    prominences.forEach((pr, i) => {
      const burst = 0.5 + 0.5 * Math.sin(t * pr.speed + pr.phase + i * 0.07);
      const ang = pr.a + Math.sin(t * 0.22 + pr.phase) * 0.03;
      const inner = radius * 0.985;
      const outer = radius + pr.h * burst;

      const grad = ctx.createLinearGradient(
        center + Math.cos(ang) * inner,
        center + Math.sin(ang) * inner,
        center + Math.cos(ang) * outer,
        center + Math.sin(ang) * outer
      );
      grad.addColorStop(0, `rgba(255,225,120,${0.1 + burst * 0.18})`);
      grad.addColorStop(1, `rgba(255,70,0,${0.12 + burst * 0.36})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = pr.w + burst * 2.3;
      ctx.beginPath();
      ctx.moveTo(center + Math.cos(ang) * inner, center + Math.sin(ang) * inner);
      ctx.lineTo(center + Math.cos(ang) * outer, center + Math.sin(ang) * outer);
      ctx.stroke();
    });

    const rim = ctx.createRadialGradient(center, center, radius * 0.88, center, center, radius * 1.08);
    rim.addColorStop(0, 'rgba(255,255,210,0)');
    rim.addColorStop(0.7, 'rgba(255,220,130,0.36)');
    rim.addColorStop(1, 'rgba(255,80,20,0)');
    ctx.fillStyle = rim;
    ctx.fillRect(0, 0, size, size);
  };

  draw(0);

  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = true;

  return { texture: tex, redraw: draw };
}

function createStarCore() {
  sunShaderUniforms = {
    uTime: { value: 0.0 },
    uViolence: { value: 1.08 }
  };

  const sunVertex = `
    varying vec3 vWorldPos;
    varying vec3 vNormalW;
    varying vec3 vObjPos;
    uniform float uTime;
    uniform float uViolence;

    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);} 
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.y;
      vec4 y=y_*ns.x+ns.y;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    float fbm6(vec3 p){
      float f=0.0;
      float a=0.56;
      for(int i=0;i<6;i++){
        f+=a*snoise(p);
        p=p*2.03+vec3(13.1,7.7,4.3);
        a*=0.52;
      }
      return f;
    }

    void main(){
      vec3 p=position;
      float t=uTime;

      float n1=fbm6(p*1.05 + vec3(t*0.34, -t*0.14, t*0.22));
      float n2=fbm6(p*2.1  + vec3(-t*0.52,  t*0.24, t*0.31));
      float n3=fbm6(p*4.2  + vec3(t*0.82, -t*0.66, t*0.2));
      float violent=(n1*0.62+n2*0.28+n3*0.10)*(uViolence*0.62);

      float disp=(violent*0.14 + sin((p.y+p.x)*5.5+t*1.6)*0.015);
      p += normal * disp;

      vec4 world=modelMatrix*vec4(p,1.0);
      vWorldPos=world.xyz;
      vObjPos=p;
      vNormalW=normalize(normalMatrix*normal);
      gl_Position=projectionMatrix*viewMatrix*world;
    }
  `;

  const sunFragment = `
    varying vec3 vWorldPos;
    varying vec3 vNormalW;
    varying vec3 vObjPos;
    uniform float uTime;
    uniform float uViolence;

    vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
    vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);} 
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
    float snoise(vec3 v){
      const vec2 C=vec2(1.0/6.0,1.0/3.0);
      const vec4 D=vec4(0.0,0.5,1.0,2.0);
      vec3 i=floor(v+dot(v,C.yyy));
      vec3 x0=v-i+dot(i,C.xxx);
      vec3 g=step(x0.yzx,x0.xyz);
      vec3 l=1.0-g;
      vec3 i1=min(g.xyz,l.zxy);
      vec3 i2=max(g.xyz,l.zxy);
      vec3 x1=x0-i1+C.xxx;
      vec3 x2=x0-i2+C.yyy;
      vec3 x3=x0-D.yyy;
      i=mod289(i);
      vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
      float n_=0.142857142857;
      vec3 ns=n_*D.wyz-D.xzx;
      vec4 j=p-49.0*floor(p*ns.z*ns.z);
      vec4 x_=floor(j*ns.z);
      vec4 y_=floor(j-7.0*x_);
      vec4 x=x_*ns.x+ns.y;
      vec4 y=y_*ns.x+ns.y;
      vec4 h=1.0-abs(x)-abs(y);
      vec4 b0=vec4(x.xy,y.xy);
      vec4 b1=vec4(x.zw,y.zw);
      vec4 s0=floor(b0)*2.0+1.0;
      vec4 s1=floor(b1)*2.0+1.0;
      vec4 sh=-step(h,vec4(0.0));
      vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
      vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
      vec3 p0=vec3(a0.xy,h.x);
      vec3 p1=vec3(a0.zw,h.y);
      vec3 p2=vec3(a1.xy,h.z);
      vec3 p3=vec3(a1.zw,h.w);
      vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
      p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
      vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
      m=m*m;
      return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
    }

    float fbm8(vec3 p){
      float f=0.0;
      float a=0.58;
      mat3 rot=mat3(0.00,0.80,0.60,-0.80,0.36,-0.48,-0.60,-0.48,0.64);
      for(int i=0;i<8;i++){
        f+=a*snoise(p);
        p=rot*p*1.92 + vec3(19.4,7.1,3.8);
        a*=0.54;
      }
      return f;
    }

    void main(){
      vec3 n=normalize(vNormalW);
      vec3 viewDir=normalize(cameraPosition-vWorldPos);
      float ndv=dot(n,viewDir);
      float edge=pow(1.0-ndv,2.2);

      float t=uTime;
      vec3 p=vObjPos*0.92;

      float flowA=fbm8(p*1.8 + vec3( t*0.75,-t*0.31, t*0.42));
      float flowB=fbm8(p*3.9 + vec3(-t*1.1, t*0.76,-t*0.62));
      float flowC=fbm8(p*8.4 + vec3( t*1.9,-t*1.3, t*0.8));
      float micro=fbm8(p*16.5+ vec3(-t*2.8, t*2.1,-t*1.7));

      float turbulence = flowA*0.42 + flowB*0.28 + flowC*0.2 + micro*0.1;
      turbulence *= 1.0 + (uViolence-1.0)*0.45;

      float gran = smoothstep(-0.58, 0.82, turbulence);
      float cells = smoothstep(0.25, 0.95, flowB + flowC*0.35);
      float filaments = smoothstep(0.38, 0.98, micro + flowC*0.55);

      vec3 cCore  = vec3(1.0,0.97,0.84);
      vec3 cMid   = vec3(1.0,0.64,0.18);
      vec3 cOuter = vec3(0.52,0.07,0.015);

      vec3 col = mix(cOuter, cMid, gran);
      col = mix(col, cCore, pow(gran, 2.15));
      col += cells * vec3(0.95,0.34,0.06) * 0.48;
      col += filaments * vec3(1.0,0.78,0.22) * 0.16;

      float spikeNoise = fbm8(normalize(vObjPos)*10.0 + vec3(t*0.9,-t*0.7,t*0.5));
      float spikes = pow(max(0.0, edge * (0.75 + spikeNoise * 0.65)), 2.8);
      col += spikes * vec3(1.0,0.42,0.09) * 1.65;

      float fres = pow(1.0-ndv, 3.4);
      col += fres * vec3(1.0,0.56,0.12) * 1.2;

      col *= 1.12 + cells*0.18 + spikes*0.44;
      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const core = new THREE.Mesh(
    new THREE.SphereGeometry(2.5, 220, 220),
    new THREE.ShaderMaterial({
      uniforms: sunShaderUniforms,
      vertexShader: sunVertex,
      fragmentShader: sunFragment
    })
  );

  coronaInnerMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vN;
      varying vec3 vW;
      void main(){
        vN = normalize(normalMatrix * normal);
        vec4 w = modelMatrix * vec4(position,1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      varying vec3 vN;
      varying vec3 vW;
      uniform float uTime;
      void main(){
        vec3 V = normalize(cameraPosition - vW);
        float ndv = max(dot(normalize(vN), V), 0.0);
        float edge = 1.0 - ndv;
        float flick = 0.65 + 0.35*sin(uTime*1.6 + vW.x*1.8 + vW.y*2.1);
        float alpha = exp(-3.2 * (1.0-edge)) * edge * 1.55 * flick;
        vec3 col = mix(vec3(1.0,0.58,0.12), vec3(1.0,0.28,0.05), edge);
        gl_FragColor = vec4(col, alpha);
      }
    `
  });

  const coronaInner = new THREE.Mesh(new THREE.SphereGeometry(2.95, 180, 180), coronaInnerMat);
  coronaInner.visible = false;
  core.add(coronaInner);

  coronaOuterMat = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec3 vN;
      varying vec3 vW;
      void main(){
        vN = normalize(normalMatrix * normal);
        vec4 w = modelMatrix * vec4(position,1.0);
        vW = w.xyz;
        gl_Position = projectionMatrix * viewMatrix * w;
      }
    `,
    fragmentShader: `
      varying vec3 vN;
      varying vec3 vW;
      uniform float uTime;
      void main(){
        vec3 V = normalize(cameraPosition - vW);
        float edge = 1.0 - max(dot(normalize(vN), V), 0.0);
        float pulse = 0.72 + 0.28*sin(uTime*0.8 + vW.z*1.3);
        float alpha = pow(edge, 3.4) * 0.82 * pulse;
        vec3 col = vec3(1.0,0.22,0.05);
        gl_FragColor = vec4(col, alpha);
      }
    `
  });

  const coronaOuter = new THREE.Mesh(new THREE.SphereGeometry(3.55, 140, 140), coronaOuterMat);
  coronaOuter.visible = false;
  core.add(coronaOuter);

  return core;
}

function initGalaxyScene() {
  const container = document.getElementById('three-container');
  container.innerHTML = '';

  try {
    if (!window.THREE || !THREE.OrbitControls) {
      throw new Error('Three.js hoặc OrbitControls chưa tải được');
    }

    galaxyInitialized = true;

    scene = new THREE.Scene();

    const bgCanvas = document.createElement('canvas');
    bgCanvas.width = 1024;
    bgCanvas.height = 1024;
    const bgCtx = bgCanvas.getContext('2d');
    const skyGrad = bgCtx.createRadialGradient(512, 360, 60, 512, 512, 760);
    skyGrad.addColorStop(0, '#1b2458');
    skyGrad.addColorStop(0.35, '#111a44');
    skyGrad.addColorStop(0.72, '#0a1231');
    skyGrad.addColorStop(1, '#04081d');
    bgCtx.fillStyle = skyGrad;
    bgCtx.fillRect(0, 0, 1024, 1024);

    for (let i = 0; i < 900; i += 1) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = Math.random() * 1.6;
      const a = 0.25 + Math.random() * 0.55;
      bgCtx.fillStyle = `rgba(220,235,255,${a})`;
      bgCtx.beginPath();
      bgCtx.arc(x, y, r, 0, Math.PI * 2);
      bgCtx.fill();
    }

    const bgTex = new THREE.CanvasTexture(bgCanvas);
    bgTex.encoding = THREE.sRGBEncoding;
    scene.background = bgTex;

    camera = new THREE.PerspectiveCamera(62, window.innerWidth / window.innerHeight, 0.1, 420);
    camera.position.set(0, 4.5, 16);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.86;
    container.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.minDistance = 4;
    controls.maxDistance = 50;
    controls.target.set(0, 0, 0);

    const starLight = new THREE.PointLight(0xffb14b, 4.2, 95, 2.0);
    starLight.position.set(0, 0, 0);
    scene.add(starLight);

    starCore = createStarCore();
    scene.add(starCore);

    const starsGeo = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i += 1) {
      const radius = 40 + Math.random() * 140;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi);
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }
    starsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starsMat = new THREE.PointsMaterial({
      color: 0xfff4df,
      size: 0.19,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.9
    });
    starField = new THREE.Points(starsGeo, starsMat);
    scene.add(starField);

    const nebulaColors = [0x68b6ff, 0x8f6dff, 0xff7cc4, 0x5b7bff, 0x2ad7ff];
    nebulaColors.forEach((color, idx) => {
      const sph = new THREE.Mesh(
        new THREE.SphereGeometry(8 + Math.random() * 7, 18, 18),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: 0.04,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        })
      );
      const a = (idx / nebulaColors.length) * Math.PI * 2;
      sph.position.set(Math.cos(a) * 11, (Math.random() - 0.5) * 6, Math.sin(a) * 11);
      scene.add(sph);
    });

    wishesGroup = new THREE.Group();

const orbits = [
  { count: 14, radius: 11,  y:  2.8,  speed:  0.0011, type: 'image' },
  { count: 16, radius: 13,  y:  0.8,  speed:  0.0008, type: 'text'  },
  { count: 16, radius: 13,  y: -0.8,  speed: -0.0009, type: 'image' },
  { count: 14, radius: 11,  y: -2.8,  speed: -0.0012, type: 'text'  },
];

const imageUrls = [
  'https://i.ibb.co/gb31Csqw/6b8d231b-c6f2-4e7e-9421-baf398ba8457.jpg',
  'https://i.ibb.co/Cs6krqDh/4f001a65-a0ea-4467-b4bc-10573eb6025c.jpg',
  'https://i.ibb.co/xS6qmGHQ/8eae99c5-ab3c-4c7d-8acb-daa906f71680.jpg',
  'https://i.ibb.co/r2f1KjfM/0e02e012-d0d1-4704-9972-5e0528c747aa.jpg',
  'https://i.ibb.co/9HR0GDfQ/19be5e1c-a385-4917-a98a-4b7c44795f3a.jpg',
  'https://i.ibb.co/xqGnH0YC/05514493-1238-4d9b-a28f-70c98e7bab5c.jpg',
  'https://i.ibb.co/gbYTMx24/7e16b11f-4d62-4cbc-a9c0-60aef60ae4da.jpg',
  'https://i.ibb.co/tPLG7Xvf/27bafc79-8560-4dc6-bfb7-01fce28d208a.jpg',
  'https://i.ibb.co/spRvtmHT/2c02fb5a-7bc0-4e45-8a51-190b12ff078d.jpg',
  'https://i.ibb.co/ksmqnPQ7/09a448ad-6ca1-4621-8805-902711cff048.jpg',
  'https://i.ibb.co/S45ZmzY1/effa3918-0100-4dbd-8284-affb36598f07.jpg',
  'https://i.ibb.co/TMtJVSdc/4a45f698-bb58-4d21-a9ab-d501701e2d49.jpg',
  'https://i.ibb.co/qFRQwHtd/16729365-a56b-43a1-be12-7ec4f775740b.jpg',
  'https://i.ibb.co/Kc8NJW0N/62c69225-bd3d-4257-ae3c-352d2dd701a1.jpg',
  'https://i.ibb.co/ycKNN36F/14f0e754-0449-42b2-aded-b5c36ab2d294.jpg',
  'https://i.ibb.co/M5ZPdPJR/85ed7fde-8487-42a0-b369-6b9d05ea1952.jpg',
  'https://i.ibb.co/fYTDB4j5/3a044204-dccc-4239-9b6b-3a164a0c544b.jpg',
  'https://i.ibb.co/C5H3RGBW/ac4a586f-e50e-42cc-9e27-a2a693c5a32a.jpg',
  'https://i.ibb.co/Kj15JbTr/391610e2-e536-4136-ab8c-d736d1eae4db.jpg',
  'https://i.ibb.co/nqPJZVc5/9175d9b9-3a51-49fa-a376-5f5d4a98c25a.jpg',
];

function makeImageSprite(url) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Bo góc nền trắng
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundRect(ctx, 8, 8, 496, 496, 48);
  ctx.fill();

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    ctx.save();
    roundRect(ctx, 18, 18, 476, 476, 40);
    ctx.clip();
    ctx.drawImage(img, 18, 18, 476, 476);
    ctx.restore();
    texture.needsUpdate = true;
  };
  img.src = url;

  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(1.8, 1.8, 1);
  return sprite;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

let wishIndex = 0;
let imgIndex  = 0;

orbits.forEach(orbit => {
  for (let i = 0; i < orbit.count; i += 1) {
    const angle  = (i / orbit.count) * Math.PI * 2;
    const radius = orbit.radius + Math.random() * 1.2;
    const baseY  = orbit.y + (Math.random() - 0.5) * 0.5;

    const sprite = orbit.type === 'image'
      ? makeImageSprite(imageUrls[imgIndex++ % imageUrls.length])
      : makeTextSprite(randomWish(wishIndex++));

    sprite.position.set(Math.cos(angle) * radius, baseY, Math.sin(angle) * radius);
    sprite.userData = { orbitR: radius, angle, baseY, speed: orbit.speed };
    wishesGroup.add(sprite);
  }
});

scene.add(wishesGroup);

    function animate() {
      if (!galaxyInitialized) return;
      requestAnimationFrame(animate);

      const t = performance.now() * 0.001;

      starCore.rotation.y += 0.01;
      starCore.rotation.z += 0.002;

      if (sunShaderUniforms) {
        sunShaderUniforms.uTime.value = t;
      }
      if (coronaInnerMat) {
        coronaInnerMat.uniforms.uTime.value = t;
      }
      if (coronaOuterMat) {
        coronaOuterMat.uniforms.uTime.value = t;
      }

      wishesGroup.children.forEach((child, idx) => {
        const d = child.userData;
        d.angle += d.speed;
        child.position.x = Math.cos(d.angle) * d.orbitR;
        child.position.z = Math.sin(d.angle) * d.orbitR;
        child.position.y = d.baseY + Math.sin(t * 1.1 + idx) * 0.08;
      });

      wishesGroup.rotation.y += 0.0013;
      starField.rotation.y += 0.00026;

      controls.update();
      renderer.render(scene, camera);
    }

    animate();
  } catch (error) {
    galaxyInitialized = false;
    console.error('Galaxy scene error:', error);
    startGalaxyFallback(container, 'Đang chạy chế độ tương thích vì máy/CDN chặn 3D.');
  }
}

window.addEventListener('resize', () => {
  resizeMatrix();

  if (galaxyInitialized && renderer && camera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
});

createFloatingIcons();
buildKeyPad();
