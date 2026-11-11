// En el artefacto React llega por <script> desde cdnjs (build UMD, global `React`).
// Este módulo lo entrega a los `import ... from 'react'` del código de la tienda.
const React = window.React

export default React
export const {
  Children,
  Fragment,
  StrictMode,
  Suspense,
  createContext,
  createElement,
  forwardRef,
  memo,
  startTransition,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  useTransition,
} = React
