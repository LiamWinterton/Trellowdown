import React, { Component } from 'react';
import Button from "./button"

class Card extends Component {
    constructor(props) {
        super(props)

        this.state = {
            comment: "",
            dueDate: (this.props.card.due !== null) ? new Date(Date.parse(this.props.card.due)) : false,
            displayTitle: (this.props.card.boardName) ? this.props.card.boardName + " - " + this.props.card.name : this.props.card.name
        }

        this.handleTextarea = this.handleTextarea.bind(this)
        this.handleButtonClick = this.handleButtonClick.bind(this)
    }

    handleTextarea(event) {
        this.setState({ comment: event.target.value });
    }

    handleButtonClick() {
        this.props.notifyButtonClick(this.props.card.id, this.props.card.idBoard, this.state.comment)
        this.setState({ comment: "" })
    }

    render() {
        // Card Title
        let title =  ""
        
        if(this.state.dueDate) {
            let difference = Math.floor((this.state.dueDate - +new Date()) / 86400000)
            let classColor = ""

            if(difference < 0) {
                classColor = "red"
            } else if(difference === 0) {
                classColor = "orange"
            } else if(difference > 0 && difference < 4) {
                classColor = "yellow"
            }

            title = (
                <div className="title">
                    <h3><a href={this.props.card.url} target="_blank">{this.state.displayTitle}</a></h3>
                    <div className={"overdue " + classColor}></div>
                </div>
            )
        } else {
            title = (
                <div className="title">
                    <h3><a href={this.props.card.url} target="_blank">{this.state.displayTitle}</a></h3>
                </div>
            )
        }
    
        // Card Info
        let moreInfo = false
    
        if(this.state.dueDate) {
            let difference = Math.floor((this.state.dueDate - +new Date()) / 86400000)
            let response
    
            if(difference < 0) {
                response = `Overdue by ${Math.abs(difference)} day(s)!`
            } else if(difference === 0) {
                response = `Due in Today`
            } else if(difference > 0) {
                response = `Due in ${Math.abs(difference)} day(s)!`
            }
    
            moreInfo = (
                <div className="more-info">
                    <ul>
                        <li>{response}</li>
                    </ul>
                </div>
            )
        }

        return (
            <div className="card" key={this.props.card.id}>
                {title}
                {moreInfo}
                <div className="buttons">
                    <div className="actions">
                        <div className="comment">
                            <textarea value={this.state.comment} onChange={this.handleTextarea} />
                        </div>
                        <Button
                            click={this.handleButtonClick}
                            classes={["button", "button-secondary"]}
                            text="Notify"
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;