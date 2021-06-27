import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: blockingSetInitialColorMode,
            }}
          ></script>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// our function needs to be a string
const blockingSetInitialColorMode = `(function() {
	${setInitialColorMode.toString()}
	setInitialColorMode();
})()
`

function setInitialColorMode() {
  function getInitialColorMode() {
    const persistedColorPreference = window.localStorage.getItem('theme')

    if (persistedColorPreference) return persistedColorPreference
  }

  const colorMode = getInitialColorMode()
  if (colorMode) {
    document.documentElement.dataset.userTheme = colorMode
  }
}

export default MyDocument
