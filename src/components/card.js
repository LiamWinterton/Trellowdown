import React, { Component } from 'react';
import Button from "./button"

class Card extends Component {
    constructor(props) {
        super(props)

        this.state = {
            comment: ""
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
        const displayTitle = (this.props.card.boardName) ? this.props.card.boardName + " - " + this.props.card.name : this.props.card.name

        let overduelabel = false
        
        if(this.props.card.due !== null) {
            const dueDate = new Date(Date.parse(this.props.card.due))

            let difference = Math.floor((dueDate - +new Date()) / 86400000)
            let classColor = "yellow"

            if(difference < 0) {
                classColor = "red"
            } else if(difference === 0) {
                classColor = "orange"
            }

            overduelabel = <div className={"overdue " + classColor}>{Math.abs(difference)}</div>
        }

        return (
            <div className="card" key={this.props.card.id}>
                <div className="title">
                    <h3><a href={this.props.card.url} target="_blank">{displayTitle}</a></h3>
                    {overduelabel}
                </div>
                <div className="buttons">
                    <div className="actions">
                        <div className="comment">
                            <textarea value={this.state.comment} onChange={this.handleTextarea} />
                        </div>
                        <Button classes={["button", "button-secondary"]} text="Notify" click={this.handleButtonClick} />
                    </div>
                </div>
            </div>
        )
    }
}

export default Card;