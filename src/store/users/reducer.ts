import { Action } from "../Actions";
import { UserAction, UserState } from "./types";

const initialState: UserState = {
  username: "",
  project_name: "",
  modelname: ""
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
        username: action.payload.project_name
      }
    }
    case Action.UPDATE_MODELNAME: {
      return {
        ...state,
        username: action.payload.modelname
      }
    }
    default:
      return state;
  }
}
