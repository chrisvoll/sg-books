import React from 'react';
import Immutable from 'immutable';

import Book from './Book.jsx';

var propTypes = {
  interface: React.PropTypes.object,
  book: React.PropTypes.object
};

class Books extends React.Component {
  performSearch(book, search) {
    if ((book.getIn(['book', 'title']) || '').toLowerCase().indexOf(search) >= 0) {
      return true;
    }

    if ((book.getIn(['book', 'description']) || '').toLowerCase().indexOf(search) >= 0) {
      return true;
    }

    return false;
  }

  getFilterFunction() {
    var search = this.props.interface.get('filterSearch');
    if (search) {
      search = search.toLowerCase();
    }

    return book => {
      if (search && !this.performSearch(book, search)) {
        return false;
      }
      return true;
    }
  }

  getBooks() {
    return this.props.book.get('books', Immutable.List())
      .filter(this.getFilterFunction())
      .map(book => {
        return <Book atom={book} key={book.get('id')} />;
      });
  }

  render() {
    return <div className="books">
      {this.getBooks()}
    </div>
  }
}

Books.propTypes = propTypes;
export default Books;
