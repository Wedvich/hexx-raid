import moment from 'moment';
import { List } from 'immutable';

import * as actionTypes from './actionTypes';

const initialState = {
  isLoading: true,
  hasLoadedNextWeek: false,
  raids: List([])
};

export default function (state = initialState, action) {
  switch (action.type) {
    case actionTypes.RAIDS_LOAD_REQUEST:
      return {
        ...state,
        isLoading: true
      };

    case actionTypes.RAIDS_LOAD_SUCCESS:
      return {
        ...state,
        isLoading: false,
        hasLoadedNextWeek: !!action.forNextWeek,
        raids: action.forNextWeek ? state.raids.concat(action.raids) : List(action.raids)
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

    case actionTypes.RAID_UPDATE_REQUEST: {
      const raidIndex = state.raids.findIndex(r => r.raidId === action.raid.raidId);
      return {
        ...state,
        raids: state.raids.update(raidIndex, r => ({ ...r, isUpdating: true }))
      };
    }

    case actionTypes.RAID_UPDATE_SUCCESS: {
      const raidIndex = state.raids.findIndex(r => r.raidId === action.raid.raidId);
      return {
        ...state,
        raids: state.raids.update(raidIndex, r => action.raid)
      };
    }

    case actionTypes.RAID_UPDATE_FAILURE: {
      const raidIndex = state.raids.findIndex(r => r.raidId === action.raidId);
      return {
        ...state,
        raids: state.raids.update(raidIndex, r => ({ ...r, isUpdating: false }))
      };
    }

    default:
      return state;
  }
}
