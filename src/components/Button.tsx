import React from 'react';

type ButtonPropsType = {
    title:string
    onClick?: () => void
    disabled?:boolean
}

export const Button = ({title,onClick,disabled}:ButtonPropsType) => {
    return (
        <button disabled={disabled} onClick={onClick}>{title}</button>
    );
};
