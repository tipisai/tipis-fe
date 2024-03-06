import { css } from "@emotion/react"

export const globalStyle = css`
  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }
  body {
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-family:
      Inter,
      -apple-system,
      BlinkMacSystemFont,
      PingFang SC,
      Microsoft YaHei,
      Helvetica Neue,
      Helvetica,
      Arial,
      sans-serif;
  }

  * {
    margin: 0;
    padding: 0;
    outline: none !important;
  }

  /*
  *  Use a more-intuitive box-sizing model.
  */

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }
`
