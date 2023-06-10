
import reducer from "./reducer.js";

export default function logger() {
    return (prevState, action, args) => {
        console.group(action);
        console.log('preState :', prevState)
        console.log('Action arguments :', args);
        const nextState = reducer(prevState, action, args);
        console.log('nextState :', nextState);
        console.groupEnd();
        return nextState
    }
}