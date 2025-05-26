export const CREATE_ASSESSMENT = "CREATE_ASSESSMENT";
export const CREATE_RESOURCE = "CREATE_RESOURCE";
export const CREATE_MODULE = "CREATE_MODULE";
export const DELETE_COURSE = "DELETE_COURSE";
export const EDIT_COURSE = "EDIT_COURSE";
export const EDIT_MODULE = "EDIT_MODULE";
export const DELETE_MODULE = "DELETE_MODULE";
export const EDIT_RESOURCE = "EDIT_RESOURCE";
export const DELETE_RESOURCE = "DELETE_RESOURCE";
export const EDIT_ASSESSMENT = "EDIT_ASSESSMENT";
export const DELETE_ASSESSMENT = "DELETE_ASSESMENT";
export const REVIEW_ASSESSMENT = "REVIEW_ASSESSMENT";

export const ASSISTANT_PERMISSIONS = [
  CREATE_ASSESSMENT,
  CREATE_RESOURCE,
  CREATE_MODULE,
  DELETE_COURSE,
  EDIT_COURSE,
  EDIT_MODULE,
  DELETE_MODULE,
  EDIT_RESOURCE,
  DELETE_RESOURCE,
  EDIT_ASSESSMENT,
  DELETE_ASSESSMENT,
  REVIEW_ASSESSMENT,
];

export const PERMISSION_LABELS: Record<string, string> = {
  [CREATE_ASSESSMENT]: "Create assignment or exam",
  [CREATE_RESOURCE]: "Create resource",
  [CREATE_MODULE]: "Create module",
  [DELETE_COURSE]: "Delete course",
  [EDIT_COURSE]: "Edit course",
  [EDIT_MODULE]: "Edit module",
  [DELETE_MODULE]: "Delete module",
  [EDIT_RESOURCE]: "Edit resource",
  [DELETE_RESOURCE]: "Delete resource",
  [EDIT_ASSESSMENT]: "Edit assignment or exam",
  [DELETE_ASSESSMENT]: "Delete assignment or exam",
  [REVIEW_ASSESSMENT]: "Grade exams",
};
