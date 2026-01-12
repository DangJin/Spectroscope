// 星期映射
const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];

// 格式化数字为两位数
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// 更新时钟
function updateClock() {
  const now = new Date();
  
  // 时间
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());
  const timeStr = `${hours}:${minutes}:${seconds}`;
  
  // 日期
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekDay = weekDays[now.getDay()];
  const dateStr = `${year}年${month}月${day}日 ${weekDay}`;
  
  // 更新DOM
  document.getElementById('time').textContent = timeStr;
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
