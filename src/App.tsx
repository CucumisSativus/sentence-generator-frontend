import * as React from 'react';
import './App.css';
import './domain/GenerateHaikuParams.ts';
import './domain/Haiku';
import './components/GenerateHaikuForm';
import HaikuApi from './api/HaikuApi';
import HaikuRow from './components/HaikuRow';
import GenerateHaikuForm from './components/GenerateHaikuForm';
import CurrentHaikuRow from './components/CurrentHaikuRow';
import * as _ from 'lodash';
import { Maybe } from 'tsmonad';
import { Container, Row, Col, Navbar, NavbarBrand, Card, CardBody, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// import PrintProvider, { Print, NoPrint } from 'react-easy-print';

interface ApplicationState {
  newestHaiku: Maybe<Haiku>;
  generatedHaikus: Array<Haiku>;
}

class App extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);
    this.state = { generatedHaikus: [], newestHaiku: Maybe.nothing<Haiku>() };
  }
  generateSentences(params: GenerateHaikuParams): void {
    HaikuApi.generateHaiku(params).then(haiku => {
      this.state.newestHaiku.map(currentHaiku => {
        this.addToOldHaiku(currentHaiku);
      });

      this.setState({ newestHaiku: Maybe.just(haiku) });
    });
  }

  addToOldHaiku(haiku: Haiku): void {
    this.setState(prevState => ({
      generatedHaikus: [...prevState.generatedHaikus, haiku]
    }));
  }

  renderHaikuLines() {
    let haikuLines = _.chunk(this.state.generatedHaikus, 3);
    let toRender = haikuLines.map(haikuLine => {
      let line = haikuLine.map(haiku => {
        return (
          <Col key={haiku.id} md={4}>
            <Card>
              <CardBody>
                <HaikuRow
                  id={haiku.id}
                  firstLine={haiku.firstLine}
                  middleLine={haiku.middleLine}
                  lastLine={haiku.lastLine}
                />
              </CardBody>
            </Card>
          </Col>

        );
      });
      let lineId = haikuLine.map(l => { return l.id; }).toString();
      return (
        <div key={lineId}>
          < div className="row align-items-center">
            {line}
          </div>
          <div className="row-spacer" />
        </div >
      );
    });

    return toRender;
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
                <NavbarBrand>
                  Generator Haiku
          </NavbarBrand>
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
              <Row>
                <Col>
                  {this.renderHaikuLines()}
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
