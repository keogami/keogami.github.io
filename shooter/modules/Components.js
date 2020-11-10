export * from "./components/Player.js"
export * from "./components/Reticle.js"
export * from "./components/Projectile.js"

export { ComponentSet }

// ComponentSet allows a set of components to be grouped together
class ComponentSet {
  constructor() {
    this._components = new Set()
  }

  Add(it) {
    this._components.add(it)
    return this
  }

  Remove(it) {
    return this._components.delete(it)
  }

  All() {
    return this._components
  }

  Clear() {
    this._components.clear()
  }

  Update(data) {
    for (let comp of this._components) {
      comp.Update(data)
    }
  }

  Draw(screen) {
    for (let comp of this._components) {
      comp.Draw(screen)
    }
  }
}