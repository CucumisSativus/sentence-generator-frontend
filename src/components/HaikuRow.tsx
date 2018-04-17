import * as React from 'react';
import '../domain/Haiku';
class HaikuRow extends React.Component<Haiku, {}> {
    render() {
        return (
            <div>
                <h4>{this.props.firstLine}</h4>
                <h4>{this.props.middleLine}</h4>
                <h4>{this.props.lastLine}</h4>
            </div>
        );
    }
}

export default HaikuRow;