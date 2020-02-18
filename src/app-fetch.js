const client = require('./client')
const cheerio = require('cheerio')

const APP_SELECTORS = {
    title: '#Main > section.section.background-light.color-ink.section--tight.ui-app-store-hero.ui-app-store-hero--type-app-details > div > div > div > div.ui-app-store-hero__header > h2',
    description: '#Main > section.section.background-light.color-ink.section--tight.ui-app-store-hero.ui-app-store-hero--type-app-details > div > div > div > p',
    rating: '#Main > section.section.background-light.color-ink.section--tight.ui-app-store-hero.ui-app-store-hero--type-app-details > div > div > div > div.heading--4.ui-app-store-hero__ratings > div > div.ui-star-rating__text > span.ui-star-rating__rating',
    reviewCount: '#Main > section.section.background-light.color-ink.section--tight.ui-app-store-hero.ui-app-store-hero--type-app-details > div > div > div > div.heading--4.ui-app-store-hero__ratings > div > div.ui-star-rating__text > span.ui-review-count-summary > a',
    price: '#Main > section.section.background-light.color-ink.section--tight.ui-app-store-hero.ui-app-store-hero--type-app-details > div > div > div > div.heading--4.ui-app-store-hero__footer > div',
    content: '#Main > section:nth-child(2) > div > div.grid__item.grid__item--tablet-up-two-thirds.grid__item--desktop-up-6.app-listing-description > div.ui-expandable-content > div.ui-expandable-content__inner',
}



async function fetchAppInfo(url) {
    const { data } = await client.get(url)
    const $ = cheerio.load(data)
    
    let appInfo = Object
        .entries(APP_SELECTORS)
        .reduce((acc, [field, selector]) => ({...acc, [field]: $(selector).text()}),{})

    console.log(appInfo)

}

fetchAppInfo('/loox')