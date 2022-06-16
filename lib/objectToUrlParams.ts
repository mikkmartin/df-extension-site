export const objectToUrlParams = (object: Object): string => {
  var add = (key, value) => pairs.push(key + '=' + value),
    pairs = []
  for (var name in object) {
    buildParam(name, isUrl(object[name]) ? urlEncode(object[name]) : object[name], add)
  }
  return pairs.length > 0 ? '?' + pairs.join('&').replace(/%20/g, '+') : ''
  function buildParam(prefix, obj, add) {
    if (Array.isArray(obj)) {
      for (var i = 0, l = obj.length; i < l; ++i) {
        var inner = obj[i]
        var shouldIncludeIndex = typeof inner === 'object'
        var arrayIndex = shouldIncludeIndex ? '[' + i + ']' : '[]'
        buildParam(prefix + arrayIndex, inner, add)
      }
    } else if (obj && typeof obj === 'object') {
      for (var name in obj) {
        buildParam(prefix + '[' + name + ']', obj[name], add)
      }
    } else {
      add(prefix, obj)
    }
  }
}

function isUrl(url: string) {
  return /^(http|https):\/\/[^ "]+$/.test(url)
}

function urlEncode(url: string) {
  return url.replaceAll('?', encodeURIComponent('?')).replaceAll('&', encodeURIComponent('&'))
}
