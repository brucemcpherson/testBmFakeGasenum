
//import { newCircularEnum } from './circularenum.js'


/**
 * make an apps script style enum
 * @param {boolean} safe whether to guard against invalid property accesses
 * @param {string[]} keys the valid key values for the enum
 * @param {string} [defaultKey] normally we use the 1st key in the keys array, but this would pick another by name
 * @return {CircularEnum}
 */
const makeCircularEnum = (safe, keys, defaultKey) => {

  const isArray = (a) => Array.isArray(a)
  const isNonEmptyArray = (a) => isArray(a) && a.length > 0
  const isString = (a) => typeof a === 'string'
  const isObject = (a) => typeof a === 'object' && a !== null && !isArray(a)

  let keyNames, values

  if (isNonEmptyArray(keys) && keys.every(isString)) {
    keyNames = keys
    values = keys
  } else if (isObject(keys) && Object.keys(keys).length > 0) {
    keyNames = Object.keys(keys)
    values = Object.values(keys)
  } else {
    throw new Error(`expected keys argument to makeCircularEnum to be an array of strings or an object`)
  }

  // we'll assume the default key is the first one if not specified
  let defaultIndex = 0

  // if one is specified then check it's in the list of valid values
  if (defaultKey) {
    if (!isString(defaultKey)) {
      throw new Error(`expected defaultKey argument to makeCircularEnum to be a string if present`)
    }
    defaultIndex = keyNames.indexOf(defaultKey)
    if (defaultIndex === -1) throw new Error(`Failed to find default enum key`, defaultKey)
  }
  defaultKey = keyNames[defaultIndex]
  const defaultValue = values[defaultIndex]

  // the base property (for Example ColorType)
  const base = newCircularEnum(safe, defaultKey, defaultIndex, defaultValue)

  // now one for each requried key
  const enums = keyNames.map((key, i) => newCircularEnum(safe, key, i, values[i]))

  // add properties to base
  enums.forEach(e => base[e.name()] = e)

  // add circularity
  enums.forEach(e => keyNames.forEach(key => e[key] = base[key]))

  return base

}

/**
 * make an apps script style enum
 * @param {string[]} keys the valid key values for the enum
 * @param {string} [defaultKey] normally we use the 1st key in the keys array, but this would pick another by name
 * @return {CircularEnum}
 */
const newFakeGasenum = (keys, defaultKey) => makeCircularEnum(false, keys, defaultKey)
const newFakeGasenumSafe = (keys, defaultKey) => makeCircularEnum(true, keys, defaultKey)