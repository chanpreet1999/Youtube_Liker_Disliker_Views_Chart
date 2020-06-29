const fs = require('fs');
const puppeteer = require('puppeteer');
const { table } = require('console');
const QuickChart = require('quickchart-js');

let link = process.argv[2];
let allData = [];
let href = [];
//https://www.youtube.com/channel/UCOhHO2ICt0ti9KAh-QHvttQ
//https://www.youtube.com/channel/UCRAmlxaK4Chru5gbTzxbHug

(async function () {
    try {
        //start browser
        let browser = await puppeteer.launch({      //these are launch options
            headless: false,
            defaultViewport: null,
            slowMo: 100,
            args: ["--start-maximized", '--disable-notifications', '--incognito']    //open in incognito and window maximized
        });
        let numberOfPages = await browser.pages();  //get array of open pages
        let tab = numberOfPages[0];                 //select the 1st one

        await tab.goto(`${link}/videos`, { waitUntil: "networkidle0", timeout: 45 * 1000 });

        const vidList = await tab.$$('#contents .style-scope.ytd-section-list-renderer a#video-title');
        for (let ele of vidList) {
            let curHref = await tab.evaluate(el => el.getAttribute("href"), ele);
            let curLink = 'https://www.youtube.com' + curHref;
            href.push(curLink);
        }

        let idx = 0;
        while (idx < href.length) {
            await limitTabs(browser, idx, idx + 10);
            idx += 10;
        }
        allData.sort((a, b) => (a.order > b.order) ? 1 : -1)
        console.table(allData);
        await seperateData(tab);

    } catch (err) {
        console.log(err);
    }
})();

async function limitTabs(browser, start, end) {
    let limitP = [];
    for (let i = start; i < href.length && i < end ; i++) {
        let singlePage = handleSingleVid(browser, href[i], i);
        limitP.push(singlePage);
    }
    await Promise.all(limitP);
}

async function handleSingleVid(browser, link, order) {
    return new Promise(async function (resolve, reject) {

        let tab = await browser.newPage()
        let obj = {};

        await tab.goto(link, { waitUntil: "networkidle0", timeout: 60 * 1000 });

        await tab.waitForSelector('yt-formatted-string#text[aria-label]');
        const data = await tab.$$('yt-formatted-string#text[aria-label]');

        let likes = await tab.evaluate(el => el.getAttribute('aria-label'), data[0]);
        obj.likes = await convert(likes);

        let dislikes = await tab.evaluate(el => el.getAttribute('aria-label'), data[1]);
        obj.dislikes = await convert(dislikes);

        let views = await tab.waitForSelector('.view-count.style-scope.yt-view-count-renderer'); //element
        views = await tab.evaluate(element => { return element.innerText }, views); //inntertext
        obj.views = await convert(views);


        let vidTitle = await tab.waitForSelector('h1 yt-formatted-string.ytd-video-primary-info-renderer');
        vidTitle = await tab.evaluate(element => { return element.innerText }, vidTitle); //inntertext 
        obj.title = await trimToLimit(vidTitle);

        obj.order = order;

        allData.push(obj);

        await tab.close();
        resolve();
    })
}

async function convert(str) {
    let arr = str.split(" ", 1)[0].split(",");
    let ans = "";
    for (let i = 0; i < arr.length; i++) {
        ans = ans + arr[i];
    }
    return ans - '0'; //converting to no
}

async function trimToLimit(str) {
    return str.replace(/^(.{20}[^\s]*).*/, "$1");   //to 20 characters
}

async function seperateData(tab) {
    let likes = [];
    let dislikes = [];
    let views = [];
    let title = [];
    for (let i = 0; i < allData.length; i++) {
        likes.push(allData[i].likes);
        dislikes.push(allData[i].dislikes);
        views.push(allData[i].views);
        title.push(allData[i].title);
    }
    await makeChart(tab, likes, dislikes, views, title);
}

async function makeChart(tab, likes, dislikes, views, title) {
    const myChart = new QuickChart();
    myChart.setConfig({
        type: 'line',
        data: {
            labels: title,
            datasets: [
                { label: 'Likes', data: likes, fill: false, borderColor: 'green' },
                { label: 'Disikes', data: dislikes, fill: false, borderColor: 'red' },
                { label: 'Views', data: views, fill: false, borderColor: 'blue' },
            ]
        }
    });
    let url = await myChart.getShortUrl();
    
    await tab.goto(url, {waitUntil:  "networkidle0"});
}