const template = document.createElement('template');
template.innerHTML = `
  <link rel="stylesheet" href="profile-card.css">
<h1 class="test">test</h1>
`;

class ProfileCard extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
  }
}

customElements.define('profile-card', ProfileCard);