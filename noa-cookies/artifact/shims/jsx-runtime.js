// El JSX compilado llama a jsx()/jsxs(). El build UMD de React no trae ese
// módulo, así que aquí se traduce a React.createElement.
const React = window.React

export const Fragment = React.Fragment

function split(props, key) {
  const { children, ...rest } = props ?? {}
  if (key !== undefined) rest.key = key
  return [rest, children]
}

/** Un solo hijo (puede ser una lista con sus propias keys): se pasa tal cual. */
export function jsx(type, props, key) {
  const [rest, children] = split(props, key)
  return children === undefined ? React.createElement(type, rest) : React.createElement(type, rest, children)
}

/** Varios hijos estáticos: se pasan como argumentos sueltos. */
export function jsxs(type, props, key) {
  const [rest, children] = split(props, key)
  return React.createElement(type, rest, ...children)
}

export const jsxDEV = jsx
