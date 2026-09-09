/**
 * Vijay Kumar Kewlani - Interactive Resume & Portfolio Engine
 * Features:
 *  1. Dynamic Typewriter Role Rotation (Hero Subtitle)
 *  2. Animated Metric Counters (Smooth count-up effect)
 *  3. Interactive Mouse Ambient Spotlight & 3D Tilt Cards
 *  4. Interactive Filter Tabs (All / Sales & Leadership / AI & Web Tech)
 *  5. Theme Switcher with LocalStorage Memory
 *  6. One-Click Contact Clipboard with Toast Alert
 *  7. 1-Click vCard (.vcf) Phone Contact Downloader
 *  8. QR Code Modal & Quick Message / Hire Me Modal Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initContactCopy();
  initTypewriter();
  initNumberCounters();
  initMouseEffectsAndTilt();
  initFilterTabs();
  initVCardDownload();
  initModals();
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

    if (!isDeleting && charIdx === currentRole.length) {
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 350;
    }

    setTimeout(typeStep, typingSpeed);
  }

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
    const duration = 1400;
    const startTime = performance.now();

    function updateCounter(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
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

  if (resumeCard && window.matchMedia('(hover: hover)').matches) {
    resumeCard.addEventListener('mousemove', (e) => {
      const rect = resumeCard.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      resumeCard.style.setProperty('--mouse-x', `${x}px`);
      resumeCard.style.setProperty('--mouse-y', `${y}px`);
    });
  }

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

      const rotX = -deltaY * 6;
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

      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');

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

/* ==========================================================================
   7. 1-Click vCard (.vcf) Contact Card Downloader
   ========================================================================== */
function downloadVCard() {
  const vCardData = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:Kewlani;Vijay;Kumar;;',
    'FN:Vijay Kumar Kewlani',
    'ORG:Clawear (clawear.com)',
    'TITLE:Sales Manager & AI Web Developer',
    'TEL;TYPE=CELL,VOICE;VALUE=uri:tel:+916378191156',
    'EMAIL;TYPE=INTERNET,PREF:vijaykewlani231994@gmail.com',
    'ADR;TYPE=HOME:;;Niwaru;Jaipur;Rajasthan;302012;India',
    'URL:https://digiclums.github.io/Vijay-Resume/',
    'URL;TYPE=GitHub:https://github.com/DigiClums',
    'NOTE:Sales Manager with 8+ years retail & tech sales mastery across Clawear, Apple, Samsung, Xiaomi, OPPO and AI Web Development.',
    'END:VCARD'
  ].join('\r\n');

  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8;' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.setAttribute('download', 'Vijay_Kumar_Kewlani_Contact.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);

  showToast('Contact card (.vcf) downloaded!');
}

function initVCardDownload() {
  const vCardBtn = document.getElementById('vCardBtn');
  const modalVCardBtn = document.getElementById('modalVCardBtn');

  if (vCardBtn) vCardBtn.addEventListener('click', downloadVCard);
  if (modalVCardBtn) modalVCardBtn.addEventListener('click', downloadVCard);
}

/* ==========================================================================
   8. QR Code & Quick Message Modals Engine
   ========================================================================== */
function initModals() {
  // Modal Elements
  const qrBtn = document.getElementById('qrBtn');
  const qrModal = document.getElementById('qrModal');
  const closeQrModal = document.getElementById('closeQrModal');

  const quickMsgBtn = document.getElementById('quickMsgBtn');
  const quickMsgModal = document.getElementById('quickMsgModal');
  const closeMsgModal = document.getElementById('closeMsgModal');

  // Open & Close QR Modal
  if (qrBtn && qrModal) {
    qrBtn.addEventListener('click', () => {
      qrModal.classList.add('open');
      qrModal.setAttribute('aria-hidden', 'false');
    });
  }

  if (closeQrModal && qrModal) {
    closeQrModal.addEventListener('click', () => {
      qrModal.classList.remove('open');
      qrModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Open & Close Quick Message Modal
  if (quickMsgBtn && quickMsgModal) {
    quickMsgBtn.addEventListener('click', () => {
      quickMsgModal.classList.add('open');
      quickMsgModal.setAttribute('aria-hidden', 'false');
      setDefaultMessage('interview');
    });
  }

  if (closeMsgModal && quickMsgModal) {
    closeMsgModal.addEventListener('click', () => {
      quickMsgModal.classList.remove('open');
      quickMsgModal.setAttribute('aria-hidden', 'true');
    });
  }

  // Close modals when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === qrModal) {
      qrModal.classList.remove('open');
      qrModal.setAttribute('aria-hidden', 'true');
    }
    if (e.target === quickMsgModal) {
      quickMsgModal.classList.remove('open');
      quickMsgModal.setAttribute('aria-hidden', 'true');
    }
  });

  // Quick Message Topic Switcher
  const topicChips = document.querySelectorAll('.topic-chip');
  const msgTextarea = document.getElementById('customMessage');

  const messageTemplates = {
    interview: 'Hi Vijay, we reviewed your resume and would like to invite you for an interview regarding an exciting Sales Management / Tech role.',
    sales: 'Hi Vijay, we are looking for a high-performing Sales Manager with your track record at Clawear, Apple, and Samsung.',
    tech: 'Hi Vijay, we are impressed by your AI Web Development and tech background and would like to discuss a project collaboration.',
    general: 'Hi Vijay, I came across your digital resume and would like to connect with you!'
  };

  function setDefaultMessage(topic) {
    if (msgTextarea) {
      msgTextarea.value = messageTemplates[topic] || messageTemplates.general;
    }
  }

  topicChips.forEach(chip => {
    chip.addEventListener('click', () => {
      topicChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const topic = chip.getAttribute('data-topic');
      setDefaultMessage(topic);
    });
  });

  // Send WhatsApp Button Action
  const sendWhatsAppBtn = document.getElementById('sendWhatsAppBtn');
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', () => {
      const senderName = document.getElementById('senderName')?.value.trim() || 'Recruiter/Client';
      const senderCompany = document.getElementById('senderCompany')?.value.trim() || '';
      const customMsg = msgTextarea?.value.trim() || '';

      let text = `Hello Vijay,\n\nI am ${senderName}`;
      if (senderCompany) text += ` from ${senderCompany}`;
      text += `.\n\n${customMsg}\n\n(Sent via Vijay-Resume Digital Profile)`;

      const waUrl = `https://wa.me/916378191156?text=${encodeURIComponent(text)}`;
      window.open(waUrl, '_blank');
      quickMsgModal.classList.remove('open');
    });
  }

  // Send Email Button Action
  const sendEmailBtn = document.getElementById('sendEmailBtn');
  if (sendEmailBtn) {
    sendEmailBtn.addEventListener('click', () => {
      const senderName = document.getElementById('senderName')?.value.trim() || 'Recruiter';
      const senderCompany = document.getElementById('senderCompany')?.value.trim() || '';
      const customMsg = msgTextarea?.value.trim() || '';

      const subject = `Inquiry for Vijay Kumar Kewlani - ${senderName}${senderCompany ? ' (' + senderCompany + ')' : ''}`;
      const body = `Hi Vijay,\n\nMy name is ${senderName}${senderCompany ? ' from ' + senderCompany : ''}.\n\n${customMsg}\n\nBest regards,\n${senderName}`;

      const mailtoUrl = `mailto:vijaykewlani231994@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoUrl;
      quickMsgModal.classList.remove('open');
    });
  }
}

/* ==========================================================================
   Toast Notification Helper
   ========================================================================== */
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
