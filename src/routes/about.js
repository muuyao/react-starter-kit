const aboutRoute = {
  path: '/about',
  getComponent: (nextState, callback) => {
    require.ensure([], (require) => {
      callback(null, require('../containers/about'));
    });
  }
};

export default aboutRoute;
