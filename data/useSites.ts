import { useEffect, useState } from 'react'
import { useLocalStorage } from 'react-use'
import { api } from 'data/server'

export const useSites = () => {
  const [urls, setUrls] = useLocalStorage('urls', seedUrls)
  const [sitesData, setSitesData] = useState<SitesState>(urls.map(url => ({ url })))

  useEffect(() => {
    setSitesData(arr =>
      arr.map(prevSite => {
        const { url, loading } = prevSite
        if (loading) return prevSite
        api.getSiteData
          .query({ url })
          .then(data =>
            setSitesData(arr => arr.map(site => (site.url === url ? { url, ...data } : site)))
          )
        return prevSite
      })
    )
  }, [urls])

  function isValidHttpUrl(string) {
    let url
    try {
      url = new URL(string)
    } catch (_) {
      return false
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
  }

  const handleAdd = ev => {
    ev.preventDefault()
    const input = ev.target.querySelector('input')
    if (!input) return
    const value = input.value
    const isUrl = isValidHttpUrl(input.value)
    if (!isUrl) return
    if (urls.includes(value)) return
    setUrls([value, ...urls])
    input.value = ''
  }
  const handleRemove = (url: string) => {
    setUrls(urls.filter(u => u !== url))
  }

  return {
    sitesData,
    handleAdd,
    handleRemove,
  }
}

type SitesState = Partial<Awaited<ReturnType<typeof api.getSiteData.query>>> &
  {
    url: string
    loading?: boolean
  }[]

const seedUrls = [
  'https://www.levila.ee/tekstid/see-oli-kuuditamine',
  'https://www.levila.ee/tekstid/levilas-hakkas-ilmuma-raamat-kersti-kaljulaidist',
  'https://www.levila.ee/raadio/usu-voim',
  'https://www.levila.ee/uudised/eesti-gaas-ostab-maailmast-gaasi-kokku',
  'https://www.reddit.com/r/ukraine/comments/w85z14/the_armed_forces_of_ukraine_attacked_an_oil_depot/',
  'https://www.reddit.com/r/ukraine/comments/w7tsvy/little_bits_of_tenderness_in_a_brutal_world/',
  'https://www.reddit.com/r/ukraine/comments/w7y1c7/ukrainians_are_returning_to_the_ukrainian/',
  'https://www.reddit.com/r/ukraine/comments/w82tl1/russia_has_made_it_clear_putins_goal_is_to/',
  'https://www.facebook.com',
  'https://www.youtube.com',
  'https://www.twitter.com',
  'https://www.linkedin.com',
  'https://www.pinterest.com',
  'https://www.tumblr.com',
  'https://www.quora.com',
  'https://www.flickr.com',
  'https://www.github.com',
  'https://www.dribbble.com',
  'https://www.behance.net',
  'https://www.500px.com',
]
