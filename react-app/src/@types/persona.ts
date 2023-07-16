export interface PersonaContextType {
  persona: Persona
}

// export interface Persona {
//   id: string,
//   name: string,
//   desc: string,
//   avatar: string,
// }
export interface Persona {
  uuid: string,
  name: string,
  desc: string,
  avatar: string,
  features: string[],
  compatibility:string
}
