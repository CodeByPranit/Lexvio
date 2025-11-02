// Client-side script for UI behavior. Server code has been moved to server.js

// Minimal enhancement: focus search when pressing '/'
document.addEventListener('keydown', function(evt){
  if (evt.key === '/' && !evt.ctrlKey && !evt.metaKey && !evt.altKey) {
    var input = document.querySelector('.search input');
    if (input) {
      evt.preventDefault();
      input.focus();
    }
  }
});

// Basic search submit handler
document.addEventListener('submit', function(evt){
  var form = evt.target;
  if (form && form.id === 'site-search') {
    evt.preventDefault();
    var query = (form.querySelector('input[name="q"]') || {}).value || '';
    if (query.trim()) {
      alert('Searching for: ' + query.trim());
      // Replace with real search navigation or filtering
    }
  }
});

// CTA behaviors
document.addEventListener('click', function(evt){
  var target = evt.target;
  if (target && target.id === 'cta-get-started') {
    evt.preventDefault();
    alert('Get started clicked');
  }
  if (target && target.closest && target.closest('.hero-login')) {
    evt.preventDefault();
    // remember where user came from and redirect to the login page
    try { sessionStorage.setItem('intended', window.location.pathname + window.location.search + window.location.hash); } catch (e) {}
    window.location.href = 'login.html';
  }
});

// Trending scroll controls
document.addEventListener('click', function(evt){
  var btn = evt.target.closest && evt.target.closest('.trend-btn');
  if (!btn) return;
  var wrap = btn.closest && btn.closest('.trend-wrap');
  if (!wrap) return;
  var scroller = wrap.querySelector('.trend-scroller');
  if (!scroller) return;
  var card = scroller.querySelector('.trend-card');
  var step = (card ? card.getBoundingClientRect().width + 28 : 260) * 2; // scroll by two cards
  if (btn.classList.contains('next')) scroller.scrollBy({ left: step, behavior: 'smooth' });
  if (btn.classList.contains('prev')) scroller.scrollBy({ left: -step, behavior: 'smooth' });
});

// Write dropdown
(function(){
  var trigger = document.getElementById('link-write');
  var menu = document.getElementById('write-menu');
  if (!trigger || !menu) return;

  function position(){
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 8; // gap
    var left = rect.left + window.scrollX; // align left edges
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
  }

  function open(){
    position();
    menu.removeAttribute('hidden');
    document.addEventListener('scroll', position, { passive: true });
    window.addEventListener('resize', position);
  }
  function close(){
    if (!menu.hasAttribute('hidden')) menu.setAttribute('hidden','');
    document.removeEventListener('scroll', position);
    window.removeEventListener('resize', position);
  }

  trigger.addEventListener('click', function(e){
    e.preventDefault();
    if (menu.hasAttribute('hidden')) open(); else close();
  });

  // Close on outside click
  document.addEventListener('click', function(e){
    if (!menu || menu.hasAttribute('hidden')) return;
    if (e.target === trigger || (e.target.closest && (e.target.closest('#write-menu') || e.target.closest('#link-write')))) return;
    close();
  });

  // Escape key closes
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();

// Community dropdown
(function(){
  var trigger = document.getElementById('link-community');
  var menu = document.getElementById('community-menu');
  if (!trigger || !menu) return;

  function position(){
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 8; // gap
    var left = rect.left + window.scrollX; // align left
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
  }

  function open(){ position(); menu.removeAttribute('hidden'); document.addEventListener('scroll', position, { passive: true }); window.addEventListener('resize', position); }
  function close(){ if (!menu.hasAttribute('hidden')) menu.setAttribute('hidden',''); document.removeEventListener('scroll', position); window.removeEventListener('resize', position); }

  trigger.addEventListener('click', function(e){ e.preventDefault(); if (menu.hasAttribute('hidden')) open(); else close(); });
  document.addEventListener('click', function(e){ if (!menu || menu.hasAttribute('hidden')) return; if (e.target === trigger || (e.target.closest && (e.target.closest('#community-menu') || e.target.closest('#link-community')))) return; close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();

// Browse mega menu
(function(){
  var trigger = document.getElementById('link-browse');
  var menu = document.getElementById('browse-menu');
  if (!trigger || !menu) return;

  function position(){
    var rect = trigger.getBoundingClientRect();
    var top = rect.bottom + window.scrollY + 8;
    var left = Math.max(12, rect.left + window.scrollX - 80); // slight left offset like screenshot
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
  }

  function open(){ position(); menu.removeAttribute('hidden'); document.addEventListener('scroll', position, { passive: true }); window.addEventListener('resize', position); }
  function close(){ if (!menu.hasAttribute('hidden')) menu.setAttribute('hidden',''); document.removeEventListener('scroll', position); window.removeEventListener('resize', position); }

  trigger.addEventListener('click', function(e){ e.preventDefault(); if (menu.hasAttribute('hidden')) open(); else close(); });
  document.addEventListener('click', function(e){ if (!menu || menu.hasAttribute('hidden')) return; if (e.target === trigger || (e.target.closest && (e.target.closest('#browse-menu') || e.target.closest('#link-browse')))) return; close(); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(); });
})();

// Genres typing animation (fake search)
(function(){
  var target = document.getElementById('genres-typing');
  if (!target) return;
  var phrases = ['fake datin', 'enemies to lovers', 'werewolf', 'slow burn', 'college AU'];
  var idx = 0, charIdx = 0, deleting = false;
  function tick(){
    var text = phrases[idx];
    if (!deleting) {
      charIdx++;
      if (charIdx === text.length + 8) { // pause at end
        deleting = true;
      }
    } else {
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % phrases.length;
      }
    }
    var shown = text.slice(0, Math.max(0, Math.min(text.length, charIdx)));
    target.textContent = shown;
    var delay = deleting ? 60 : 120;
    setTimeout(tick, delay);
  }
  tick();
})();

// Footer year
(function(){
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();


// Auth Modals
(function(){
  var overlay = document.getElementById('modal-overlay');
  var loginModal = document.getElementById('modal-login');
  var signupModal = document.getElementById('modal-signup');
  var linkLogin = document.getElementById('link-login');
  var linkSignup = document.getElementById('link-signup');

  function show(el){ if (el) el.removeAttribute('hidden'); }
  function hide(el){ if (el) el.setAttribute('hidden',''); }
  function openModal(which){
    show(overlay);
    if (which === 'login') { show(loginModal); hide(signupModal); }
    if (which === 'signup') { show(signupModal); hide(loginModal); }
    setTimeout(function(){
      var focusable = (which==='login'?loginModal:signupModal).querySelector('button, [href], input');
      if (focusable) focusable.focus();
    }, 0);
  }
  function closeAll(){ hide(overlay); hide(loginModal); hide(signupModal); }

  // Make login/signup navigate to dedicated pages (so button protection can redirect there)
  if (linkLogin) linkLogin.setAttribute('href', 'login.html');
  if (linkSignup) linkSignup.setAttribute('href', 'signup.html');

  document.addEventListener('click', function(e){
    if (e.target && (e.target === overlay || e.target.hasAttribute('data-close'))) { closeAll(); }
  });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeAll(); });

  // Switch between modals
  var toSignup = document.getElementById('to-signup');
  var toLogin = document.getElementById('to-login');
  if (toSignup) toSignup.addEventListener('click', function(e){ e.preventDefault(); openModal('signup'); });
  if (toLogin) toLogin.addEventListener('click', function(e){ e.preventDefault(); openModal('login'); });

  // Toggle email forms
  var loginEmailToggle = document.getElementById('login-email-toggle');
  var loginEmailForm = document.getElementById('login-email-form');
  var signupEmailToggle = document.getElementById('signup-email-toggle');
  var signupEmailForm = document.getElementById('signup-email-form');

  function toggle(el){ if (!el) return; if (el.hasAttribute('hidden')) el.removeAttribute('hidden'); else el.setAttribute('hidden',''); }
  if (loginEmailToggle) loginEmailToggle.addEventListener('click', function(){ toggle(loginEmailForm); });
  if (signupEmailToggle) signupEmailToggle.addEventListener('click', function(){ toggle(signupEmailForm); });

  // OAuth buttons (demo)
  document.addEventListener('click', function(e){
    var btn = e.target.closest && e.target.closest('.btn.btn-oauth');
    if (!btn) return;
    var provider = btn.getAttribute('data-provider');
    alert('OAuth flow would start for: ' + provider);
  });

  // Forgot password (demo)
  var forgot = document.getElementById('forgot-password');
  if (forgot) forgot.addEventListener('click', function(e){
    e.preventDefault();
    var email = prompt('Enter your email to reset password:');
    if (email) alert('Password reset link sent to ' + email);
  });

  // Capture submissions
  function serializeForm(form){
    var data = {};
    if (!form) return data;
    Array.prototype.forEach.call(form.elements, function(el){
      if (!el.name) return;
      if ((el.type === 'checkbox' || el.type === 'radio')) data[el.name] = el.checked; else data[el.name] = el.value;
    });
    return data;
  }

  if (loginEmailForm) loginEmailForm.addEventListener('submit', function(e){
    e.preventDefault();
    if (!loginEmailForm.reportValidity()) return;
    var payload = serializeForm(loginEmailForm);
    console.log('Login payload', payload);
    // Demo: mark user as logged in
    try { localStorage.setItem('isLoggedIn','true'); } catch (err) { /* ignore */ }
    // store a small demo user profile
    try { localStorage.setItem('user', JSON.stringify({ username: payload.email.split('@')[0], avatar: '../images/logo/onlylogo.png' })); } catch (err) { /* ignore */ }
    alert('Logged in (demo) as ' + payload.email);
    closeAll();
    renderUserArea && renderUserArea();
    try {
      var dest = sessionStorage.getItem('intended');
      if (dest) { sessionStorage.removeItem('intended'); window.location.href = dest; }
    } catch (e) {}
  });

  if (signupEmailForm) signupEmailForm.addEventListener('submit', function(e){
    e.preventDefault();
    if (!signupEmailForm.reportValidity()) return;
    var payload = serializeForm(signupEmailForm);
    console.log('Signup payload', payload);
    // Demo: mark user as logged in after signup
    try { localStorage.setItem('isLoggedIn','true'); } catch (err) { /* ignore */ }
    try { localStorage.setItem('user', JSON.stringify({ username: payload.username || payload.email || 'you', avatar: '../images/logo/onlylogo.png' })); } catch (err) { /* ignore */ }
    alert('Account created (demo) for ' + payload.username);
    closeAll();
    renderUserArea && renderUserArea();
    try {
      var dest2 = sessionStorage.getItem('intended');
      if (dest2) { sessionStorage.removeItem('intended'); window.location.href = dest2; }
    } catch (e) {}
  });

  // --- user storage and UI rendering helpers ---
  function getUser(){
    try { var s = localStorage.getItem('user'); return s ? JSON.parse(s) : null; } catch (err) { return null; }
  }
  function setUser(u){ try { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('isLoggedIn','true'); } catch (err) {} }
  function clearUser(){ try { localStorage.removeItem('user'); localStorage.removeItem('isLoggedIn'); } catch (err) {} }

  function renderUserArea(){
    var userArea = document.getElementById('user-area');
    var loginLink = document.getElementById('link-login');
    var signupLink = document.getElementById('link-signup');
    var logoutLink = document.getElementById('link-logout');
    var userNameEl = document.getElementById('user-name');
    var userAvatar = document.getElementById('user-avatar');
    var user = getUser();
    if (user && isAuthenticated()){
      if (loginLink) loginLink.setAttribute('hidden','');
      if (signupLink) signupLink.setAttribute('hidden','');
      if (userArea) userArea.removeAttribute('hidden');
      if (userNameEl) userNameEl.textContent = user.username || '';
      if (userAvatar && user.avatar) userAvatar.src = user.avatar;
    } else {
      if (loginLink) loginLink.removeAttribute('hidden');
      if (signupLink) signupLink.removeAttribute('hidden');
      if (userArea) userArea.setAttribute('hidden','');
    }
    if (logoutLink) {
      logoutLink.removeEventListener && logoutLink.removeEventListener('click', onLogoutClick);
      logoutLink.addEventListener('click', onLogoutClick);
    }
  }

  function onLogoutClick(e){
    e.preventDefault();
    // If Firebase is available, sign out there as well
    if (window.firebase && firebase.auth) {
      firebase.auth().signOut().then(function(){
        clearUser();
        renderUserArea();
        // if on a protected page, redirect to home
        try { window.location.href = 'inde.html'; } catch(e){}
      }).catch(function(err){
        console.error('Sign out error', err);
        clearUser();
        renderUserArea();
      });
    } else {
      clearUser();
      renderUserArea();
    }
  }

  // initial render on page load
  setTimeout(function(){ renderUserArea(); }, 0);

  // If Firebase auth is present, listen for changes and update the UI
  if (window.firebase && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user){
      if (user) {
        // build a small profile
        var profile = {
          username: user.displayName || (user.email ? user.email.split('@')[0] : 'user'),
          avatar: user.photoURL || '../images/logo/onlylogo.png'
        };
        try { localStorage.setItem('user', JSON.stringify(profile)); localStorage.setItem('isLoggedIn','true'); } catch(e) {}
        renderUserArea();
        // If there's an intended redirect (from protected click), go there now
        try {
          var dest = sessionStorage.getItem('intended');
          if (dest) {
            sessionStorage.removeItem('intended');
            // avoid redirect loop if already on the dest
            if (window.location.pathname.indexOf(dest) === -1) window.location.href = dest;
          }
        } catch(e) {}
      } else {
        // not signed in
        clearUser();
        renderUserArea();
      }
    });
  }

  // Helper to determine auth state (client-side demo)
  function isAuthenticated(){
    try { return localStorage.getItem('isLoggedIn') === 'true'; } catch (err) { return false; }
  }

  // Protect certain interactive controls: if user clicks a button or .btn link while not
  // authenticated, open the login modal instead of allowing the action.
  document.addEventListener('click', function(evt){
    // run in capture phase semantics via early return if default already prevented
    if (evt.defaultPrevented) return;
    var el = evt.target;
    if (!el) return;

    // normalize to the actionable element
    var actionEl = el.closest && el.closest('button, a, [role="button"]');
    if (!actionEl) return;

    // Exclude login/signup triggers and auth modal internals
    if (actionEl.id === 'link-login' || actionEl.id === 'link-signup') return;
    if (actionEl.closest && (actionEl.closest('#modal-login') || actionEl.closest('#modal-signup') || actionEl.closest('#modal-overlay'))) return;
  // allow specific elements to opt-out of auth interception
  if (actionEl.hasAttribute && actionEl.hasAttribute('data-no-auth')) return;
    // Exclude search submit and navigation menus where we don't want to block
    if (actionEl.closest && actionEl.closest('#site-search')) return;
    if (actionEl.closest && actionEl.closest('.mega-menu')) return;

    // Decide which elements to protect: buttons and links with class 'btn' or role button
    var isButton = actionEl.tagName === 'BUTTON' || actionEl.getAttribute('role') === 'button';
    var isBtnLink = actionEl.tagName === 'A' && actionEl.classList && actionEl.classList.contains('btn');
    var requiresAuth = isButton || isBtnLink || actionEl.hasAttribute('data-requires-auth');
    if (!requiresAuth) return;

    // If not authenticated, prevent the action and show login modal
    if (!isAuthenticated()){
      evt.preventDefault();
      evt.stopPropagation();
      // store intended target so we can redirect back after login
      try {
        var intended = actionEl.getAttribute('href') || (actionEl.tagName === 'BUTTON' ? (actionEl.getAttribute('data-target') || '') : '');
        sessionStorage.setItem('intended', intended || window.location.pathname + window.location.search + window.location.hash);
      } catch (e) {}
      window.location.href = 'login.html';
    }
  }, true);
})();

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  avatar: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);


