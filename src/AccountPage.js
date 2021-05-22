import React from "react";
import App from "./App.js";

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            scores: [],
            error: "You haven't submitted any answers yet",
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
        fetch("api/scores").then(res => {
            if (res.status !== 200) {
                this.setState({error: "Could not get scores"})
            } else {
                res.json().then(j => this.setState({scores: j, error: ""}))
            }
        }).catch(() => {
            this.setState({error: "Could not get scores"})
        });
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
                                            <td>{App.getPvaluePoints(row.confidence, row.correct, row.correct + row.wrong)}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </>
                    ) :
                    <>
                        <p>{this.state.error}</p>
                        <p>Get started <a href="/play">here</a></p>
                    </>
                }
            </div>
        )
    }
}

export default AccountPage