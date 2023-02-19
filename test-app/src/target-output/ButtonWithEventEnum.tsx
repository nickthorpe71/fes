import React, { FC, useState } from "react";
import Button1 from "./Button1";

enum states {
    DEFAULT,
    HOVER,
    ERROR,
}

const ButtonWithEvent = () => {
    const [state, setState] = useState(states.DEFAULT);

    const handleHover = () => {
        try {
            console.log("hovering");
            setState(states.HOVER);
        } catch (error) {
            setState(states.ERROR);
        }
    };

    const handleLeave = () => {
        try {
            console.log("not hovering");
            setState(states.DEFAULT);
        } catch (error) {
            setState(states.ERROR);
        }
    };

    const handleClick = () => {
        try {
            console.log("clicked");
            throw new Error("error");
        } catch (error) {
            setState(states.ERROR);
            console.error("error");
        }
    };

    const renderStates = () => {
        switch (state) {
            case states.ERROR:
                return (
                    <div className='text-red-400'>
                        This button is broken, please refresh.
                    </div>
                );
            case states.HOVER:
                return <Button1 text={"hovering"} onClick={handleClick} />;
            default:
                return <Button1 text={"hover me"} />;
        }
    };

    return (
        <div
            onMouseOver={() => handleHover()}
            onMouseLeave={() => handleLeave()}
        >
            {renderStates()}
        </div>
    );
};

export default ButtonWithEvent;
