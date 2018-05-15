import React, { Fragment } from 'react';
import Card from './card'

const Board = props => {
    const isPriority = props.board.id === null
    const classNames = (isPriority) ? "board break" : "board"

    const boardContent = (wrapped=false) => {
        const content = (
            <Fragment>
                <a href={props.board.url} target="_blank"><h2>{props.board.name}</h2></a>
                <div className="content">
                    {props.board.cards.map(card => {
                        return <Card card={card} key={card.id} notifyButtonClick={props.notifyButtonClick} />
                    })}
                </div>
            </Fragment>
        )
        
        if(wrapped) {
            return (
                <div className="container">
                    {content}
                </div>
            )
        } else {
            return (
                <Fragment>
                    {content}
                </Fragment>
            )
        }
    }

    return (
        <div className={classNames} key={props.board.id} id={props.board.id}>
            {boardContent(isPriority)}
        </div>
    )
}

export default Board;