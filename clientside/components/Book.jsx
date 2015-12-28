import React from 'react';
import Immutable from 'immutable';
import { Link } from 'react-router';
import InterfaceActions from '../actions/InterfaceActions';
import bookEnum from '../helpers/bookEnum';

var propTypes = {
  atom: React.PropTypes.object
};

class Book extends React.Component {
  getSafeDescription() {
    var str = this.props.atom.getIn(['book', 'description']) || '';
    str = str.replace(/(<([^>]+)>)/ig, '');

    if (str.length > 90) {
      str = str.slice(0, 90) + '...';
    }

    return str;
  }

  getAuthor() {
    return this.props.atom.getIn(['book', 'authors', 0, 'name']);
  }

  getDescription() {
    var author = this.getAuthor();
    var desc = this.getSafeDescription();
    var joiner = author && desc ? ' – ' : '';
    return author + joiner + desc;
  }

  getLocation() {
    var key = this.props.atom.get('shelves')
      .filter(shelf => bookEnum.locations[shelf.get('@name')])
      .getIn([0, '@name']);

    return bookEnum.locations[key];
  }

  getTitleSlug() {
    return this.props.atom.getIn(['book', 'title'])
      .toLowerCase()
      .split(':')[0]
      .replace(/[^\w ]+/g,'')
      .replace(/ +/g,'-')
      .split('-')
      .slice(0, 8)
      .join('-');
  }

  render() {
    var title = this.props.atom.getIn(['book', 'title']);

    return <Link to={'/books/' + this.props.atom.getIn(['book', 'id']) + '/' + this.getTitleSlug()} className="book">
      <div className="book__image"/>
      <div className="book__title" title={title}>
        {title}
      </div>

      <div className="book__description">
        {this.getDescription()}
      </div>

      <div className="book__location">
        {this.getLocation()}
      </div>
    </Link>;
  }
}

Book.propTypes = propTypes;
export default Book;