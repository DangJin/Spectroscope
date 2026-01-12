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

// ==================== 场景切换 ====================
let currentScene = 'clock';

function switchScene(sceneName) {
  if (currentScene === sceneName) return;
  
  // 隐藏当前场景
  document.querySelectorAll('.scene').forEach(scene => {
    scene.classList.remove('active');
  });
  
  // 停止烟花动画
  if (currentScene === 'firework') {
    stopFirework();
  }
  
  // 显示新场景
  const newScene = document.getElementById(`scene-${sceneName}`);
  if (newScene) {
    newScene.classList.add('active');
  }
  
  // 启动烟花动画
  if (sceneName === 'firework') {
    setTimeout(startFirework, 100);
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
  
  // 烟花画布初始化
  initFirework();
  
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
