// ==================== 时钟功能 ====================
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

function padZero(num) {
  return num.toString().padStart(2, '0');
}

let lastSecTens = '';
let lastSecOnes = '';

function flipDigit(element, newValue) {
  element.textContent = newValue;
  element.classList.remove('flip');
  void element.offsetWidth;
  element.classList.add('flip');
}

function updateClock() {
  const now = new Date();
  
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  const secTens = seconds[0];
  const secOnes = seconds[1];
  
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = weekDays[now.getDay()];
  const dateStr = `${year}年${month}月${day}日 ${weekDay}`;
  
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  
  const secTensEl = document.getElementById('sec-tens');
  const secOnesEl = document.getElementById('sec-ones');
  
  if (secTens !== lastSecTens) {
    flipDigit(secTensEl, secTens);
    lastSecTens = secTens;
  }
  
  if (secOnes !== lastSecOnes) {
    flipDigit(secOnesEl, secOnes);
    lastSecOnes = secOnes;
  }
  
  document.getElementById('date').textContent = dateStr;
}

// ==================== 烟花功能 ====================
let fireworkCanvas, fireworkCtx;
let fireworks = [];
let particles = [];
let fireworkAnimationId;

function initFirework() {
  fireworkCanvas = document.getElementById('firework-canvas');
  const rect = fireworkCanvas.parentElement.getBoundingClientRect();
  fireworkCanvas.width = rect.width || 140;
  fireworkCanvas.height = rect.height || 140;
  fireworkCtx = fireworkCanvas.getContext('2d');
}

class Firework {
  constructor(canvas) {
    this.canvas = canvas;
    this.x = canvas.width / 2 + (Math.random() - 0.5) * 40;
    this.y = canvas.height;
    this.targetY = canvas.height * 0.2 + Math.random() * canvas.height * 0.3;
    this.speed = 1.5 + Math.random() * 1;
    this.hue = Math.random() * 360;
    this.alive = true;
  }
  
  update() {
    this.y -= this.speed;
    if (this.y <= this.targetY) {
      this.explode();
      this.alive = false;
    }
  }
  
  explode() {
    const particleCount = 20 + Math.floor(Math.random() * 15);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(this.x, this.y, this.hue, this.canvas));
    }
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${this.hue}, 100%, 70%)`;
    ctx.shadowBlur = 10;
    ctx.shadowColor = `hsl(${this.hue}, 100%, 60%)`;
    ctx.fill();
  }
}

class Particle {
  constructor(x, y, hue, canvas) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.hue = hue + (Math.random() - 0.5) * 30;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 0.5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.decay = 0.015 + Math.random() * 0.015;
    this.gravity = 0.03;
    this.alive = true;
  }
  
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.alpha -= this.decay;
    if (this.alpha <= 0) {
      this.alive = false;
    }
  }
  
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.alpha})`;
    ctx.shadowBlur = 5;
    ctx.shadowColor = `hsla(${this.hue}, 100%, 50%, ${this.alpha})`;
    ctx.fill();
  }
}

function animateFirework() {
  if (!fireworkCtx) return;
  
  // 半透明清除，产生拖尾效果
  fireworkCtx.globalCompositeOperation = 'destination-out';
  fireworkCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  fireworkCtx.fillRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
  fireworkCtx.globalCompositeOperation = 'lighter';
  
  // 随机发射烟花
  if (Math.random() < 0.03) {
    fireworks.push(new Firework(fireworkCanvas));
  }
  
  // 更新和绘制烟花
  fireworks = fireworks.filter(fw => {
    fw.update();
    if (fw.alive) fw.draw(fireworkCtx);
    return fw.alive;
  });
  
  // 更新和绘制粒子
  particles = particles.filter(p => {
    p.update();
    if (p.alive) p.draw(fireworkCtx);
    return p.alive;
  });
  
  fireworkAnimationId = requestAnimationFrame(animateFirework);
}

function startFirework() {
  if (!fireworkCanvas) initFirework();
  fireworks = [];
  particles = [];
  animateFirework();
}

function stopFirework() {
  if (fireworkAnimationId) {
    cancelAnimationFrame(fireworkAnimationId);
    fireworkAnimationId = null;
  }
  if (fireworkCtx) {
    fireworkCtx.clearRect(0, 0, fireworkCanvas.width, fireworkCanvas.height);
  }
}

// ==================== 极光功能（Aurora 极地极光） ====================
let auroraCanvas, auroraCtx;
let auroraAnimationId;
let auroraTime = 0;

function initAurora() {
  auroraCanvas = document.getElementById('aurora-canvas');
  const rect = auroraCanvas.parentElement.getBoundingClientRect();
  auroraCanvas.width = rect.width || 140;
  auroraCanvas.height = rect.height || 140;
  auroraCtx = auroraCanvas.getContext('2d');
}

function drawAurora() {
  if (!auroraCtx) return;
  
  const w = auroraCanvas.width;
  const h = auroraCanvas.height;
  
  // 清空画布
  auroraCtx.fillStyle = 'rgba(0, 0, 0, 0.08)';
  auroraCtx.fillRect(0, 0, w, h);
  
  // 绘制多层极光帷幕
  const curtainCount = 3;
  
  for (let c = 0; c < curtainCount; c++) {
    auroraCtx.beginPath();
    
    // 从底部开始
    auroraCtx.moveTo(0, h);
    
    // 绘制波浪状的顶部边缘
    const points = [];
    for (let x = 0; x <= w; x += 2) {
      // 多层波浪叠加，模拟极光的飘动
      const wave1 = Math.sin(x * 0.08 + auroraTime * 0.02 + c) * 8;
      const wave2 = Math.sin(x * 0.12 + auroraTime * 0.015 + c * 2) * 5;
      const wave3 = Math.sin(x * 0.05 + auroraTime * 0.025 + c * 0.5) * 10;
      
      // 极光高度变化
      const heightVar = Math.sin(x * 0.03 + auroraTime * 0.01 + c * 3) * 15;
      const baseHeight = h * (0.25 + c * 0.12);
      const y = baseHeight + wave1 + wave2 + wave3 + heightVar;
      
      points.push({ x, y });
      auroraCtx.lineTo(x, y);
    }
    
    // 闭合路径
    auroraCtx.lineTo(w, h);
    auroraCtx.closePath();
    
    // 创建垂直渐变 - 从底部向上渐变消失
    const gradient = auroraCtx.createLinearGradient(0, h, 0, 0);
    
    // 极光颜色：绿色为主，带有蓝色和紫色
    const hueShift = Math.sin(auroraTime * 0.01 + c) * 15;
    const baseHue = 120 + c * 25 + hueShift; // 绿色到青色
    const alpha = 0.25 - c * 0.05;
    
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(0.1, `hsla(${baseHue}, 100%, 45%, ${alpha})`);
    gradient.addColorStop(0.3, `hsla(${baseHue + 10}, 100%, 55%, ${alpha * 1.2})`);
    gradient.addColorStop(0.5, `hsla(${baseHue + 20}, 100%, 50%, ${alpha * 0.8})`);
    gradient.addColorStop(0.7, `hsla(${baseHue + 40}, 80%, 45%, ${alpha * 0.4})`);
    gradient.addColorStop(1, 'transparent');
    
    auroraCtx.fillStyle = gradient;
    auroraCtx.fill();
    
    // 添加顶部边缘的亮线
    auroraCtx.beginPath();
    auroraCtx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      auroraCtx.lineTo(points[i].x, points[i].y);
    }
    auroraCtx.strokeStyle = `hsla(${baseHue + 10}, 100%, 70%, ${alpha * 1.5})`;
    auroraCtx.lineWidth = 1.5;
    auroraCtx.shadowBlur = 10;
    auroraCtx.shadowColor = `hsla(${baseHue}, 100%, 60%, 0.6)`;
    auroraCtx.stroke();
  }
  
  // 添加一些闪烁的星星
  auroraCtx.shadowBlur = 0;
  for (let i = 0; i < 2; i++) {
    if (Math.random() < 0.15) {
      const x = Math.random() * w;
      const y = Math.random() * h * 0.4;
      const size = Math.random() * 1.2 + 0.3;
      
      auroraCtx.beginPath();
      auroraCtx.arc(x, y, size, 0, Math.PI * 2);
      auroraCtx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.6 + 0.3})`;
      auroraCtx.fill();
    }
  }
  
  auroraTime++;
  auroraAnimationId = requestAnimationFrame(drawAurora);
}

function startAurora() {
  if (!auroraCanvas) initAurora();
  auroraTime = 0;
  drawAurora();
}

function stopAurora() {
  if (auroraAnimationId) {
    cancelAnimationFrame(auroraAnimationId);
    auroraAnimationId = null;
  }
  if (auroraCtx) {
    auroraCtx.clearRect(0, 0, auroraCanvas.width, auroraCanvas.height);
  }
}

// ==================== 场景切换 ====================
let currentScene = 'clock';

function switchScene(sceneName) {
  if (currentScene === sceneName) return;
  
  // 隐藏当前场景
  document.querySelectorAll('.scene').forEach(scene => {
    scene.classList.remove('active');
  });
  
  // 停止动画
  if (currentScene === 'firework') {
    stopFirework();
  }
  if (currentScene === 'aurora') {
    stopAurora();
  }
  
  // 显示新场景
  const newScene = document.getElementById(`scene-${sceneName}`);
  if (newScene) {
    newScene.classList.add('active');
  }
  
  // 启动动画
  if (sceneName === 'firework') {
    setTimeout(startFirework, 100);
  }
  if (sceneName === 'aurora') {
    setTimeout(startAurora, 100);
  }
  
  // 更新按钮状态
  document.querySelectorAll('.control-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.scene === sceneName);
  });
  
  currentScene = sceneName;
}

// ==================== 控制按钮显示/隐藏 ====================
let controlsTimeout;
const controls = document.getElementById('controls');
const toggleArea = document.getElementById('toggle-area');

function showControls() {
  controls.classList.add('visible');
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(hideControls, 3000);
}

function hideControls() {
  controls.classList.remove('visible');
}

// ==================== 初始化 ====================
function init() {
  // 时钟
  updateClock();
  setInterval(updateClock, 1000);
  
  // 画布初始化
  initFirework();
  initAurora();
  
  // 场景切换按钮
  document.querySelectorAll('.control-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchScene(btn.dataset.scene);
      showControls(); // 重置隐藏计时器
    });
  });
  
  // 点击底部区域显示控制按钮
  toggleArea.addEventListener('click', showControls);
  toggleArea.addEventListener('touchstart', showControls);
  
  // 防止屏幕休眠
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').catch(() => {});
  }
  
  // 双击全屏
  document.body.addEventListener('dblclick', (e) => {
    if (e.target.closest('.controls')) return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen();
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
