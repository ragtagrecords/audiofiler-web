import * as React from 'react';

interface PlayButtonProps {
    clickHandler: any,
    index: number
}

// doesnt do anything, simply a placeholder
interface PlayButtonState {
    foo: null
}

export class PlayButton extends React.Component<PlayButtonProps, PlayButtonState>  {

    constructor(props:PlayButtonProps) {
        super(props);
        this.state = {
            foo: null
        }
    }
    render() {
        return (
            <button onClick={() => this.props.clickHandler(this.props.index)}>Play</button>
        );
    }
    
}