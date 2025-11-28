// Basic UI interactions and micro-animations
document.addEventListener('DOMContentLoaded', () => {
  // Intersection observer to reveal phones on scroll
  const animated = document.querySelectorAll('[data-animate]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    animated.forEach((el) => observer.observe(el));
  } else {
    animated.forEach((el) => el.classList.add('in-view'));
  }

  // Mode toggle state
  const modeToggle = document.getElementById('modeToggle');
  if (modeToggle) {
    modeToggle.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON') {
        modeToggle.querySelectorAll('button').forEach((btn) => btn.classList.remove('active'));
        e.target.classList.add('active');
      }
    });
  }

  // Bottom tabbar active state
  const tabbar = document.getElementById('tabbar');
  if (tabbar) {
    tabbar.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      tabbar.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = btn.dataset.tabTarget;
      const panels = document.querySelectorAll('.tab-sections > .panel');
      panels.forEach((panel) => {
        panel.classList.toggle('active', panel.dataset.tab === target);
      });
    });
  }

  // Time slider -> human readable time
  const slider = document.getElementById('timeSlider');
  const timeValue = document.getElementById('timeValue');
  const formatTime = (minutes) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const pad = (n) => (n < 10 ? `0${n}` : `${n}`);
    return `${pad(h)}:${pad(m)}`;
  };
  if (slider && timeValue) {
    const updateTime = () => { timeValue.textContent = formatTime(parseInt(slider.value, 10)); };
    slider.addEventListener('input', updateTime);
    updateTime();
  }

  // Seat counter
  const seatValue = document.getElementById('seatValue');
  const seatPlus = document.getElementById('seatPlus');
  const seatMinus = document.getElementById('seatMinus');
  let seats = parseInt(seatValue ? seatValue.textContent : '3', 10) || 3;
  const syncSeats = () => { if (seatValue) seatValue.textContent = seats; };
  if (seatPlus && seatMinus && seatValue) {
    seatPlus.addEventListener('click', () => { seats = Math.min(6, seats + 1); syncSeats(); });
    seatMinus.addEventListener('click', () => { seats = Math.max(1, seats - 1); syncSeats(); });
    syncSeats();
  }

  // View controls: grid vs rail
  const viewControls = document.getElementById('viewControls');
  const deviceGrid = document.querySelector('.device-grid');
  if (viewControls && deviceGrid) {
    viewControls.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-btn');
      if (!btn) return;
      viewControls.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const view = btn.dataset.view;
      if (view === 'rail') {
        deviceGrid.classList.add('rail');
      } else {
        deviceGrid.classList.remove('rail');
      }
    });
  }

  // Car animation along SVG route path
  const car = document.getElementById('car');
  const path = document.getElementById('routePath');
  if (car && path) {
    const length = path.getTotalLength();
    const animateCar = () => {
      const now = performance.now();
      const cycle = (now % 9000) / 9000; // 9s loop
      const distance = length * cycle;
      const point = path.getPointAtLength(distance);
      // convert SVG coords (viewBox 360x420) to %
      const xPct = (point.x / 360) * 100;
      const yPct = (point.y / 420) * 100;
      car.style.left = `${xPct}%`;
      car.style.top = `${yPct}%`;
      requestAnimationFrame(animateCar);
    };
    animateCar();
  }
});
