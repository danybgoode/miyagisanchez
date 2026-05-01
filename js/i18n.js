/**
 * i18n.js - Lightweight Vanilla JS i18n System
 */

const i18n = {
  supportedLanguages: ['en', 'es'],
  defaultLanguage: 'en',
  storageKey: 'selected_language',
  translations: {},
  currentLanguage: 'en',

  async init() {
    if (typeof window.renderSharedShell === 'function') {
      window.renderSharedShell();
    }

    // 1. Detect language
    const storedLang = localStorage.getItem(this.storageKey);
    const browserLang = navigator.language.split('-')[0];
    
    if (storedLang && this.supportedLanguages.includes(storedLang)) {
      this.currentLanguage = storedLang;
    } else if (this.supportedLanguages.includes(browserLang)) {
      this.currentLanguage = browserLang;
    } else {
      this.currentLanguage = this.defaultLanguage;
    }

    document.documentElement.lang = this.currentLanguage;

    // 2. Initial fetch and apply
    await this.loadTranslations(this.currentLanguage);
    this.applyTranslations();
    this.updateSwitcherUI();
    this.syncEmbeddedVisuals();
    
    // 3. Expose to window for global access
    window.setLanguage = (lang) => this.setLanguage(lang);
  },

  async loadTranslations(lang) {
    try {
      // Determine current page from URL
      const pathSegments = window.location.pathname.split('/').filter(Boolean);
      let page = pathSegments.length ? pathSegments[pathSegments.length - 1].replace('.html', '') : 'index';
      if (!page || page === '/' || page === 'index') {
        // For directory-style URLs (e.g. executive-agent/index.html), use the parent dir name
        page = pathSegments.length >= 2 ? pathSegments[pathSegments.length - 2] : 'index';
      }

      // Load global translations
      const globalResponse = await fetch(`locales/${lang}/global.json`);
      const globalData = await globalResponse.json();
      
      let pageData = {};
      try {
        const pageResponse = await fetch(`locales/${lang}/${page}.json`);
        if (pageResponse.ok) {
          pageData = await pageResponse.json();
        }
      } catch (e) {
        console.warn(`No page-specific translations found for ${page}`);
      }

      // Merge translations
      this.translations[lang] = { ...globalData, ...pageData };
    } catch (error) {
      console.error(`Could not load translations for ${lang}:`, error);
    }
  },

  async setLanguage(lang) {
    if (!this.supportedLanguages.includes(lang)) return;
    
    this.currentLanguage = lang;
    localStorage.setItem(this.storageKey, lang);
    
    if (!this.translations[lang]) {
      await this.loadTranslations(lang);
    }
    
    this.applyTranslations();
    this.updateSwitcherUI();
    this.syncEmbeddedVisuals();
    
    // Update HTML lang attribute
    document.documentElement.lang = lang;
  },

  syncEmbeddedVisuals() {
    document.querySelectorAll('[data-visual-locale-frame]').forEach(frame => {
      try {
        frame.contentWindow?.postMessage(
          { type: 'bonsai:set-language', lang: this.currentLanguage },
          window.location.origin
        );
      } catch (error) {
        console.warn('Could not sync embedded visual language', error);
      }
    });
  },

  applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    const ariaLabelElements = document.querySelectorAll('[data-i18n-aria-label]');
    const contentElements = document.querySelectorAll('[data-i18n-content]');
    const langData = this.translations[this.currentLanguage];
    
    if (!langData) return;

    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = langData[key];
      
      if (translation) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translation;
        } else {
          el.innerHTML = translation;
        }
      }
    });

    ariaLabelElements.forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      const translation = langData[key];

      if (translation) {
        el.setAttribute('aria-label', translation);
      }
    });

    contentElements.forEach(el => {
      const key = el.getAttribute('data-i18n-content');
      const translation = langData[key];

      if (translation) {
        el.setAttribute('content', translation);
      }
    });

    // Handle visibility - ensure elements are processed after DOM updates
    const visibilityElements = document.querySelectorAll('[data-lang-visible]');
    visibilityElements.forEach(el => {
      const visibleLang = el.getAttribute('data-lang-visible');
      if (visibleLang === this.currentLanguage) {
        // Make sure element is visible by setting display to initial state or block
        el.style.display = '';
      } else {
        // Hide elements that don't match current language
        el.style.display = 'none';
      }
    });
    
    // Update page title if key exists
    if (langData['page_title']) {
      document.title = langData['page_title'];
    }
    
    // Handle pricing display logic for all plans with discounts
    this.handlePricingWithDiscounts();
  },

  handlePricingWithDiscounts() {
    // Check if we have translation data
    const langData = this.translations[this.currentLanguage];
    
    if (!langData) {
      return;
    }
    
    // Handle enterprise pricing
    this.handleEnterprisePricing(langData);
    
    // Handle pro pricing
    this.handlePlanPricing('plan_pro', langData);
    
    // Handle basic pricing
    this.handlePlanPricing('plan_basic', langData);
  },
  
  handleEnterprisePricing(langData) {
    // Check if we have enterprise pricing with discount
    // If we don't have the translation data or no discounted price is defined, do nothing
    if (!langData || !langData['plan_enterprise_price_discounted']) {
      return;
    }
    
    // Find the enterprise pricing container
    const enterprisePriceElement = document.querySelector('[data-i18n="plan_enterprise_price"]');
    
    if (!enterprisePriceElement) {
      return;
    }
    
    // Get the translation data
    const discountedPrice = langData['plan_enterprise_price_discounted'];
    const originalPrice = langData['plan_enterprise_price_original'];
    
    // Check if we have both prices (discounted and original)
    if (discountedPrice && originalPrice) {
      // Create the container for both prices
      const priceContainer = document.createElement('div');
      priceContainer.className = 'enterprise-pricing-container';
      
      // Create the crossed-out original price
      const originalPriceElement = document.createElement('span');
      originalPriceElement.className = 'pricing-original';
      originalPriceElement.style.textDecoration = 'line-through';
      originalPriceElement.style.color = '#999';
      originalPriceElement.style.fontSize = '24px';
      originalPriceElement.innerHTML = originalPrice;
      
      // Create the discounted price
      const discountedPriceElement = document.createElement('span');
      discountedPriceElement.className = 'pricing-discounted';
      discountedPriceElement.style.fontSize = '30px';
      discountedPriceElement.style.fontWeight = '700';
      discountedPriceElement.style.color = '#000';
      discountedPriceElement.style.marginLeft = '10px';
      discountedPriceElement.innerHTML = discountedPrice;
      
      // Add both elements to the container
      priceContainer.appendChild(originalPriceElement);
      priceContainer.appendChild(discountedPriceElement);
      
      // Apply the container as content to keep the original element intact for future translations
      enterprisePriceElement.innerHTML = '';
      enterprisePriceElement.appendChild(priceContainer);
    }
  },
  
  handlePlanPricing(planKey, langData) {
    // Check if we have the plan pricing with discount
    const discountedKey = `${planKey}_price_discounted`;
    const originalKey = `${planKey}_price_original`;
    
    if (!langData || !langData[discountedKey]) {
      return;
    }
    
    // Find the plan pricing container
    const planPriceElement = document.querySelector(`[data-i18n="${planKey}_price"]`);
    
    if (!planPriceElement) {
      return;
    }
    
    // Get the translation data
    const discountedPrice = langData[discountedKey];
    const originalPrice = langData[originalKey];
    
    // Check if we have both prices (discounted and original)
    if (discountedPrice && originalPrice) {
      // Create the container for both prices
      const priceContainer = document.createElement('div');
      priceContainer.className = `${planKey}-pricing-container`;
      
      // Create the crossed-out original price
      const originalPriceElement = document.createElement('span');
      originalPriceElement.className = 'pricing-original';
      originalPriceElement.style.textDecoration = 'line-through';
      originalPriceElement.style.color = '#999';
      originalPriceElement.style.fontSize = '24px';
      originalPriceElement.innerHTML = originalPrice;
      
      // Create the discounted price
      const discountedPriceElement = document.createElement('span');
      discountedPriceElement.className = 'pricing-discounted';
      discountedPriceElement.style.fontSize = '30px';
      discountedPriceElement.style.fontWeight = '700';
      discountedPriceElement.style.color = '#000';
      discountedPriceElement.style.marginLeft = '10px';
      discountedPriceElement.innerHTML = discountedPrice;
      
      // Add both elements to the container
      priceContainer.appendChild(originalPriceElement);
      priceContainer.appendChild(discountedPriceElement);
      
      // Apply the container as content to keep the original element intact for future translations
      planPriceElement.innerHTML = '';
      planPriceElement.appendChild(priceContainer);
    }
  },

  updateSwitcherUI() {
    const buttons = document.querySelectorAll('.lang-btn');
    buttons.forEach(btn => {
      const lang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
      if (lang === this.currentLanguage) {
        btn.classList.add('active');
        // iOS 6 "pressed" state simulation for active button
        btn.style.background = 'linear-gradient(to bottom, #d0d0d0, #b8b8b8)';
        btn.style.boxShadow = 'inset 0 2px 3px rgba(0,0,0,0.3)';
        btn.style.transform = 'translateY(1px)';
      } else {
        btn.classList.remove('active');
        btn.style.background = '';
        btn.style.boxShadow = '';
        btn.style.transform = '';
      }
    });
  }
};

// Auto-init on script load
document.addEventListener('DOMContentLoaded', () => {
  i18n.init();
});
