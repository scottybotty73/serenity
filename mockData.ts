import { Appointment, ClinicalProfile, Message, ClinicalNote } from './types';

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientName: 'Alex Thompson', time: '09:00 AM', status: 'UPCOMING', platform: 'Telegram' },
  { id: '2', patientName: 'Sarah Chen', time: '11:30 AM', status: 'UPCOMING', platform: 'Web' },
  { id: '3', patientName: 'Mike Ross', time: '02:00 PM', status: 'PENDING', platform: 'Voice' },
  { id: '4', patientName: 'Emma Watson', time: '04:00 PM', status: 'UPCOMING', platform: 'Telegram' },
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

export const MOCK_NOTES: ClinicalNote[] = [
  {
    id: 'n1',
    date: 'Oct 24, 2023',
    type: 'Follow-up',
    subjective: "Patient reports feeling 'overwhelmed' by upcoming quarterly review. Mentions sleep disruption (waking at 3am).",
    objective: "Affect is anxious, speech is rapid. Grooming is good. Eye contact is intermittent.",
    assessment: "GAD symptoms exacerbating due to work stress. Avoidance coping mechanisms present.",
    plan: "1. Continue CBT thought records.\n2. Introduce progressive muscle relaxation for sleep.\n3. Review in 1 week.",
    summary: "Session focused on work anxiety. Patient receptive to new sleep hygiene techniques."
  },
  {
    id: 'n2',
    date: 'Oct 17, 2023',
    type: 'Follow-up',
    subjective: "Patient reports argument with wife regarding household chores. Feels 'unappreciated'.",
    objective: "Mood is irritable. Affect congruent. No signs of psychosis.",
    assessment: "Interpersonal conflict acting as secondary stressor.",
    plan: "1. Discuss communication strategies (I-statements).\n2. Schedule couples session if conflict persists.",
    summary: "Addressed marital conflict. Role-played communication techniques."
  },
  {
    id: 'n3',
    date: 'Oct 10, 2023',
    type: 'Initial',
    subjective: "Initial intake. Chief complaint: 'Constant worry'. Duration: 6 months.",
    objective: "Alert and oriented x3. Anxious distress noted.",
    assessment: "Provisional diagnosis of GAD. Rule out thyroid dysfunction.",
    plan: "1. Refer for blood work.\n2. Start sertraline 25mg titration.",
    summary: "Initial assessment completed. Treatment plan initiated."
  }
];
