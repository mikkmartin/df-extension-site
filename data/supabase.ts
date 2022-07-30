import { createClient } from '@supabase/supabase-js'
import { definitions } from 'lib/supabase-types'

export const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_KEY as string
)

export type Scrapers = Omit<definitions['scrapers'], 'selectors'> & {
  selectors: Object
}
