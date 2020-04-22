import React from 'react';
import './App.css';
import {findFact} from "./WikiScraper";
import FunFact from "./FunFact";
import Loading from "./Loading";

function truncate(sentence){
    return sentence.substring(0, 50) + "..."
}

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fact: "My horse is amazing",
            answer: "Yes it is",
            history: [],
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
                history: [...this.state.history, {question: res.title, answer: res.answer}]
            })
        })
    }

    saveAnswerToHistory(lower, upper, correct){
        this.setState({
            history: [...this.state.history.slice(0, this.state.history.length - 1),
                {...this.state.history[this.state.history.length - 1], lower, upper, correct}]
        })
    }

    render() {
        return (
            <div className="App">
                <center>
                <button onClick={() => {this.setState({loading: true}); this.updateFact(findFact())} } >
                    Find me a fact!
                </button>
                {this.state.loading? <Loading/> :
                <FunFact
                    fact={this.state.fact}
                    answer={this.state.answer}
                    saveAnswerToHistory={this.saveAnswerToHistory}
                />}
                <p>{JSON.stringify(this.state.history)}</p>
                </center>
            </div>
        );
    }
}
export default App;
