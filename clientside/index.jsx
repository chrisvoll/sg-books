require('./styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { Router, Route, IndexRoute } from 'react-router';
import history from './helpers/history';

import Books from './components/Books.jsx';
import BookDetails from './components/BookDetails.jsx';
import Navigation from './components/Navigation.jsx';

import data from './helpers/data';

import InterfaceStore from './stores/InterfaceStore';
import BookActions from './actions/BookActions';

class App extends React.Component {
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
    this.unsubscribeInterface = InterfaceStore.listen(this.handleInterfaceUpdate.bind(this));

    BookActions.ingestBooks(data.getIn(['reviews', 'review']));
  }

  componentWillUnmount() {
    this.unsubscribeInterface();
  }

  render() {
    var selected = this.state.atom.getIn(['interface', 'selected']);

    return <div className="app">

      <Navigation
        interface={this.state.atom.get('interface')} />

      {this.props.children}

    </div>;
  }
}

window.ReactBootstrapper = function(data, el) {
  ReactDOM.render(<Router history={history}>
    <Route path="/" component={App}>
      <IndexRoute component={Books} />
      <Route path="search/:query" component={Books} />
      <Route path="books/:bookId" component={BookDetails} />
      <Route path="books/:bookId/:slug" component={BookDetails} />
    </Route>
  </Router>, el);
}
