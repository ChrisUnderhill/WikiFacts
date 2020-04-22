import React from "react";

function HistoryElement(props){
    return (<div className="history-container" key={props.key}>
        <h2 className="history-mark">{(
            props.correct ? <span style={{"color": "green"}}>&#10004;</span> :
                props.correct === undefined ? <span style={{"color": "grey", "font-weight": "bolder"}}>&#9675;</span> :
                    <span style={{"color":"red"}}>&#10008;</span>)}</h2>
        <h3 className="history-text">{props.question}</h3>
    </div>)
}

export default HistoryElement;