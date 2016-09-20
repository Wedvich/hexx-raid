import React, { Component } from 'react';
import { Link } from 'react-router';

class App extends Component {
  /*<span><Link to="/characters" activeClassName="active">Characters</Link></span>*/
  render() {
    return <div id="app">
      <nav>
        <span><Link to="/raids" activeClassName="active">Raids</Link></span>
      </nav>
      <div className="announcement">
        <span className="icon"></span>
        {`Hi everyone, and welcome to the new (and hopefully improved) raid planner! It's fresh out of the oven and some features are still missing, but more will be added over time. Contact management if you run into any problems, or if you have questions, suggestions or bugs you'd like to report. Happy raiding!`}
      </div>
      {this.props.children}
    </div>;
  }
}

export default App;
