import React from 'react';

const Input = props => {
    const placeholder = (props.placeholder) ? props.placeholder : undefined

    return (
        <input type={props.type} name={props.name} value={props.value} onChange={props.onChange} placeholder={placeholder} />
    )
}

export default Input;