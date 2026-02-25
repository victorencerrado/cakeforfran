// francesca, feliz cumple!
// qué haces acá? tu pastel no esta acá
// que intentas hacer? escapar de la matrix? si, todo es una ilusion, nada es real, el pastel es falso
// toda la realiad no es nada mas que numeros y letras muajaja 
// ve y regresa :33
// y ya q estas aqui, espero que te haya gustado este regalito tonto q t hice con cariño :3

import * as THREE from 'three';

// ─── screen de terminal ──────────────────────────────────────────────────────────

const terminal = document.createElement('div');
terminal.id = 'terminal';
terminal.style.cssText = `
  position: fixed; inset: 0; background: #000;
  display: flex; align-items: center; justify-content: center;
  z-index: 100; font-family: 'Courier New', monospace;
  flex-direction: column; gap: 0;
`;

const pre = document.createElement('pre');
pre.style.cssText = `
  color: #fff; font-size: clamp(16px, 2.5vw, 26px);
  line-height: 1.9; margin: 0; padding: 2rem;
  max-width: 700px; width: 100%;
`;

const cursor = document.createElement('span');
cursor.style.cssText = `
  display: inline-block; width: 14px; height: 1.1em;
  background: #fff; animation: blink 0.7s step-end infinite;
  vertical-align: text-bottom; margin-left: 2px;
`;
cursor.id = 'cursor';

const blinkStyle = document.createElement('style');
blinkStyle.textContent = `@keyframes blink { 50% { opacity: 0; } }`;
document.head.appendChild(blinkStyle);

terminal.appendChild(pre);
pre.appendChild(cursor);
document.body.appendChild(terminal);

// pausa despues de escribirse (en ms)
const lines = [
  { text: '> fran...',                                              pause: 1200 },
  { text: '> feliz cumpleaños',                                    pause: 900  },
  { text: '> felices 21 años, ya casi 22, ya casi 23...',          pause: 700  },
  { text: '> cada vez más vieja',                                   pause: 700  },
  { text: '> :b',                                                   pause: 1500 },
  { text: '> descuida, seguimos y seguiremos siendo jovenes por siempre', pause: 800 },
  { text: '> :)',                                                   pause: 1500 },
  { text: '> sé que no te gusta darle mucha importancia a tu cumple, perdón', pause: 1500 },
  { text: '> pero por ser este tu día,',                                 pause: 600  },
  { text: '> te quise hacer un cosito, un pastelito :3',                   pause: 700  },
  { text: '> espero que te guste, pensé mucho en tí',               pause: 1800 },
  { text: '> te quiero',                                            pause: 1800 },
  { text: '> ...',                                                  pause: 2000 },
  { text: '> ʕ •ᴥ•ʔʕ •ᴥ•ʔʕ •ᴥ•ʔʕ •ᴥ•ʔʕ •ᴥ•ʔ',                  pause: 1200 },
  { text: '> [dale ya a lo q sea pa continuar]',                pause: 0    },
];

let lineIdx = 0, charIdx = 0;
let currentText = '';
let typingDone = false;

// ─── sonido de tecla ──────────────────────────────────────────────────────────

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let soundBuffer = null;

// con el sonio de sans lets goooo se pudo
fetch('sonidos/sans.mp3')
  .then(res => res.arrayBuffer())
  .then(data => audioCtx.decodeAudioData(data))
  .then(buffer => { soundBuffer = buffer; })
  .catch(() => console.warn('No se pudo cargar el sonido'));

function playKeyClick() {
  if (!soundBuffer) return;

  const source = audioCtx.createBufferSource();
  const gainNode = audioCtx.createGain();

  source.buffer = soundBuffer;
  source.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  source.playbackRate.value = 1.0; // velocidad: 1.0 normal, 2.0 doble, 0.5 mitad
  gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime); // volumen
  source.start(0, 0, 0.08); // duración del sample en segundos, no entendi q hace esto
}

function typeNext() {
  if (lineIdx >= lines.length) {
    typingDone = true;
    return;
  }
  const line = lines[lineIdx].text;  // .text
  if (charIdx < line.length) {
    currentText += line[charIdx];
    charIdx++;
    pre.textContent = currentText;
    pre.appendChild(cursor);
    playKeyClick();
    setTimeout(typeNext, charIdx === 1 && line.startsWith('>') ? 80 : 40);
  } else {
    currentText += '\n';
    const pause = lines[lineIdx].pause;  // pausa personalizada
    lineIdx++;
    charIdx = 0;
    setTimeout(typeNext, pause);
  }
}

setTimeout(typeNext, 600);

function startTransition() {
  if (!typingDone) return;
  terminal.style.transition = 'opacity 1.5s ease';
  terminal.style.opacity = '0';
  setTimeout(() => { terminal.style.display = 'none'; }, 1500);
}

document.addEventListener('keydown', startTransition);
document.addEventListener('click', startTransition);
document.addEventListener('touchstart', startTransition);

// ─── THREE.JS SCENE (three.js el coso libreria para 3d) ───────────────────────────────────────────────────────────

const textureLoader = new THREE.TextureLoader();
const scene = new THREE.Scene();

// imagen de fondo
const bgTexture = new THREE.TextureLoader().load('imagenes/fondo.png', (tex) => {
  tex.colorSpace = THREE.SRGBColorSpace; // esto arregla los colores lavados
  scene.background = tex;
});

// camara
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 7);
camera.lookAt(0, 0, 0);

// renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// luces
scene.add(new THREE.AmbientLight(0xfff0f5, 0.7));
const dirLight = new THREE.DirectionalLight(0xffeedd, 1.5);
dirLight.position.set(3, 8, 5);
dirLight.castShadow = true;
scene.add(dirLight);
const fillLight = new THREE.PointLight(0xff80b0, 0.8, 20);
fillLight.position.set(-4, 3, 2);
scene.add(fillLight);

// ── mesa ─────────────────────────────────────────────────────────────────────

// mantel de cuadritos hecho con canvas
const clothCanvas = document.createElement('canvas');
clothCanvas.width = 512; clothCanvas.height = 512;
const cCtx = clothCanvas.getContext('2d');
const checkSize = 32;
for (let row = 0; row < 512 / checkSize; row++) {
  for (let col = 0; col < 512 / checkSize; col++) {
    cCtx.fillStyle = (row + col) % 2 === 0 ? '#e8d5e8' : '#b07ab0';
    cCtx.fillRect(col * checkSize, row * checkSize, checkSize, checkSize);
  }
}
const clothTex = new THREE.CanvasTexture(clothCanvas);
clothTex.wrapS = clothTex.wrapT = THREE.RepeatWrapping;
clothTex.repeat.set(4, 4);

const tableGeo = new THREE.CylinderGeometry(5, 5, 0.3, 48);
const tableMat = new THREE.MeshStandardMaterial({ map: clothTex });
const table = new THREE.Mesh(tableGeo, tableMat);
table.position.y = -2.5;
table.receiveShadow = true;
scene.add(table);

// ── pastel ──────────────────────────────────────────────────────────────────────

const cakeGroup = new THREE.Group();
cakeGroup.position.y = -2.0;
scene.add(cakeGroup);

// plato
const plateGeo = new THREE.CylinderGeometry(1.9, 1.7, 0.12, 48);
const plateMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2, metalness: 0.1 });
const plate = new THREE.Mesh(plateGeo, plateMat);
plate.position.y = 0.06;
plate.castShadow = true;
cakeGroup.add(plate);

// capas del pastel
function makeCakeLayer(radiusTop, radiusBot, height, color, yPos) {
  const geo = new THREE.CylinderGeometry(radiusTop, radiusBot, height, 48);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.7 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.y = yPos;
  mesh.castShadow = true;
  return mesh;
}

// layer 1 (bottom) - peach/orange
const layer1 = makeCakeLayer(1.6, 1.6, 0.75, 0xffb347, 0.5);
cakeGroup.add(layer1);

// frosting stripe layer 1 - pink
const frost1 = makeCakeLayer(1.65, 1.65, 0.2, 0xff6b9d, 0.87);
cakeGroup.add(frost1);

// layer 2 - lighter peach
const layer2 = makeCakeLayer(1.25, 1.25, 0.65, 0xffd699, 1.25);
cakeGroup.add(layer2);

// frosting stripe layer 2
const frost2 = makeCakeLayer(1.3, 1.3, 0.18, 0xff6b9d, 1.57);
cakeGroup.add(frost2);

// layer 3 (top) - pink
const layer3 = makeCakeLayer(0.9, 0.9, 0.55, 0xffaec9, 1.9);
cakeGroup.add(layer3);

// top frosting disc
const topFrostGeo = new THREE.CylinderGeometry(0.95, 0.95, 0.1, 48);
const topFrostMat = new THREE.MeshStandardMaterial({ color: 0xfff0f5, roughness: 0.5 });
const topFrost = new THREE.Mesh(topFrostGeo, topFrostMat);
topFrost.position.y = 2.22;
cakeGroup.add(topFrost);

// drip effect - pequeñitas esferas en los bordes
for (let i = 0; i < 12; i++) {
  const angle = (i / 12) * Math.PI * 2;
  const dripGeo = new THREE.SphereGeometry(0.12, 8, 8);
  const dripMat = new THREE.MeshStandardMaterial({ color: 0xff6b9d });
  const drip = new THREE.Mesh(dripGeo, dripMat);
  drip.position.set(Math.cos(angle) * 1.55, 0.75, Math.sin(angle) * 1.55);
  cakeGroup.add(drip);
}

// rosettes on top
for (let i = 0; i < 6; i++) {
  const angle = (i / 6) * Math.PI * 2;
  const rosetteGeo = new THREE.SphereGeometry(0.13, 12, 12);
  const rosetteMat = new THREE.MeshStandardMaterial({ color: 0xff4488, roughness: 0.6 });
  const rosette = new THREE.Mesh(rosetteGeo, rosetteMat);
  rosette.position.set(Math.cos(angle) * 0.65, 2.35, Math.sin(angle) * 0.65);
  cakeGroup.add(rosette);
}

// fresitas on top
const strawGeo = new THREE.SphereGeometry(0.22, 12, 12);
strawGeo.scale(0.9, 1.2, 0.9);
const strawMat = new THREE.MeshStandardMaterial({ color: 0xff2244, roughness: 0.7 });
const straw = new THREE.Mesh(strawGeo, strawMat);
straw.position.y = 2.55;
cakeGroup.add(straw);

// hojitas en la fresita
for (let i = 0; i < 3; i++) {
  const leafGeo = new THREE.ConeGeometry(0.08, 0.22, 6);
  const leafMat = new THREE.MeshStandardMaterial({ color: 0x22aa44 });
  const leaf = new THREE.Mesh(leafGeo, leafMat);
  const a = (i / 3) * Math.PI * 2;
  leaf.position.set(Math.cos(a) * 0.15, 2.72, Math.sin(a) * 0.15);
  leaf.rotation.z = (Math.random() - 0.5) * 0.8;
  cakeGroup.add(leaf);
}

// velas
function makeCandle(x, z, color) {
  const cGeo = new THREE.CylinderGeometry(0.055, 0.055, 0.5, 12);
  const cMat = new THREE.MeshStandardMaterial({ color });
  const candle = new THREE.Mesh(cGeo, cMat);
  candle.position.set(x, 2.55, z);
  cakeGroup.add(candle);

  // flama
  const flameGeo = new THREE.SphereGeometry(0.07, 8, 8);
  flameGeo.scale(0.6, 1.4, 0.6);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffdd44 });
  const flame = new THREE.Mesh(flameGeo, flameMat);
  flame.position.set(x, 2.88, z);
  cakeGroup.add(flame);

  const pointLight = new THREE.PointLight(0xffaa00, 0.5, 2);
  pointLight.position.set(x, 2.88, z);
  cakeGroup.add(pointLight);
}

makeCandle(0, 0, 0xffaacc);
makeCandle(0.3, 0.2, 0xaaddff);
makeCandle(-0.3, 0.1, 0xffddaa);

// palitos de "chocolate" en el pastel
for (let i = 0; i < 3; i++) {
  const angle = (i / 3) * Math.PI * 2 + 0.4;
  const stickGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.5, 8);
  const stickMat = new THREE.MeshStandardMaterial({ color: 0x5c2d0e });
  const stick = new THREE.Mesh(stickGeo, stickMat);
  stick.position.set(Math.cos(angle) * 0.5, 2.6, Math.sin(angle) * 0.5);
  stick.rotation.z = (Math.random() - 0.5) * 0.5;
  stick.rotation.x = (Math.random() - 0.5) * 0.3;
  cakeGroup.add(stick);
}

// ── fotos con margenes ─────────────────────────────────────────────────────────────

const imagePaths = [
  'imagenes/1.png',
  'imagenes/2.png',
  'imagenes/3.png',
  'imagenes/4.png',
];

// revisa cuantas imagenes existen y solo muestra hasta 4 (porque solo hice 4 posiciones para las fotos)
const photoPositions = [
  { x: -4.2, y: -1.8, z: -1.5, ry: 0.5 },
  { x: -2.8, y: -1.8, z: 1.5, ry: 0.3 },
  { x: 2.8, y: -1.8, z: 1.5, ry: -0.3 },
  { x: 4.2, y: -1.8, z: -1.5, ry: -0.5 },
];

const frameColor = 0xd4a96a; // como tipo madera se supone

imagePaths.forEach((path, i) => {
  if (i >= photoPositions.length) return;
  const pos = photoPositions[i];

  const photoGroup = new THREE.Group();
  photoGroup.position.set(pos.x, pos.y, pos.z);
  photoGroup.rotation.y = pos.ry;
  scene.add(photoGroup);

  // frame outer
  const frameW = 2.2, frameH = 1.6, frameD = 0.12;
  const frameGeo = new THREE.BoxGeometry(frameW, frameH, frameD);
  const frameMat = new THREE.MeshStandardMaterial({ color: frameColor, roughness: 0.6, metalness: 0.15 });
  const frame = new THREE.Mesh(frameGeo, frameMat);
  photoGroup.add(frame);

  // frame inner cutout (white background placeholder)
  const innerW = 1.85, innerH = 1.25;
  const innerGeo = new THREE.PlaneGeometry(innerW, innerH);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0xcccccc });
  const inner = new THREE.Mesh(innerGeo, innerMat);
  inner.position.z = frameD / 2 + 0.001;
  photoGroup.add(inner);

  // photo texture
  const texture = textureLoader.load(path,
    () => {
      texture.colorSpace = THREE.SRGBColorSpace; // arregla los colores lavados otra vez la ptm
      inner.material = new THREE.MeshBasicMaterial({ map: texture });
    },
    undefined,
    () => {
      // on error, show placeholder gradient via canvas
      const pc = document.createElement('canvas');
      pc.width = 256; pc.height = 180;
      const pCtx = pc.getContext('2d');
      const g = pCtx.createLinearGradient(0, 0, 256, 180);
      g.addColorStop(0, '#ffb3d9'); g.addColorStop(1, '#b3d9ff');
      pCtx.fillStyle = g;
      pCtx.fillRect(0, 0, 256, 180);
      pCtx.fillStyle = 'rgba(255,255,255,0.5)';
      pCtx.font = 'bold 28px Arial';
      pCtx.textAlign = 'center';
      pCtx.fillText('📸', 128, 100);
      inner.material = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(pc) });
    }
  );

  // frame border edges
  const borderMat = new THREE.MeshStandardMaterial({ color: 0xc49040, roughness: 0.5 });
  // top/bottom bars
  [{ y: frameH / 2 - 0.15, h: 0.3 }, { y: -frameH / 2 + 0.15, h: 0.3 }].forEach(({ y, h }) => {
    const bGeo = new THREE.BoxGeometry(frameW, h, frameD + 0.01);
    const b = new THREE.Mesh(bGeo, borderMat);
    b.position.y = y;
    photoGroup.add(b);
  });
  // left/right bars
  [{ x: -frameW / 2 + 0.15, w: 0.3 }, { x: frameW / 2 - 0.15, w: 0.3 }].forEach(({ x, w }) => {
    const bGeo = new THREE.BoxGeometry(w, frameH, frameD + 0.01);
    const b = new THREE.Mesh(bGeo, borderMat);
    b.position.x = x;
    photoGroup.add(b);
  });


});

// ── carta sobre la mesa ──────────────────────────────────────────────────────

const cardCanvas = document.createElement('canvas');
cardCanvas.width = 512; cardCanvas.height = 280;
const cardCtx = cardCanvas.getContext('2d');
cardCtx.fillStyle = '#fff9f0';
cardCtx.roundRect(10, 10, 492, 260, 18);
cardCtx.fill();
cardCtx.strokeStyle = '#d4a96a';
cardCtx.lineWidth = 4;
cardCtx.roundRect(10, 10, 492, 260, 18);
cardCtx.stroke();
cardCtx.fillStyle = '#c25a7a';
cardCtx.font = 'bold 38px Georgia, serif';
cardCtx.textAlign = 'center';
cardCtx.fillText('pa la personita q tanto', 256, 80);
cardCtx.fillStyle = '#c25a7a';
cardCtx.font = 'bold 38px Georgia, serif';
cardCtx.fillText('quiero y aprecio :3', 256, 140); 
cardCtx.fillStyle = '#888';
cardCtx.font = '26px Georgia, serif';
cardCtx.fillText('con mucho cariño <3', 256, 210);

const cardTex = new THREE.CanvasTexture(cardCanvas);
const cardGeo = new THREE.PlaneGeometry(1.8, 1.0);
const cardMat = new THREE.MeshBasicMaterial({ map: cardTex });
const card = new THREE.Mesh(cardGeo, cardMat);
// la mesa está en y=-2.5 con altura 0.3, entonces la superficie queda en y=-2.35
// ponemos la carta justo encima con un pequeño offset osea en y=-2.33
card.position.set(0.9, -2.33, 2.0);
card.rotation.x = -Math.PI / 2;  // plana sobre la mesa
card.rotation.z = 0.3;            // giradita 
scene.add(card);  //lets goooo al fin pude solucionar esto :D

// ── particulas de confetti ────────────────────────────────────────────────────────

const confettiCount = 50; 
const confettiGeometries = [];
const confettiMeshes = [];
const confettiData = [];

const confettiColors = [
  0xff6b9d, 0xffb347, 0xaaddff, 0xffdd44,
  0x88ff88, 0xff88cc, 0x88ccff, 0xffaa55,
  0xdd88ff, 0xff5588,
];

for (let i = 0; i < confettiCount; i++) {
  // rectangulo y cuadritos
  const isRect = Math.random() > 0.4;
  const geo = isRect
    ? new THREE.PlaneGeometry(0.12, 0.06)
    : new THREE.PlaneGeometry(0.08, 0.08);

  const mat = new THREE.MeshBasicMaterial({
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92,
  });

  const mesh = new THREE.Mesh(geo, mat);

  // q se distribuyan random
  const startX = (Math.random() - 0.5) * 18;
  const startY = 8 + Math.random() * 6;
  const startZ = (Math.random() - 0.5) * 10;

  mesh.position.set(startX, startY, startZ);
  mesh.rotation.set(
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2,
    Math.random() * Math.PI * 2
  );

  confettiData.push({
    velocity: {
      x: (Math.random() - 0.5) * 0.03,
      y: -(0.02 + Math.random() * 0.035),
      z: (Math.random() - 0.5) * 0.02,
    },
    rotSpeed: {
      x: (Math.random() - 0.5) * 0.08,
      y: (Math.random() - 0.5) * 0.08,
      z: (Math.random() - 0.5) * 0.08,
    },
    // slight horizontal sway (sine wave)
    swayAmp: Math.random() * 0.015,
    swayFreq: 1.5 + Math.random() * 2,
    swayOffset: Math.random() * Math.PI * 2,
    startX,
    startY,
    startZ,
    delay: Math.random() * 300, // frames before it starts falling
    age: 0,
  });

  confettiMeshes.push(mesh);
  scene.add(mesh);
}

// ── window resize ─────────────────────────────────────────────────────────────

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ── animate ───────────────────────────────────────────────────────────────────

let time = 0;
function animate() {
  requestAnimationFrame(animate);
  time += 0.01;

  // gentle cake wobble wobble wobble womp womp womp
  cakeGroup.rotation.y += 0.003;

  // lucesita de la vela
  cakeGroup.children.forEach(child => {
    if (child.isPointLight) {
      child.intensity = 0.4 + Math.sin(time * 8 + Math.random() * 0.5) * 0.2;
    }
  });

  // animacion de confetti
  confettiMeshes.forEach((mesh, i) => {
    const d = confettiData[i];
    d.age++;

    if (d.age < d.delay) return;

    const t = (d.age - d.delay) * 0.01;

    mesh.position.x += d.velocity.x + Math.sin(t * d.swayFreq + d.swayOffset) * d.swayAmp;
    mesh.position.y += d.velocity.y;
    mesh.position.z += d.velocity.z;

    mesh.rotation.x += d.rotSpeed.x;
    mesh.rotation.y += d.rotSpeed.y;
    mesh.rotation.z += d.rotSpeed.z;

    // se reinicia cuando cae debajo de la mesa
    if (mesh.position.y < -4) {
      mesh.position.x = (Math.random() - 0.5) * 18;
      mesh.position.y = 8 + Math.random() * 4;
      mesh.position.z = (Math.random() - 0.5) * 10;
      d.age = d.delay; // reset age but skip delay osea q se reincia inmediatamente
    }
  });

  renderer.render(scene, camera);
}

animate();

