export default function Input ({ html }) {
  return html`
    <style>
      form {
        inset-block-end: 1em;
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
    <form class="fixed z1 inset-i-0 mi-auto flex justify-content-center gap-2">
      <input
        required
        autofocus
        name="userinput"
        type="text"
        placeholder="Start a conversation"
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
