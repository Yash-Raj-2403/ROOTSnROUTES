/// <reference types="vite/client" />
/// <reference types="aframe" />

// Extend window interface for A-Frame
declare global {
  interface Window {
    AFRAME?: any;
  }
}

// Declare model-viewer as a custom element
declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': any;
    'a-scene': any;
    'a-assets': any;
    'a-asset-item': any;
    'a-sky': any;
    'a-light': any;
    'a-text': any;
    'a-entity': any;
    'a-box': any;
    'a-cylinder': any;
    'a-sphere': any;
    'a-plane': any;
    'a-camera': any;
  }
}
