import React from 'react'

const Button = props => {
    return (
        <a onClick={props.click} className={props.classes.join(" ")}>{props.text}</a>
    )
}

export default Button