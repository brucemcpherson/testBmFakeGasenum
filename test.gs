//import { newFakeGasenum, newFakeGasenumSafe } from '../main.js'
/// testing from npm
/// import { newFakeGasenum } from '@mcpher/fake-gasenum'
//import { Exports as unitExports } from '@mcpher/unit'
//import is from '@sindresorhus/is';

const unit = unitExports.newUnit({
  showErrorsOnly: true
})

// see if we're running in apps script 
const isFake = !globalThis.ScriptApp || ScriptApp.isFake

// apps script can't get from parent without access to the getresource of the parent
if (unitExports.CodeLocator.isGas) {
  // because a GAS library cant get its caller's code
  unitExports.CodeLocator.setGetResource(ScriptApp.getResource)
  // optional - generally not needed - only necessary if you are using multiple libraries and some file sahre the same ID
  unitExports.CodeLocator.setScriptId(ScriptApp.getScriptId())
}

// enmums can now have optional values.
const testFakeGasEnum = () => {
  unit.section("check enum structure", t => {

    const getSeed = (p) => Object.keys(p).filter(k => is.nonEmptyObject(p[k]))

    const testEnumProp = (p, report, defaultIndex = 0) => {
      t.true(is.nonEmptyObject(p))

      getSeed(p).forEach((key, i) => {
        t.true(is.nonEmptyObject(p[key]), report)
        t.is(p[key].toString(), key, report)
        t.is(p[key].name(), key, report)
        t.is(p[key].ordinal(), i, report)
        t.is(p[key].compareTo(p[key]), 0, report)
        if (i === defaultIndex) {
          t.is(p[key].name(), p.name(), report)
        } else {
          t.not(p.compareTo(p[key], 0), report)
        }
      })

    }
    const fruit = ["melon", "apple", "banana"]
    let p = newFakeGasenum(fruit)
    t.deepEqual(getSeed(p), fruit)
    t.is(p.name(), fruit[0])
    testEnumProp(p, "normal default")

    p = newFakeGasenum(fruit, fruit[2])
    t.deepEqual(getSeed(p), fruit)
    t.is(p.name(), fruit[2], "check default key has moved")
    testEnumProp(p, "non normal default", 2)

    p = newFakeGasenum(fruit)
    t.deepEqual(getSeed(p), fruit)
    t.is(p.name(), p[fruit[1]][fruit[2]][fruit[0]].name(), "check circularity")


    /// apps script fake example
    const keys = ["UNSUPPORTED", "RGB", "THEME"]

    // imitate the ColorType enum
    const ColorType = newFakeGasenum(keys)

    t.is(ColorType.toString(), "UNSUPPORTED")
    t.is(ColorType.name(), "UNSUPPORTED")
    t.is(ColorType.toJSON(), "UNSUPPORTED")
    t.is(ColorType.ordinal(), 0)
    t.is(ColorType.compareTo(ColorType.UNSUPPORTED), 0)
    t.is(ColorType.RGB.toString(), "RGB")
    t.is(ColorType.RGB.name(), "RGB")
    t.is(ColorType.RGB.toJSON(), "RGB")
    t.is(ColorType.RGB.ordinal(), 1)
    t.is(ColorType.RGB.compareTo(ColorType.RGB), 0)
    t.is(ColorType.THEME.toString(), "THEME")
    t.is(ColorType.THEME.name(), "THEME")
    t.is(ColorType.THEME.toJSON(), "THEME")
    t.is(ColorType.THEME.ordinal(), 2)
    t.is(ColorType.THEME.compareTo(ColorType.THEME), 0)

    t.is(ColorType.THEME.compareTo(ColorType), 2)
    t.is(ColorType.RGB.compareTo(ColorType), 1)
    t.is(ColorType.RGB.compareTo(ColorType.THEME), -1)

    t.is(ColorType.THEME.RGB.RGB.THEME.UNSUPPORTED.RGB.RGB.toString(), "RGB", "just some Apps Script weirdness")

    // check the safe version 
    p = newFakeGasenumSafe(fruit)
    t.deepEqual(getSeed(p), fruit)
    t.is(t.threw(() => p.foo)?.message, "attempt to get non-existent property foo in fake-gas-enum", "check proxies are guarding")
    testEnumProp(p, "safe version")

    // versus the unsafe version
    t.true(is.undefined(ColorType.foo))
  })
}

unit.section("custom values", t => {
  const definition = {
    KEY1: "value1",
    KEY2: "value2"
  }
  const myEnum = newFakeGasenum(definition)

  t.is(myEnum.KEY1.name(), "KEY1")
  t.is(myEnum.KEY1.toString(), "value1")
  t.is(myEnum.KEY1.toJSON(), "value1")

  t.is(myEnum.KEY2.name(), "KEY2")
  t.is(myEnum.KEY2.toString(), "value2")
  t.is(myEnum.KEY2.toJSON(), "value2")

  // Check circularity
  t.is(myEnum.KEY1.KEY2.toString(), "value2")

  // Check default (first key)
  t.is(myEnum.name(), "KEY1")
  t.is(myEnum.toString(), "value1")
});

unit.section('existing array functionality preserved', t => {
  const keys = ["A", "B"];
  const myEnum = newFakeGasenum(keys);

  t.is(myEnum.A.name(), "A")
  t.is(myEnum.A.toString(), "A")
  t.is(myEnum.A.toJSON(), "A")
});

// we want to manually induce if actually rinning on apps script
if (isFake) {
  testFakeGasEnum()
}  
