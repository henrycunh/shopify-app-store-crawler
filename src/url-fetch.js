/*
    Iterates through the app store pages and fetches the
    app names and URLs
*/
const cheerio = require('cheerio') 
const Progress = require('cli-progress')
const client = require('./client')
const { createWriteStream } = require('fs')
const path = require('path')

async function fetchAppTotal() {
    const { data } = await client.get('/browse/all')
    const $ = cheerio.load(data)
    const pageTotalText = $('#Main > section:nth-child(2) > div > div.grid__item.grid__item--mobile-up-full.grid__item--desktop-up-three-quarters > div.grid.grid--bleed.grid--vertically-centered.gutter-bottom.search-filters__header.search-results__grid > div:nth-child(1)') 
    return parseInt(pageTotalText.text().match(/of (\d+) results/i)[1])
}

async function fetchPage(page) {
    try {
        const { data: response } = await client.get('/browse/all', { params: { page } })
        const $ = cheerio.load(response)
        const appCards = $('#SearchResultsListings > div > div')
        if (!appCards) return null
        const apps = appCards.map(function() {
            return {
                title: $(this).attr('title'),
                url: $(this).attr('data-target-href').match(/([^\?]+)/)[0]
            }
        }).get()
        return apps
    } catch (e) {
        console.log(e.message)
        return null
    }
}

async function fetchAll() {
    let currentPage = 1, hasNext = false
    const appsFile = createWriteStream(path.join(__dirname, '../data/apps.jsonl'))
    const bar = new Progress.SingleBar({
        format: 'Apps | {bar} | {percentage}% || {value}/{total} Apps || {eta_formatted} || {duration_formatted}',
        barCompleteChar: '\u2588',
        barIncompleteChar: '\u2591',
        hideCursor: true
    })
    const appTotal = await fetchAppTotal()
    bar.start(appTotal, 0)
    
    do {
        const apps = await fetchPage(currentPage++)
        if (apps !== null) {
            bar.increment(apps.length)
            appsFile.write(apps.map(JSON.stringify).join('\n')+'\n')
        }
        hasNext = apps !== null
    } while (hasNext)
    appsFile.close()
}


fetchAll()
