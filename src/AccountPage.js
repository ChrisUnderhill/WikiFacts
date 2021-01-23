import React from "react";
import App from "./App.js";

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            scores: [],
        }

        this.getUsernameFromSession = this.getUsernameFromSession.bind(this);
        this.getScores = this.getScores.bind(this);
    }

    getUsernameFromSession(){
        fetch("/api/session")
            .then( (res) => {
            if (res.status !== 200){
                alert("No session found!")
            }
            else{
                res.json().then( (res) => {
                    this.setState({username: res.username})
                })
            }
        })
    }

    getScores(){
        this.setState({scores: [
                {confidence: 90, correct: 75, wrong: 25}, {confidence: 50, correct: 17, wrong: 99}
            ]});
        return;
        fetch("api/scores").then(res => {
            if (res.status !== 200) {
                alert("Could not get scores");
            } else {
                res.json().then(j => this.setState({scores: j}))
            }
        })
    }

    componentDidMount() {
        this.getUsernameFromSession();
        this.getScores();
    }
z
    render(){
        return (
            <div className="welcome-container">
                <h2> Hi {this.state.username}! </h2>
                {this.state.scores.length ? (
                        <>
                            <p>This is how you're doing:</p>
                            <table className="scoreTable">
                                <thead>
                                <tr>
                                    <th>Confidence</th>
                                    <th>Correct</th>
                                    <th>Wrong</th>
                                    <th>Percentage</th>
                                    <th>Points</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.scores.map((row, index) => {
                                    return (
                                        <tr key={"row" + row.confidence} className={index % 2 ? "even" : "odd"}>
                                            <td>{row.confidence}%</td>
                                            <td>{row.correct}</td>
                                            <td>{row.wrong}</td>
                                            <td>{(100 * row.correct / (row.correct + row.wrong)).toFixed(1)}%</td>
                                            <td>{App.getPoints(row.confidence, row.correct, row.correct + row.wrong)}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </>
                    ) :
                    <>
                        <p>You haven't submitted any questions yet</p>
                        <p>Get started <a href="/play">here</a></p>
                    </>
                }
            </div>
        )
    }
}

export default AccountPage