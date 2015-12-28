import React from 'react';
import Immutable from 'immutable';
import InterfaceActions from './actions/InterfaceActions';

var propTypes = {
  atom: React.PropTypes.object
};

var rooms = {
  'sg-mr1': 'Meeting Room 1',
  'sg-mr2': 'Meeting Room 2',
  'sg-mr3': 'Meeting Room 3',
  'sg-mr4': 'Meeting Room 4',
  'sg-desks': 'Desks'
};

class Book extends React.Component {
  getSafeDescription() {
    var description = this.props.atom.getIn(['book', 'description']) || '';
    description = description.replace(/(<([^>]+)>)/ig, '');
    if (description.length > 140) {
      description = description.slice(0, 140) + '...';
    }
    return description;
  }

  getLocation() {
    var shelves = this.props.atom.get('shelves') || Immutable.List();
    var location = '';

    shelves.forEach(shelf => {
      if (rooms[shelf.get('@name')]) {
        location = rooms[shelf.get('@name')];
      }
    });

    return location;
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