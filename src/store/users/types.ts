import { Action } from "../Actions";

export type UserState = {
  username: string,
  project_name: string,
  modelname: string
}

interface UpdateUsername {
  type: typeof Action.UPDATE_USERNAME;
  payload: {
    username: string
  }
}

interface UpdateProjectName {
  type: typeof Action.UPDATE_PROJECT_NAME;
  payload: {
    project_name: string
  }
}

interface UpdateModelname {
  type: typeof Action.UPDATE_MODELNAME;
  payload: {
    modelname: string
  }
}

export type UserActionType = UpdateUsername | UpdateModelname | UpdateProjectName
