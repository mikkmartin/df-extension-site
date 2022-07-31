import { load, Cheerio, AnyNode, CheerioAPI } from 'cheerio/lib/slim'
import type { CSSProperties } from 'styled-components'

export class QuerySelector implements IQuerySelector {
  private rootEl: CheerioAPI
  private selection: Cheerio<AnyNode>
  constructor(rawHtml: string) {
    this.rootEl = load(rawHtml)
  }
  select = (selector: string) => {
    this.selection = this.rootEl(selector).first()
    return this
  }
  find = (selector: string) => {
    this.selection = this.selection.find(selector).first()
    return this
  }
  parent = (selector?: string) => {
    if (selector) {
      const _el = this.selection?.closest(selector)
      if (Boolean(_el.get().length)) this.selection = _el
    } else {
      const _el = this.selection?.parent()
      if (_el) this.selection = _el
    }
    return this
  }
  child = (selector?: string) => {
    this.selection = this.selection.children(selector).first()
    return this
  }
  style = (selector: keyof CSSProperties) => {
    const styleValue = this.selection.css(selector)
    if (selector === 'backgroundImage') return this.backgroundImage(styleValue)
    return styleValue
  }
  backgroundImage = (str: string) => {
    return {
      get: () => str,
      asUrl: () => str?.split('"')[1]!,
    }
  }
  txt = () => {
    return this.selection.text()
  }
  attr = (attr: string) => {
    return this.selection.attr(attr)
  }
  hasAttr = (attr: string) => {
    return this.selection.attr(attr) !== undefined
  }
  get = () => {
    return this.selection.get(0) as unknown as HTMLElement
  }
}

export function scrape<T extends object>(rawHtml: string, selectors: T): T {
  return new FromJson(rawHtml).fromJson(selectors)
}

class FromJson {
  $: QuerySelector['find']
  constructor(rawHtml: string) {
    this.$ = new QuerySelector(rawHtml).select
  }
  fromJson = <T>(selectors: T) => {
    const entries = Object.entries(selectors)
    const data = entries.reduce((all, [key, selectors]) => {
      const value = this.isObject(selectors)
        ? this.findFirstExistingEnum(selectors)
        : this.findFirstValue(selectors)
      return { ...all, [key]: value }
    }, {})
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

interface IQuerySelector {
  find: (selector: string) => this
  parent: (selector?: string) => this
  child: (selector?: string) => this
  style: (style: string) => any
  backgroundImage: (str: string) => {
    get: () => string
    asUrl: () => string
  }
  txt: () => string
  attr: (attr: string) => string
  hasAttr: (attr: string) => boolean
  get: () => HTMLElement
}
