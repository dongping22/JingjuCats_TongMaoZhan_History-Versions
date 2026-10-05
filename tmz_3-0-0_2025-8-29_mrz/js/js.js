//切换亮/深色模式
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (!themeToggleBtn) {
        console.error('切换按钮丢失');//应该不会出现这种情况的吧🤔
        return;
    }

    function initializeTheme() {
        const currentTheme = localStorage.getItem('theme') || 'mdui-theme-light';
        document.documentElement.classList.add(currentTheme);
        updateButtonIcon(currentTheme);
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.classList.contains('mdui-theme-light') ? 'mdui-theme-light' : 'mdui-theme-dark';
        const newTheme = currentTheme === 'mdui-theme-light' ? 'mdui-theme-dark' : 'mdui-theme-light';

        document.documentElement.classList.remove(currentTheme);
        document.documentElement.classList.add(newTheme);
        updateButtonIcon(newTheme);
        localStorage.setItem('theme', newTheme);
    }

    function updateButtonIcon(theme) {
        const iconSrc = theme === 'mdui-theme-light'
            ? '../京剧猫同猫站3代/img/light_mode.png'
            : '../京剧猫同猫站3代/img/dark_mode.png';
        const img = themeToggleBtn.querySelector('img');
        if (img) {
            img.src = iconSrc;
        } else {
            console.error('Icon image not found in theme toggle button');
        }
    }

    themeToggleBtn.addEventListener('click', toggleTheme);
    initializeTheme();
});

document.addEventListener('keydown', function(event) {
  // 禁用 F12
  if (event.key === 'F12') {
    event.preventDefault();
    return false;
  }
  // 禁用 Ctrl+Shift+I
  if (event.ctrlKey && event.shiftKey && event.key === 'I') {
    event.preventDefault();
    return false;
  }
  // 禁用 Ctrl+Shift+J 
  if (event.ctrlKey && event.shiftKey && event.key === 'J') {
    event.preventDefault();
    return false;
  }
});
document.addEventListener('contextmenu', function(event) {
  event.preventDefault(); // 禁用右键菜单
});

(function() {
  var threshold = 160; 
  var checkDevTools = function() {
    var devtoolsOpen = window.outerWidth - window.innerWidth > threshold ||
                      window.outerHeight - window.innerHeight > threshold;
    if (devtoolsOpen) {
      location.reload(); // 刷新页面
    }
  };

  setInterval(checkDevTools, 1000);
})();



function siteTime() {
  window.setTimeout("siteTime()", 1000);
  var seconds = 1000
  var minutes = seconds * 60
  var hours = minutes * 60
  var days = hours * 24
  var years = days * 365
  var today = new Date()
  var todayYear = today.getFullYear()
  var todayMonth = today.getMonth()
  var todayDate = today.getDate()
  var todayHour = today.getHours()
  var todayMinute = today.getMinutes()
  var todaySecond = today.getSeconds()

  var t1 = Date.UTC(2024, 2, 3, 0, 0, 0)
  var t2 = Date.UTC(todayYear, todayMonth, todayDate, todayHour, todayMinute, todaySecond)
  var diff = t2 - t1
  var diffYears = Math.floor(diff / years)
  var diffDays = Math.floor((diff / days) - diffYears * 365)
  var diffHours = Math.floor((diff - (diffYears * 365 + diffDays) * days) / hours)
  var diffMinutes = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours) / minutes)
  var diffSeconds = Math.floor((diff - (diffYears * 365 + diffDays) * days - diffHours * hours - diffMinutes * minutes) / seconds)
  document.getElementById("site-time").innerHTML = "本站已稳定运行："
      + diffYears + " 年 " + diffDays + " 天 " + diffHours + " 小时 " + diffMinutes + " 分钟 " + diffSeconds + " 秒"
}

siteTime()


function getCounter() {
  let counterData = localStorage.getItem('visitCounter');
  if (counterData === null) {
      // 当localStorage中没有找到visitCounter项时，应设置为一个字符串化的JSON对象
      counterData = JSON.stringify({ count: 0 });
  }
  // 返回字符串化的JSON对象或解析后的对象
  return JSON.parse(counterData);
}

function setCounter(data) {
  localStorage.setItem('visitCounter', JSON.stringify(data));
}

function incrementCounter() {
  let counter = getCounter();
  counter.count++;
  setCounter(counter);

  // 更新页面显示
  document.getElementById('counter').innerText = `访问次数: ${counter.count}`;
}

// 页面加载时初始化计数器并自动增加一次
window.onload = function() {
  incrementCounter();
};