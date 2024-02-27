import { Action } from "../Actions";
import { UserAction, UserState } from "./types";

const initialState: UserState = {
  username: "",
  project_name: "",
  modelname: "",
  modeltype: "",
  compare_modelname: "",
  notice_update: "",
};

export function userReducer(
  state = initialState,
  action: UserAction
): UserState {
  switch (action.type) {
    case Action.UPDATE_USERNAME: {
      return {
        ...state,
        username: action.payload.username
      }
    }
    case Action.UPDATE_PROJECT_NAME: {
      return {
        ...state,
        project_name: action.payload.project_name
      }
    }
    case Action.UPDATE_MODELNAME: {
      return {
        ...state,
        modelname: action.payload.modelname
      }
    }
    case Action.UPDATE_MODELTYPE: {
      return {
        ...state,
        modeltype: action.payload.modeltype
      }
    }
    case Action.UPDATE_COMPARE_MODELNAME: {
      return {
        ...state,
        compare_modelname: action.payload.compare_modelname
      }
    }
    case Action.UPDATE_NOTICE_UPDATE: {
      return {
        ...state,
        notice_update: action.payload.notice_update
      }
    }
    default:
      return state;
  }
}
