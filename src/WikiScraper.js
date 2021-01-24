import { parse } from 'node-html-parser';
import links from "./links.js";

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
            let s = json.extract;
            if (!s){
                return;
            }
            s = s.replace(/\[.*\]/, "");
            let regex = /[0-9]+,?\.?[0-9]*/g;
            let matches = s.match(regex)
            if (matches){
                let m = choose(matches);
                return {question: s, answer: m, title: json.title}
            }
        })
}
function findCachedFact(){
    return getSummary(choose(links))
        .then( (json) => {
            let s = json.extract;
            if (!s){
                return;
            }
            s = s.replace(/\[.*\]/, "");
            let regex = /[0-9]+,?\.?[0-9]*/g;
            let matches = s.match(regex)
            if (matches){
                let m = choose(matches);
                return {question: s, answer: m, title: json.title}
            }
        })
}


function choose(choices) {
    let index = Math.floor(Math.random() * choices.length);
    return choices[index];
}

function pickRandomDate(){
    let month = choose(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])
    let year = choose(["2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005", "2004"])
    return "Wikipedia:Featured_article_candidates%2FFeatured_log%2F" + month + "_" + year
}

export {findFact, findCachedFact}
