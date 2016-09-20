import moment from 'moment';
import { List } from 'immutable';

import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: false,
  raids: List([])
};

export default function(state = initialState, action) {
  switch (action.type) {
    case actionTypes.RAIDS_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.RAIDS_LOAD_SUCCESS:
      return {
        isLoading: false,
        raids: List(action.raids)
      };

    case actionTypes.RAIDS_LOAD_FAILURE:
      return {
        ...state,
        isLoading: false
      };

    case actionTypes.RAID_UPDATE_SIGNUP_REQUEST: {
      const raidIndex = state.raids.findIndex(r => r.raidId === action.raidId);
      return {
        ...state,
        raids: state.raids.update(raidIndex, r => ({ ...r, isBusy: true }))
      };
    }

    case actionTypes.RAID_UPDATE_SIGNUP_SUCCESS: {
      const raidIndex = state.raids.findIndex(r => r.raidId === action.raid.raidId);
      return {
        ...state,
        raids: state.raids.update(raidIndex, r => action.raid)
      };
    }

    case actionTypes.RAID_UPDATE_SIGNUP_FAILURE: {
      const raidIndex = state.raids.findIndex(r => r.raidId === action.raidId);
      return {
        ...state,
        raids: state.raids.update(raidIndex, r => ({ ...r, isBusy: false }))
      };
    }

    default:
      return state;
  }
}
