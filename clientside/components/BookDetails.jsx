import React from 'react';
import data from '../helpers/data.js';

var propTypes = {
  id: React.PropTypes.number
};

class BookDetails extends React.Component {
  getBook() {
    return data.getIn(['reviews', 'review']).filter(book => {
      return book.getIn(['book', 'id']) === this.props.id;
    }).first();
  }
  render() {
    var book = this.getBook();

    return <div className="book-details">
      <div className="book-details__title">
        {book.getIn(['book', 'title'])}
      </div>
    </div>;
  }
}

BookDetails.propTypes = propTypes;
export default BookDetails;
