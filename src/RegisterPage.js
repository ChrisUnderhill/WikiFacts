import React from "react";
import {Link, Redirect } from "react-router-dom";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            ConfirmPassword: "",
            redirectToLogin: false,
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleConfirmPasswordChange = this.handleConfirmPasswordChange.bind(this)
        this.sendRegisterRequest = this.sendRegisterRequest.bind(this)
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    handleConfirmPasswordChange(event) {
        this.setState({ConfirmPassword: event.target.value})
    }
    
    sendRegisterRequest(){
        fetch("url", {
            method: "POST",
            body: JSON.stringify(
                {
                    username: this.state.username,
                    password: this.state.password
                })
        }).then((res) => {
            if (res.status == 200){
                alert("ERROR!!!!!!!!!!!!!!!!! " + res.status)
            } else{
                this.setState({redirectToLogin: true})
            }
        })
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
            <input type={"password"} id={"pwd"} placeholder={"Password"} onChange={this.handlePasswordChange}/>
            <br />
            <label htmlFor={"cpwd"}>Confirm Password: </label>
            <input type={"password"} id={"cpwd"} placeholder={"Password"} onChange={this.handleConfirmPasswordChange}/>
            <br />
            {this.state.password === this.state.ConfirmPassword || <p>Passwords do not match!</p>}
            <button className={"our-button"} disabled={this.state.password !== this.state.ConfirmPassword} onClick={this.sendRegisterRequest}> Register </button>
            <br />
            <p>Already have an account? <br/>
                <Link to={"/login"}>Login here</Link> </p>
        </div>;
    }
}

export default RegisterPage;