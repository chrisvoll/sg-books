require('./styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import Books from './components/Books.jsx';
import Navigation from './components/Navigation.jsx';

import InterfaceStore from './stores/InterfaceStore';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atom: Immutable.Map({
        interface: Immutable.Map()
      })
    };
  }

  handleInterfaceUpdate(data) {
    var atom = this.state.atom.set('interface', data);
    this.setState({ atom });
  }

  componentDidMount() {
    this.unsubscribe = InterfaceStore.listen(this.handleInterfaceUpdate.bind(this));
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    var atom = this.state.atom.get('interface');
    return <div className="app">

      <Navigation interface={atom} />
      <Books interface={atom} />

    </div>;
  }
}

window.ReactBootstrapper = function(data, el) {
  ReactDOM.render(<Root />, el);
}
