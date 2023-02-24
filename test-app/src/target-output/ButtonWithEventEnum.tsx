import React, { FC, useState, useRef, useEffect } from "react";
import Button1 from "./Button1";

const ButtonWithEvent = () => {
    enum states {
        DEFAULT,
        HOVER,
        ERROR,
    }
    const [state, setState] = useState<states>(states.DEFAULT);
    const isMounted = useRef<boolean>(true);
    /* prettier-ignore */ useEffect(() => () => { isMounted.current = false; }, [] );
    const setStateIfRendered = (newState: states) =>
        isMounted.current ? setState(newState) : null;

    const handleHover = () => {
        try {
            setStateIfRendered(states.HOVER);
        } catch (error) {
            setStateIfRendered(states.ERROR);
        }
    };

    const handleLeave = () => {
        try {
            setStateIfRendered(states.DEFAULT);
        } catch (error) {
            setStateIfRendered(states.ERROR);
        }
    };

    const handleClick = () => {
        try {
            throw new Error("error");
        } catch (error) {
            setStateIfRendered(states.ERROR);
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
