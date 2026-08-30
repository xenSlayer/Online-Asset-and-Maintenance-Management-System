export type TechnicianAvailability = 'Available' | 'On Assignment';

export interface TechnicianTask {
  id: string;
  assetName: string;
  status: 'Pending' | 'Assigned' | 'In Progress' | 'Completed';
}

export interface Technician {
  id: string;
  name: string;
  specialisation: string;
  availability: TechnicianAvailability;
  activeTasks: number;
  email: string;
  phone: string;
  status: string;
  avatarColor: string;
}

export interface TechnicianDetail extends Technician {
  tasks: TechnicianTask[];
}
