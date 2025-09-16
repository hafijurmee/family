/* Family Contacts — Interactive logic with localStorage persistence */
/* eslint-disable no-alert */
(() => {
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // ---------- Helpers ----------
  const pad = n => String(n).padStart(2, '0');
  const fmtDateTime = iso => {
    if (!iso) return "কখনো কল করা হয়নি";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = pad(d.getMonth()+1);
    const day = pad(d.getDate());
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    return `${day}-${m}-${y}, ${hh}:${mm}`;
  };

  // ---------- Data ----------
  const LS_KEY = 'family_contacts_v1';
  const THEME_KEY = 'theme_preference';

  const defaultContacts = [
    { id: crypto.randomUUID(), name: "আব্বা", relation: "বাবা", phones: ["+8801XXXXXXXXX"], status: "not_called", lastCalled: null, callCount: 0 },
    { id: crypto.randomUUID(), name: "আম্মা", relation: "মা", phones: ["+8801XXXXXXXXX"], status: "not_called", lastCalled: null, callCount: 0 },
    { id: crypto.randomUUID(), name: "দাদা", relation: "দাদু", phones: ["+8801XXXXXXXXX"], status: "not_called", lastCalled: null, callCount: 0 },
    { id: crypto.randomUUID(), name: "বোন", relation: "বোন", phones: ["+8801XXXXXXXXX"], status: "not_called", lastCalled: null, callCount: 0 },
    { id: crypto.randomUUID(), name: "চাচা", relation: "চাচা", phones: ["+8801XXXXXXXXX"], status: "not_called", lastCalled: null, callCount: 0 },
  ];

  let contacts = loadContacts();

  function loadContacts() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return defaultContacts;
      const data = JSON.parse(raw);
      if (Array.isArray(data)) return data;
      return defaultContacts;
    } catch {
      return defaultContacts;
    }
  }

  function saveContacts() {
    localStorage.setItem(LS_KEY, JSON.stringify(contacts));
    refreshCounts();
  }

  // ---------- Theme ----------
  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
    $('#themeToggle').textContent = theme === 'light' ? 'ডার্ক মোড' : 'লাইট মোড';
  }
  function initTheme() {
    const pref = localStorage.getItem(THEME_KEY);
    if (pref) { setTheme(pref); return; }
    // Respect system preference by default
    const sysDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(sysDark ? 'dark' : 'light');
  }
  $('#themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  // ---------- Rendering ----------
  const grid = $('#cardsGrid');
  const cardTpl = $('#cardTemplate');

  function renderList() {
    grid.innerHTML = '';
    const search = $('#searchInput').value.trim().toLowerCase();
    const filter = $('#filterSelect').value;
    const sortBy = $('#sortSelect').value;

    let list = contacts.slice();

    // filter
    if (filter !== 'all') {
      list = list.filter(c => c.status === filter);
    }

    // search
    if (search) {
      list = list.filter(c => {
        const hay = [c.name, c.relation, ...(c.phones || [])].join(' ').toLowerCase();
        return hay.includes(search);
      });
    }

    // sort
    list.sort((a,b) => {
      switch (sortBy) {
        case 'name_asc': return a.name.localeCompare(b.name);
        case 'name_desc': return b.name.localeCompare(a.name);
        case 'relation_asc': return a.relation.localeCompare(b.relation);
        case 'recent': return new Date(b.lastCalled || 0) - new Date(a.lastCalled || 0);
        default: return 0;
      }
    });

    // render
    for (const c of list) {
      const node = cardTpl.content.firstElementChild.cloneNode(true);
      node.dataset.id = c.id;

      // avatar initial
      const initial = (c.name?.[0] || '?').toUpperCase();
      node.querySelector('.avatar').textContent = initial;

      node.querySelector('.name').textContent = c.name;
      node.querySelector('.relation').textContent = c.relation;
      node.querySelector('.last-called').textContent = c.lastCalled ? `শেষ কল: ${fmtDateTime(c.lastCalled)}` : 'কখনো কল করা হয়নি';

      const badge = node.querySelector('.status-badge');
      badge.classList.remove('called', 'not-called');
      badge.classList.add(c.status === 'called' ? 'called' : 'not-called');
      badge.querySelector('.status-text').textContent = c.status === 'called' ? 'Called' : 'Not Called';
      const icon = badge.querySelector('.status-icon');
      // replace icon mark paths for called state (check) vs cross for not called
      const marks = icon.querySelectorAll('.status-mark');
      marks.forEach(m => m.remove());
      if (c.status === 'called') {
        const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p.setAttribute('class','status-mark');
        p.setAttribute('d','M7 12.5l3.2 3.2L17.5 8.4');
        p.setAttribute('stroke-width','2.2');
        p.setAttribute('stroke-linecap','round');
        p.setAttribute('stroke-linejoin','round');
        icon.appendChild(p);
      } else {
        const p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('class','status-mark');
        p1.setAttribute('d','M15.5 8.5L8.5 15.5');
        p1.setAttribute('stroke-width','2');
        p1.setAttribute('stroke-linecap','round');
        const p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p2.setAttribute('class','status-mark');
        p2.setAttribute('d','M8.5 8.5L15.5 15.5');
        p2.setAttribute('stroke-width','2');
        p2.setAttribute('stroke-linecap','round');
        icon.appendChild(p1); icon.appendChild(p2);
      }

      const phonesWrap = node.querySelector('.phones');
      phonesWrap.innerHTML = '';
      (c.phones || []).forEach((tel, idx) => {
        const line = document.createElement('div');
        line.className = 'phone-line';
        const label = document.createElement('span');
        label.textContent = idx === 0 ? 'মেইন:' : 'বিকল্প:';
        const code = document.createElement('code');
        code.textContent = tel;
        line.append(label, code);
        phonesWrap.appendChild(line);
      });

      // Call button (uses tel: link)
      const callBtn = node.querySelector('.call-btn');
      const primaryTel = (c.phones && c.phones[0]) ? c.phones[0] : '';
      callBtn.href = primaryTel ? `tel:${primaryTel}` : '#';
      callBtn.dataset.tel = primaryTel;
      if (!primaryTel) callBtn.setAttribute('disabled', 'true');

      callBtn.addEventListener('click', (e) => {
        if (!primaryTel) {
          e.preventDefault();
          alert('এই কন্ট্যাক্টের জন্য ফোন নম্বর সেট করা হয়নি।');
          return;
        }
        // Optimistically mark as called
        markCalled(c.id);
      });

      node.querySelector('.toggle-status').addEventListener('click', () => toggleStatus(c.id));
      node.querySelector('.delete-contact').addEventListener('click', () => deleteContact(c.id));

      grid.appendChild(node);
    }

    $('#emptyState').hidden = list.length !== 0;
    refreshCounts();
    triggerReveal();
  }

  function refreshCounts() {
    const total = contacts.length;
    const called = contacts.filter(c => c.status === 'called').length;
    const notCalled = total - called;
    $('#countTotal').textContent = total;
    $('#countCalled').textContent = called;
    $('#countNotCalled').textContent = notCalled;
  }

  function markCalled(id) {
    const i = contacts.findIndex(c => c.id === id);
    if (i < 0) return;
    contacts[i].status = 'called';
    contacts[i].lastCalled = new Date().toISOString();
    contacts[i].callCount = (contacts[i].callCount || 0) + 1;
    saveContacts();
    renderList();
  }

  function toggleStatus(id) {
    const i = contacts.findIndex(c => c.id === id);
    if (i < 0) return;
    const next = contacts[i].status === 'called' ? 'not_called' : 'called';
    contacts[i].status = next;
    if (next === 'called' && !contacts[i].lastCalled) contacts[i].lastCalled = new Date().toISOString();
    saveContacts();
    renderList();
  }

  function deleteContact(id) {
    if (!confirm('আপনি কি নিশ্চিত? এই কন্ট্যাক্ট ডিলিট হবে।')) return;
    contacts = contacts.filter(c => c.id !== id);
    saveContacts();
    renderList();
  }

  // ---------- Controls ----------
  $('#searchInput').addEventListener('input', renderList);
  $('#filterSelect').addEventListener('change', renderList);
  $('#sortSelect').addEventListener('change', renderList);
  $('#resetStatuses').addEventListener('click', () => {
    if (!confirm('সব কন্ট্যাক্টের স্ট্যাটাস "Not Called" করা হবে—নিশ্চিত?')) return;
    contacts = contacts.map(c => ({ ...c, status: 'not_called' }));
    saveContacts();
    renderList();
  });

  // Import/Export
  $('#exportBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(contacts, null, 2)], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'family-contacts-backup.json';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  });
  $('#importBtn').addEventListener('click', () => $('#importFile').click());
  $('#importFile').addEventListener('change', (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data)) throw new Error('Invalid data');
        // basic shape check
        for (const c of data) {
          if (!c.id || !c.name) throw new Error('Invalid item');
          c.phones = Array.isArray(c.phones) ? c.phones : [];
          c.status = c.status === 'called' ? 'called' : 'not_called';
        }
        contacts = data;
        saveContacts();
        renderList();
        alert('ইম্পোর্ট সম্পন্ন!');
      } catch (err) {
        alert('ইম্পোর্ট ব্যর্থ: ভুল ফাইল/ডেটা।');
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  });

  // Add form
  $('#addForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#nameInput').value.trim();
    const relation = $('#relationInput').value.trim();
    const phone = $('#phoneInput').value.trim();
    const alt = $('#altPhoneInput').value.trim();
    if (!name || !relation || !phone) {
      alert('নাম, সম্পর্ক ও ফোন নম্বর অবশ্যই লাগবে।');
      return;
    }
    const item = {
      id: crypto.randomUUID(),
      name, relation,
      phones: alt ? [phone, alt] : [phone],
      status: 'not_called',
      lastCalled: null,
      callCount: 0,
    };
    contacts.unshift(item);
    saveContacts();
    // clear
    $('#nameInput').value = '';
    $('#relationInput').value = '';
    $('#phoneInput').value = '';
    $('#altPhoneInput').value = '';
    renderList();
  });

  // ---------- Reveal on scroll ----------
  function triggerReveal() {
    const items = $$('.reveal');
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      }
    }, { threshold: .1 });
    items.forEach(el => io.observe(el));
  }

  // ---------- Init ----------
  function init() {
    $('#year').textContent = new Date().getFullYear();
    initTheme();
    refreshCounts();
    renderList();
  }
  init();
})();
