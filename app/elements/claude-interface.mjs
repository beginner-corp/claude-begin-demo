import xss from 'xss'

export default function ClaudeInterface({ html, state }) {
  const { store } = state
  const { messages } = store

  return html`
    <style scope="global">
      body:has(#toggle:checked) {
        overflow: hidden;
      }

      #scrollanchor {
        overflow-anchor: auto;
        block-size: 1px;
      }
    </style>
    <style>
      :host {
        display: block;
        position: relative;
      }

      #app-layout {
        grid-template-rows: min-content 1fr min-content;
        block-size: 100dvh;
      }

      @media (width > 52em) {
        section {
          grid-template-columns: minmax(25%, 16em) 1fr;
          max-inline-size: 100em;
        }

        header {
          inset-block-start: var(--space-0);
        }
      }

      ui-message-list {
        display: block;
        padding-block-end: var(--space-6);
      }

      aside {
        background-color: white;
        border-radius: 0.25em;
        box-shadow: 0 4px 12px hsla(0deg 0% 0% / 0.125);
        max-block-size: calc(100% - (var(--space-0) * 2));
        inset: var(--space-0);
      }

      @media (prefers-color-scheme: dark) {
        aside {
          background-color: #333;
        }
      }

      @media (width <= 52em) {
        aside {
          display: none;
          z-index: 2;
        }

        label {
          background: var(--accent);
          inline-size: 32px;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          inset-block-start: var(--space--4);
          inset-inline-end: var(--space--4);
          z-index: 3;
          box-shadow: 0 4px 12px hsla(0deg 0% 0% / 0.125);
        }

        label:has(#toggle:checked) ~ aside {
          display: block;
        }

        #toggle:not(:checked) ~ #icon-close {
          display: none;
        }

        #toggle:checked ~ #icon-menu {
          display: none;
        }
      }

      #scrollanchor {
        overflow-anchor: auto;
        block-size: 1px;
      }

    </style>

    <claude-config></claude-config>

    <div id="app-layout" class="grid">
      <header class="flex justify-content-center mbs4 mbe2">
        <claude-logo></claude-logo>
      </header>

      <section class="si-100 pi0 grid-lg gap0-lg mi-auto overflow-scroll overflow-hidden-lg">

        <label class="hidden-lg flex align-items-center justify-content-center fixed">
          <input type="checkbox" id="toggle" name="mobile-menu" class="hidden" />
          <figure id="icon-menu">
            <?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M3 5H21" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 12H21" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M3 19H21" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </figure>
          <figure id="icon-close">
            <?xml version="1.0" encoding="UTF-8"?><svg width="20px" height="20px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#fff"><path d="M6.75827 17.2426L12.0009 12M17.2435 6.75736L12.0009 12M12.0009 12L6.75827 6.75736M12.0009 12L17.2435 17.2426" stroke="#fff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          </figure>
        </label>

        <aside class="fixed sticky-lg mb0-lg overflow-y-scroll">
          <ui-previous-sessions></ui-previous-sessions>
        </aside>

        <main data-wssurl="${process.env.ARC_WSS_URL}" class="overflow-y-scroll-lg">
          <ui-message-list class="p0-lg"></ui-message-list>
          <div id="scrollanchor"></div>
        </main>
      </section>

      <ui-input></ui-input>

    </div>

    <script type="module" src="/_public/browser/index.mjs"></script>
    <script type="application/json" id="initialMessages">
      ${JSON.stringify(xss(messages))}
    </script>
  `
}
