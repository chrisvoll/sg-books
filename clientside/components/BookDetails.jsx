import React from 'react';
import Immutable from 'immutable';
import { markdown } from 'markdown';

import BookStore from '../stores/BookStore';
import InterfaceStore from '../stores/InterfaceStore';
import bookEnum from '../helpers/bookEnum';

class BookDetails extends React.Component {
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

  getBook() {
    return this.state.atom.getIn(['book', 'books'], Immutable.List()).filter(book => {
      return parseInt(book.getIn(['book', 'id']), 10) === parseInt(this.props.params.bookId, 10);
    }).first() || Immutable.Map();
  }

  getStars() {
    var rating = this.getBook().getIn(['book', 'average_rating']);
    rating = Math.round(parseInt(rating, 10));
    var stars = '';
    for (var i = 0; i < rating; i++) {
      stars += '★';
    }
    return stars;
  }

  getSafeDescription() {
    // The Goodreads output includes a lot of garbage we don't
    // want, so we'll filter out all the HTML tags, convert
    // the <br> tags into actual line breaks, and feed it
    // through a markdown parse.
    var str = this.getBook().getIn(['book', 'description']) || '';
    str = str
      .replace(/<br>/ig, '\n')
      .replace(/(<([^>]+)>)/ig, '');
    return markdown.toHTML(str);
  }

  getLocation() {
    var key = this.getBook().get('shelves', Immutable.Map())
      .filter(shelf => bookEnum.locations[shelf.get('@name')])
      .getIn([0, '@name']);

    return bookEnum.locations[key];
  }

  render() {
    var book = this.getBook();
    var author = book
          .getIn(['book', 'authors'], Immutable.List())
          .map(author => author.get('name'))
          .join(', ');
    console.log(book.toJS());

    return <div className="book-details">
      <div className="book-details__title">
        {book.getIn(['book', 'title'])}
      </div>

      <div className="book-details__author">
        {author}
      </div>

      <div className="book-details__description" dangerouslySetInnerHTML={{ __html: this.getSafeDescription() }} />

      <div className="book-details__location">
        Location: {this.getLocation()}
      </div>

      <div className="book-details__isbn13">
        ISBN: {book.getIn(['book', 'isbn13'], book.getIn(['book', 'isbn']))}
      </div>

      <div className="book-details__publisher">
        Published by {book.getIn(['book', 'publisher'])} in {book.getIn(['book', 'published'])}
      </div>

      <div className="book-details__rating">
        {this.getStars()} {book.getIn(['book', 'average_rating'])}
      </div>
    </div>;
  }
}

export default BookDetails;
