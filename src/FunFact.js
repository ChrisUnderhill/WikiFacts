import React from "react";

class FunFact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {lower: 0, upper: 0}
        this.checkAnswer = this.checkAnswer.bind(this)
    }

    checkAnswer(){
        if (this.state.lower <= this.props.answer && this.state.upper >= this.props.answer){
            console.log("Correct")
        }
        else{
            console.log("Wrong")
        }
    }

    render() {
        return (
        <div>
            <p>
                {this.props.fact}
            </p>
            <label htmlFor={"lower"}>Enter a lower bound: </label>
            <input type={"number"} id={"lower"} value={this.state.lower} onChange={ (event) => this.setState({lower: event.target.value})}/>
            <br />
            <label htmlFor={"upper"}>Enter an upper bound: </label>
            <input type={"number"} id={"upper"} value={this.state.upper} onChange={ (event) => this.setState({upper: event.target.value})}/>
            <br />
            <button onClick={this.checkAnswer}> Check </button>
        </div>
        );
    }
}

export default FunFact