export default function Input ({ html }) {
  return html`
    <style>
      :host {
        display: block;
        padding-block: var(--space-0);
      }
      form {
        inline-size: min(90vw, 48ch);
        background-color: var(--back);
        border: 0.5em solid var(--back);
        border-radius: 0.5em;
        box-shadow: 0 4px 12px hsla(0deg 0% 0% / 0.125);
      }
      input {
        border: 1px solid var(--accent);
        border-radius: 0.25em;
      }
      button {
        background-color: var(--accent);
        border-radius: 0.25em;
        color: white;
      }
    </style>
    <form class="mi-auto flex justify-content-center gap-2">
      <input
        required
        autofocus
        name="userinput"
        type="text"
        placeholder="Message Claude"
        class="pi-2 pb-4 flex-grow"
      />
      <button
        type="submit"
        class="pi0 pb-4 font-medium"
      >
        Send
      </button>
    </form>
  `
}
