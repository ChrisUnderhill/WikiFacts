import { parse } from 'node-html-parser';

const endpoint = "https://en.wikipedia.org/api/rest_v1/page/html/"

function getPage(page){
    console.log(endpoint + page)
    return fetch(endpoint + page)
        .then( (res) => res.text() )
}

function findLinks(html){
    const root = parse(html)
    return root.querySelectorAll("h3").map(x => x.id)
}

function findFact(){
    return getPage(pickRandomDate())
        .then( (html) => getPage(choose(findLinks(html))))
        .then( (html) => {
            const root = parse(html)
            const paragraphs = root.querySelectorAll("p").slice(0,5)
            // document.write(paragraphs)

            for (let i = 0; i < 5; i++ ){
                const p = paragraphs[i]
                const sentences = p.text.split(". ")

                for (let j = 0; j < sentences.length; j++){
                    let s = sentences[j]
                    s = s.replace(/\[.*\]/, "")
                    let m
                    let regex = /[0-9]+/g
                    do {
                        m = regex.exec(s);
                        if (m) {
                            return [s, m]
                        }
                    } while (m);
                }
            }
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
