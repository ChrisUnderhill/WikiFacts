import React from "react";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <h2>Hi, please log in!</h2>
            <label htmlFor={"user"}>Username: </label>
            <input type={"text"} id={"user"} value={this.state.lower} />
            <br />
            <label htmlFor={"pwd"}>Password: </label>
            <input type={"password"} id={"pwd"} value={this.state.upper} />
            <br />
            <button className={"our-button"} disabled={this.state.output} > Log In </button>
        </div>;
    }
}

