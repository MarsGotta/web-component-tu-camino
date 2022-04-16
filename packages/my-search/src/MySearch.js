export class MySearch extends HTMLElement {
  static get observedAttributes() {
    return ["button", "label", "placeholder", "value"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    this.buttonEl = this.shadowRoot.querySelector("button");
    this.slotNode = this.buttonEl.querySelector("slot");
    this.inputEl = this.shadowRoot.querySelector("input");

    this.addEventListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  get button() {
    return this.getAttribute("button") || "";
  }

  set button(data) {
    this.setAttribute("button", data);
  }

  get value() {
    return this.getAttribute("value") || "";
  }

  set value(data) {
    this.setAttribute("value", data);
  }

  get placeholder() {
    return this.getAttribute("placeholder") || "";
  }

  set placeholder(data) {
    this.setAttribute("placeholder", data);
  }

  get label() {
    return this.getAttribute("label") || "";
  }
  
  set label(data) {
    this.setAttribute("label", data); 
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }

    this[name] = newVal;
  }

  addEventListeners() {
    this.buttonEl.addEventListener("click", () => { 
      this.dispatchCustomEvent("my-search-button-click", {
        button: this.button || this.innerHTML,
        value: this.value,
      })
    });

    this.inputEl.addEventListener("input", () => {
      this.dispatchCustomEvent("my-search-input-change", {
        value: this.inputEl.value,
      });
    });
  }

  removeEventListeners() {
    this.buttonEl.removeEventListener("click", () => {});
    this.inputEl.removeEventListener("input", () => {});
  }

  dispatchCustomEvent(eventName, detail) {
    this.dispatchEvent(
      new CustomEvent(eventName, {
        bubbles: true,
        composed: true,
        detail,
      })
    );
  }

  getTemplate() {
    const template = document.createElement("template");
    template.innerHTML = `
      <style>
        ${this.getStyles()}
      </style>
      <label part="label">${this.label}</label>
      <input 
        type="text" 
        value="${this.value}" 
        placeholder="${this.placeholder}"
        part="input" 
      />
      <button part="button">
          <slot>${this.button}</slot>
      </button>
    `;
    return template;
  }

  getStyles() {
    return `
      :host {
        display: block;
        font-family: sans-serif;
        font-weight: 300;
        font-size: 1rem;
        margin: 0.7rem 0;
      }

      input {
        border: none;
        border-bottom: 1px solid var(--my-search-input-border-color, #ccc);
        padding: 0.5rem;
      }

      label {
        display: block;
        padding-left: 0.5rem;
        font-size: 0.8rem;
      }

      button {
        border: none;
        background-color: #5f3993;
        cursor: pointer;
        outline: none;
        color: white;
        padding: 10px;
        border-radius: 5px;
        min-width: 6rem;
        min-height: 2rem;
      }

      button:hover {
        background-color: #9f7fcd;
      }

      button:active, button:focus {
        background-color: #472b6e;
      }
    `;
  }

  render() {
    this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
  }
}
