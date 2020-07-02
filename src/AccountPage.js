import React from "react";

class AccountPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {username: ""}

        this.getUsernameFromSession = this.getUsernameFromSession.bind(this)
    }

    getUsernameFromSession(){
        fetch("/api/session")
            .then( (res) => res.json())
            .then( (res) => {
            if (res.status !== 200){
                alert("No session found!")
            }
            else{
                this.setState({username: res.username})
            }
        })
    }

    componentDidMount() {
        this.getUsernameFromSession()
    }

    render(){
        return (<h1> Hi {this.state.username}! </h1>)
    }
}

export default AccountPage