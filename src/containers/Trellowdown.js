import React from 'react';
import ReactLoading from 'react-loading'
import Board from '../components/board'

const Trellowdown = (props) => {
    let content

    if(props.boards !== undefined) {
        content = (
            <div className="container">
                <div id="trellowdown" className="trellowdown">
                    {props.boards.map(board => {
                        return <Board board={board} key={board.id} notifyButtonClick={props.notifyButtonClick} />
                    })}
                </div>
            </div>
        )
    } else (
        content = (
            <div style={{ position: "fixed", width: "100%", height: "100%", top: "0", left: "0", display: "flex", justifyContent: "center", alignItems: "center" }} >
                <ReactLoading type="spin" color="#FFFFFF" />
            </div>
        )
    )

    return content
}

export default Trellowdown