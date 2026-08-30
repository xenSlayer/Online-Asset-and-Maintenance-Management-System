export type TechnicianAvailability = 'Available' | 'On Assignment';

export interface Technician {
  id: string;
  name: string;
  specialisation: string;
  availability: TechnicianAvailability;
  activeTasks: number;
  email: string;
  phone: string;
  avatarColor: string;
}
