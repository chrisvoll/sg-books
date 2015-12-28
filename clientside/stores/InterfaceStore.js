import Reflux from 'reflux';
import Immutable from 'immutable';
import InterfaceActions from '../actions/InterfaceActions';

var InterfaceStore = Reflux.createStore({
  listenables: InterfaceActions,
  data: Immutable.Map(),

  init() {
    console.log('init');
  },

  onDoSomething() {
    console.log('do something');
    this.trigger(this.data);
  }
});

export default InterfaceStore;
