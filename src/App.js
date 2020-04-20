import React from 'react';
import logo from './logo.svg';
import './App.css';
import {findFact} from "./WikiScraper";
import FunFact from "./FunFact";

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {fact: "My horse is amazing"}
    }

    updateFact(promise){
        promise.then( (res) => {
            let sentence = res[0]
            console.log(res[1])
            sentence = sentence.replace(res[1][0], "____")
            this.setState({fact: sentence})
        })
    }

    render() {
        return (
            <div className="App">
                <button onClick={() => this.updateFact(findFact())}  >
                    i am some text
                </button>
                <FunFact fact={this.state.fact}/>
            </div>
        );
    }
}
export default App;
