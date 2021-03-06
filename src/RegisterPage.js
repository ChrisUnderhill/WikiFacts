import React from "react";
import {Link, Redirect } from "react-router-dom";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            confirmPassword: "",
            redirectToLogin: false,
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
        this.sendRegisterRequest = this.sendRegisterRequest.bind(this)
        this.enterListener = this.enterListener.bind(this)
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    handleConfirmPasswordChange(event) {
        this.setState({confirmPassword: event.target.value})
    }
    
    sendRegisterRequest(){
        fetch("/api/register", {
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
                this.setState({redirectToLogin: true})
            }
        })
    }
    
    enterListener (event) {
        if (event.keyCode === 13 && 
            this.state.password.length && 
            this.state.username.length && 
            this.state.confirmPassword.length &&
            this.state.password === this.state.confirmPassword
        ) {
                this.sendRegisterRequest();
        }
    }

    render() {
        if (this.state.redirectToLogin){
            return <div className="registration-successful">
                <h2>Registration successful!</h2>
                <h3><Link to={"/login"}>Click here</Link> to login</h3>
            </div>

        }
        return <div className="login-container">
            <h2>Hi, please register!</h2>
            <br />
            <label htmlFor={"user"}>Username: </label>
            <input type={"text"} id={"user"} placeholder={"Username"} onChange={this.handleUserNameChange} />
            <br />
            <label htmlFor={"pwd"}>Password: </label>
            <input type={"password"} id={"pwd"} placeholder={"Password"} onChange={this.handlePasswordChange} onKeyDown={this.enterListener}/>
            <br />
            <label htmlFor={"cpwd"}>Confirm Password: </label>
            <input type={"password"} id={"cpwd"} placeholder={"Password"} onChange={this.handleConfirmPasswordChange} onKeyDown={this.enterListener}/>
            <br />
            {this.state.password === this.state.confirmPassword || <p>Passwords do not match!</p>}
            <button className={"our-button"} disabled={this.state.password !== this.state.confirmPassword} onClick={this.sendRegisterRequest}> Register </button>
            <br />
            <p>Already have an account? <br/>
                <Link to={"/login"}>Login here</Link> </p>
        </div>;
    }
}

export default RegisterPage;