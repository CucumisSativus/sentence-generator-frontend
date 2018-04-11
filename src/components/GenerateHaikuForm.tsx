import * as React from 'react';
import '../domain/GenerateHaikuFormProps';

class GenerateHaikuForm extends React.Component<GenerateHaikuFormProps, {}> {
    render() {
        return (
            <div>
                <button type="button" onClick={this.props.onSubmit}>Click me</button>
            </div>
        );
    }
}

export default GenerateHaikuForm;