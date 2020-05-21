import React from "react";
import {Link} from "react-router-dom";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            cpassword: "",
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
        this.handleCPasswordChange = this.handleCPasswordChange.bind(this)
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    handleCPasswordChange(event) {
        this.setState({cpassword: event.target.value})
    }

    render() {
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
            <input type={"password"} id={"cpwd"} placeholder={"Password"} onChange={this.handleCPasswordChange}/>
            <br />
            {this.state.password === this.state.cpassword || <p>Passwords do not match!</p>}
            <button className={"our-button"} disabled={this.state.password !== this.state.cpassword} onClick={() => alert("YOU ARE THE 1,000,001 VISITOR TO THIS PAGE")}> Register </button>
            <br />
            <p>Already have an account? <br/>
                <Link to={"/login"}>Login here</Link> </p>
        </div>;
    }
}

export default RegisterPage;