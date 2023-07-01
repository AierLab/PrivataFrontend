import { createContext } from 'react'

const PersonaContext = createContext({
  persona: {
    id: '',
    name: '',
    desc: '',
    avatar: '',
  },
})

export { PersonaContext }
