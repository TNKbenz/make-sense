import { Action } from "../Actions";
import { UserActionType } from "./types";

export function updateUsername(username: string): UserActionType {
  return {
    type: Action.UPDATE_USERNAME,
    payload: {
      username
    }
  }
}

export function updateProjectName(project_name: string): UserActionType {
  return {
    type: Action.UPDATE_PROJECT_NAME,
    payload: {
      project_name
    }
  }
}

export function updateModelName(modelname: string): UserActionType {
  return {
    type: Action.UPDATE_MODELNAME,
    payload: {
      modelname
    }
  }
}

export function updateModelType(modeltype: string): UserActionType {
  return {
    type: Action.UPDATE_MODELTYPE,
    payload: {
      modeltype
    }
  }
}

