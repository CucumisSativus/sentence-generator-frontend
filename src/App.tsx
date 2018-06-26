import * as React from 'react';
import './App.css';
import './domain/GenerateHaikuParams.ts';
import './domain/Haiku';
import './components/GenerateHaikuForm';
import HaikuApi from './api/HaikuApi';
import GenerateHaikuForm from './components/GenerateHaikuForm';
import HaikuRow from './components/CurrentHaikuRow';
import { Maybe } from 'tsmonad';
import { Container, Row, Col, Navbar, NavbarBrand, Button, Card, CardBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface ApplicationState {
  newestHaiku: Maybe<Haiku>;
  generatedHaikus: Array<Haiku>;
}

class App extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);
    this.state = { generatedHaikus: [], newestHaiku: Maybe.nothing<Haiku>() };
  }

  componentWillMount() {
    HaikuApi.getHaikuList().then(haikus =>
      this.setState({ generatedHaikus: haikus })
    );
  }

  generateSentences(params: GenerateHaikuParams): void {
    HaikuApi.generateHaiku(params).then(haiku => {
      this.setState({ newestHaiku: Maybe.just(haiku) });
    });
  }

  addToOldHaiku(haiku: Haiku): void {
    this.setState(prevState => ({
      generatedHaikus: [...prevState.generatedHaikus, haiku]
    }));
  }
  saveHaiku(haiku: Haiku): void {
    HaikuApi.saveHaiku(haiku).then(h => this.addToOldHaiku(h));
  }

  onHaikuEdited(haiku: Haiku) {
    console.log(haiku);
  }

  renderCurrentHaikuRow() {
    return this.state.newestHaiku.map(haiku => {
      return (
        <HaikuRow
          key={haiku.id}
          haiku={haiku}
          onHaikuEdited={(h) => this.onHaikuEdited(h)}
          bootstrapSize="h1"
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
  renderSaveButton() {
    return this.state.newestHaiku.bind(haiku => {
      if (this.state.generatedHaikus.indexOf(haiku) > -1) {
        return Maybe.nothing<Haiku>();
      } else {
        return Maybe.just(haiku);
      }
    }).caseOf({
      just: haiku => <Button color="info" onClick={() => this.saveHaiku(haiku)}>Zapisz</Button>,
      nothing: () => <span />
    });
  }

  renderSavedHaikus() {
    let haikus = this.state.generatedHaikus.map(haiku => {
      return (
        <Card key={haiku.id}>
          <CardBody>
            <HaikuRow
              haiku={haiku}
              onHaikuEdited={(h) => this.onHaikuEdited(h)}
              bootstrapSize="h3"
            />
          </CardBody>
        </Card>
      );
    });
    return (
      <Col>
        {haikus}
      </Col>
    );
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
              <Navbar className="sticky-top">
                <NavbarBrand>W. I. X. A. Generator</NavbarBrand>
              </Navbar>
              <Row>
                <Col>
                  <div className="fixed-div">
                    <Row>
                      <Col>
                        <h1>Haiku</h1>
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {this.renderCurrentHaikuRow()}
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <GenerateHaikuForm
                          onSubmit={onSubmit}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        {this.renderPrintButton()}
                      </Col>
                      <Col>
                        {this.renderSaveButton()}
                      </Col>
                    </Row>
                  </div>
                </Col>
                <Col className="scrollable">
                  <Row>
                    <Col>
                      <h1>Baza tekstów</h1>
                    </Col>
                  </Row>
                  <Row>
                    {this.renderSavedHaikus()}
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
