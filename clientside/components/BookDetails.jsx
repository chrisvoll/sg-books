import React from 'react';
import Immutable from 'immutable';
import { markdown } from 'markdown';
import { Link } from 'react-router';

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
      .replace(/<br>/ig, '\n\n')
      .replace(/<\/p>/ig, '\n')
      .replace(/<\/?strong>/ig, '**')
      .replace(/<\/?em>/ig, '*')
      .replace(/(<([^>]+)>)/ig, '');
    return markdown.toHTML(str);
  }

  getLocation() {
    var key = this.getBook().get('shelves', Immutable.Map())
      .filter(shelf => bookEnum.locations[shelf.get('@name')])
      .getIn([0, '@name']);

    return bookEnum.locations[key];
  }

  getAmazonLink() {
    return 'https://www.amazon.com/dp/' + this.getBook().getIn(['book', 'isbn']);
  }

  render() {
    var book = this.getBook();
    var author = book
          .getIn(['book', 'authors'], Immutable.List())
          .map(author => author.get('name'))
          .join(', ');
    console.log(book.toJS());

    return <div className="book-details-wrapper">

      <div className="sub-navigation">
        <div className="sub-navigation__inner">
          <Link to="/" className="sub-navigation__inner__back">
            &larr; Back to All Books
          </Link>

          <div className="sub-navigation__inner__title">
            {book.getIn(['book', 'title'])}
          </div>

          <div className="sub-navigation__inner__author">
            By {author}
          </div>
        </div>
      </div>

      <div className="book-details">

        <div className="book-details__row">
          <div className="book-details__row__key">
            About this book
          </div>
          <div className="book-details__row__value book-details__description" dangerouslySetInnerHTML={{ __html: this.getSafeDescription() }} />
        </div>

        <div className="book-details__row">
          <div className="book-details__row__key">
            Location
          </div>
          <div className="book-details__row__value">
            {this.getLocation()}
          </div>
        </div>

        <div className="book-details__row">
          <div className="book-details__row__key">
            ISBN
          </div>
          <div className="book-details__row__value">
            {book.getIn(['book', 'isbn13'], book.getIn(['book', 'isbn']))}
          </div>
        </div>

        <div className="book-details__row">
          <div className="book-details__row__key">
            Publisher
          </div>
          <div className="book-details__row__value">
            {book.getIn(['book', 'publisher'])}
          </div>
        </div>

        <div className="book-details__row">
          <div className="book-details__row__key">
            Publication Date
          </div>
          <div className="book-details__row__value">
            {book.getIn(['book', 'published'])}
          </div>
        </div>

        <div className="book-details__row">
          <div className="book-details__row__key">
            Rating
          </div>
          <div className="book-details__row__value">
            {this.getStars()} {book.getIn(['book', 'average_rating'])}
          </div>
        </div>

        <div className="book-details__row">
          <div className="book-details__row__key">
            More Details
          </div>
          <div className="book-details__row__value">
            <a className="book-details__details" href={book.get('link')} target="_blank">
              Goodreads
            </a> &middot; <a className="book-details__details" href={this.getAmazonLink()} target="_blank">
              Amazon
            </a>
          </div>
        </div>
      </div>
    </div>;
  }
}

export default BookDetails;
