import * as React from 'react';
import HaikuRowProps from '../domain/HaikuRowProps';

class HaikuRow extends React.Component<HaikuRowProps, {}> {

    renderHaiku() {
        let haiku = this.props.haiku;
        return (
            <div>
                {this.renderLine(haiku.firstLine)}
                {this.renderLine(haiku.middleLine)}
                {this.renderLine(haiku.lastLine)}
            </div>
        );
    }
    renderLine(line: string) {
        return (
            <p className={this.props.bootstrapSize}>{line}</p>
        );
    }

    render() {
        return (
            <div>
                {this.renderHaiku()}
            </div>
        );
    }
}

export default HaikuRow;