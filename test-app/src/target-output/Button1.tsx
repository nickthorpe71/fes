import React, { FC } from "react";

interface Button1Props {
    text: string;
    onClick?: () => void;
}

const Button1: FC<Button1Props> = ({ text, onClick }) => {
    return (
        <button
            className={`py-2 px-4 rounded bg-slate-500 text-white hover:bg-white hover:text-slate-500`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

export default Button1;
