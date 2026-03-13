/* ===================================
   ELITE VISA CONSULTANCY - MAIN JS
   Full interactive functionality
   =================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Security: Input Sanitization ───
  function sanitize(str) {
    return str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // ─── Page Transition System ───
  (function initPageTransitions() {
    // Create overlay if not present
    if (!document.querySelector('.page-transition-overlay')) {
      const overlay = document.createElement('div');
      overlay.className = 'page-transition-overlay';
      overlay.innerHTML = `
        <div class="curtain-left"></div>
        <div class="curtain-right"></div>
        <div class="transition-logo">MS GLOBAL <span>VISA</span><span class="transition-spinner"></span></div>`;
      document.body.appendChild(overlay);
    }

    // Intercept navigation links for smooth transition
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;
      const href = link.getAttribute('href');
      if (!href || href === 'javascript:void(0)' ||
          href.startsWith('javascript') || href.startsWith('mailto') ||
          href.startsWith('tel') || href.startsWith('https://wa.me') ||
          href.startsWith('https://instagram') ||
          link.getAttribute('target') === '_blank') return;
      // Allow pure hash links to scroll normally
      if (href.startsWith('#')) return;
      // Links like ../index.html#contact should navigate normally (no transition needed)
      if (href.includes('#')) return;

      e.preventDefault();
      const overlay = document.querySelector('.page-transition-overlay');
      if (overlay) {
        overlay.classList.add('active');
        setTimeout(() => { window.location.href = href; }, 900);
      } else {
        window.location.href = href;
      }
    });
  })();

  // ─── Loading Screen ───
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    // Hide body content until loader is done
    document.body.style.opacity = '1';
    setTimeout(() => {
      loadingScreen.classList.add('loaded');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
        // Only start page entrance after loader is gone
        document.body.classList.add('page-enter');
      }, 500);
    }, 1800);
  } else {
    // No loading screen (sub-pages), animate in immediately
    document.body.classList.add('page-enter');
  }

  // ─── Toast Notification System ───
  window.showToast = function (message, type = 'success') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: 'fa-check-circle', error: 'fa-times-circle', info: 'fa-info-circle' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <i class="fas ${icons[type] || icons.info} toast-icon"></i>
      <span class="toast-message">${sanitize(message)}</span>
      <button class="toast-close" onclick="this.parentElement.classList.add('removing');setTimeout(()=>this.parentElement.remove(),300)"><i class="fas fa-times"></i></button>`;
    container.appendChild(toast);
    setTimeout(() => { toast.classList.add('removing'); setTimeout(() => toast.remove(), 300); }, 4000);
  };

  // ─── Mobile Menu ───
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
    // Close on link click
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
    // Mobile dropdown toggle
    navMenu.querySelectorAll('.dropdown > a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          link.parentElement.classList.toggle('open');
        }
      });
    });
  }

  // ─── Smooth Scroll ───
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
  });

  // ─── Header Scroll Effect ───
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 80);
    });
  }

  // ─── Intersection Observer (animate-in) ───
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); } });
  }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.animate-in').forEach(el => observer.observe(el));

  // ─── Stat Counter Animation ───
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          const target = parseInt(entry.target.dataset.count);
          const suffix = entry.target.dataset.suffix || '';
          let current = 0;
          const step = Math.max(1, Math.ceil(target / 60));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) { current = target; clearInterval(timer); }
            entry.target.textContent = current.toLocaleString() + suffix;
          }, 30);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(c => counterObserver.observe(c));
  }

  // ─── FAQ Accordion ───
  document.querySelectorAll('.faq-question').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const wasActive = item.classList.contains('active');
      // Close all
      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!wasActive) {
        item.classList.add('active');
        const answer = item.querySelector('.faq-answer');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ─── Hero Slideshow ───
  const slides = document.querySelectorAll('.hero-slideshow .slide');
  if (slides.length > 1) {
    let current = 0;
    slides[0].classList.add('active');
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 5000);
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
  }

  // ─── Chat Widget ───
  const chatFab = document.querySelector('.chat-fab');
  const chatWidget = document.querySelector('.chat-widget');
  const chatClose = document.querySelector('.chat-close');
  const chatInput = document.querySelector('.chat-input-form input');
  const chatSend = document.querySelector('.chat-input-form button');
  const chatMessages = document.querySelector('.chat-messages');

  if (chatFab && chatWidget) {
    chatFab.addEventListener('click', () => {
      chatWidget.classList.toggle('open');
      const notif = chatFab.querySelector('.chat-notification');
      if (notif) notif.remove();
    });
    if (chatClose) chatClose.addEventListener('click', () => chatWidget.classList.remove('open'));
  }

  // Quick Replies
  document.querySelectorAll('.quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.textContent.trim();
      addChatMessage(text, 'user');
      btn.parentElement.remove();
      setTimeout(() => botReply(text), 800);
    });
  });

  // Chat send
  if (chatSend && chatInput) {
    const sendMsg = () => {
      const text = chatInput.value.trim();
      if (!text) return;
      addChatMessage(text, 'user');
      chatInput.value = '';
      setTimeout(() => botReply(text), 800);
    };
    chatSend.addEventListener('click', (e) => { e.preventDefault(); sendMsg(); });
    chatInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); sendMsg(); } });
  }

  function addChatMessage(text, sender) {
    if (!chatMessages) return;
    const now = new Date();
    const time = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const avatarIcon = sender === 'bot' ? 'EV' : '<i class="fas fa-user"></i>';
    const div = document.createElement('div');
    div.className = `chat-msg ${sender}`;
    div.innerHTML = `
      <div class="chat-avatar">${avatarIcon}</div>
      <div class="chat-bubble"><p>${sanitize(text)}</p><span class="chat-time">${time}</span></div>`;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function botReply(userText) {
    const lower = userText.toLowerCase();
    let reply = "Thank you for your message! Our team will get back to you shortly. For urgent queries, call us at +1 (555) 123-4567.";
    if (lower.includes('appointment') || lower.includes('book')) {
      reply = "I'd love to help you book an appointment! <a href='pages/appointment.html' style='color:var(--primary-gold);font-weight:600'>Click here to book now</a>, or call us at +1 (555) 123-4567.";
    } else if (lower.includes('track') || lower.includes('status')) {
      reply = "You can track your application status <a href='pages/track-application.html' style='color:var(--primary-gold);font-weight:600'>here</a>. Please have your reference ID ready.";
    } else if (lower.includes('cost') || lower.includes('price') || lower.includes('fee')) {
      reply = "Our consultation packages start from $199. Use our <a href='pages/visa-calculator.html' style='color:var(--primary-gold);font-weight:600'>Visa Cost Calculator</a> for a detailed estimate!";
    } else if (lower.includes('student') || lower.includes('study')) {
      reply = "We offer comprehensive student visa services for USA, UK, Canada, Australia & more! Our success rate for student visas is over 95%.";
    } else if (lower.includes('work') || lower.includes('employment')) {
      reply = "We handle H-1B, Skilled Worker, and employer-sponsored work visas. Book a consultation to discuss your specific case.";
    } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      reply = "Hello! 👋 Welcome to EliteVisa. How can I assist you today? I can help with bookings, visa info, costs, or tracking.";
    } else if (lower.includes('document') || lower.includes('require')) {
      reply = "Required documents vary by visa type. Generally you'll need: valid passport, photographs, financial statements, and application forms. We'll guide you through every step!";
    }
    addChatMessage(reply, 'bot');
  }

  // ─── Newsletter Form ───
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = newsletterForm.querySelector('input').value.trim();
      if (!/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      showToast('Thank you for subscribing! 🎉', 'success');
      newsletterForm.querySelector('input').value = '';
    });
  }

  // ─── Contact Form ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('input[name="name"]');
      const email = contactForm.querySelector('input[name="email"]');
      const phone = contactForm.querySelector('input[name="phone"]');
      const serviceSelect = contactForm.querySelector('select');
      const occupationField = contactForm.querySelector('textarea[name="occupation"]');
      const messageField = contactForm.querySelector('textarea[name="message"]');
      // Validate fields
      if (!name || !name.value.trim() || !phone || !phone.value.trim() || !occupationField || !occupationField.value.trim() || !messageField || !messageField.value.trim()) {
        showToast('Please fill in all required fields.', 'error');
        return;
      }
      if (email && email.value.trim() && !/^[\w.-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email.value.trim())) {
        showToast('Please enter a valid email address.', 'error');
        return;
      }
      // Save sanitized data to localStorage for admin panel
      const messages = JSON.parse(localStorage.getItem('ev_messages') || '[]');
      messages.push({
        id: Date.now(),
        name: sanitize(name.value.trim()),
        email: email ? sanitize(email.value.trim()) : '',
        phone: sanitize(phone.value.trim()),
        service: serviceSelect ? sanitize(serviceSelect.value) : 'General',
        occupation: occupationField ? sanitize(occupationField.value.trim()) : '',
        message: messageField ? sanitize(messageField.value.trim()) : '',
        date: new Date().toLocaleString(),
        status: 'new'
      });
      localStorage.setItem('ev_messages', JSON.stringify(messages));
      showToast('Message sent successfully! We\'ll contact you within 24 hours.', 'success');
      contactForm.reset();
    });
  }

  // ─── Scroll to Top ───
  let scrollBtn = document.querySelector('.scroll-top-btn');
  if (!scrollBtn) {
    scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(scrollBtn);
  }
  window.addEventListener('scroll', () => {
    if (scrollBtn) scrollBtn.classList.toggle('visible', window.scrollY > 500);
  });

  // ═══════════════════════════════════
  //  APPOINTMENT BOOKING WIZARD
  // ═══════════════════════════════════
  const bookingSteps = document.querySelectorAll('.booking-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const progressLines = document.querySelectorAll('.progress-line');
  let currentBookingStep = 1;

  window.goToStep = function (step) {
    if (step < 1 || step > 4) return;

    // Validate before moving forward
    if (step > currentBookingStep) {
      if (currentBookingStep === 1 && !getSelectedService()) {
        showToast('Please select a service to continue.', 'error');
        return;
      }
      if (currentBookingStep === 2 && (!selectedDate || !selectedTime)) {
        showToast('Please select a date and time slot.', 'error');
        return;
      }
      if (currentBookingStep === 3) {
        const form = document.getElementById('bookingForm');
        if (form && !form.checkValidity()) {
          form.reportValidity();
          return;
        }
        const consent = document.getElementById('bookConsent');
        if (consent && !consent.checked) {
          showToast('Please agree to the terms to continue.', 'error');
          return;
        }
      }
    }

    // Update steps
    bookingSteps.forEach(s => s.classList.add('hidden'));
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) targetStep.classList.remove('hidden');

    // Update progress
    progressSteps.forEach((ps, i) => {
      ps.classList.remove('active', 'completed');
      if (i + 1 < step) ps.classList.add('completed');
      if (i + 1 === step) ps.classList.add('active');
    });
    progressLines.forEach((pl, i) => {
      pl.classList.toggle('completed', i + 1 < step);
    });

    currentBookingStep = step;

    // If reaching confirmation step, finalize booking
    if (step === 4) finalizeBooking();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  function getSelectedService() {
    const checked = document.querySelector('input[name="service"]:checked');
    return checked ? checked.value : null;
  }

  // ─── Wire up Next / Prev buttons ───
  document.querySelectorAll('.next-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const nextStep = parseInt(btn.getAttribute('data-next'));
      if (nextStep) goToStep(nextStep);
    });
  });
  document.querySelectorAll('.prev-step').forEach(btn => {
    btn.addEventListener('click', () => {
      const prevStep = parseInt(btn.getAttribute('data-prev'));
      if (prevStep) goToStep(prevStep);
    });
  });

  // ─── Enable Next button when a service is selected ───
  document.querySelectorAll('input[name="service"]').forEach(radio => {
    radio.addEventListener('change', () => {
      const nextBtn = document.querySelector('#step1 .next-step');
      if (nextBtn) nextBtn.removeAttribute('disabled');
    });
  });

  // ─── Calendar ───
  let calendarMonth, calendarYear;
  let selectedDate = null;
  let selectedTime = null;

  const calendarDays = document.querySelector('.calendar-days');
  const calendarTitle = document.querySelector('.calendar-header h3');
  const prevBtn = document.querySelector('.cal-nav:first-child');
  const nextBtn = document.querySelector('.cal-nav:last-child');
  const selectedDateDisplay = document.querySelector('.selected-date-display');
  const timeSlotsEl = document.querySelector('.time-slots');

  if (calendarDays) {
    const now = new Date();
    calendarMonth = now.getMonth();
    calendarYear = now.getFullYear();
    renderCalendar();

    if (prevBtn) prevBtn.addEventListener('click', () => {
      calendarMonth--;
      if (calendarMonth < 0) { calendarMonth = 11; calendarYear--; }
      renderCalendar();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      calendarMonth++;
      if (calendarMonth > 11) { calendarMonth = 0; calendarYear++; }
      renderCalendar();
    });
  }

  function renderCalendar() {
    if (!calendarDays) return;
    calendarDays.innerHTML = '';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    if (calendarTitle) calendarTitle.textContent = `${months[calendarMonth]} ${calendarYear}`;

    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day empty';
      calendarDays.appendChild(empty);
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(calendarYear, calendarMonth, d);
      const dayEl = document.createElement('div');
      dayEl.className = 'cal-day';
      dayEl.textContent = d;

      // Disable past dates and weekends (Sunday=0)
      const dayOfWeek = date.getDay();
      if (date < today || dayOfWeek === 0) {
        dayEl.classList.add('disabled');
      } else {
        if (date.toDateString() === today.toDateString()) dayEl.classList.add('today');

        // Check if selected
        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
          dayEl.classList.add('selected');
        }

        dayEl.addEventListener('click', () => {
          document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
          dayEl.classList.add('selected');
          selectedDate = date;
          selectedTime = null;
          if (selectedDateDisplay) {
            selectedDateDisplay.textContent = date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
          }
          renderTimeSlots();
          // Reset step 2 next button until time is also selected
          const step2Next = document.querySelector('#step2 .next-step');
          if (step2Next) step2Next.setAttribute('disabled', '');
        });
      }

      calendarDays.appendChild(dayEl);
    }
  }

  function renderTimeSlots() {
    if (!timeSlotsEl) return;
    const slots = ['09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
      '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'];

    // Randomly make a couple unavailable for realism
    const unavailableIndexes = new Set();
    unavailableIndexes.add(Math.floor(Math.random() * slots.length));
    unavailableIndexes.add(Math.floor(Math.random() * slots.length));

    timeSlotsEl.innerHTML = '';
    slots.forEach((slot, i) => {
      const div = document.createElement('div');
      div.className = 'time-slot';
      div.textContent = slot;
      if (unavailableIndexes.has(i)) {
        div.classList.add('unavailable');
      } else {
        div.addEventListener('click', () => {
          document.querySelectorAll('.time-slot.selected').forEach(el => el.classList.remove('selected'));
          div.classList.add('selected');
          selectedTime = slot;
          // Enable step 2 next button
          const step2Next = document.querySelector('#step2 .next-step');
          if (step2Next) step2Next.removeAttribute('disabled');
        });
      }
      timeSlotsEl.appendChild(div);
    });
  }

  // ─── Finalize Booking ───
  function finalizeBooking() {
    const service = getSelectedService();
    const name = document.getElementById('bookName')?.value || 'N/A';
    const email = document.getElementById('bookEmail')?.value || 'N/A';
    const phone = document.getElementById('bookPhone')?.value || 'N/A';
    const country = document.getElementById('bookCountry')?.value || 'N/A';
    const packageType = document.getElementById('bookPackage')?.value || 'N/A';

    // Generate reference ID
    const refId = 'EV-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const dateStr = selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';

    // Fill confirmation
    const fields = {
      'summaryRef': refId,
      'summaryService': service || 'N/A',
      'summaryDate': dateStr,
      'summaryTime': selectedTime || 'N/A',
      'summaryName': name,
      'summaryEmail': email,
      'summaryPhone': phone,
      'summaryCountry': country,
      'summaryPackage': packageType
    };
    Object.entries(fields).forEach(([id, val]) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    });

    // Save to localStorage
    const booking = { refId, service, date: dateStr, time: selectedTime, name, email, phone, country, package: packageType, status: 'confirmed', createdAt: new Date().toISOString() };
    const bookings = JSON.parse(localStorage.getItem('ev_bookings') || '[]');
    bookings.push(booking);
    localStorage.setItem('ev_bookings', JSON.stringify(bookings));

    showToast('Appointment booked successfully! 🎉', 'success');
  }

  window.printBooking = function () {
    window.print();
  };

  // ═══════════════════════════════════
  //  APPLICATION TRACKER
  // ═══════════════════════════════════
  const trackerForm = document.getElementById('trackerForm');
  const trackerResults = document.getElementById('trackerResults');
  const trackerNotFound = document.getElementById('trackerNotFound');

  if (trackerForm) {
    trackerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const refId = document.getElementById('trackingId')?.value.trim();
      if (!refId) { showToast('Please enter a reference ID.', 'error'); return; }

      // Search localStorage
      const bookings = JSON.parse(localStorage.getItem('ev_bookings') || '[]');
      const found = bookings.find(b => b.refId === refId);

      // Demo data
      const demoData = {
        'EV-2026-DEMO01': {
          refId: 'EV-2026-DEMO01', name: 'John Smith', service: 'Student Visa',
          date: 'Monday, January 15, 2026', status: 'processing',
          country: 'United States', submitted: 'Jan 10, 2026',
          timeline: [
            { step: 'Application Received', date: 'Jan 10, 2026', status: 'completed', desc: 'Your application has been received and logged.' },
            { step: 'Document Review', date: 'Jan 12, 2026', status: 'completed', desc: 'All documents have been verified.' },
            { step: 'Submitted to Embassy', date: 'Jan 13, 2026', status: 'completed', desc: 'Application submitted to the embassy.' },
            { step: 'Processing', date: 'Jan 14, 2026', status: 'active', desc: 'Your application is being processed.' },
            { step: 'Decision', date: 'Pending', status: 'pending', desc: 'Awaiting final decision.' }
          ]
        }
      };

      const data = found || demoData[refId];

      if (data) {
        renderTrackerResult(data, !!demoData[refId]);
        if (trackerResults) trackerResults.classList.remove('hidden');
        if (trackerNotFound) trackerNotFound.classList.add('hidden');
      } else {
        if (trackerResults) trackerResults.classList.add('hidden');
        if (trackerNotFound) trackerNotFound.classList.remove('hidden');
      }
    });
  }

  function renderTrackerResult(data, isDemo) {
    // Status badge
    const statusBadge = document.getElementById('statusBadge');
    if (statusBadge) {
      const statusText = data.status || 'confirmed';
      statusBadge.className = `tracker-status-badge ${statusText}`;
      statusBadge.innerHTML = `<i class="fas fa-spinner"></i> ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`;
    }
    // Header
    const headerTitle = document.getElementById('trackerTitle');
    if (headerTitle) headerTitle.textContent = data.service || data.name || 'Application';
    const headerRef = document.getElementById('trackerRef');
    if (headerRef) headerRef.textContent = `Reference: ${data.refId}`;

    // Timeline
    const timelineEl = document.getElementById('trackerTimeline');
    if (timelineEl) {
      if (isDemo && data.timeline) {
        timelineEl.innerHTML = data.timeline.map(t => `
          <div class="timeline-item ${t.status}">
            <div class="timeline-dot"><i class="fas ${t.status === 'completed' ? 'fa-check' : t.status === 'active' ? 'fa-spinner' : 'fa-circle'}"></i></div>
            <div class="timeline-content">
              <h4>${t.step}</h4>
              <p>${t.desc}</p>
              <span class="timeline-date">${t.date}</span>
            </div>
          </div>`).join('');
      } else {
        // Generate basic timeline from booking
        timelineEl.innerHTML = `
          <div class="timeline-item completed">
            <div class="timeline-dot"><i class="fas fa-check"></i></div>
            <div class="timeline-content"><h4>Application Received</h4><p>Your booking has been confirmed.</p><span class="timeline-date">${data.date || 'N/A'}</span></div>
          </div>
          <div class="timeline-item active">
            <div class="timeline-dot"><i class="fas fa-spinner"></i></div>
            <div class="timeline-content"><h4>Under Review</h4><p>Our team is reviewing your application.</p><span class="timeline-date">In progress</span></div>
          </div>
          <div class="timeline-item">
            <div class="timeline-dot"><i class="fas fa-circle"></i></div>
            <div class="timeline-content"><h4>Processing</h4><p>Awaiting further processing.</p><span class="timeline-date">Pending</span></div>
          </div>`;
      }
    }

    // Details
    const detailsGrid = document.getElementById('trackerDetailsGrid');
    if (detailsGrid) {
      detailsGrid.innerHTML = `
        <div class="detail-item"><span class="detail-label">Reference ID</span><span class="detail-value">${data.refId}</span></div>
        <div class="detail-item"><span class="detail-label">Applicant</span><span class="detail-value">${data.name || 'N/A'}</span></div>
        <div class="detail-item"><span class="detail-label">Service</span><span class="detail-value">${data.service || 'N/A'}</span></div>
        <div class="detail-item"><span class="detail-label">Status</span><span class="detail-value">${(data.status || 'confirmed').toUpperCase()}</span></div>
        <div class="detail-item"><span class="detail-label">Appointment Date</span><span class="detail-value">${data.date || 'N/A'}</span></div>
        <div class="detail-item"><span class="detail-label">Package</span><span class="detail-value">${data.package || 'Standard'}</span></div>`;
    }
  }

  // ═══════════════════════════════════
  //  CLIENT PORTAL
  // ═══════════════════════════════════
  const loginForm = document.getElementById('loginForm');
  const loginView = document.getElementById('loginView');
  const dashboardView = document.getElementById('dashboardView');

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail')?.value.trim();
      const pass = document.getElementById('loginPassword')?.value;

      if (!email || !pass) { showToast('Please fill in all fields.', 'error'); return; }
      if (pass !== 'demo123') {
        showToast('Invalid credentials. Try password: demo123', 'error');
        return;
      }

      localStorage.setItem('ev_loggedIn', 'true');
      localStorage.setItem('ev_userName', email.split('@')[0] || 'Client');
      showDashboard();
      showToast('Welcome back! 👋', 'success');
    });
  }

  // Password toggle
  const passToggle = document.querySelector('.password-toggle');
  if (passToggle) {
    passToggle.addEventListener('click', () => {
      const input = passToggle.parentElement.querySelector('input');
      const isPass = input.type === 'password';
      input.type = isPass ? 'text' : 'password';
      passToggle.innerHTML = `<i class="fas ${isPass ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
    });
  }

  // Check if already logged in
  if (loginView && dashboardView && localStorage.getItem('ev_loggedIn') === 'true') {
    showDashboard();
  }

  function showDashboard() {
    if (loginView) loginView.classList.add('hidden');
    if (dashboardView) dashboardView.classList.remove('hidden');

    const userName = localStorage.getItem('ev_userName') || 'Client';
    const welcomeEl = document.getElementById('welcomeName');
    if (welcomeEl) welcomeEl.textContent = userName;

    populateDashboard();
  }

  window.logout = function () {
    localStorage.removeItem('ev_loggedIn');
    localStorage.removeItem('ev_userName');
    if (loginView) loginView.classList.remove('hidden');
    if (dashboardView) dashboardView.classList.add('hidden');
    showToast('Logged out successfully.', 'info');
  };

  function populateDashboard() {
    const bookings = JSON.parse(localStorage.getItem('ev_bookings') || '[]');
    const appointmentsList = document.getElementById('appointmentsList');

    // Update stat cards
    const totalAppts = document.getElementById('statAppointments');
    if (totalAppts) totalAppts.textContent = bookings.length;

    if (appointmentsList) {
      if (bookings.length === 0) {
        appointmentsList.innerHTML = `<div class="empty-state"><i class="fas fa-calendar-alt"></i><h4>No Appointments Yet</h4><p>Book your first consultation to get started.</p><a href="appointment.html" class="cta-button" style="margin-top:1rem"><i class="fas fa-plus"></i> Book Now</a></div>`;
      } else {
        appointmentsList.innerHTML = bookings.map(b => {
          const date = new Date(b.createdAt || Date.now());
          const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
          const day = date.getDate();
          return `
          <div class="appointment-card">
            <div class="appt-date-box"><span class="month">${month}</span><span class="day">${day}</span></div>
            <div class="appt-info">
              <h4>${b.service || 'Consultation'}</h4>
              <p>Ref: ${b.refId}</p>
              <div class="appt-meta">
                <span><i class="fas fa-clock"></i> ${b.time || 'TBD'}</span>
                <span><i class="fas fa-tag"></i> ${b.package || 'Standard'}</span>
              </div>
            </div>
            <span class="appt-status confirmed">Confirmed</span>
          </div>`;
        }).join('');
      }
    }
  }

  // Dashboard Tabs
  document.querySelectorAll('.dash-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.dash-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.dash-tab-content').forEach(c => c.classList.remove('active'));
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  // Document Checklist Progress
  const docChecks = document.querySelectorAll('.doc-check input');
  if (docChecks.length) {
    const updateProgress = () => {
      const total = docChecks.length;
      const checked = document.querySelectorAll('.doc-check input:checked').length;
      const pct = Math.round((checked / total) * 100);
      const fill = document.querySelector('.doc-progress-fill');
      const text = document.querySelector('.doc-progress-text');
      if (fill) fill.style.width = pct + '%';
      if (text) text.textContent = `${checked} of ${total} documents uploaded (${pct}%)`;

      // Update status labels
      docChecks.forEach(cb => {
        const item = cb.closest('.doc-item');
        if (item) {
          const status = item.querySelector('.doc-status');
          if (status) {
            status.className = `doc-status ${cb.checked ? 'uploaded' : 'pending'}`;
            status.textContent = cb.checked ? 'Uploaded' : 'Pending';
          }
        }
      });
    };
    docChecks.forEach(cb => cb.addEventListener('change', updateProgress));
    updateProgress();
  }

  // Profile Form
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Profile updated successfully! ✅', 'success');
    });
  }

  // ═══════════════════════════════════
  //  VISA COST CALCULATOR
  // ═══════════════════════════════════
  const calcForm = document.getElementById('calcForm');
  if (calcForm) {
    calcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      calculateCost();
    });
  }

  function calculateCost() {
    const country = document.getElementById('calcCountry')?.value;
    const visaType = document.getElementById('calcVisaType')?.value;
    const pkg = document.getElementById('calcPackage')?.value;
    const applicants = parseInt(document.getElementById('calcApplicants')?.value) || 1;

    if (!country || !visaType || !pkg) {
      showToast('Please fill in all required fields.', 'error');
      return;
    }

    // Fee lookup
    const visaFees = {
      usa: { student: 160, work: 190, family: 265, tourist: 160, business: 160, pr: 1225 },
      uk: { student: 348, work: 625, family: 1538, tourist: 100, business: 100, pr: 2404 },
      canada: { student: 150, work: 155, family: 75, tourist: 100, business: 100, pr: 1325 },
      australia: { student: 620, work: 310, family: 7850, tourist: 140, business: 140, pr: 4115 },
      germany: { student: 75, work: 75, family: 75, tourist: 80, business: 80, pr: 200 },
      uae: { student: 300, work: 500, family: 350, tourist: 90, business: 200, pr: 1000 },
      newzealand: { student: 270, work: 495, family: 500, tourist: 170, business: 170, pr: 2680 },
      singapore: { student: 150, work: 105, family: 100, tourist: 30, business: 30, pr: 100 },
    };

    const serviceFees = { basic: 199, standard: 499, premium: 999 };

    const baseFee = visaFees[country]?.[visaType] || 200;
    const serviceFee = serviceFees[pkg] || 499;

    // Extras
    let extrasTotal = 0;
    const extraLabels = [];
    document.querySelectorAll('.calc-checkbox input:checked').forEach(cb => {
      const val = parseInt(cb.dataset.price) || 0;
      extrasTotal += val;
      extraLabels.push({ name: cb.parentElement.textContent.trim().replace(/\$[\d,]+/, '').trim(), cost: val });
    });

    const govFees = Math.round(baseFee * 0.15);
    const total = (baseFee * applicants) + serviceFee + extrasTotal + govFees;

    // Render breakdown
    const emptyEl = document.querySelector('.calc-empty');
    const breakdownEl = document.querySelector('.calc-breakdown');
    if (emptyEl) emptyEl.classList.add('hidden');
    if (breakdownEl) breakdownEl.classList.remove('hidden');

    const breakdownBody = document.getElementById('breakdownBody');
    if (breakdownBody) {
      let html = `
        <div class="breakdown-item"><span>Visa Application Fee (${visaType})</span><span>$${baseFee}</span></div>
        <div class="breakdown-item"><span>Service Fee (${pkg} package)</span><span>$${serviceFee}</span></div>`;
      if (applicants > 1) {
        html += `<div class="breakdown-item"><span>Additional Applicants (×${applicants})</span><span>$${baseFee * (applicants - 1)}</span></div>`;
      }
      extraLabels.forEach(ex => {
        html += `<div class="breakdown-item"><span>${ex.name}</span><span>$${ex.cost}</span></div>`;
      });
      html += `
        <div class="breakdown-item"><span>Government Processing Fees</span><span>$${govFees}</span></div>
        <div class="breakdown-divider"></div>
        <div class="breakdown-item total"><span>Total Estimated Cost</span><span>$${total.toLocaleString()}</span></div>`;
      breakdownBody.innerHTML = html;
    }

    showToast('Cost estimate calculated! 💰', 'success');
  }

  // ─── Destination Category Tabs ───
  const destCatBtns = document.querySelectorAll('.dest-cat-btn');
  const destDropdowns = document.querySelectorAll('.dest-dropdown');
  if (destCatBtns.length) {
    destCatBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.dataset.category;
        // Toggle active button
        destCatBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        // Toggle dropdown panels
        destDropdowns.forEach(dd => dd.classList.remove('active'));
        const target = document.getElementById('dest-' + cat);
        if (target) target.classList.add('active');
      });
    });
  }

  window.printCalculation = function () { window.print(); };
  window.bookFromCalc = function () { window.location.href = 'appointment.html'; };

});
