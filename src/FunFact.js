import React from "react";

class FunFact extends React.Component{
    render() {
        return (
        <div>
            <p>
                {this.props.fact}
            </p>
            <label htmlFor={"input"}>Enter a lower bound: </label>
            <input type={"text"} id={"input"}/>
            <button onClick={() => console.log("You are wrong")}> Check </button>
        </div>
        );
    }
}

export default FunFact