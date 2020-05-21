import React from "react";
import {Link} from "react-router-dom";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }

        this.handleUserNameChange = this.handleUserNameChange.bind(this)
        this.handlePasswordChange = this.handlePasswordChange.bind(this)
    }

    handleUserNameChange(event) {
        this.setState({username: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    render() {
        return <div className="login-container">
            <h2>Hi, please log in!</h2>
            <br />
            <label htmlFor={"user"}>Username: </label>
            <input type={"text"} id={"user"} placeholder={"Username"} onChange={this.handleUserNameChange} />
            <br />
            <label htmlFor={"pwd"}>Password: </label>
            <input type={"password"} id={"pwd"} placeholder={"Password"} onChange={this.handlePasswordChange}/>
            <br />
            <button className={"our-button"} onClick={() => alert("YOU ARE THE 1,000,000 VISITOR TO THIS PAGE")}> Log In </button>
            <br />
            <p>Don't have an account yet? <Link to={"/register"}>Register here</Link> </p>
        </div>;
    }
}

export default LoginPage;