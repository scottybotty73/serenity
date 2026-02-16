import { Appointment, ClinicalProfile, Message } from './types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientName: 'Alex Thompson', time: '09:00 AM', status: 'UPCOMING', platform: 'Telegram' },
  { id: '2', patientName: 'Sarah Chen', time: '11:30 AM', status: 'UPCOMING', platform: 'Web' },
  { id: '3', patientName: 'Mike Ross', time: '02:00 PM', status: 'PENDING', platform: 'Voice' },
];

export const MOCK_PROFILE: ClinicalProfile = {
  name: 'Alex Thompson',
  age: 32,
  diagnosis: ['Generalized Anxiety Disorder (GAD)', 'Mild Depression'],
  medications: ['Sertraline 50mg'],
  keyPeople: [
    { name: 'Elena', relation: 'Wife', dynamic: 'Supportive but strained' },
    { name: 'Robert', relation: 'Father', dynamic: 'Distant' }
  ],
  lastAssessment: {
    type: 'GAD-7',
    score: 12,
    date: '2023-10-25',
    trend: 'improving'
  }
};

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg_1',
    role: 'model',
    content: "Good morning, Alex. I've reviewed your chart. How have you been handling the anxiety triggers we discussed last session regarding your upcoming work presentation?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  }
];
