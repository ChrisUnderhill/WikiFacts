import React from "react";
import ConfidenceInterval from "./ConfidenceInterval";
import {Link} from "react-router-dom";

class Home extends React.Component {

    render() {
        return <div className="question-container">
            <h1>Welcome to Wiki Facts!</h1>
            <p>It's the best ever!!!!!!  Research has shown that people are too confident in their estimations.  Link to some research plz.</p>
            <ConfidenceInterval value={this.props.confidence} onChange={this.props.onChange}/>
            <Link to={"/play"}><button className="our-button">Let's play!</button></Link>
        </div>
    }
}

export default Home;