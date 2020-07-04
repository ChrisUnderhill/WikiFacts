import React from 'react';
import {Route, Router, Switch} from "react-router";
import cumulativeBinomialProbability from "binomial-probability"
import { createBrowserHistory } from "history";

import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

import Home from "./Home";
import FunFact from "./FunFact";
import Loading from "./Loading";
import HistoryElement from "./HistoryElement";
import Header from "./Header";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import AccountPage from "./AccountPage";

import {findFact} from "./WikiScraper";

import tip from "./tip.png";


const history = createBrowserHistory();

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
            loading: false,
            confidence: 90,
            username: "",
        }
        this.saveAnswerToHistory = this.saveAnswerToHistory.bind(this);
        this.getPValue = this.getPValue.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
    }

    componentDidMount() {
        this.updateUsername(fetch("/api/session")
            .then( (res) => {
                if (res.status !== 200){
                    console.log("No session found!")
                }
                else{
                    res.json().then( (res) => {
                        this.setState({username: res.username})
                    })
                }
            }))
    }

    updateFact(promise) {
        promise.then((res) => {
            if (res === undefined) {
                this.updateFact(findFact())
                return
            }
            let sentence = res.question
            sentence = sentence.replace(res.answer, "____")
            this.setState({
                loading: false,
                fact: sentence,
                answer: parseFloat(res.answer.replace(",", "")),
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

    getScore(){
        return this.state.history.reduce( (a,b) => a + b.correct, 0 )
    }

    getPValue(confidence, score, n_trials){
        let expected = confidence * n_trials / 100;
        if (expected < score) {
            return cumulativeBinomialProbability(n_trials, score, confidence / 100);
        } else {
            return cumulativeBinomialProbability(n_trials, n_trials - score, 1- (confidence / 100));
        }
    }

    updateUsername(username){
        this.setState({username: username})
    }

    render() {
        return (
            <ThemeProvider theme={theme} >
                <div>
                    <Router history={history} >
                        <Header username={this.state.username}/>
                        <Switch>
                            <Route exact path={"/"}>
                                <div className="App">
                                    <Home confidence={this.state.confidence} onChange={c => this.setState({confidence: c})}/>
                                </div>
                            </Route>
                            <Route exact path={"/account"}>
                                <div className="App">
                                    <AccountPage />
                                </div>
                            </Route>
                            <Route exact path={"/play"}>
                                <div className="App">
                                    <div className="quiz">
                                        <div className="question-container">
                                            <button className={"our-button"}
                                                    disabled={this.state.loading}
                                                    onClick={() => {this.setState({loading: true}); this.updateFact(findFact())} } >
                                                Find me a fact!
                                            </button>
                                            {this.state.loading? <Loading/> :
                                                <FunFact
                                                    fact={this.state.fact}
                                                    answer={this.state.answer}
                                                    saveAnswerToHistory={this.saveAnswerToHistory}
                                                />
                                            }
                                        </div>
                                    </div>
                                    <div className="history">
                                        <h2>Confidence: {this.state.confidence}%</h2>
                                        <h2 className={"score"}>Score: {this.getScore()}/{this.state.history.length}</h2>
                                        <div className="p-container">
                                            <p className="p-text"><em>p</em>-value:&nbsp;
                                                {this.getPValue(this.state.confidence, this.getScore(), this.state.history.length).toFixed(3)}</p>
                                            <img src={tip} className="hover-trigger"/>
                                            <div className="hover-tip">
                                                <p>A <em>p</em>-value tells you the probability of getting a score at least this extreme</p>
                                            </div>
                                        </div>
                                        {this.state.history.map(x => HistoryElement({...x, key: x.question + JSON.stringify(x.correct)}))}
                                    </div>
                                </div>
                            </Route>
                            <Route exact path={"/login"}>
                                <LoginPage updateUsername={this.updateUsername}/>
                            </Route>
                            <Route exact path={"/register"}>
                                <RegisterPage />
                            </Route>
                            <Route path={"/*"} status={404}>
                                <center><h2>Congratulations on finding our 404 page!</h2></center>
                            </Route>
                        </Switch>
                    </Router>
                </div>
            </ThemeProvider>
        );
    }
}
export default App;
