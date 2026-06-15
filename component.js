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

// Create a class for the element
class MyCustomElement extends HTMLElement {
  static observedAttributes = ['color', 'size'];

  constructor() {
    // Always call super first in constructor
    super();
  }

  connectedCallback() {
    console.log('Custom element added to page.');
  }

  disconnectedCallback() {
    console.log('Custom element removed from page.');
  }

  connectedMoveCallback() {
    console.log('Custom element moved with moveBefore()');
  }

  adoptedCallback() {
    console.log('Custom element moved to new page.');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`Attribute ${name} has changed.`);
  }
}

customElements.define('my-custom-element', MyCustomElement);
