export default function AssistantMessage ({ html }) {
  return html`
    <style>
      :host {
        display: inline-block;
        padding-block: var(--space--1) var(--space-0);
        padding-inline: var(--space-0);
        background-color: hsla(var(--accent-h) var(--accent-s) var(--accent-l) / 0.125);
        border-radius: 0.5em;
        max-inline-size: 72ch;
      }

      .assistant {
        color: var(--accent);
      }

      /* Messages from Claude come back with newline characters; this retains the formatting in the markup. */
      p {
        white-space: pre-line;
      }
    </style>
    <span class="assistant font-bold text-1">Claude</span>
    <p>
      <slot></slot>
    </p>
    
  `
}
