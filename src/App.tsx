import * as React from 'react';
import './App.css';
import './domain/GenerateHaikuParams.ts';
import './domain/Haiku';
import './components/GenerateHaikuForm';
import HaikuApi from './api/HaikuApi';
import HaikuRow from './components/HaikuRow';
import GenerateHaikuForm from './components/GenerateHaikuForm';
import CurrentHaikuRow from './components/CurrentHaikuRow';
import { Maybe } from 'tsmonad';
import { Container, Row, Col, Navbar, NavbarBrand, Card, CardBody } from 'reactstrap';
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

  render() {
    let onSubmit = (p: GenerateHaikuParams) => this.generateSentences(p);
    return (
      <Container fluid={true}>
        <div className="App container">
          <Navbar>
            <NavbarBrand>
              Generator Haiku
          </NavbarBrand>
          </Navbar>

          <Row>
            <Col>
              {this.state.newestHaiku.map(haiku => {
                return (
                  <CurrentHaikuRow
                    key={haiku.firstLine}
                    firstLine={haiku.firstLine}
                    middleLine={haiku.middleLine}
                    lastLine={haiku.lastLine}
                  />
                );
              }).caseOf({
                just: s => s,
                nothing: () => <p />
              })}
              <Row>
                <Col>
                  <GenerateHaikuForm
                    onSubmit={onSubmit}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
            <Row>
              {this.state.generatedHaikus.map(haiku => {
                return (
                  
                    <Col key={haiku.firstLine} md={4}>
                      <Card>
                        <CardBody>
                          <HaikuRow

                            firstLine={haiku.firstLine}
                            middleLine={haiku.middleLine}
                            lastLine={haiku.lastLine}
                          />
                        </CardBody>
                      </Card>
                    </Col>
                  
                );
              })}
              </Row>
            </Col>
          </Row>
        </div>
      </Container>
    );
  }
}

export default App;
