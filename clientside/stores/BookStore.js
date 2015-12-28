import Reflux from 'reflux';
import Immutable from 'immutable';
import BookActions from '../actions/BookActions';

var BookStore = Reflux.createStore({
  listenables: BookActions,

  data: Immutable.Map({
    books: Immutable.List()
  }),

  onIngestBooks(books) {
    this.data = this.data.set('books', books);
    this.trigger(this.data);
  }
});

export default BookStore;
