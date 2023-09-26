import { createContext } from "react"
import { ThemeMode } from '@privata/types/theme'

export type ThemeContextProps = {
  theme: ThemeMode
  setTheme: (theme: ThemeMode, cursorX?: number, cursorY?: number) => void,
}

const ThemeContext = createContext<ThemeContextProps>({ theme: 'system', setTheme: () => {} })

export default ThemeContext
