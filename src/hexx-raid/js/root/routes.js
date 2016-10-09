import App from './app';
import Raids, { RaidEditor } from '../raids';
import { Audit, Characters } from '../characters';
import { SignIn } from '../auth';

export default {
  childRoutes: [{
    path: '/',
    component: App,
    indexRoute: { onEnter: (nextState, replace) => replace('/raids') },
    childRoutes: [
      { path: '/raids', component: Raids, childRoutes: [
        { path: '/raids/:raidId', component: RaidEditor }
      ] },
      { path: '/characters', component: Characters },
      { path: '/audit', component: Audit },
      { path: '/signin', component: SignIn }
    ]
  }]
};
