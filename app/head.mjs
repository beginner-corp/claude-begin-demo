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
        body {
          background-color: var(--back);
          color: var(--fore);
        }
      </style>
      <link rel="icon" href="/_public/favicon.svg">
      <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/github-dark.min.css">
      <script src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"></script>
    </head>
    <body class="font-sans leading3">
`
}
