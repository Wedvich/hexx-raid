import React, { Component } from 'react';
import { Link } from 'react-router';

class App extends Component {
  /*<span><Link to="/characters" activeClassName="active">Characters</Link></span>*/
  render() {
    return <div id="app">
      <nav>
        <span><Link to="/raids" activeClassName="active">Raids</Link></span>
      </nav>
      {this.props.children}
    </div>;
  }
}

export default App;
