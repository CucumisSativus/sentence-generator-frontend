import * as React from 'react';
import './App.css';
import './domain/GenerateHaikuParams.ts';
import './domain/Haiku';
import './components/GenerateHaikuForm';
import HaikuApi from './api/HaikuApi';
import GenerateHaikuForm from './components/GenerateHaikuForm';
import CurrentHaikuRow from './components/CurrentHaikuRow';
import { Maybe } from 'tsmonad';
import { Container, Row, Col, Navbar, NavbarBrand, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ApplicationState {
  newestHaiku: Maybe<Haiku>;
}

class App extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);
    this.state = { newestHaiku: Maybe.nothing<Haiku>() };
  }
  generateSentences(params: GenerateHaikuParams): void {
    HaikuApi.generateHaiku(params).then(haiku => {
      this.setState({ newestHaiku: Maybe.just(haiku) });
    });
  }

  renderCurrentHaikuRow() {
    return this.state.newestHaiku.map(haiku => {
      return (
        <CurrentHaikuRow
          key={haiku.id}
          id={haiku.id}
          firstLine={haiku.firstLine}
          middleLine={haiku.middleLine}
          lastLine={haiku.lastLine}
        />
      );
    }).caseOf({
      just: s => s,
      nothing: () => <p />
    });
  }

  renderPrintButton() {
    return this.state.newestHaiku.caseOf({
      just: () => <Button color="info" onClick={() => window.print()}>Drukuj</Button>,
      nothing: () => <span />
    });
  }
  render() {
    let onSubmit = (p: GenerateHaikuParams) => this.generateSentences(p);
    return (
      <div>
        <div className="example-print">
          {this.renderCurrentHaikuRow()}
        </div>
        <div className="example-screen">
          <Container fluid={true}>
            <div className="App container">
              <Navbar>
                <NavbarBrand>Generator Haiku</NavbarBrand>
              </Navbar>
              <Row>
                <Col>
                  {this.renderCurrentHaikuRow()}
                  <Row>
                    <Col>
                      <GenerateHaikuForm
                        onSubmit={onSubmit}
                      />
                    </Col>
                    <Col>
                      {this.renderPrintButton()}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Container>
        </div>
      </div>
    );
  }
}

export default App;
