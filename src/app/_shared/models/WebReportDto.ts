import { User } from './Auth/User';
import { Project } from './Project/Project';

export interface WebReportDto {

  user: User;
  projects: Project[];
}
