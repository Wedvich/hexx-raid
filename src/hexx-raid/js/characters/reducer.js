import moment from 'moment';
import { List } from 'immutable';

import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  isRefreshingAudit: false,
  characters: [],
  lastRefreshed: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.CHARACTERS_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.CHARACTERS_LOAD_SUCCESS:
      const lastRefreshed = action.characters.reduce((last, character) => {
        if (character.audit) {
          const refreshed = moment(character.audit.lastUpdated);
          if (refreshed > last) {
            last = refreshed;
          }
        }
        return last;
      }, null);
    
      return {
        ...state,
        isLoading: false,
        characters: List(action.characters),
        lastRefreshed: lastRefreshed ? lastRefreshed.toISOString() : null
      };

    case actionTypes.CHARACTERS_LOAD_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    case actionTypes.AUDIT_REFRESH_REQUEST:
      return {
        ...state,
        isRefreshingAudit: true
      };

    case actionTypes.AUDIT_REFRESH_SUCCESS:
      return {
        ...state,
        isRefreshingAudit: false,
        lastRefreshed: moment().toISOString()
      };

    case actionTypes.AUDIT_REFRESH_FAILURE:
      return {
        ...state,
        isRefreshingAudit: false
      };

    default:
      return state;
  }
}
