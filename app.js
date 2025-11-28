// Basic UI interactions and micro-animations
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

  // Search filter
  const searchInput = document.getElementById('searchInput');
  const rideList = document.getElementById('rideList');
  if (searchInput && rideList) {
    const filter = () => {
      const q = searchInput.value.trim().toLowerCase();
      rideList.querySelectorAll('.ride-card').forEach((card) => {
        const text = `${card.dataset.route || ''} ${card.dataset.driver || ''}`;
        const match = text.includes(q);
        card.style.display = match ? '' : 'none';
      });
    };
    searchInput.addEventListener('input', filter);
  }

  // Bottom sheet toggle (live map)
  const liveSheet = document.getElementById('liveSheet');
  if (liveSheet) {
    const handle = liveSheet.querySelector('.handle');
    const toggle = () => {
      liveSheet.classList.toggle('collapsed');
    };
    if (handle) handle.addEventListener('click', toggle);
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
    let startTime = null;
    const duration = 9000; // 9s loop
    const length = path.getTotalLength();
    
    const animateCar = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const cycle = (elapsed % duration) / duration;
      
      // Get point at current length
      const point = path.getPointAtLength(length * cycle);
      
      // SVG viewBox is 360x420. Convert to percentage for CSS positioning
      // This assumes the SVG scales uniformly within its container
      const xPct = (point.x / 360) * 100;
      const yPct = (point.y / 420) * 100;
      
      car.style.left = `${xPct}%`;
      car.style.top = `${yPct}%`;
      
      requestAnimationFrame(animateCar);
    };
    requestAnimationFrame(animateCar);
  }
});
