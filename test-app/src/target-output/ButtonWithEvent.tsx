import React, { FC } from "react";
import Button1 from "./Button1";

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
                <Button1 text={text} onClick={handleClick} />
            )}
        </div>
    );
};

export default ButtonWithEvent;
