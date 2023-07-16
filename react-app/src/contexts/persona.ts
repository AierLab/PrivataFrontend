import { PersonaContextType } from '../@types/persona'
import { createContext } from 'react'

const PersonaContext = createContext<PersonaContextType>({
  persona: {
    uuid: '',
    name: '',
    desc: '',
    avatar: '',
    features: [],
    compatibility:''
  },
})

export { PersonaContext }
