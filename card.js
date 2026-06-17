const template = document.createElement('template');
template.innerHTML = `
  <style>
    .card { border: 2px solid; }
  </style>
  <div class="card">
    <h2><slot name="nombre">Nombre</slot></h2>
    <p><slot name="rol">Rol</slot></p>
  </div>
`;

class UserCard extends HTMLElement {
    static observedAttributes = ['color'];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    connectedCallback() {
        const color = this.getAttribute('color') || '#000000';
        const card = this.shadowRoot.querySelector('.card');
        const titulo = this.shadowRoot.querySelector('h2');
        titulo.style.color = color;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log(
            `Atributo ${name} cambió de ${oldValue} a ${newValue}`
        );
        //  const titulo = this.shadowRoot.querySelector('h2');
        // titulo.style.color = newValue;
        // this.connectedCallback();
    }
}

customElements.define('user-card', UserCard);