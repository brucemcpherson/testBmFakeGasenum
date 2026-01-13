//import { guard } from './proxies.js'
const ordinalKeySymbol = Symbol('enum_ordinal')

class CircularEnum {
  constructor(name, ordinal, value) {
    this[ordinalKeySymbol] = ordinal
    this.ordinal = () => this[ordinalKeySymbol]
    this.name = () => name;
    this.toString = () => value || name;
    this.toJSON = () => value || name;
    this.compareTo = (e) => this.ordinal() - e.ordinal()
  }
}

const newCircularEnum = (safe, keys, defaultKey, value) => {
  const c = new CircularEnum(keys, defaultKey, value)
  return safe ? guard(c) : c
}

