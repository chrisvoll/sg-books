import React from 'react';

import Book from './Book.jsx';
import data from '../helpers/data';

var propTypes = {
  interface: React.PropTypes.object
};

class Books extends React.Component {
  getFilterFunction() {
    var search = this.props.interface.get('filterSearch');
    if (search) {
      search = search.toLowerCase();
    }

    return book => {
      if (search && book.getIn(['book', 'title']).toLowerCase().indexOf(search) < 0) {
        return false;
      }
      return true;
    }
  }

  getBooks() {
    var books = data.getIn(['reviews', 'review']);
    return books
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
