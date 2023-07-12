import { PersonaContextType } from '../@types/persona'
import { createContext } from 'react'

const PersonaContext = createContext<PersonaContextType>({
  persona: {
    id: '',
    name: '',
    desc: '',
    avatar: '',
  },
})

export { PersonaContext }
