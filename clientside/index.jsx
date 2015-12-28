require('./styles/style.scss');

import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';

import Book from './components/Book.jsx';
import data from './helpers/data';

import InterfaceStore from './stores/InterfaceStore';
import InterfaceActions from './actions/InterfaceActions';

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atom: Immutable.Map()
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

  getBooks() {
    var books = data.getIn(['reviews', 'review']);
    return books.map(book => {
      return <Book atom={book} key={book.get('id')} />;
    });
  }

  render() {
    return <div className="books">
      {this.getBooks()}
    </div>;
  }
}

window.ReactBootstrapper = function(data, el) {
  ReactDOM.render(<Root />, el);
}
