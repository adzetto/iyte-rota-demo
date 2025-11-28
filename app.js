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

  // Car path animation (ellipse)
  const car = document.getElementById('car');
  if (car) {
    const animateCar = () => {
      let last = performance.now();
      const loop = (now) => {
        const delta = now - last;
        last = now;
        const cycle = (now % 7000) / 7000; // 7s loop
        const angle = cycle * Math.PI * 2;
        const radiusX = 22;
        const radiusY = 16;
        const x = 50 + radiusX * Math.cos(angle);
        const y = 50 + radiusY * Math.sin(angle);
        car.style.left = `${x}%`;
        car.style.top = `${y}%`;
        requestAnimationFrame(loop);
      };
      requestAnimationFrame(loop);
    };
    animateCar();
  }

  // Hero/device parallax
  const canvas = document.querySelector('.canvas');
  let parallaxTick = 0;
  if (canvas) {
    window.addEventListener('pointermove', (e) => {
      parallaxTick += 1;
      if (parallaxTick % 2) return; // throttle
      const x = (e.clientX / window.innerWidth - 0.5) * 10;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      canvas.style.transform = `perspective(1200px) rotateY(${x}deg) rotateX(${y}deg)`;
    });
    window.addEventListener('pointerleave', () => {
      canvas.style.transform = 'none';
    });
  }
});
