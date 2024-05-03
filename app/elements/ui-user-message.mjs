export default function UserMessage ({ html }) {
  return html`
    <style>
      :host {
        display: inline-block;
        padding-block: var(--space--1) var(--space-0);
        padding-inline: var(--space-0);
        border: 1px solid hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.5);
        border-radius: 0.5em;
        max-inline-size: 72ch;
      }

      .user {
        opacity: 0.75;
      }
    </style>
    <span class="user font-bold text-1">You</span>
    <p>
      <slot></slot>
    </p>
  `
}
