//import { guard } from './proxies.js'
const ordinalKeySymbol = Symbol('enum_ordinal')
const hasString = (v) => typeof v?.toString === 'function'
const makeString = (v,name) => hasString(v) ?  v.toString() : name.toString();

class CircularEnum {
  constructor(name, ordinal, value) {
    this[ordinalKeySymbol] = ordinal
    this.ordinal = () => this[ordinalKeySymbol]
    this.name = () => name;
    // in live apps script toString returns the value as a string if given
    this.toString = () => makeString(value,name)
    // in live apps script toJSON doesnt exist when there is a value
    this.toJSON = () => value
    this.compareTo = (e) => this.ordinal() - e.ordinal()
  }
}

const newCircularEnum = (safe, keys, defaultKey, value) => {
  const c = new CircularEnum(keys, defaultKey, value)
  return safe ? guard(c) : c
}

