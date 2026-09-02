/* The Balance Organization — small, dependency-free site script.
   Everything on the site works without JavaScript. This file only adds:
   - mobile navigation toggle
   - Amharic/English language toggle (placeholder notice until Amharic pages exist)
   - friendly form handling (validation + confirmation message)
   - Donate page interactions (frequency, amount, fund, payment details)
   - Volunteer page role pre-selection from the "For Lawyers" / "For Psychologists" buttons
*/
(function () {
  'use strict';

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.getAttribute('data-open') === 'true';
      nav.setAttribute('data-open', open ? 'false' : 'true');
      navToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  }

  /* ---------- Language toggle ----------
     Amharic pages are not published yet. Choosing "አማ" shows a short bilingual
     notice with the phone number. When Amharic pages exist, point each button at
     the matching page (see README). */
  var langButtons = document.querySelectorAll('.lang-toggle button');
  var langNotice = document.getElementById('lang-notice');
  var langKey = 'balance-lang';
  function setLang(code) {
    langButtons.forEach(function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === code ? 'true' : 'false');
    });
    if (langNotice) { langNotice.hidden = code !== 'am'; }
    try { window.localStorage.setItem(langKey, code); } catch (e) { /* storage unavailable */ }
  }
  langButtons.forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  var closeNotice = document.querySelector('[data-close-lang-notice]');
  if (closeNotice) { closeNotice.addEventListener('click', function () { setLang('en'); }); }
  try {
    var saved = window.localStorage.getItem(langKey);
    if (saved === 'am') { setLang('am'); }
  } catch (e) { /* ignore */ }

  /* ---------- Forms ----------
     Forms post to the URL in their action attribute. Until a form backend is
     connected (see README), we show the confirmation message on the page. */
  var forms = document.querySelectorAll('form[data-site-form]');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var status = form.querySelector('.form-status');
      var invalid = form.querySelector(':invalid');
      if (invalid) {
        event.preventDefault();
        if (status) {
          status.hidden = false;
          status.innerHTML = '<p class="error-text">Please check the fields marked as required.</p>';
        }
        invalid.focus();
        return;
      }
      var endpoint = form.getAttribute('action');
      if (!endpoint || endpoint === '#') {
        event.preventDefault();
        var successHtml = form.getAttribute('data-success') || '<h3>Thank you.</h3><p>We have received your message.</p>';
        var wrapper = document.createElement('div');
        wrapper.className = 'form-success';
        wrapper.setAttribute('role', 'status');
        wrapper.setAttribute('tabindex', '-1');
        wrapper.innerHTML = successHtml;
        form.replaceWith(wrapper);
        wrapper.focus();
      }
    });
  });

  /* ---------- Donate page ---------- */
  var giveCards = document.querySelectorAll('.give-card');
  if (giveCards.length) {
    var freqInputs = document.querySelectorAll('input[name="frequency"]');
    var summary = document.getElementById('give-summary-text');
    var payment = document.getElementById('payment');
    var continueBtn = document.getElementById('give-continue');

    function selectedFrequency() {
      var checked = document.querySelector('input[name="frequency"]:checked');
      return checked ? checked.value : 'monthly';
    }
    function refreshCards() {
      var freq = selectedFrequency();
      giveCards.forEach(function (card) {
        card.setAttribute('data-selected', card.getAttribute('data-frequency') === freq ? 'true' : 'false');
      });
      updateSummary();
    }
    function amountFor(freq) {
      var card = document.querySelector('.give-card[data-frequency="' + freq + '"]');
      if (!card) { return ''; }
      var chosen = card.querySelector('input[type="radio"]:not([name="frequency"]):checked');
      var custom = card.querySelector('input[type="number"]');
      if (custom && custom.value) { return custom.value; }
      return chosen ? chosen.value : '';
    }
    function updateSummary() {
      if (!summary) { return; }
      var freq = selectedFrequency();
      var amount = amountFor(freq);
      var currencyEl = document.querySelector('.give-card[data-frequency="' + freq + '"] select');
      var currency = currencyEl ? currencyEl.value : 'ETB';
      var fund = document.querySelector('input[name="fund"]:checked');
      var fundLabel = fund ? fund.getAttribute('data-label') : 'where it is needed most';
      var freqLabel = freq === 'monthly' ? 'each month' : 'once';
      summary.textContent = amount
        ? 'Your gift: ' + currency + ' ' + Number(amount).toLocaleString() + ' ' + freqLabel + ', for ' + fundLabel + '.'
        : 'Choose an amount to see your gift summary.';
    }

    freqInputs.forEach(function (r) { r.addEventListener('change', refreshCards); });
    giveCards.forEach(function (card) {
      var freq = card.getAttribute('data-frequency');
      card.addEventListener('change', function () {
        var radio = document.querySelector('input[name="frequency"][value="' + freq + '"]');
        if (radio && !radio.checked) { radio.checked = true; }
        refreshCards();
      });
      card.addEventListener('input', function (e) {
        if (e.target && e.target.type === 'number') {
          card.querySelectorAll('input[type="radio"]').forEach(function (r) { if (r.name !== 'frequency') { r.checked = false; } });
          var radio = document.querySelector('input[name="frequency"][value="' + freq + '"]');
          if (radio) { radio.checked = true; }
          refreshCards();
        }
      });
    });
    document.querySelectorAll('input[name="fund"]').forEach(function (r) { r.addEventListener('change', updateSummary); });
    if (continueBtn && payment) {
      continueBtn.addEventListener('click', function () {
        payment.hidden = false;
        payment.setAttribute('tabindex', '-1');
        payment.focus();
        payment.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
    refreshCards();
  }

  /* ---------- Volunteer page: pre-select role from path buttons ---------- */
  function applyRoleFromHash() {
    var hash = window.location.hash;
    var role = hash === '#apply-lawyer' ? 'lawyer' : hash === '#apply-psychologist' ? 'psychologist' : null;
    if (!role) { return; }
    var radio = document.querySelector('input[name="role"][value="' + role + '"]');
    if (radio) { radio.checked = true; }
  }
  applyRoleFromHash();
  window.addEventListener('hashchange', applyRoleFromHash);

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = String(new Date().getFullYear()); }
})();
