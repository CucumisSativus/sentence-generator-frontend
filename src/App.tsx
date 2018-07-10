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
  showSaveButton: boolean;
}

class App extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);
    this.state = { generatedHaikus: [], newestHaiku: Maybe.nothing<Haiku>(), showSaveButton: false };
  }

  componentWillMount() {
    this.refreshHaikuList();
    setInterval(this.refreshHaikuList.bind(this), 5000);
  }

  refreshHaikuList() {
    console.log('refreshing haikus');
    HaikuApi.getHaikuList().then(haikus =>
      this.setState({ generatedHaikus: haikus })
    );
  }
  generateSentences(params: GenerateHaikuParams): void {
    HaikuApi.generateHaiku(params).then(haiku => {
      this.setState({ newestHaiku: Maybe.just(haiku), showSaveButton: true });
    });
  }

  addToOldHaiku(haiku: Haiku): void {
    this.setState(prevState => ({
      generatedHaikus: [haiku, ...prevState.generatedHaikus], showSaveButton: false
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
      if (!this.state.showSaveButton) {
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

  renderInstruction() {
    return (
      <p className="some-text">
        Przycisk 'GENERUJ HAIKU' pozwala oglądającemu wystawę,
        a więc Automatycznemu Twórcy, wygenerować odpowiedni tekst.
        Od niego zależy, który tekst zostanie zapisany i ostatecznie uznany za 'Dzieło'.
        Zapisane Teksty Xemantyczne są dostępne i aktualizowane w czasie rzeczywistym w Bazie Xemantycznych Haiku,
        którą można przeglądać po prawej stronie ekranu.
      Haiku sobie również wydrukować, korzystając z opcji 'DRUKUJ'.
      </p>
    );
  }

  renderCredo() {
    return (
      <blockquote className="blockquote-reverse blue some-text">
        <p>I jeśli gra się wciąż sto, tysiąc, sto tysięcy lat, to wedle wszelkiego
          prawdopodobieństwa kiedyś przypadkiem musi z tego wyjść wiersz.</p>
        <footer>Ende Michale 'Niekończąca się historia'</footer>
      </blockquote>
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
                <NavbarBrand>Wystawa Interaktywnej Xemantyki Automatycznej: Generator Haiku</NavbarBrand>
              </Navbar>
              <Row>
                <Col>
                  <Row>
                    {this.renderCredo()}
                  </Row>
                  <div className="fixed-div">
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
                  <Row />

                  <Row className="instruction">
                    {this.renderInstruction()}
                  </Row>
                </Col>
                <Col className="scrollable">
                  <Row>
                    <Col>
                      <h1>Baza Xemantycznych Haiku</h1>
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
