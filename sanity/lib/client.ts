import { createClient } from 'next-sanity'

import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // false so SSG/ISR always pulls fresh content at (re)build time
})

// Default revalidation window (in seconds) for ISR across the site.
export const REVALIDATE = 60

type FetchParams = Record<string, unknown>

// Thin wrapper that applies our default ISR revalidation to every query.
export async function sanityFetch<T>(
  query: string,
  params: FetchParams = {},
  revalidate: number | false = REVALIDATE,
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: { revalidate },
  })
}
