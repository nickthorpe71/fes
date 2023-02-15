"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Button = ({ text, onClick }) => {
    const [style, setStyle] = react_1.default.useState("bg-white text-slate-500");
    return (<button className={`py-2 px-4 rounded ${style}`} onClick={onClick} onMouseOver={() => setStyle("bg-slate-500 text-white")} onMouseLeave={() => setStyle("bg-white text-slate-500")}>
            {text}
        </button>);
};
const ButtonWithEvent = () => {
    const [text, setText] = react_1.default.useState("hover me");
    const [onClickText, setOnClickText] = react_1.default.useState("clicked not hovering");
    const [hasError, setHasError] = react_1.default.useState(false);
    const handleHover = () => {
        try {
            setText("hovering");
            setOnClickText("clicked hovering");
        }
        catch (error) {
            setHasError(true);
        }
    };
    const handleLeave = () => {
        try {
            setText("hover me");
            setOnClickText("clicked not hovering");
        }
        catch (error) {
            setHasError(true);
        }
    };
    const handleClick = () => {
        try {
            console.log(onClickText);
            throw new Error("error");
        }
        catch (error) {
            setHasError(true);
        }
    };
    return (<div onMouseOver={() => handleHover()} onMouseLeave={() => handleLeave()}>
            {hasError ? (<div className='text-red-400'>
                    This button is broken, please refresh.
                </div>) : (<Button text={text} onClick={handleClick}/>)}
        </div>);
};
exports.default = ButtonWithEvent;
//# sourceMappingURL=Button.js.map