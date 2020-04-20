import { parse } from 'node-html-parser';

const endpointHtml = "https://en.wikipedia.org/api/rest_v1/page/html/"
const endpointSummary = "https://en.wikipedia.org/api/rest_v1/page/summary/"

function getPage(page){
    console.log(endpointHtml + page)
    return fetch(endpointHtml + page)
        .then( (res) => res.text() )
}

function getSummary(page){
    console.log(endpointSummary + page)
    return fetch(endpointSummary + page)
        .then( (res) => res.json() )
}

function findLinks(html){
    const root = parse(html)
    return root.querySelectorAll("h3").map(x => x.id)
}

function findFact(){
    return getPage(pickRandomDate())
        .then( (html) => getSummary(choose(findLinks(html))))
        .then( (json) => {
            let s = json.extract
            s = s.replace(/\[.*\]/, "")
            let m
            let regex = /[0-9]+/g
            do {
                m = regex.exec(s);
                if (m) {
                    if (s.search("<") === -1) {
                        return [s, m]
                    }
                }
            } while (m);

        })
}

function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function pickRandomDate(){
    let month = choose(["January", "February", "March", "April"])
    let year = choose(["2019", "2018", "2017"])
    return "Wikipedia:Featured_article_candidates%2FFeatured_log%2F" + month + "_" + year
}

export {findFact}
