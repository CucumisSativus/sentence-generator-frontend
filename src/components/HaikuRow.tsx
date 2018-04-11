import * as React from 'react';
import '../domain/Haiku';
class HaikuRow extends React.Component<Haiku, {}> {
    render() {
        return (
            <div>
                <p>{this.props.firstLine}</p>
                <p>{this.props.middleLine}</p>
                <p>{this.props.lastLine}</p>
            </div>
        );
    }
}

export default HaikuRow;