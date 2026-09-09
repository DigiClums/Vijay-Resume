/**
 * Vijay Kumar Kewlani - Interactive Resume Script
 * Features:
 *  - Dark / Light theme toggle with LocalStorage persistence
 *  - Copy contact details to clipboard with interactive toast notification
 *  - System theme preference detection
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initContactCopy();
});

/**
 * Initialize theme based on LocalStorage or OS preference
 */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or check OS preference
  const savedTheme = localStorage.getItem('vk_resume_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    htmlRoot.setAttribute('data-theme', savedTheme);
  } else if (prefersDark) {
    htmlRoot.setAttribute('data-theme', 'dark');
  } else {
    htmlRoot.setAttribute('data-theme', 'light');
  }

  // Toggle button click listener
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      
      htmlRoot.setAttribute('data-theme', newTheme);
      localStorage.setItem('vk_resume_theme', newTheme);
    });
  }

  // Listen for system theme changes if no explicit user override
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('vk_resume_theme')) {
        htmlRoot.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      }
    });
  }
}

/**
 * Copy contact information to clipboard
 */
function initContactCopy() {
  const copyBtn = document.getElementById('copyContactBtn');
  const toast = document.getElementById('toast');

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
        // Fallback for non-https / older browsers
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

/**
 * Toast Notification Helper
 */
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
