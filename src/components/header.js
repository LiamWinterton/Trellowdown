import React from 'react';
import QuickAdd from "./quickAdd";
import Menu from './menu'
import Options from '../containers/Options'

import logo from "../assets/logo.png"

const Header = props => {
    const memberOptions = (props.isSuperUser) ? props.members : false

    return (
        <header>
            <div className="container">
                <div id="logo">
                    <img src={logo} alt="logo" />
                </div>
                <QuickAdd
                    boards={props.boards}
                    members={props.members}
                    showQuickAdd={props.showQuickAdd} />
                <Options
                    options={props.options}
                    members={memberOptions}
                    handleOptionChange={props.handleOptionChange}
                    handleUserChange={props.handleUserChange} />
                <Menu boards={props.boards} showNavigationMenu={props.showNavigationMenu} />
            </div>
        </header>
    )
}

export default Header;