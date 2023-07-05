import { BugAntIcon, MinusIcon, StopIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRef, useState, useEffect } from 'react';
import './Titlebar.css'

interface TitleBarProps {
  colorScheme?: 'light' | 'dark',
};

// to avoid OS deem the titlebar as a draggable area, have to seperate
// titlebar as a independent component, place it as a child of the
// page's top right element, if there's no such element, place it as a
// child of root.
const Titlebar = ({ colorScheme }: TitleBarProps) => {
  const [debug, setDebug] = useState<boolean>(false)
  const [devMenuOpen, setDevMenuOpen] = useState<boolean>(false)
  const devExtPathRef = useRef<HTMLInputElement>(null)

  const color = colorScheme === 'light' ? 'white' : 'black'

  useEffect(() => {
    window.api.isDebug().then((d: boolean) => {
      // prevent from re-rendering
      if(debug !== d) setDebug(d)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDebug])

  return (
    <div className="titlebar">

      { /* button to open dev tools when running in dev mode */ }
      { debug ?
        <>
          <button id="open-dev-menu" onClick={ () => setDevMenuOpen(o => !o) } title="Open Dev Menu">
            <BugAntIcon color={color} />
          </button>
          { devMenuOpen ?
            <div className="dev-menu" onClick={ () => setDevMenuOpen(false) }>
              <div className="dev-menu-content" onClick={ e => e.stopPropagation() }>
                <h1> Debug Menu </h1>
                <button onClick={ window.api.toggleDevTools }> Open Dev Tools </button>
                <div>
                  <input className="extension-path" ref={devExtPathRef} placeholder="path"/>
                  <button onClick={ () => { console.log(window.api.loadDevExtension(devExtPathRef.current!.value)) }}> Load dev extension </button>
                  <span
                    onClick={() =>
                      window.api.openExternal("https://www.electronjs.org/docs/latest/tutorial/devtools-extension")
                    }
                    style={{ color: "blue", cursor: "pointer" }}
                  > help </span>
                  <span
                    onClick={() =>
                      window.api.openExternal("https://github.com/facebook/react/issues/25843")
                    }
                    style={{ color: "blue", cursor: "pointer" }}
                  > &nbsp; react dev #25843 </span>
                </div>
              </div>
            </div>
            :
            <></>
          }
        </>
        :
        <></>
      }

      <button id="minimize" onClick={window.api.minimizeWindow} title="Minimize Window">
        <MinusIcon color={color}/>
      </button>
      <button id="maximize" onClick={window.api.toggleMaximize} title="Maximize Window">
        <StopIcon color={color}/>
      </button >
      <button id="close" onClick={window.api.closeWindow} title="Close Window">
        <XMarkIcon color={color}/>
      </button>
    </div>
  )
}

export default Titlebar
