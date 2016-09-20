import App from '../app';
import Raids from '../raids';
import Characters from '../characters';
import { SignIn } from '../auth';

export default {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/raids') },
    childRoutes: [
      { path: '/raids', component: Raids },
      { path: '/characters', component: Characters },
      { path: '/signin', component: SignIn }
    ]
  }]
};
