const fs = require('fs');
const puppeteer = require('puppeteer');
const { resolve } = require('path');
const { table } = require('console');

(async function() {
    try{
        let link = 'https://www.youtube.com/watch?v=hpVNMjpjiJc';
        let browser = await puppeteer.launch({      //these are launch options
            headless: false,
            defaultViewport: null,
            slowMo: 100,
            args: ["--start-maximized", '--disable-notifications', '--incognito']    //open in incognito and window maximized
        });
        let numberOfPages = await browser.pages();  //get array of open pages
        let tab = numberOfPages[0];                 //select the 1st one

        let obj = {};
        await tab.goto(link, { waitUntil: "networkidle0" });
        await tab.waitForSelector('yt-formatted-string#text[aria-label]');
        const data = await tab.$$('yt-formatted-string#text[aria-label]');
        obj.likes = await tab.evaluate(el => el.getAttribute('aria-label'), data[0]);
        obj.dislikes = await tab.evaluate(el => el.getAttribute('aria-label'), data[1]);
    
        let views = await tab.waitForSelector('.view-count.style-scope.yt-view-count-renderer');
        obj.views = await tab.evaluate(element => { return element.innerText }, views);
        //obj.views = await tab.$eval('.view-count.style-scope.yt-view-count-renderer', el => el.value);
        console.log(obj);
        
    }
    catch(err){
        console.log(err);
    }
} )();