import React from 'react';
import './App.css';
import {findFact} from "./WikiScraper";
import FunFact from "./FunFact";
import Loading from "./Loading";
import HistoryElement from "./HistoryElement";
import Header from "./Header";
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    palette: {
        primary: {
            // light: will be calculated from palette.primary.main,
            main: '#30B030',
            // dark: will be calculated from palette.primary.main,
            // contrastText: will be calculated to contrast with palette.primary.main
        },
        secondary: {
            light: '#4AFFE7',
            main: '#0044ff',
            // dark: will be calculated from palette.secondary.main,
            contrastText: '#282c34',
        },
        // Used by `getContrastText()` to maximize the contrast between
        // the background and the text.
        contrastThreshold: 3,
        // Used by the functions below to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
});

class App extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            fact: "Click \"Find me a fact\" to get started",
            title: "Title",
            answer: undefined,
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
            <ThemeProvider theme={theme} >
            <div>
                <Header/>
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
            </div>
            </ThemeProvider>
        );
    }
}
export default App;
