// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  const syncHeaderOffset = () => {
    const shell = document.querySelector('.shared-header-shell');
    if (!shell) return;
    document.body.style.setProperty('--header-offset', `${shell.offsetHeight}px`);
  };

  const currentUrl = new URL(window.location.href);
  currentUrl.hash = '';

  document.querySelectorAll('[data-dynamic-canonical]').forEach(link => {
    link.setAttribute('href', currentUrl.toString());
  });

  document.querySelectorAll('[data-dynamic-og-url]').forEach(meta => {
    meta.setAttribute('content', currentUrl.toString());
  });

  syncHeaderOffset();
  window.addEventListener('resize', syncHeaderOffset);

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Touch-first press feedback so buttons feel tactile on mobile too.
  const tactileButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
  const clearPressedState = button => {
    button.classList.remove('is-pressed');
  };

  tactileButtons.forEach(button => {
    button.addEventListener('pointerdown', () => {
      button.classList.add('is-pressed');
    });

    ['pointerup', 'pointercancel', 'pointerleave', 'dragstart'].forEach(eventName => {
      button.addEventListener(eventName, () => clearPressedState(button));
    });
  });

  // Smooth Scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        
        // Close mobile menu if open
        if (navLinks.classList.contains('active')) {
          navLinks.classList.remove('active');
        }

        window.scrollTo({
          top: targetElement.offsetTop - 44, // Account for sticky header
          behavior: 'smooth'
        });
      }
    });
  });

});
