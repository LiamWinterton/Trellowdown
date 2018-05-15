import React from 'react';

const Menu = (props) => {
    if(props.boards !== undefined && props.showNavigationMenu !== "false") {
        const boards = props.boards.map(board => {
            const link = (board.id === null) ? "#trellowdown" : `#${board.id}`

            return (
                <div className="menu-item" key={board.name}>
                    <a href={link}>{board.name}</a>
                </div>
            )
        })

        return (
            <div className="trellowdown-menu">
                {boards}
            </div>
        )
    } else {
        return false
    }
}

export default Menu;