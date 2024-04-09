export default function Message ({ html }) {
  return html`
    <div class="mbe0">
      <p>
        Author: <slot name="author"></slot>
      </p>
      <p>
        Message: <slot name="message"></slot>
      </p>
    </div>
    
  `
}
