import * as React from 'react';
import '../domain/Haiku';
class CurrentHaikuRow extends React.Component<Haiku, {}> {
    render() {
        return (
            <div>
                <h1 className="display-3">{this.props.firstLine}</h1>
                <h1 className="display-3">{this.props.middleLine}</h1>
                <h1 className="display-3">{this.props.lastLine}</h1>
            </div>
        );
    }
}

export default CurrentHaikuRow;