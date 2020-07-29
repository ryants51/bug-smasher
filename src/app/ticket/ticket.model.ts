import { Attachment } from './attachments/attachment.model';

export interface Ticket {
  uid: string;
  assignedUser: string;
  creator: string;
  dateCreated: Date;
  description: string;
  lastUpdated: Date;
  parentProject: string;
  priority: string;
  status: string;
  title: string;
  type: string;
}
