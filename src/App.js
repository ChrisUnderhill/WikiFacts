import React from 'react';
import logo from './logo.svg';
import './App.css';
import {findFact} from "./WikiScraper";
import FunFact from "./FunFact";

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {fact: "My horse is amazing", answer: "Yes it is"}
    }

    updateFact(promise){
        promise.then( (res) => {
            if (res == undefined){
                this.updateFact(findFact())
                return
            }
            let sentence = res[0]
            console.log(res[1])
            sentence = sentence.replace(res[1][0], "____")
            this.setState({fact: sentence, answer: parseInt(res[1][0])})
        })
    }

    render() {
        return (
            <div className="App">
                <button onClick={() => this.updateFact(findFact())}  >
                    Find me a fact!
                </button>
                <FunFact fact={this.state.fact} answer={this.state.answer}/>
            </div>
        );
    }
}
export default App;
