import React from "react";

class FunFact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {lower: 0, upper: 0, output: "", fact: props.fact}
        this.checkAnswer = this.checkAnswer.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.fact !== prevState.fact){
            return {lower: 0, upper: 0, output: "", fact: nextProps.fact};
        }
        else return null;
    }

    checkAnswer(){
        let correct = this.state.lower <= this.props.answer && this.state.upper >= this.props.answer;
        this.props.saveAnswerToHistory(this.state.lower, this.state.upper, correct)
        if (correct){
            console.log("Correct")
            this.setState({output: "Correct! Answer was " + this.props.answer })
        }
        else{
            console.log("Wrong")
            this.setState({output: "Wrong! Answer was " + this.props.answer})
        }
    }

    render() {
        return (
        <div>
            <p>
                {this.props.fact}
            </p>
            <center>
            <table style={{"text-align": "right"}}>
                <tr>
                    <td>
                        <label htmlFor={"lower"}>Enter a lower bound:</label>
                    </td>
                    <td>
                        <input type={"number"} id={"lower"} value={this.state.lower} onChange={ (event) => this.setState({lower: event.target.value})}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <label htmlFor={"upper"}>Enter an upper bound:</label>
                    </td>
                    <td>
                        <input type={"number"} id={"upper"} value={this.state.upper} onChange={ (event) => this.setState({upper: event.target.value})}/>
                    </td>
                </tr>
            </table>
            </center>

            <br />
            <button className={"our-button"} disabled={this.state.output} onClick={this.checkAnswer}> Check </button>
            <p>{this.state.output}</p>
        </div>
        );
    }
}

export default FunFact