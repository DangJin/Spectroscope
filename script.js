// 星期映射
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 格式化数字为两位数
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// 上一次的秒数值
let lastSecTens = '';
let lastSecOnes = '';

// 翻牌动画
function flipDigit(element, newValue) {
  element.textContent = newValue;
  element.classList.remove('flip');
  // 触发 reflow 以重新启动动画
  void element.offsetWidth;
  element.classList.add('flip');
}

// 更新时钟
function updateClock() {
  const now = new Date();
  
  // 时间
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  const secTens = seconds[0];
  const secOnes = seconds[1];
  
  // 日期
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = weekDays[now.getDay()];
  const dateStr = `${year}年${month}月${day}日 ${weekDay}`;
  
  // 更新时分
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  
  // 更新秒数（带翻牌动画）
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
  
  // 更新日期
  document.getElementById('date').textContent = dateStr;
}

// 初始化
function init() {
  updateClock();
  // 每秒更新
  setInterval(updateClock, 1000);
  
  // 防止屏幕休眠（如果浏览器支持）
  if ('wakeLock' in navigator) {
    navigator.wakeLock.request('screen').catch(() => {
      console.log('Wake Lock not supported');
    });
  }
  
  // 全屏功能（点击屏幕切换全屏）
  document.body.addEventListener('dblclick', toggleFullscreen);
}

// 切换全屏
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(err => {
      console.log('Fullscreen error:', err);
    });
  } else {
    document.exitFullscreen();
  }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
