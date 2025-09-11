/*
 * Client‑side script for rendering family contact cards and managing
 * call status. This file fetches contact data from a JSON file,
 * generates interactive cards, and persists call states in
 * localStorage. When a card is clicked, the associated phone number
 * is dialled using a `tel:` link and the status badge is updated to
 * indicate the contact has been called.
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('contactsContainer');
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Attempt to load contacts from a global variable first. When the site
  // is served from the file system (file://) browsers may block fetch()
  // for JSON resources. To avoid this, index.html includes
  // data/contacts.js which populates window.contactsData. On HTTP
  // servers (e.g. GitHub Pages) this variable may be undefined, so we
  // fall back to fetching the JSON file.
  if (Array.isArray(window.contactsData)) {
    renderContacts(window.contactsData);
  } else {
    fetch('data/contacts.json')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load contacts.json');
        }
        return response.json();
      })
      .then((contacts) => {
        renderContacts(contacts);
      })
      .catch((err) => {
        console.error(err);
        const errorMessage = document.createElement('p');
        errorMessage.textContent =
          'Unable to load contacts. Please check the console for more information.';
        errorMessage.style.color = 'var(--accent-red)';
        container.appendChild(errorMessage);
      });
  }

  /**
   * Renders a list of contacts into the DOM as clickable cards.
   * @param {Array<{name:string, phone:string}>} contacts
   */
  function renderContacts(contacts) {
    // Retrieve saved call states from localStorage; default to empty object
    const calledContacts = JSON.parse(
      localStorage.getItem('calledContacts') || '{}'
    );

    contacts.forEach((contact, index) => {
      // Create anchor acting as a card; the tel: link triggers the phone call
      const card = document.createElement('a');
      card.href = 'tel:' + contact.phone;
      card.className = 'card';
      card.setAttribute('role', 'link');
      card.setAttribute(
        'aria-label',
        `Call ${contact.name} at ${contact.phone}`
      );
      // data attributes for later reference
      card.dataset.phone = contact.phone;

      // Avatar image
      const avatar = document.createElement('img');
      avatar.className = 'avatar';
      avatar.src = contact.image || 'assets/avatar.png';
      avatar.alt = `${contact.name}'s avatar`;

      // Info wrapper for name and phone
      const infoWrapper = document.createElement('div');
      infoWrapper.className = 'info';
      // Name element
      const nameEl = document.createElement('div');
      nameEl.className = 'name';
      nameEl.textContent = contact.name;
      // Phone line with icon
      const phoneContainer = document.createElement('div');
      phoneContainer.className = 'phone-container';
      // Phone icon (Bootstrap phone icon)
      const phoneIconWrap = document.createElement('span');
      phoneIconWrap.className = 'phone-icon';
      phoneIconWrap.innerHTML =
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
            <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
         </svg>`;
      // Phone number text
      const phoneNumberSpan = document.createElement('span');
      phoneNumberSpan.className = 'phone';
      phoneNumberSpan.textContent = contact.phone;
      phoneContainer.appendChild(phoneIconWrap);
      phoneContainer.appendChild(phoneNumberSpan);
      // Append name and phone container to info wrapper
      infoWrapper.appendChild(nameEl);
      infoWrapper.appendChild(phoneContainer);

      // Status row (badge and text)
      const statusEl = document.createElement('div');
      statusEl.className = 'status';
      const badge = document.createElement('span');
      badge.className = 'status-badge';
      // Determine if this contact has been called
      const isCalled = Boolean(calledContacts[contact.phone]);
      badge.classList.add(isCalled ? 'called' : 'not-called');
      // Choose the correct icon (check or x)
      if (isCalled) {
        badge.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
             <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
             <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
           </svg>`;
      } else {
        badge.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
             <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
             <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
           </svg>`;
      }
      const statusText = document.createElement('span');
      statusText.className = 'status-text';
      statusText.textContent = isCalled ? 'Called' : 'Not called';
      statusEl.appendChild(badge);
      statusEl.appendChild(statusText);

      // Assemble card: avatar, info, status
      card.appendChild(avatar);
      card.appendChild(infoWrapper);
      card.appendChild(statusEl);

      // Set a staggered animation delay for each card to create a pleasant reveal effect
      card.style.animationDelay = `${index * 0.05}s`;

      // Click handler: mark contact as called and update UI
      card.addEventListener('click', () => {
        // Persist call status
        const stored = JSON.parse(
          localStorage.getItem('calledContacts') || '{}'
        );
        stored[contact.phone] = true;
        localStorage.setItem('calledContacts', JSON.stringify(stored));
        // Update badge classes
        badge.classList.remove('not-called');
        badge.classList.add('called');
        // Swap to check icon
        badge.innerHTML =
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" aria-hidden="true">
             <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
             <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
           </svg>`;
        // Update status text
        statusText.textContent = 'Called';
        // Nothing else: letting the anchor's default behaviour handle tel:
      });

      // Insert card into the container
      container.appendChild(card);
    });
  }
});