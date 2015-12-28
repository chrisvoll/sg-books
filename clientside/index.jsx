require('./styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import Books from './components/Books.jsx';
import BookDetails from './components/BookDetails.jsx';
import Navigation from './components/Navigation.jsx';

import data from './helpers/data';

import InterfaceStore from './stores/InterfaceStore';
import BookStore from './stores/BookStore';
import BookActions from './actions/BookActions';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atom: Immutable.Map({
        interface: Immutable.Map(),
        book: Immutable.Map()
      })
    };
  }

  handleInterfaceUpdate(data) {
    var atom = this.state.atom.set('interface', data);
    this.setState({ atom });
  }

  handleBookUpdate(data) {
    var atom = this.state.atom.set('book', data);
    this.setState({ atom });
  }

  componentDidMount() {
    this.unsubscribeInterface = InterfaceStore.listen(this.handleInterfaceUpdate.bind(this));
    this.unsubscribeBook = BookStore.listen(this.handleBookUpdate.bind(this));

    BookActions.ingestBooks(data.getIn(['reviews', 'review']));
  }

  componentWillUnmount() {
    this.unsubscribeInterface();
    this.unsubscribeBook();
  }

  render() {
    var selected = this.state.atom.getIn(['interface', 'selected']);

    return <div className="app">

      <Navigation
        interface={this.state.atom.get('interface')} />

      {!selected &&
        <Books
          interface={this.state.atom.get('interface')}
          book={this.state.atom.get('book')} />
      }

      {selected &&
        <BookDetails id={selected} />
      }

    </div>;
  }
}

window.ReactBootstrapper = function(data, el) {
  ReactDOM.render(<Root />, el);
}
