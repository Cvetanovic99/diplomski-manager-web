import { Client } from '../Client';
import { User } from '../Auth/User';
import { Warehouse } from '../Warehouse/Warehouse';
import { Icon } from '../../helpers/Icon';
import { Task } from '../Task/Task';
import { PdfFile } from '../PdfFile';

export interface Project {

  id:         number;
  title:      string;
  client:     Client;
  user:       User;
  warehouse:  Warehouse;
  state:      string;
  tasks:      Task[];

  pdfFile: PdfFile;

  stateIcon: Icon | undefined;
}
