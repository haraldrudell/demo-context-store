const getComponentName = (component) => (
  component.displayName ||
  component.name
)

export default getComponentName



// WEBPACK FOOTER //
// ./app/utilities/get-component-name.js