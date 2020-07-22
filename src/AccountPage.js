import React from "react";

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

    render(){
        return (
            <div>
                <h1> Hi {this.state.username}! </h1>
                <p>{JSON.stringify(this.state.scores)}</p>
            </div>
        )
    }
}

export default AccountPage