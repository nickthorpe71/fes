import React, { FC, useState, useRef, useEffect } from "react";

import Button1 from "./Button1";

const ButtonWithEvent: FC = () => {
    enum compState {
        DEFAULT,
        HOVER,
        ERROR,
    }

    const [state, setState] = useState<compState>(compState.DEFAULT);
    const isMounted = useRef<boolean>(true);
    /* prettier-ignore */ useEffect(() => () => { isMounted.current = false; }, [] );
    const setStateSafe = (newState: compState) =>
        isMounted.current ? setState(newState) : null;
};
export default ButtonWithEvent;
