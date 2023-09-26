export { };

declare global {
  interface Window {
    api: any;
  }
  interface Document {
    startViewTransition?: (callback: () => Promise) => ViewTransition
  }

  interface ViewTransition {
    finished: Promise<void>
    ready: Promise<void>
    updateCallbackDone: Promise<void>
    skipTransition: () => void
  }
}
