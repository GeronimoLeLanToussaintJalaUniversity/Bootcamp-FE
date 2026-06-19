const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="profile-card/profile-card.css">
 
  <div class="card">
    <header class="header">JalaSoft</header>
    <div class="photo-wrap">
      <div class="photo">
        <slot name="avatar">
          <img class="avatar-img" >
        </slot>
      </div>
    </div>
    <h1 class="name"></h1>
    <div class="role"></div>
  </div>
`;

class ProfileCard extends HTMLElement {

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    const root = this.shadowRoot;
    const name = this.getAttribute('name') || 'Nombre Apellido';
    const role = this.getAttribute('role') || 'Rol';
    const image = this.getAttribute('image') || '';

    root.querySelector('.name').textContent = name;
    root.querySelector('.role').textContent = role;

    const img = root.querySelector('.avatar-img');
    img.src = image;
    img.alt = name;
    img.hidden = false;
  }
}

customElements.define('profile-card', ProfileCard);