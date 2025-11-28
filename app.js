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

  // Draggable Bottom Sheet
  const liveSheet = document.getElementById('liveSheet');
  if (liveSheet) {
    const handle = liveSheet.querySelector('.handle');
    let isDragging = false;
    let startY = 0;
    let currentY = 0;
    let initialTranslateY = 0;

    // Helper to get current translation
    const getTranslateY = () => {
      if (liveSheet.classList.contains('collapsed')) {
        return liveSheet.offsetHeight * 0.55; // 55%
      }
      return 0;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      startY = e.clientY;
      initialTranslateY = getTranslateY();
      liveSheet.classList.add('dragging');
      liveSheet.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const deltaY = e.clientY - startY;
      currentY = initialTranslateY + deltaY;

      // Clamp values (don't drag too far up)
      // minimal resistance going up past 0
      if (currentY < 0) currentY = currentY * 0.3;

      liveSheet.style.transform = `translateY(${currentY}px)`;
    };

    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      liveSheet.classList.remove('dragging');
      liveSheet.releasePointerCapture(e.pointerId);
      liveSheet.style.transform = ''; // Clear inline style to let CSS class take over

      const deltaY = e.clientY - startY;
      const threshold = 50; // px to trigger snap

      // Logic:
      // If was collapsed and dragged up > threshold -> Expand
      // If was expanded and dragged down > threshold -> Collapse
      // Otherwise revert

      const isCollapsed = liveSheet.classList.contains('collapsed');

      if (isCollapsed) {
        if (deltaY < -threshold) {
          liveSheet.classList.remove('collapsed');
        }
      } else {
        if (deltaY > threshold) {
          liveSheet.classList.add('collapsed');
        }
      }
    };

    if (handle) {
      liveSheet.addEventListener('pointerdown', onPointerDown);
      liveSheet.addEventListener('pointermove', onPointerMove);
      liveSheet.addEventListener('pointerup', onPointerUp);
      liveSheet.addEventListener('pointercancel', onPointerUp);
    }
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

  // Map Pin Interactivity
  const mapPins = document.querySelectorAll('.map-pin');
  if (mapPins.length > 0 && liveSheet) {
    const driverInfo = liveSheet.querySelector('.driver-info strong');
    const driverSub = liveSheet.querySelector('.driver-info span');

    mapPins.forEach(pin => {
      pin.addEventListener('click', () => {
        const loc = pin.dataset.loc;
        const info = pin.dataset.info;

        // Update sheet info
        if (driverInfo) driverInfo.textContent = `${loc}`;
        if (driverSub) driverSub.textContent = info;

        // Open sheet if collapsed
        liveSheet.classList.remove('collapsed');
      });
    });
  }

  // Driver Publish Flow Simulation
  const publishBtn = document.getElementById('publishBtn');
  const driverWaitingView = document.getElementById('driverWaitingView');
  const requestsContainer = document.getElementById('requestsContainer');
  const cancelRideBtn = document.getElementById('cancelRideBtn');
  const formCard = document.querySelector('.form-card'); // The form to hide

  if (publishBtn && driverWaitingView && requestsContainer) {
    publishBtn.addEventListener('click', () => {
      // Hide form, show waiting
      if (formCard) formCard.style.display = 'none';
      publishBtn.style.display = 'none';
      driverWaitingView.classList.add('active');

      // Simulate incoming request after 3 seconds
      setTimeout(() => {
        const reqId = Date.now();
        const reqHTML = `
          <div class="request-card" id="req-${reqId}">
            <div class="mini-avatar" style="background:#e0f7fa; color:#006064;">AL</div>
            <div style="flex:1">
              <div style="font-weight:700; color:var(--anthracite)">Ali K.</div>
              <div style="font-size:12px; color:var(--muted)">Mühendislik Fak.</div>
            </div>
            <div class="request-actions">
              <button class="btn-icon btn-decline" onclick="this.closest('.request-card').remove()">✕</button>
              <button class="btn-icon btn-accept" onclick="acceptRequest('${reqId}')">✓</button>
            </div>
          </div>
        `;
        requestsContainer.insertAdjacentHTML('beforeend', reqHTML);

        // Trigger animation
        setTimeout(() => {
          const el = document.getElementById(`req-${reqId}`);
          if (el) el.classList.add('show');
        }, 50);

      }, 2500);
    });

    if (cancelRideBtn) {
      cancelRideBtn.addEventListener('click', () => {
        driverWaitingView.classList.remove('active');
        if (formCard) formCard.style.display = 'grid';
        publishBtn.style.display = 'inline-flex';
        requestsContainer.innerHTML = ''; // Clear requests
      });
    }
  }

  // Global helper for accept button (since it's injected HTML)
  window.acceptRequest = (id) => {
    const card = document.getElementById(`req-${id}`);
    if (card) {
      card.innerHTML = `
        <div style="color:#2e7d32; font-weight:700; display:flex; align-items:center; gap:8px;">
          <span>✓</span> Ali K. kabul edildi
        </div>
      `;
      card.style.background = "#e8f5e9";
      card.style.borderColor = "#c8e6c9";

      // Update seat count visually
      const seatVal = document.getElementById('seatValue');
      if (seatVal) {
        let current = parseInt(seatVal.textContent);
        if (current > 0) seatVal.textContent = current - 1;
      }
    }
  };

  // Chat Interface Logic
  const chatView = document.getElementById('chatView');
  const openChatBtns = document.querySelectorAll('button'); // We need to find the specific chat button
  const closeChatBtn = document.getElementById('closeChatBtn');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const chatMessages = document.getElementById('chatMessages');

  // Find the "Mesaj" button in the bottom sheet
  if (liveSheet) {
    const msgBtn = Array.from(liveSheet.querySelectorAll('button')).find(b => b.textContent.includes('Mesaj'));
    if (msgBtn && chatView) {
      msgBtn.addEventListener('click', () => {
        chatView.classList.add('active');
      });
    }
  }

  if (closeChatBtn && chatView) {
    closeChatBtn.addEventListener('click', () => {
      chatView.classList.remove('active');
    });
  }

  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble sent';
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Simulate reply
    setTimeout(() => {
      const reply = document.createElement('div');
      reply.className = 'message-bubble received';
      const replies = [
        "Tamamdır, bekliyorum.",
        "Konumun doğru mu?",
        "Geliyorum!",
        "👍"
      ];
      reply.textContent = replies[Math.floor(Math.random() * replies.length)];
      chatMessages.appendChild(reply);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }, 1500);
  };

  if (chatSendBtn && chatInput) {
    chatSendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') sendMessage();
    });
  }
});
