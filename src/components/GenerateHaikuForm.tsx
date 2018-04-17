import * as React from 'react';
import '../domain/GenerateHaikuFormProps';
import { Button } from 'reactstrap';

class GenerateHaikuForm extends React.Component<GenerateHaikuFormProps, {}> {
    render() {
        return (
            <Button color="primary" size="lg" onClick={this.props.onSubmit} > Generuj Sztukę </Button>
        );
    }
}

export default GenerateHaikuForm;