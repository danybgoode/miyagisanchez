// js/main.js

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

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

  // Custom iOS 6 Glove Cursor
  const isTouchDevice = window.matchMedia("(hover: none)").matches;
  if (!isTouchDevice) {
    const cursorSvg = `<svg width="48" height="48" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="glove-grad" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e8e8e8"/></linearGradient><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="#000000" flood-opacity="0.4"/></filter></defs><g filter="url(#shadow)"><g transform="rotate(-45 25 35)"><path d="M 14 54 L 30 54 C 34 54, 34 60, 30 60 L 14 60 C 10 60, 10 54, 14 54 Z" fill="url(#glove-grad)" stroke="#c8c7cc" stroke-width="1.5" stroke-linejoin="round"/><path d="M 22 26 L 22 8 C 22 3, 32 3, 32 8 L 32 25 C 37 22, 43 23, 44 28 C 44 32, 40 35, 37 36 C 42 37, 46 41, 44 45 C 42 49, 38 49, 35 49 C 39 51, 41 55, 37 58 C 33 61, 28 57, 26 55 L 18 55 C 10 55, 6 47, 6 40 C 6 33, 11 29, 15 32 C 19 35, 22 39, 22 39 Z" fill="url(#glove-grad)" stroke="#c8c7cc" stroke-width="1.5" stroke-linejoin="round"/><path d="M 23 42 C 20 45, 20 50, 23 52 M 28 42 C 31 45, 31 50, 28 52" stroke="#c8c7cc" stroke-width="1.5" fill="none" stroke-linecap="round"/></g></g></svg>`;
    const cursorDataUrl = `data:image/svg+xml;utf8,${encodeURIComponent(cursorSvg)}`;
    
    const glove = document.createElement('div');
    glove.classList.add('custom-glove-cursor');
    glove.style.backgroundImage = `url('${cursorDataUrl}')`;
    document.body.appendChild(glove);

    const interactiveElements = document.querySelectorAll('button, .btn-primary, .btn-secondary, .btn-danger');

    let isHovering = false;

    window.addEventListener('mousemove', (e) => {
      if (isHovering) {
        glove.style.left = `${e.clientX - 3}px`;
        glove.style.top = `${e.clientY - 8}px`;
      }
    });

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', (e) => {
        isHovering = true;
        glove.style.left = `${e.clientX - 3}px`;
        glove.style.top = `${e.clientY - 8}px`;
        glove.classList.add('show');
      });

      el.addEventListener('mouseleave', () => {
        isHovering = false;
        glove.classList.remove('show');
        glove.classList.remove('squeeze');
      });

      el.addEventListener('mousedown', () => {
        glove.classList.add('squeeze');
      });

      el.addEventListener('mouseup', () => {
        glove.classList.remove('squeeze');
      });
    });
  }
});
