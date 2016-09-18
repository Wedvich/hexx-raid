import moment from 'moment';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as raidsReducer } from '../raids';
import { reducer as charactersReducer } from '../characters';
import { reducer as authReducer } from '../auth';

export default combineReducers({
  raids: raidsReducer,
  characters: charactersReducer,
  routing: routerReducer,
  auth: authReducer
});
