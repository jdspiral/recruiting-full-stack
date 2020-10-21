import React from 'react'

const themes = {
  dark: {
    backgroundColor: 'black',
    color: 'white',
    name: 'Dark Mode',
    id: 0,
  },
  light: {
    backgroundColor: 'white',
    color: 'black',
    name: 'Light Mode',
    id: 1,
  },
}

const initialState = {
  dark: false,
  theme: themes.light,
  toggle: () => {},
}
const ThemeContext = React.createContext(initialState)

// eslint-disable-next-line react/prop-types
function ThemeProvider({ children }) {
  const apiUrl = 'http://localhost:8000/webservice.php'
  const [dark, setDark] = React.useState(false) // Default theme is light

  React.useEffect(() => {
    const getTheme = () => {
      fetch(apiUrl)
        .then(res => res.json())
        .then((json) => {
          setDark(json.settings[0].value)
        })
    }
    getTheme()
  }, [dark])

  const toggle = () => {
    const isDark = !dark
    const updatedData = {
      method: 'POST',
      mode: 'cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(isDark ? themes.dark : themes.light),
    }

    fetch(apiUrl, updatedData)
      .then(response => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        setDark(isDark)
      })
      .catch(error => console.error(error))
  }

  const theme = dark ? themes.dark : themes.light

  return (
    <ThemeContext.Provider value={{ theme, dark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export { ThemeProvider, ThemeContext }
