// web component
class HelloWorld extends HTMLElement {
  constructor() {
    super();
  }

  // connect component
  connectedCallback() {
    const titulo = this.getAttribute('titulo');
    const color = this.getAttribute('color');
    this.innerHTML = `<div style="background: ${color}"> <h2>${titulo}</h2> </div>`;
  }
}

// register component
customElements.define('hello-world', HelloWorld);
