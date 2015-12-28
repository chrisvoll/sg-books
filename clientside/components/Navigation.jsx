import React from 'react';

import InterfaceActions from '../actions/InterfaceActions';

var propTypes = {
  interface: React.PropTypes.object
};

class Navigation extends React.Component {
  handleSearch(e) {
    InterfaceActions.setFilterSearch(e.target.value);
  }

  render() {
    return <div className="navigation">
      <div className="navigation__logo">
        SGBooks
      </div>

      <div className="navigation__search">
        <input
          className="navigation__search__input"
          type="text"
          value={this.props.interface.get('filterSearch')}
          onChange={this.handleSearch}
          placeholder="Search Books" /> 
      </div>
    </div>;
  }
}

Navigation.propTypes = propTypes;
export default Navigation;
