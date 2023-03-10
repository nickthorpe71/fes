import React, { FC } from "react";

interface ButtonProps {
    text: string;
    onClick?: () => void;
}

const Button: FC<ButtonProps> = ({ text, onClick }) => {
    return (
        <button
            className={`py-2 px-4 rounded bg-white text-slate-500 hover:bg-slate-500 hover:text-white`}
            onClick={onClick}
        >
            {text}
        </button>
    );
};

const ButtonWithEvent = () => {
    const [text, setText] = React.useState("hover me");
    const [onClickText, setOnClickText] = React.useState(
        "clicked not hovering"
    );
    const [hasError, setHasError] = React.useState(false);

    const handleHover = () => {
        try {
            setText("hovering");
            setOnClickText("clicked hovering");
        } catch (error) {
            setHasError(true);
        }
    };

    const handleLeave = () => {
        try {
            setText("hover me");
            setOnClickText("clicked not hovering");
        } catch (error) {
            setHasError(true);
        }
    };

    const handleClick = () => {
        try {
            console.log(onClickText);
            throw new Error("error");
        } catch (error) {
            setHasError(true);
        }
    };

    return (
        <div
            onMouseOver={() => handleHover()}
            onMouseLeave={() => handleLeave()}
        >
            {hasError ? (
                <div className='text-red-400'>
                    This button is broken, please refresh.
                </div>
            ) : (
                <Button text={text} onClick={handleClick} />
            )}
        </div>
    );
};

export default ButtonWithEvent;
