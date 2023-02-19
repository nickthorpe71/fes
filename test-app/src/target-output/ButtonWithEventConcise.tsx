import React, { FC, useState } from "react";
import Button1 from "./Button1";

const ButtonWithEvent = () => {
    const [hasError, setHasError] = useState(false);
    const [buttonText, setButtonText] = useState("hover me");

    const handleHover = () => {
        try {
            console.log("hovering");
            setButtonText("hovering");
        } catch (error) {
            setHasError(true);
        }
    };

    const handleLeave = () => {
        try {
            console.log("not hovering");
            setButtonText("hover me");
        } catch (error) {
            setHasError(true);
        }
    };

    const handleClick = () => {
        try {
            console.log("clicked");
            throw new Error("error");
        } catch (error) {
            console.error("error");
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
                <Button1 text={buttonText} onClick={handleClick} />
            )}
        </div>
    );
};

export default ButtonWithEvent;
