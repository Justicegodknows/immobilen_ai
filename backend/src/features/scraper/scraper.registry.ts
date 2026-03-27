import type { ScraperInterface } from './scraper.types'
import { ExampleBrowserScraper } from './scrapers/example-browser.scraper'
import { ExampleStaticScraper } from './scrapers/example-static.scraper'

// Add new scraper instances here to activate them in both the scheduler and the API.
export const scraperRegistry: ScraperInterface[] = [
  new ExampleStaticScraper(),
  new ExampleBrowserScraper(),
]
