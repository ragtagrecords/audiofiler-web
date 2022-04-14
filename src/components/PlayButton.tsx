import * as React from 'react';

interface PlayButtonProps {
    ClickHandler: any,
    Index: number
}

// doesnt do anything, simply a placeholder
interface PlayButtonState {
    Foo: null
}

export class PlayButton extends React.Component<PlayButtonProps, PlayButtonState>  {

    constructor(props:PlayButtonProps) {
        super(props);
        this.state = {
            Foo: null
        }
    }
    render() {
        return (
            <button onClick={() => this.props.ClickHandler(this.props.Index)}>Play</button>
        );
    }
    
}