import React, { Component } from 'react';
import { Link } from 'react-router';

import { IS_IN_IFRAME } from '../utils';

class App extends Component {
  /*<span><Link to="/characters" activeClassName="active">Characters</Link></span>*/
  render() {
    return <div id="app">
      <nav>
        <span><Link to="/raids" activeClassName="active">Raids</Link></span>
      </nav>
      <div className="announcement">
        <span className="icon"></span>
        {`Hi everyone, and welcome to the new (and hopefully improved) raid planner! Contact management if you run into any problems, or if you have questions, suggestions or bugs you'd like to report. Happy raiding!`}
      </div>
      {IS_IN_IFRAME && <div className="announcement mobile-only">
        <span className="button-group">
          <button className="coming" onClick={() => window.open('/')}>
            Open mobile-friendly view
          </button>
        </span>
      </div>}
      {this.props.children}
    </div>;
  }
}

export default App;
