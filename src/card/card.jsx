import React, {Component} from "react";
import './card.css';


class Card extends Component {
    render(){
        return(
            <div className="card-container">
                    {this.props.children[0]  || this.props.children[1]?  
                        <div className="cardUpdate"> 
                            <form className="update-form">
                                <ul>
                                <li className="form-li">                                
                                    <label  className="input-label">Question</label>
                                    <textarea  className="card-input"
                                            type="text"
                                            name="question"
                                            value={this.props.question}
                                            onChange={this.props.recordChange}/>
                                </li>
                                <li className="form-li">
                                    <label      className="input-label">Answer</label>
                                    <textarea   className="card-input"
                                                type="text"
                                                name="answer"
                                                value={this.props.answer}
                                                onChange={this.props.recordChange}/>
                                </li>
                                <li className="form-li">
                                    <label  className="input-label">Source</label>
                                    <textarea  className="card-input"
                                            type="text"
                                            name="source"
                                            value={this.props.source}
                                            onChange={this.props.recordChange}/>
                                    </li>
                                <li className="form-li">
                                    <button onClick={this.props.onClick}>Submit</button>    
                                </li>
                                </ul>
                            </form>
                        </div>        
                        :
                            <div className="card">
                                <div className="front">
                                    <div className="question">{this.props.question}</div>
                                </div>
                                <div className="back">
                                    <div className="answer">{this.props.answer}</div>
                                    <a href={this.props.source} className="source">Source</a>
                                </div>
                            </div>
                    }      
            </div>
        );
    }
}
export default Card;