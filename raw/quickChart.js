const puppeteer = require('puppeteer');
const axios = require('axios')
const QuickChart = require('quickchart-js');

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

        let likes = [];
        let dislikes = [];
        let views = [];
        let title = [];
        let allData = [{
            likes: 213,
            dislikes: 321,
            views: 1000,
            title: 'vid1',
            order: 0
        }, {
            likes: 83,
            dislikes: 30,
            views: 2100,
            title: 'vid2',
            order: 1
        }, {
            likes: 723,
            dislikes: 201,
            views: 2300,
            title: 'vid3',
            order: 2
        }];

        for (let i = 0; i < allData.length; i++) {
            likes.push(allData[i].likes);
            dislikes.push(allData[i].dislikes);
            views.push(allData[i].views);
//            title.push(`\' ${allData[i].title}\'`);
            title.push( allData[i].title );
        }

        //      let str = "https://quickchart.io/chart?c={type:'line',data:{labels:['January','February', 'March','April', 'May'], datasets:[{label:'Dogs', data: [50,60,70,180,190], fill:false,borderColor:'blue'},{label:'Cats', data:[100,200,300,400,500], fill:false,borderColor:'green'}]}}";
        //    let line = `https://quickchart.io/chart?c= {type:'line',data:{labels:[${title}], datasets:[{label:'Likes', data: [${likes}], fill:false,borderColor:'blue'},{label:'Dislikes', data:[${dislikes}], fill:false,borderColor:'green'},{label:'Views', data: [${views}], fill:false,borderColor:'red'}]}}`;
        //     console.log( line.substr(40) );

        //         let balji = "https://quickchart.io/chart?width=300&height=200&c={type:'line',data:{labels:[" + title + "],"
        //             + "datasets:[{label:'Likes',data:[" + likes + "],fill:false,borderColor:'rgb(75, 192, 192)',datalabels: {color: 'black'}}]},"
        //             + "options:{plugins:{datalabels: {display: true,anchor: 'end',align: 'start'}},scales: {yAxes: [{ticks:{reverse: false,beginAtZero:false}}]}}}"

        //     //    let url = 'https://quickchart.io/chart?bkg=white&c={type:%27bar%27,data:{labels:[2012,2013,2014,2015,2016],datasets:[{label:%27Users%27,data:[120,60,50,180,120]}]}}';
        //        await tab.goto(line, { waitUntil: "networkidle0", timeout: 45 * 1000 });

        await makeChart(likes, dislikes, views, title, tab);

    }
    catch (err) {
        console.log(err);

    }
})();

async function makeChart(likes, dislikes, views, title, tab)
{
const myChart = new QuickChart();
myChart.setConfig({
    type : 'line',
    data : { 
        labels : title,
        datasets : [
            {label:'Likes', data: likes, fill:false,borderColor:'blue'},
            {label:'Disikes', data: dislikes, fill:false,borderColor:'green'},
            {label:'Views', data: views, fill:false,borderColor:'red'},
        ] 
    }
});
let url = await myChart.getShortUrl();
await tab.goto( url );
}

async function createChart(likes, dislikes, views, title) {
    try {
        let dToSend = {
            'chart':
            {
                'type': 'line',
                'data': {
                    'labels': `[${title}]`,
                    'datasets': [
                        { 'label': 'Likes', 'data': `[${likes}]`, 'borderColor': 'blue' },
                        { 'label': 'Dislikes', 'data': `${dislikes}]`, 'borderColor': 'green' },
                        { 'label': 'Views', 'data': `[${views}]`, 'borderColor': 'red' }
                    ]
                }
            }
        }

        const config = {
            method: 'post',
            url: 'https://quickchart.io/chart/create',
            headers: { 'Content-Type': 'application/json' },
            data: dToSend + ""
        }
        const res = await axios.post('https://reqres.in/api/users', {
            name: 'Atta',
            job: 'Freelance Developer'
        });
        console.log(res.data);
    } catch (err) {
        console.error(err);
    }
};
