import React from "react";

class FunFact extends React.Component{
    constructor(props) {
        super(props);
        this.state = {lower: 0, upper: 0, output: "", fact: props.fact, canCheck: false}
        this.checkAnswer = this.checkAnswer.bind(this)
        this.enterListener = this.enterListener.bind(this)
    }

    static getDerivedStateFromProps(nextProps, prevState){
        if(nextProps.fact !== prevState.fact){
            return {lower: 0, upper: 0, output: "", fact: nextProps.fact, canCheck: false};
        }
        else return null;
    }

    checkAnswer(){
        let correct = this.state.lower <= this.props.answer && this.state.upper >= this.props.answer;
        this.props.saveAnswerToHistory(this.state.lower, this.state.upper, correct)
        if (correct){
            console.log("Correct")
            this.setState({output: "Correct! Answer was " + this.props.answer, canCheck: false })
        }
        else{
            console.log("Wrong")
            this.setState({output: "Wrong! Answer was " + this.props.answer, canCheck: false})
        }
    }

    enterListener (event) {
        if (event.keyCode === 13 && this.state.canCheck) {
            this.checkAnswer();
        }
    }

    render() {
        return (
        <div>
            <p>
                {this.props.fact}
            </p>
            {(typeof this.props.answer == "undefined") || <>
                <center>
                    <table style={{"textAlign": "right"}}>
                        <tbody>
                        <tr>
                            <td>
                                <label htmlFor={"lower"}>Enter a lower bound:</label>
                            </td>
                            <td>
                                <input type={"number"} id={"lower"} value={this.state.lower} onKeyDown={this.enterListener} onChange={ (event) => this.setState({lower: event.target.value, canCheck: parseInt(event.target.value) <= this.state.upper && !this.state.output})}/>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <label htmlFor={"upper"}>Enter an upper bound:</label>
                            </td>
                            <td>
                                <input type={"number"} id={"upper"} value={this.state.upper} onKeyDown={this.enterListener} onChange={ (event) => this.setState({upper: event.target.value, canCheck: parseInt(event.target.value) >= this.state.lower && !this.state.output})}/>
                            </td>
                        </tr>
                        </tbody>
                </table>
                </center>

                <br />
                <button className={"our-button"} disabled={!this.state.canCheck} onClick={this.checkAnswer}> Check </button>
                <p>{this.state.output}</p>
            </>}
        </div>
        );
    }
}

export default FunFact