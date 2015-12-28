import React from 'react';
import { Link } from 'react-router';

import InterfaceActions from '../actions/InterfaceActions';

var propTypes = {
  interface: React.PropTypes.object
};

var topics = [
  'Business',
  'Copywriting',
  'CSS',
  'Design',
  'HTML',
  'iOS',
  'JavaScript',
  'MySQL',
  'PHP',
  'Python',
  'SEO'
];

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
    this.documentListener = this.handleDocumentClick.bind(this);
  }

  handleSearch(e) {
    InterfaceActions.setFilterSearch(e.target.value);
  }

  handleToggleDropdown() {
    if (this.state.visible === true) {
      this.handleCloseDropdown();
    } else if (this.state.visible === false) {
      this.handleShowDropdown();
    }
  }

  handleCloseDropdown() {
    this.setState({ visible: false });
    document.removeEventListener('click', this.documentListener);
  }

  handleShowDropdown() {
    this.setState({ visible: true });
    document.addEventListener('click', this.documentListener);
  }

  handleDocumentClick(e) {
    if (e.target.className.indexOf('navigation__topics__label') === -1) {
      this.handleCloseDropdown();
    }
  }

  getTopics() {
    var topicElements = [];

    for (var i = 0; i < topics.length; i++) {
      topicElements.push(
        <Link to={'/search/' + topics[i].toLowerCase()} className="navigation__topics__topic" key={topics[i]}>
          {topics[i]}
        </Link>
      );
    }

    return topicElements;
  }

  render() {
    return <div className="navigation">
      <Link to="/" className="navigation__logo">
        SeatGeek Books
      </Link>

      <div className="navigation__search">
        <input
          className="navigation__search__input"
          type="text"
          value={this.props.interface.get('filterSearch')}
          onChange={this.handleSearch}
          placeholder="Search Books" /> 
      </div>

      <div className="navigation__topics">
        <div className="navigation__topics__label" onClick={this.handleToggleDropdown.bind(this)}>
          Topics
        </div>

        <div className={'navigation__topics__dropdown' + (this.state.visible ? ' visible' : ' hidden')}>
          {this.getTopics()}
        </div>
      </div>
    </div>;
  }
}

Navigation.propTypes = propTypes;
export default Navigation;
