import * as React from 'react';
import './App.css';
import './domain/GenerateHaikuParams.ts';
import './domain/Haiku';
import './components/GenerateHaikuForm';
import HaikuApi from './api/HaikuApi';
import HaikuRow from './components/HaikuRow';
import GenerateHaikuForm from './components/GenerateHaikuForm';

interface ApplicationState {
  generatedHaikus: Array<Haiku>;
}

class App extends React.Component<{}, ApplicationState> {
  constructor(props: {}) {
    super(props);
    this.state = { generatedHaikus: [] };
  }
  generateSentences(params: GenerateHaikuParams): void {
    console.log(params);
    HaikuApi.generateHaiku(params).then(haiku => {
      this.addHaikuToState(haiku);
    });
  }

  addHaikuToState(haiku: Haiku): void {
    this.setState(prevState => ({
      generatedHaikus: [...prevState.generatedHaikus, haiku]
    }));
  }
  render() {
    let onSubmit = (p: GenerateHaikuParams) => this.generateSentences(p);
    return (
      <div className="App container">
        <GenerateHaikuForm
          onSubmit={onSubmit}
        />
        <ul>
        {this.state.generatedHaikus.map(haiku => {
          return (
            <li key={haiku.firstLine}>
              <HaikuRow

                firstLine={haiku.firstLine}
                middleLine={haiku.middleLine}
                lastLine={haiku.lastLine}
              />
            </li>
          );
        })}
        </ul>
      </div>
    );
  }
}

export default App;
