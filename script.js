/**
 * Vijay Kumar Kewlani - Interactive Resume & Animated Portfolio Engine
 * Features:
 *  1. Dynamic Typewriter Role Rotation (Hero Subtitle)
 *  2. Animated Metric Counters (Smooth count-up effect)
 *  3. Interactive Mouse Ambient Spotlight & 3D Tilt Cards
 *  4. Interactive Filter Tabs (All / Sales & Leadership / AI & Web Tech)
 *  5. Theme Switcher with LocalStorage Memory
 *  6. One-Click Contact Clipboard with Toast Alert
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initContactCopy();
  initTypewriter();
  initNumberCounters();
  initMouseEffectsAndTilt();
  initFilterTabs();
});

/* ==========================================================================
   1. Dynamic Typewriter Effect
   ========================================================================== */
function initTypewriter() {
  const roleEl = document.getElementById('typingRole');
  if (!roleEl) return;

  const roles = [
    'Sales Manager @ Clawear',
    'AI Web & Frontend Developer',
    '8+ Years Retail Tech Sales Leader',
    'Prompt Engineering & LLM Integrations',
    'Smartphone Diagnostics & Hardware Specialist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeStep() {
    const currentRole = roles[roleIdx];

    if (isDeleting) {
      roleEl.textContent = currentRole.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      roleEl.textContent = currentRole.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 70;
    }

    // Finished typing current role
    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 350; // Pause before typing next word
    }

    setTimeout(typeStep, typingSpeed);
  }

  // Start typewriter after a short delay
  setTimeout(typeStep, 600);
}

/* ==========================================================================
   2. Animated Number Counters
   ========================================================================== */
function initNumberCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25 });

  counters.forEach(counter => observer.observe(counter));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400; // ms
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // EaseOutCubic formula
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easeProgress * target);

      el.textContent = `${currentVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        el.textContent = `${target}${suffix}`;
      }
    }

    requestAnimationFrame(updateCounter);
  }
}

/* ==========================================================================
   3. Ambient Mouse Spotlight & 3D Card Tilt
   ========================================================================== */
function initMouseEffectsAndTilt() {
  const resumeCard = document.querySelector('.resume-card');

  // Ambient mouse spotlight background tracking
  if (resumeCard && window.matchMedia('(hover: hover)').matches) {
    resumeCard.addEventListener('mousemove', (e) => {
      const rect = resumeCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      resumeCard.style.setProperty('--mouse-x', `${x}px`);
      resumeCard.style.setProperty('--mouse-y', `${y}px`);
    });
  }

  // 3D Card tilt on hover
  const tiltCards = document.querySelectorAll('[data-tilt]');
  if (!tiltCards.length || !window.matchMedia('(hover: hover)').matches) return;

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const deltaX = (x - centerX) / centerX;
      const deltaY = (y - centerY) / centerY;

      const rotX = -deltaY * 6; // Max 6 deg
      const rotY = deltaX * 6;

      card.style.transform = `perspective(800px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   4. Interactive Filter Tabs (All / Sales / Tech)
   ========================================================================== */
function initFilterTabs() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  if (!filterButtons.length) return;

  const filterableItems = document.querySelectorAll('[data-category]');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetFilter = button.getAttribute('data-filter');

      // Update active state on buttons
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

      // Apply filter to content items
      filterableItems.forEach(item => {
        const categories = item.getAttribute('data-category') || '';
        const categoryList = categories.split(' ');

        if (targetFilter === 'all' || categoryList.includes(targetFilter)) {
          item.classList.remove('filter-dimmed');
          item.classList.add('filter-highlight');
        } else {
          item.classList.add('filter-dimmed');
          item.classList.remove('filter-highlight');
        }
      });
    });
  });
}

/* ==========================================================================
   5. Dark / Light Theme Manager
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  const savedTheme = localStorage.getItem('vk_resume_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('vk_resume_theme', newTheme);
    });
  }

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('vk_resume_theme')) {
        htmlRoot.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }
}

/* ==========================================================================
   6. Contact Info Copy to Clipboard with Toast Notification
   ========================================================================== */
function initContactCopy() {
  const copyBtn = document.getElementById('copyContactBtn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const contactText = `Vijay Kumar Kewlani
Current Role: Sales Manager at Clawear (clawear.com)
Phone: +91 6378191156
Email: vijaykewlani231994@gmail.com
Location: Niwaru, Jaipur, Rajasthan (302012)
GitHub: https://github.com/DigiClums
Portfolio Resume: https://github.com/DigiClums/Vijay-Resume`;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(contactText);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = contactText;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      showToast('Contact details copied to clipboard!');
    } catch (err) {
      showToast('Contact: +91 6378191156 | vijaykewlani231994@gmail.com');
    }
  });
}

let toastTimeout;
function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}
