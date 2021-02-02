import React, { Component } from "react";
import './crudbutton.css';


class CRUDButton extends Component{

    render(props) {
        return(
            <div className="buttonContainer">
                <button className="btn" onClick={this.props.children === "Update" ? 
                                                    this.props.updateCard : this.props.children === "Create" ? 
                                                    this.props.createCard : this.props.children === "Draw" ?
                                                    this.props.drawCard : this.props.deleteCard }>{this.props.children}</button>
            </div>
        )
    }
}

export default CRUDButton;