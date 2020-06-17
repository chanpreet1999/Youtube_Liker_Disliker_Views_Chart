const fs = require('fs');
const puppeteer = require('puppeteer');
const { table } = require('console');
let link = process.argv[2];
let  allData = [];

//https://www.youtube.com/channel/UCOhHO2ICt0ti9KAh-QHvttQ
//https://www.youtube.com/channel/UCRAmlxaK4Chru5gbTzxbHug

(async function () {
    try {
        let allPro = [];
        let href = [];
        //start browser
        let browser = await puppeteer.launch({      //these are launch options
            headless: false,
            defaultViewport: null,
            slowMo: 100,
            args: ["--start-maximized", '--disable-notifications', '--incognito']    //open in incognito and window maximized
        });
        let numberOfPages = await browser.pages();  //get array of open pages
        let tab = numberOfPages[0];                 //select the 1st one

        await tab.goto(`${link}/videos`, { waitUntil: "networkidle0" , timeout : 45 * 1000});

        const vidList = await tab.$$('#contents .style-scope.ytd-section-list-renderer a#video-title');

        for (let ele of vidList) {
            let curHref = await tab.evaluate(el => el.getAttribute("href"), ele);
            let curLink = 'https://www.youtube.com' + curHref;
            href.push(curLink);
        }

        await handleSingleVid(browser, href[0]);
        console.log('called resolve');
        
        console.log(allData);
        
        // let willHandleOneVid = await handleSingleVid(browser, tab, curLink);
        // allPro.push(willHandleOneVid);
        // let completeArr = await Promise.all(allPro);
        // console.table(completeArr);

    } catch (err) {
        console.log(err);
    }
})();

async function handleSingleVid(browser, link) {
    return new Promise(async function (resolve, reject) {
        
        let tab = await browser.newPage()
        let obj = {};
        
        await tab.goto(link, { waitUntil: "networkidle0" });
        
        await tab.waitForSelector('yt-formatted-string#text[aria-label]');
        const data = await tab.$$('yt-formatted-string#text[aria-label]');
        obj.likes = await tab.evaluate(el => el.getAttribute('aria-label'), data[0]);
        obj.dislikes = await tab.evaluate(el => el.getAttribute('aria-label'), data[1]);
        let views = await tab.waitForSelector('.view-count.style-scope.yt-view-count-renderer');
        obj.views = await tab.evaluate(element => { return element.innerText }, views);
        
        allData.push(obj);
        
        await tab.close();
        resolve();
    })
}