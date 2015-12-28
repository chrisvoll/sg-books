import React from 'react';
import Immutable from 'immutable';

import BookStore from '../stores/BookStore';
import InterfaceStore from '../stores/InterfaceStore';

import Book from './Book.jsx';

class Books extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      atom: Immutable.Map({
        book: Immutable.Map(),
        interface: Immutable.Map()
      })
    };
  }

  setStateFromStores() {
    this.setState({
      atom: Immutable.Map({
        book: BookStore.data,
        interface: InterfaceStore.data
      })
    });
  }

  componentDidMount() {
    this.unsubscribeBook = BookStore.listen(this.setStateFromStores.bind(this));
    this.unsubscribeInterface = InterfaceStore.listen(this.setStateFromStores.bind(this));
    this.setStateFromStores();
  }

  componentWillUnmount() {
    this.unsubscribeBook();
    this.unsubscribeInterface();
  }

  performSearch(book, search) {
    if ((book.getIn(['book', 'title']) || '').toLowerCase().indexOf(search) >= 0) {
      return true;
    }

    if ((book.getIn(['book', 'description']) || '').toLowerCase().indexOf(search) >= 0) {
      return true;
    }

    return false;
  }

  performTokenSearch(book, search) {
    var terms = search.split(' ');
    for (var i = 0; i < terms.length; i++) {
      if (!this.performSearch(book, terms[i])) {
        return false;
      }
    }
    return true;
  }

  getFilterFunction() {
    var search = this.props.params.query;
    if (search) {
      search = search.toLowerCase();
    }

    return book => {
      if (search && !this.performTokenSearch(book, search)) {
        return false;
      }
      return true;
    }
  }

  getBooks() {
    return this.state.atom.getIn(['book', 'books'], Immutable.List())
      .filter(this.getFilterFunction())
      .map(book => {
        return <Book atom={book} key={book.get('id')} />;
      });
  }

  render() {
    var books = this.getBooks();

    return <div className="books">
      {books.size > 0 &&
        books
      }

      {books.size === 0 &&
        <div className="books__not-found">
          These are not the books you are looking for.
        </div>
      }
    </div>
  }
}

export default Books;
