import React from "react";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div>
            <h2>Hi, please log in!</h2>
            <label htmlFor={"user"}>Username: </label>
            <input type={"text"} id={"user"} value={"username"} />
            <br />
            <label htmlFor={"pwd"}>Password: </label>
            <input type={"password"} id={"pwd"} value={"password"} />
            <br />
            <button className={"our-button"} > Log In </button>
        </div>;
    }
}

export default LoginPage;