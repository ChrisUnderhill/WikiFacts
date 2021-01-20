import React from "react";
import ConfidenceInterval from "./ConfidenceInterval";
import {Link} from "react-router-dom";

class Home extends React.Component {

    render() {
        return <div className="welcome-container">
            <h1>Welcome to WikiFacts!</h1>
            <p>Are you too confident? Don't think so? You're probably overconfident about that, take our test and you'll never believe what might happen!<br/>

                <a href="https://en.wikipedia.org/wiki/Overconfidence_effect">Research</a> has shown that people are too confident in their estimations.
                This site is inspired by <a href="http://messymatters.com/calibration/">Messy Matters</a>.  </p>

            <p>
                We'll give you a series of questions with numerical answers (in fill-the-blank style). After selecting a confidence level below (say 90%), we'll ask you to give an upper and lower bound, such that you are as confident that the true answer lies within your range as the value you have selected.
            </p>
            <ConfidenceInterval value={this.props.confidence} onChange={this.props.onChange}/>
            <Link to={"/play"}><button className="our-button">Let's play!</button></Link>
        </div>
    }
}

export default Home;