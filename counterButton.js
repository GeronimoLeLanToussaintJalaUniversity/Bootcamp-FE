class CounterButton extends HTMLButtonElement {

    constructor() {
        super();
        this.count = 0;
    }

    connectedCallback() {
        console.log('Botón agregado al DOM');
        this.textContent = `Clicks: ${this.count}`;
        this.addEventListener('click', this.increment);
    }

    disconnectedCallback() {
        console.log('Botón eliminado del DOM');
        this.removeEventListener('click', this.increment);
    }

    increment = () => {
        this.count++;
        this.textContent = `Clicks: ${this.count}`;
    }
}

customElements.define('counter-button', CounterButton, { extends: 'button' });