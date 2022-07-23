import { Document, Element } from 'fast-wasm-scraper'

export const loadHtml = (rawHtml: string) => new HtmlSelector(rawHtml).select
export function fromJson<T extends object>(rawHtml: string, selectors: T): T {
  return new FromJson(rawHtml).fromJson(selectors)
}

class HtmlSelector {
  el: Element
  constructor(rawHtml: string) {
    this.el = new Document(rawHtml).root
  }
  select = (selector: string) => {
    this.el = this.el?.query(selector)[0]
    return this
  }
  attr = (attrName: string) => {
    return this.el?.attributes[attrName]
  }
  txt = () => {
    return this.el?.text()
  }
}

class FromJson {
  $: HtmlSelector['select']
  constructor(rawHtml: string) {
    this.$ = new HtmlSelector(rawHtml).select
  }
  fromJson = <T>(selectors: T) => {
    const entries = Object.entries(selectors)
    const data = entries.reduce((all, [key, selectors]) => {
      const value = this.isObject(selectors)
        ? this.findFirstExistingEnum(selectors)
        : this.findFirstValue(selectors)
      return { ...all, [key]: value }
    }, {})
    //@ts-ignore
    return data as T
  }
  isObject = (value: any) => typeof value === 'object' && !Array.isArray(value) && value !== null
  findFirstValue = selectors => {
    selectors = typeof selectors === 'string' ? [selectors] : selectors //normalize for iteration
    return [...selectors].reduce((returnValue, selector, _, arr) => {
      // break out when a value is found
      if (returnValue) {
        arr.splice(1)
        return returnValue
      }
      if (selector === null) return ' '
      const steps = selector.split('|').map(str => str.trim())
      const firstStep = steps.shift()
      let $selection = this.$(firstStep)

      if (steps.length === 0) {
        //if there is only one step, return the selector's text value
        if (typeof $selection === 'string') return $selection
        const selectionValue = $selection.txt()
        if (selectionValue) return selectionValue
      } else {
        for (const [i, step] of steps.entries()) {
          const isLastStep = i === steps.length - 1
          const testWithArgument = /(\w+)\('((.*?)+)'\)/g
          const fnWithArgument = testWithArgument.exec(step)
          if (fnWithArgument) {
            const [, method, arg] = fnWithArgument
            returnValue = $selection[method](arg)
            if (isLastStep) return returnValue
            $selection = returnValue
          } else {
            returnValue = $selection[step]()
            if (isLastStep) return returnValue
            $selection = returnValue
          }
        }
      }
    }, undefined)
  }
  findFirstExistingEnum = (object: Object) => {
    const entries = Object.entries(object)
    return [...entries].reduce((returnValue, [key, selectors], _, arr) => {
      if (typeof selectors === 'boolean') return key
      if (returnValue) {
        arr.splice(1)
        return returnValue
      }
      const value = this.findFirstValue(selectors)
      if (value !== undefined) return key
    }, undefined)
  }
}
