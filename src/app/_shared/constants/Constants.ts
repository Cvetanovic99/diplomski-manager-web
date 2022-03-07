export enum Types {
  user = 1,
  client = 2,
  warehouse = 3,
  product = 4
}

export enum Roles {
  admin = 'Admin',
  user = 'User'
}

export enum ProjectState {

  complete = 'Realizovan',
  postponed = 'Odložen',
  inProgress = 'U procesu',
  givenUp = 'Odustao',
  notFinished = 'Nije završen'
}

export const projectStates = [
  'Realizovan',
  'Odložen',
  'U procesu',
  'Odustao',
  'Nije završen'
];
