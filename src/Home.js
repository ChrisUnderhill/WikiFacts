import React from "react";
import ConfidenceInterval from "./ConfidenceInterval";
import {Link} from "react-router-dom";

class Home extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            confidence: 90,
        }
    }

    render() {
        return <div className="question-container">
            <h1>Welcome to Wiki Facts!</h1>
            <p>It's the best ever!!!!!!</p>
            <ConfidenceInterval value={this.state.confidence} onChange={c => this.setState({confidence: c})}/>
            <Link to={"/play?c="+this.state.confidence}><button className="our-button">Let's play!</button></Link>
        </div>
    }
}

export default Home;