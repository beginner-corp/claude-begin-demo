import { getStyles } from '@enhance/arc-plugin-styles'

const { styleTag } = getStyles

export default function Head () {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title></title>
      ${styleTag()}
      <style>
        @import url('/_public/styles/github-dark.min.css') screen and (prefers-color-scheme: dark);
        @import url('/_public/styles/github.min.css') screen and (prefers-color-scheme: light);
        body {
          background-color: var(--back);
          color: var(--fore);
        }
      </style>
      <link rel="icon" href="/_public/favicon.svg">
      <script src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"></script>
      <script>
        hljs.configure({ignoreUnescapedHTML: true})
      </script>
    </head>
    <body class="font-sans leading3">
`
}
