import React from 'react';
import './App.css';
import {findFact} from "./WikiScraper";
import FunFact from "./FunFact";
import Loading from "./Loading";
import HistoryElement from "./HistoryElement";

function truncate(sentence){
    return sentence.substring(0, 50) + "..."
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fact: "My horse is amazing",
            title: "Title",
            answer: "Yes it is",
            history: [{question: "test question fdjksl frjf ej fjlk f jdks hfjkal hfk alhfjksl fhkrsal hfarl hfu ali"}],
            loading: false
        }
        this.saveAnswerToHistory = this.saveAnswerToHistory.bind(this)
    }

    updateFact(promise){
        promise.then( (res) => {
            if (res == undefined){
                this.updateFact(findFact())
                return
            }
            let sentence = res.question
            sentence = sentence.replace(res.answer, "____")
            this.setState({
                loading: false,
                fact: sentence,
                answer: res.answer,
                title: res.title,
            })
        })
    }

    saveAnswerToHistory(lower, upper, correct){
        this.setState({
            history: [...this.state.history,
                {question: this.state.title, answer: this.state.answer, lower, upper, correct}]
        })
    }

    render() {
        return (
            <div className="App">
                <div className="quiz">
                <button
                    disabled={this.state.loading}
                    onClick={() => {this.setState({loading: true}); this.updateFact(findFact())} } >
                    Find me a fact!
                </button>
                {this.state.loading? <Loading/> :
                <FunFact
                    fact={this.state.fact}
                    answer={this.state.answer}
                    saveAnswerToHistory={this.saveAnswerToHistory}
                />}
                </div>
                <div className="history">
                {this.state.history.map(HistoryElement)}
                </div>
            </div>
        );
    }
}
export default App;
