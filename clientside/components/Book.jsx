import React from 'react';
import Immutable from 'immutable';
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

  getLocation() {
    var key = this.props.atom.get('shelves')
      .filter(shelf => bookEnum.locations[shelf.get('@name')])
      .getIn([0, '@name']);

    return bookEnum.locations[key];
  }

  handleClick() {
    InterfaceActions.doSomething();
  }

  render() {
    return <div className="book" onClick={this.handleClick}>
      <div className="book__title">
        {this.props.atom.getIn(['book', 'title'])}
      </div>

      <div className="book__description">
        {this.getSafeDescription()}
      </div>

      <div className="book__location">
        {this.getLocation()}
      </div>
    </div>;
  }
}

Book.propTypes = propTypes;
export default Book;