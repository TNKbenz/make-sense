import { Action } from "../Actions";

export type UserState = {
  username: string,
  project_name: string,
  modelname: string,
  modeltype: string,
  compare_modelname: string,
  notice_update: string,
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

interface UpdateModelType {
  type: typeof Action.UPDATE_MODELTYPE;
  payload: {
    modeltype: string
  }
}

interface UpdateCompareModelname {
  type: typeof Action.UPDATE_COMPARE_MODELNAME;
  payload: {
    compare_modelname: string
  }
}

interface UpdateNoticeUpdate {
  type: typeof Action.UPDATE_NOTICE_UPDATE;
  payload: {
    notice_update: string
  }
}

export type UserActionType = UpdateUsername | UpdateModelname | UpdateProjectName | UpdateModelType | UpdateCompareModelname | UpdateNoticeUpdate
