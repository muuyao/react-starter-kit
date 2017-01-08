import App from '../containers/app';
import Home from '../containers/home';
import PageNotFound from '../containers/404';
import aboutRoute from './about';

const rootRoute = {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: {
      component: Home
    },
    childRoutes: [
      aboutRoute
    ]
  }, {
    path: '*',
    component: PageNotFound
  }]
};

export default rootRoute;
