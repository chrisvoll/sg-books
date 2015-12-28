import createBrowserHistory from 'history/lib/createBrowserHistory'

var history = createBrowserHistory();

history.listen(location => {
  // https://github.com/rackt/react-router/issues/2144#issuecomment-150939358
  setTimeout(() => {
    if (location.action === 'POP') {
      return;
    }

    window.scrollTo(0, 0);
  });
});

export default history;
