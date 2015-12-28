import Reflux from 'reflux';
import Immutable from 'immutable';
import InterfaceActions from '../actions/InterfaceActions';
import history from '../helpers/history';

var InterfaceStore = Reflux.createStore({
  listenables: InterfaceActions,

  data: Immutable.Map({
    filterSearch: null,
    filterLocation: null,
    selected: null
  }),

  set(key, val) {
    this.data = this.data.set(key, val);
    this.trigger(this.data);
  },

  setIn(keyPath, val) {
    this.data = this.data.setIn(keyPath, val);
    this.trigger(this.data);
  },

  onSetFilterSearch(value) {
    this.set('filterSearch', value);
    if (value) {
      history.pushState(null, '/search/' + value);
    } else {
      history.pushState(null, '/');
    }
  }
});

export default InterfaceStore;
