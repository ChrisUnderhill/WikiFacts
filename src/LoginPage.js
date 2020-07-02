import React from "react";
import {Link} from "react-router-dom";
import {Redirect} from "react-router";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            redirectToHome: false,
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.sendLoginRequest     = this.sendLoginRequest.bind(this)
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    sendLoginRequest(){
        fetch("/api/login", {
            headers: {
                "Content-Type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(
                {
                    username: this.state.username,
                    password: this.state.password
                })
        }).then((res) => {
            if (res.status !== 200){
                alert("ERROR!!!!!!!!!!!!!!!!! " + res.status)
            } else{
                this.props.updateUsername(this.state.username)
                this.setState({redirectToHome: true})
            }
        })
    }

    render() {
        if (this.state.redirectToHome){
            return <Redirect to={"/"} />
        }
        return <div className="login-container">
            <h2>Hi, please log in!</h2>
            <br />
            <label htmlFor={"user"}>Username: </label>
            <input type={"text"} id={"user"} placeholder={"Username"} onChange={this.handleUserNameChange} />
            <br />
            <label htmlFor={"pwd"}>Password: </label>
            <input type={"password"} id={"pwd"} placeholder={"Password"} onChange={this.handlePasswordChange}/>
            <br />
            <button className={"our-button"} onClick={this.sendLoginRequest}> Log In </button>
            <br />
            <p>Don't have an account yet? <Link to={"/register"}>Register here</Link> </p>
        </div>;
    }
}

export default LoginPage;