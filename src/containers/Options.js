import React, { PureComponent } from 'react';
import Input from '../components/input'

class Options extends PureComponent {
    constructor(props) {
        super(props)

        this.state = { active: false }

        this.handleMenuToggle = this.handleMenuToggle.bind(this)
    }

    handleMenuToggle() {
        this.setState({ active: !this.state.active})
    }

    render() {
        const containerClassName = (this.state.active) ? "menu-container active" : "menu-container"
        const burgerClassName = (this.state.active) ? "burger is-active" : "burger"

        const superUserMembers = (this.props.members) ? (
            <div className="member-icons">
                {this.props.members.map(member => {
                    const hasImage = member.avatarHash !== null && member.avatarHash !== "" 

                    return (
                        <label key={member.id}>
                            <input type="radio" name="superuser-members" value={member.id} className="member-icon" onChange={() => this.props.handleUserChange(member.id)} />

                            {hasImage ? (
                                <img src={member.avatarUrl + "/30.png"} alt={member.name} />
                            ) : (
                                <span>{member.initials}</span>
                            )}

                        </label>
                    )
                })}
            </div>
        ) : false

        if(this.props.options) {
            return (
                <div className={containerClassName}>
                    <div className="menu-header">
                        <div id="menu-toggle" onClick={this.handleMenuToggle}>
                            <div className={burgerClassName}></div>
                        </div>
                    </div>
                    <div className="menu">
                        <h1>Options</h1>
                        {this.props.options.map(group => {
                            return (
                                <div className="form-group" key={group.name}>
                                    <div className="form-group-title"><h3>{group.name}</h3></div>
                                    {group.options.map(option => {
                                        const value = (option.value !== null) ? option.value : option.default
                                        const classes = ["option", `option-${option.type}`]
                                        const returnValue = (value === "true") ? "false" : "true"

                                        if(value === "true") {
                                            classes.push("checked")
                                        }
   
                                        return (
                                            <div className={classes.join(" ")} key={option.slug}>
                                                <Input type={option.type} name={option.slug} value={value} />
                                                <label htmlFor={option.slug} onClick={() => this.props.handleOptionChange(option.slug, returnValue)}>{option.name}</label>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                    <div className="menu-footer">
                        <div id="olly-boards">{superUserMembers}</div>
                        <div id="extra-buttons">
                            <a className="button button-danger" onClick={() => {
                                localStorage.removeItem("trello_token")
                                window.location.reload()
                            }}>Logout</a>
                        </div>
                    </div>

                </div>
            )
        } else {
            return <div></div>
        }
    }
}

export default Options;