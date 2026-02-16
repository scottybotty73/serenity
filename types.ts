export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isCrisis?: boolean;
}

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  platform: 'Telegram' | 'Voice' | 'Web';
}

export interface ClinicalProfile {
  name: string;
  age: number;
  diagnosis: string[];
  medications: string[];
  keyPeople: { name: string; relation: string; dynamic: string }[];
  lastAssessment: {
    type: 'GAD-7' | 'PHQ-9';
    score: number;
    date: string;
    trend: 'improving' | 'stable' | 'worsening';
  };
}

export interface ClinicalNote {
  id: string;
  date: string;
  type: 'Initial' | 'Follow-up' | 'Crisis';
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  summary: string;
}

export interface AppState {
  view: 'DASHBOARD' | 'CHAT' | 'PROFILE' | 'SCHEDULE' | 'NOTES';
  isAwake: boolean;
  activePatientId: string | null;
}
