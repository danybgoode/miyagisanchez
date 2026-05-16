/* ── Custom Booking Modal — Cal.com v2 API ───────────────────────────────── */
(function () {
  'use strict';

  var API      = 'https://api.cal.com/v2';
  var KEY      = 'cal_live_5fcf6f814e0f0e1d31a2e27445ede93a';
  var USERNAME = 'miyagisan';
  var SLUG     = 'bonsaitalk';
  var VER      = '2024-06-14';

  /* ── State ─────────────────────────────────────────────────────────────── */
  var state = {
    step: 'calendar',   // calendar | slots | form | confirm | error
    eventTypes: [],
    selectedDuration: null,
    selectedEventType: null,
    year: null,
    month: null,
    slotsCache: {},     // '<etId>-<year>-<month>' → { 'YYYY-MM-DD': [isoTime, …] }
    selectedDate: null,
    selectedTime: null,
    loading: false,
    error: null,
    booking: null,
  };

  var modalEl = null;
  var panelEl = null;

  /* ── API helpers ────────────────────────────────────────────────────────── */

  function headers() {
    return {
      'Authorization': 'Bearer ' + KEY,
      'cal-api-version': VER,
      'Content-Type': 'application/json'
    };
  }

  function apiGet(path) {
    return fetch(API + path, { headers: headers() }).then(function (r) { return r.json(); });
  }

  function apiPost(path, body) {
    return fetch(API + path, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(body)
    }).then(function (r) { return r.json(); });
  }

  /* ── Cal.com calls ──────────────────────────────────────────────────────── */

  function loadEventTypes() {
    return apiGet('/event-types?username=' + USERNAME + '&slug=' + SLUG)
      .then(function (data) {
        if (data.status !== 'success' || !data.data) return [];
        var raw = data.data;
        var types = [];
        if (Array.isArray(raw)) {
          types = raw;
        } else if (raw.eventTypeGroups) {
          raw.eventTypeGroups.forEach(function (g) {
            if (g.eventTypes) types = types.concat(g.eventTypes);
          });
        } else if (Array.isArray(raw.eventTypes)) {
          types = raw.eventTypes;
        }
        var filtered = types.filter(function (t) { return t.slug === SLUG; });
        return filtered.length ? filtered : types;
      });
  }

  function loadSlots(etId, year, month) {
    var cacheKey = etId + '-' + year + '-' + month;
    if (state.slotsCache[cacheKey]) return Promise.resolve(state.slotsCache[cacheKey]);

    var tz    = (Intl && Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC';
    var start = new Date(year, month, 1).toISOString();
    var end   = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

    return apiGet(
      '/slots/available?eventTypeId=' + etId +
      '&startTime=' + encodeURIComponent(start) +
      '&endTime='   + encodeURIComponent(end) +
      '&timeZone='  + encodeURIComponent(tz)
    ).then(function (data) {
      var byDate = {};
      if (data.status === 'success' && data.data && data.data.slots) {
        var slots = data.data.slots;
        Object.keys(slots).forEach(function (dateKey) {
          byDate[dateKey] = slots[dateKey].map(function (s) { return s.time; });
        });
      }
      state.slotsCache[cacheKey] = byDate;
      return byDate;
    });
  }

  function createBooking(etId, startTime, name, email) {
    var tz = (Intl && Intl.DateTimeFormat().resolvedOptions().timeZone) || 'UTC';
    return apiPost('/bookings', {
      eventTypeId: etId,
      start: startTime,
      attendee: { name: name, email: email, timeZone: tz },
      metadata: {}
    });
  }

  /* ── Modal shell ────────────────────────────────────────────────────────── */

  function buildModal() {
    var el = document.createElement('div');
    el.className = 'lg-overlay';
    el.id = 'booking-modal';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-modal', 'true');
    el.setAttribute('aria-label', 'Schedule a call');
    el.innerHTML = '<div class="lg-panel" id="lg-panel"></div>';
    document.body.appendChild(el);
    el.addEventListener('click', function (e) { if (e.target === el) closeModal(); });
    return el;
  }

  /* ── Render dispatcher ──────────────────────────────────────────────────── */

  function render() {
    panelEl = document.getElementById('lg-panel');
    if (!panelEl) return;
    var html = '';
    if      (state.step === 'calendar') html = renderCalendar();
    else if (state.step === 'slots')    html = renderSlots();
    else if (state.step === 'form')     html = renderForm();
    else if (state.step === 'confirm')  html = renderConfirm();
    else if (state.step === 'error')    html = renderError();
    panelEl.innerHTML = html;
    bindEvents();
  }

  /* ── Calendar ───────────────────────────────────────────────────────────── */

  function renderCalendar() {
    var today     = new Date(); today.setHours(0, 0, 0, 0);
    var cacheKey  = (state.selectedEventType ? state.selectedEventType.id : '') + '-' + state.year + '-' + state.month;
    var byDate    = state.slotsCache[cacheKey] || null;
    var monthStr  = new Date(state.year, state.month, 1)
      .toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    var canPrev   = state.year > today.getFullYear() ||
                    (state.year === today.getFullYear() && state.month > today.getMonth());
    var title     = state.selectedEventType ? state.selectedEventType.title : 'Schedule a call';

    var durRow = '';
    if (state.eventTypes.length > 1) {
      var btns = state.eventTypes.map(function (et) {
        var sel = state.selectedDuration === et.id ? ' bm-dur-selected' : '';
        return '<button class="bm-dur-btn' + sel + '" data-et="' + et.id + '">' + (et.lengthInMinutes || et.length) + ' min</button>';
      }).join('');
      durRow = '<div class="bm-duration-row">' + btns + '</div>';
    }

    return '<div class="bm-content">' +
      header(title) +
      '<div class="bm-body">' +
        durRow +
        '<div class="bm-month-nav">' +
          '<button class="bm-nav-btn" id="bm-prev"' + (canPrev ? '' : ' disabled') + '>&#8249;</button>' +
          '<span class="bm-month-label">' + monthStr + '</span>' +
          '<button class="bm-nav-btn" id="bm-next">&#8250;</button>' +
        '</div>' +
        '<div class="bm-days-header">' +
          ['Su','Mo','Tu','We','Th','Fr','Sa'].map(function (d) {
            return '<div class="bm-day-name">' + d + '</div>';
          }).join('') +
        '</div>' +
        '<div class="bm-grid">' + buildCalGrid(state.year, state.month, byDate, today) + '</div>' +
        (state.loading ? '<p class="bm-loading">Checking availability…</p>' : '') +
      '</div>' +
    '</div>';
  }

  function buildCalGrid(year, month, byDate, today) {
    var firstDay    = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var out = '';
    var i;
    for (i = 0; i < firstDay; i++) out += '<div class="cal-cell cal-empty"></div>';
    for (var d = 1; d <= daysInMonth; d++) {
      var dt      = new Date(year, month, d); dt.setHours(0, 0, 0, 0);
      var dateStr = fmtDate(year, month, d);
      var isPast  = dt < today;
      var isToday = dt.getTime() === today.getTime();
      var isSel   = dateStr === state.selectedDate;
      var hasSl   = byDate && byDate[dateStr] && byDate[dateStr].length > 0;

      var cls = 'cal-cell';
      if (isSel)                       cls += ' cal-selected';
      else if (isPast)                 cls += ' cal-past';
      else if (!byDate)                cls += ' cal-unavailable';
      else if (hasSl)                  cls += ' cal-available';
      else                             cls += ' cal-unavailable';
      if (isToday && !isSel)           cls += ' cal-today';

      var attrs = '';
      if (hasSl && !isPast && !isSel) attrs = ' data-date="' + dateStr + '" role="button" tabindex="0"';
      out += '<div class="' + cls + '"' + attrs + '>' + d + '</div>';
    }
    return out;
  }

  /* ── Slots ──────────────────────────────────────────────────────────────── */

  function renderSlots() {
    var cacheKey  = (state.selectedEventType ? state.selectedEventType.id : '') + '-' + state.year + '-' + state.month;
    var byDate    = state.slotsCache[cacheKey] || {};
    var slots     = (state.selectedDate && byDate[state.selectedDate]) || [];
    var dateLabel = new Date(state.selectedDate + 'T12:00:00')
      .toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    var title     = state.selectedEventType ? state.selectedEventType.title : 'Schedule a call';

    var slotGrid;
    if (!slots.length) {
      slotGrid = '<p class="bm-no-slots">No availability on this day</p>';
    } else {
      slotGrid = slots.map(function (iso) {
        var sel = state.selectedTime === iso ? ' bm-slot-selected' : '';
        return '<button class="bm-slot' + sel + '" data-time="' + esc(iso) + '">' + fmtTime(iso) + '</button>';
      }).join('');
    }

    var cont = state.selectedTime
      ? '<button class="bm-submit" id="bm-next-form" style="margin-top:18px">Continue &#8594;</button>'
      : '';

    return '<div class="bm-content">' +
      header(title) +
      '<div class="bm-body">' +
        '<button class="bm-back-btn" id="bm-back">&#8592; Back</button>' +
        '<p class="bm-slots-date">' + dateLabel + '</p>' +
        '<div class="bm-slots-grid">' + slotGrid + '</div>' +
        cont +
      '</div>' +
    '</div>';
  }

  /* ── Form ───────────────────────────────────────────────────────────────── */

  function renderForm() {
    var dateLabel = new Date(state.selectedDate + 'T12:00:00')
      .toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    var dur = state.selectedEventType ? (state.selectedEventType.lengthInMinutes || state.selectedEventType.length) + ' min' : '';

    return '<div class="bm-content">' +
      header('Your details') +
      '<div class="bm-body">' +
        '<button class="bm-back-btn" id="bm-back">&#8592; Back</button>' +
        '<div class="bm-booking-summary">' +
          '<span class="bm-summary-date">' + dateLabel + '</span>' +
          '<span>·</span>' +
          '<span class="bm-summary-time">' + fmtTime(state.selectedTime) + '</span>' +
          (dur ? '<span>·</span><span>' + dur + '</span>' : '') +
        '</div>' +
        '<form id="bm-form" autocomplete="on">' +
          '<div class="bm-field">' +
            '<label class="bm-label" for="bm-name">Full name</label>' +
            '<input class="bm-input" id="bm-name" name="name" type="text" placeholder="Jane Smith" required autocomplete="name">' +
          '</div>' +
          '<div class="bm-field">' +
            '<label class="bm-label" for="bm-email">Email</label>' +
            '<input class="bm-input" id="bm-email" name="email" type="email" placeholder="jane@company.com" required autocomplete="email">' +
          '</div>' +
          '<button class="bm-submit" type="submit"' + (state.loading ? ' disabled' : '') + '>' +
            (state.loading ? 'Booking…' : 'Confirm booking') +
          '</button>' +
        '</form>' +
        (state.error
          ? '<p style="color:#f87171;font-size:0.82rem;margin-top:10px;">' + esc(state.error) + '</p>'
          : '') +
      '</div>' +
    '</div>';
  }

  /* ── Confirm ────────────────────────────────────────────────────────────── */

  function renderConfirm() {
    var b     = state.booking || {};
    var title = b.title || 'Call scheduled';
    var when  = b.startTime ? fmtDateTime(b.startTime) : '';

    return '<div class="bm-content">' +
      header('Confirmed') +
      '<div class="bm-body">' +
        '<div class="bm-confirm">' +
          '<div class="bm-confirm-icon">&#10003;</div>' +
          '<p class="bm-confirm-title">' + esc(title) + '</p>' +
          (when ? '<p class="bm-confirm-detail">' + when + '</p>' : '') +
          '<p class="bm-confirm-note">You\'ll receive a calendar invite and confirmation email shortly.</p>' +
          '<button class="bm-submit" id="bm-done">Done</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── Error ──────────────────────────────────────────────────────────────── */

  function renderError() {
    return '<div class="bm-content">' +
      header('Something went wrong') +
      '<div class="bm-body">' +
        '<div class="bm-confirm">' +
          '<div class="bm-confirm-icon bm-icon-error">!</div>' +
          '<p class="bm-confirm-title">Booking failed</p>' +
          '<p class="bm-confirm-detail">' + esc(state.error || 'Please try again.') + '</p>' +
          '<button class="bm-submit" id="bm-retry">Try again</button>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  /* ── Shared header snippet ──────────────────────────────────────────────── */

  function header(title) {
    return '<div class="bm-header">' +
      '<span class="bm-event-title">' + esc(title) + '</span>' +
      '<button class="bm-close-btn" id="lg-close-btn" aria-label="Close">&#x2715;</button>' +
    '</div>';
  }

  /* ── Event binding ──────────────────────────────────────────────────────── */

  function bindEvents() {
    var p = panelEl;
    if (!p) return;

    q(p, '#lg-close-btn', 'click', closeModal);

    /* Duration tabs */
    p.querySelectorAll('.bm-dur-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = parseInt(btn.dataset.et, 10);
        var et = state.eventTypes.filter(function (e) { return e.id === id; })[0];
        state.selectedDuration  = id;
        state.selectedEventType = et;
        state.slotsCache = {};
        state.selectedDate = null;
        state.selectedTime = null;
        fetchSlotsThenRender();
      });
    });

    /* Month navigation */
    q(p, '#bm-prev', 'click', function () {
      if (state.month === 0) { state.year--; state.month = 11; } else { state.month--; }
      state.selectedDate = null;
      fetchSlotsThenRender();
    });
    q(p, '#bm-next', 'click', function () {
      if (state.month === 11) { state.year++; state.month = 0; } else { state.month++; }
      state.selectedDate = null;
      fetchSlotsThenRender();
    });

    /* Day click → slots */
    p.querySelectorAll('.cal-available').forEach(function (cell) {
      cell.addEventListener('click', function () {
        state.selectedDate = cell.dataset.date;
        state.selectedTime = null;
        state.step = 'slots';
        render();
      });
    });

    /* Back */
    q(p, '#bm-back', 'click', function () {
      if (state.step === 'slots') {
        state.step = 'calendar';
        state.selectedDate = null;
        render();
      } else if (state.step === 'form') {
        state.step = 'slots';
        state.selectedTime = null;
        render();
      }
    });

    /* Slot selection */
    p.querySelectorAll('.bm-slot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        state.selectedTime = btn.dataset.time;
        render();
      });
    });

    /* Continue to form */
    q(p, '#bm-next-form', 'click', function () {
      state.step = 'form';
      render();
    });

    /* Form submit */
    var form = p.querySelector('#bm-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name  = p.querySelector('#bm-name').value.trim();
        var email = p.querySelector('#bm-email').value.trim();
        if (!name || !email) return;
        state.loading = true;
        state.error   = null;
        render();
        createBooking(state.selectedDuration, state.selectedTime, name, email)
          .then(function (data) {
            state.loading = false;
            if (data.status === 'success' && data.data) {
              state.booking = data.data;
              state.step    = 'confirm';
            } else {
              state.error = (data.error) || 'Booking failed. Please try again.';
              state.step  = 'form';
            }
            render();
          })
          .catch(function () {
            state.loading = false;
            state.error   = 'Network error. Please try again.';
            state.step    = 'form';
            render();
          });
      });
    }

    q(p, '#bm-done',  'click', closeModal);
    q(p, '#bm-retry', 'click', function () { state.step = 'form'; state.error = null; render(); });
  }

  function q(parent, sel, ev, fn) {
    var el = parent.querySelector(sel);
    if (el) el.addEventListener(ev, fn);
  }

  /* ── Fetch slots then re-render ─────────────────────────────────────────── */

  function fetchSlotsThenRender() {
    if (!state.selectedEventType) { render(); return; }
    var cacheKey = state.selectedEventType.id + '-' + state.year + '-' + state.month;
    if (state.slotsCache[cacheKey]) { render(); return; }
    state.loading = true;
    render();
    loadSlots(state.selectedEventType.id, state.year, state.month)
      .then(function () { state.loading = false; render(); })
      .catch(function () { state.loading = false; render(); });
  }

  /* ── Open / Close ───────────────────────────────────────────────────────── */

  function openModal() {
    if (!modalEl) modalEl = buildModal();
    var today     = new Date();
    state.step    = 'calendar';
    state.year    = today.getFullYear();
    state.month   = today.getMonth();
    state.selectedDate = null;
    state.selectedTime = null;
    state.loading      = true;
    state.error        = null;
    state.booking      = null;

    document.body.classList.add('modal-open');
    modalEl.getBoundingClientRect();
    modalEl.classList.add('is-open');
    render();

    loadEventTypes()
      .then(function (types) {
        state.eventTypes = types;
        if (types.length) {
          state.selectedDuration  = types[0].id;
          state.selectedEventType = types[0];
        }
        return state.selectedEventType
          ? loadSlots(state.selectedEventType.id, state.year, state.month)
          : Promise.resolve({});
      })
      .then(function () { state.loading = false; render(); })
      .catch(function () { state.loading = false; render(); });
  }

  function closeModal() {
    if (modalEl) modalEl.classList.remove('is-open');
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ── Helpers ────────────────────────────────────────────────────────────── */

  function fmtDate(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function fmtTime(iso) {
    if (!iso) return '';
    return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function fmtDateTime(iso) {
    if (!iso) return '';
    var d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) +
      ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Public ─────────────────────────────────────────────────────────────── */

  window.openBookingModal  = openModal;
  window.closeBookingModal = closeModal;
})();
