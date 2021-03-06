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

import {findFact, findCachedFact} from "./WikiScraper";

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
        this.updateUsername = this.updateUsername.bind(this);
        this.setConfidence = this.setConfidence.bind(this);
    }

    componentDidMount() {
        fetch("/api/session")
            .then( (response) => {
                if (response.status !== 200){
                    console.log("No session found!")
                }
                else{
                    response.json().then( (json) => {
                        console.log("json is", json)
                        if (json.username){
                            this.setState({username: json.username})
                        }
                    }).catch((err) => {
                        this.setState({username: ""})
                    })
                }
            }).catch(() => this.setState({username: ""}))
    }

    updateFact(promise) {
        promise.then((res) => {
            if (res === undefined) {
                this.updateFact(findCachedFact())
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
        if (this.state.username){
            fetch("/api/score", {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify({
                    correct: correct,
                    confidence: this.state.confidence
                })
            }).then(res => {
                if (res.status !== 200){
                    console.log("aaaaaaaa could not save")
                }
            })
        }
    }

    getScore(){
        return this.state.history.reduce( (a,b) => a + b.correct, 0 )
    }

    static getPValue(confidence, score, n_trials){
        let expected = confidence * n_trials / 100;
        if (expected < score) {
            return cumulativeBinomialProbability(n_trials, score, confidence / 100);
        } else {
            return cumulativeBinomialProbability(n_trials, n_trials - score, 1- (confidence / 100));
        }
    }

    static getPvaluePoints(confidence, score, n_trials){
        if (n_trials === 0){
            return 0;
        }
        let expected = Math.round(confidence * n_trials / 100);
        return Math.floor( 100 * App.getPValue(confidence, score, n_trials) / App.getPValue(confidence, expected, n_trials));
    }

    static getBetaDistributionPoints(confidence, score, n_trials){
        let confidencePercent = confidence/100;
        const alpha = 8;
        const beta = (alpha-1)/confidencePercent - alpha +2; //calculate beta such that our Beta distribution is maximal at the correct confidence.
        console.log("beta = " + beta);
        const normalisation = Math.pow(confidencePercent, alpha-1) * Math.pow(1 - confidencePercent, beta-1);
        console.log("normalisation = " + normalisation);
        if (n_trials === 0){
            return 0;
        }
        let userPercentage = score / n_trials;
        let points = Math.pow(userPercentage, alpha-1) * Math.pow(1 - userPercentage, beta-1);

        console.log("confidencePercent = ", confidencePercent)
        console.log("userPercent = ", userPercentage)
        console.log("points = " + points)
        return (points / normalisation * 100).toFixed(1);
    }

    updateUsername(username){
        this.setState({username: username})
    }

    setConfidence(confidence){
        this.setState({
            confidence,
            question: undefined,
            history: [],
        });
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
                                    <Home confidence={this.state.confidence} onChange={c => this.setConfidence(c)}/>
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
                                                    onClick={() => {this.setState({loading: true}); this.updateFact(findCachedFact())} } >
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
                                        <p className="p-text no-margin"><b>Points: {App.getBetaDistributionPoints(this.state.confidence, this.getScore(), this.state.history.length)}</b></p>
                                        <div className="p-container">
                                            <p className="p-text"><em>p</em>-value:&nbsp;
                                                {App.getPValue(this.state.confidence, this.getScore(), this.state.history.length).toFixed(3)}</p>
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
