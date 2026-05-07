// ksecret/timer.js

const TOTAL_TIME = 600; // 10分鐘 (秒)
const TEACHER_PASSWORD = "888"; // 預設教師密碼

function initTimer() {
  const timerDiv = document.createElement('div');
  timerDiv.id = 'global-timer';
  timerDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: rgba(0,0,0,0.8);
    border: 2px solid #d4af37;
    color: #d4af37;
    padding: 10px 20px;
    font-size: 20px;
    font-family: 'Courier New', monospace;
    font-weight: bold;
    border-radius: 8px;
    z-index: 10000;
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.5);
    text-align: center;
    pointer-events: none;
  `;
  document.body.appendChild(timerDiv);

  let startTime = localStorage.getItem('gameStartTime');
  const isPuzzlePage = window.location.pathname.includes('puzzle');

  if (!startTime) {
    if (isPuzzlePage) {
      startTime = Date.now();
      localStorage.setItem('gameStartTime', startTime);
    } else {
      timerDiv.innerText = "⏳ 準備開始";
      return; // 尚未進入關卡，不開始倒數
    }
  }

  function updateTimer() {
    // 檢查是否全部通關
    if (localStorage.getItem('gameCompleted') === 'true') {
      const endTime = localStorage.getItem('gameEndTime') || Date.now();
      const timeSpent = Math.floor((endTime - startTime) / 1000);
      const min = Math.floor(timeSpent / 60);
      const sec = timeSpent % 60;
      timerDiv.innerText = `🎉 通關時間: ${min}分${sec.toString().padStart(2, '0')}秒`;
      timerDiv.style.color = '#4CAF50';
      timerDiv.style.borderColor = '#4CAF50';
      return;
    }

    const now = Date.now();
    const elapsed = Math.floor((now - startTime) / 1000);
    const remaining = TOTAL_TIME - elapsed;

    if (remaining <= 0) {
      timerDiv.innerText = "❌ 00:00 (時間到)";
      timerDiv.style.color = '#ff5555';
      timerDiv.style.borderColor = '#ff5555';
    } else {
      const min = Math.floor(remaining / 60);
      const sec = remaining % 60;
      timerDiv.innerText = `⏳ 剩餘時間: ${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    
    setTimeout(updateTimer, 1000);
  }
  
  updateTimer();
}

// 供各關卡呼叫：標記單一關卡過關
window.markLevelCleared = function(level) {
  localStorage.setItem(`puzzle${level}Cleared`, 'true');
  checkAllCleared();
};

// 檢查是否集滿三個通關紀錄
function checkAllCleared() {
  const p1 = localStorage.getItem('puzzle1Cleared') === 'true';
  const p2 = localStorage.getItem('puzzle2Cleared') === 'true';
  const p3 = localStorage.getItem('puzzle3Cleared') === 'true';
  
  if (p1 && p2 && p3 && localStorage.getItem('gameCompleted') !== 'true') {
    localStorage.setItem('gameCompleted', 'true');
    localStorage.setItem('gameEndTime', Date.now());
  }
}

// 教師專用重置功能 (需輸入密碼)
window.teacherResetGame = function() {
  const pwd = prompt("這將會清除所有過關紀錄與時間。\n請輸入教師密碼：");
  if (pwd === TEACHER_PASSWORD) {
    localStorage.removeItem('gameStartTime');
    localStorage.removeItem('gameEndTime');
    localStorage.removeItem('gameCompleted');
    localStorage.removeItem('puzzle1Cleared');
    localStorage.removeItem('puzzle2Cleared');
    localStorage.removeItem('puzzle3Cleared');
    alert("系統已重置！");
    location.reload();
  } else if (pwd !== null) {
    alert("密碼錯誤，無法重置。");
  }
};

window.addEventListener('DOMContentLoaded', initTimer);
