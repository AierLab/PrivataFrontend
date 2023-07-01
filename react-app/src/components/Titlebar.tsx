import { CogIcon, MinusIcon, StopIcon, XMarkIcon } from '@heroicons/react/24/outline';
import './Titlebar.css'

// to avoid OS deem the titlebar as a draggable area, have to seperate
// titlebar as a independent component, place it as a child of the
// page's top right element, if there's no such element, place it as a
// child of root.
const Titlebar = () => {
  return (
    <div className="titlebar">

      { /* button to open dev tools when running in dev mode */ }
      { window.api.isDebug() ?
        <button id="open-dev-tools" onClick={ window.api.toggleDevTools } title="Open DevTools">
          <CogIcon />
        </button>
        :
        <></>
      }

      <button id="minimize" onClick={window.api.minimizeWindow} title="Minimize Window">
        <MinusIcon />
      </button>
      <button id="maximize" onClick={window.api.toggleMaximize} title="Maximize Window">
        <StopIcon />
      </button >
      <button id="close" onClick={window.api.closeWindow} title="Close Window">
        <XMarkIcon />
      </button>
    </div>
  )
}

export default Titlebar
