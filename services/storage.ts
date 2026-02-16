import { v4 as uuidv4 } from 'uuid';
import { Appointment, ClinicalProfile, Message, ClinicalNote } from '../types';
import { MOCK_PROFILE, MOCK_APPOINTMENTS, MOCK_NOTES, INITIAL_MESSAGES } from '../mockData';

// Keys for LocalStorage
const STORAGE_KEYS = {
  PROFILE: 'serenity_profile',
  MESSAGES: 'serenity_messages',
  NOTES: 'serenity_notes',
  APPOINTMENTS: 'serenity_appointments'
};

/**
 * StorageService
 * Acts as the Data Access Layer. In a production Next.js app, 
 * these methods would be Server Actions calling Drizzle/Neon.
 */
export const StorageService = {
  // --- Profile ---
  getProfile: (): ClinicalProfile => {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!data) {
      // Initialize with default if empty (simulating new patient)
      StorageService.saveProfile(MOCK_PROFILE);
      return MOCK_PROFILE;
    }
    return JSON.parse(data);
  },

  saveProfile: (profile: ClinicalProfile) => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  // --- Messages ---
  getMessages: (): Message[] => {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!data) {
      StorageService.saveMessages(INITIAL_MESSAGES);
      return INITIAL_MESSAGES;
    }
    return JSON.parse(data, (key, value) => {
        // Revive dates
        if (key === 'timestamp') return new Date(value);
        return value;
    });
  },

  saveMessages: (messages: Message[]) => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  addMessage: (message: Message) => {
    const messages = StorageService.getMessages();
    messages.push(message);
    StorageService.saveMessages(messages);
  },

  // --- Notes ---
  getNotes: (): ClinicalNote[] => {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!data) {
      StorageService.saveNotes(MOCK_NOTES);
      return MOCK_NOTES;
    }
    return JSON.parse(data);
  },

  saveNotes: (notes: ClinicalNote[]) => {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  },

  addNote: (note: ClinicalNote) => {
    const notes = StorageService.getNotes();
    // Prepend to show newest first
    notes.unshift(note);
    StorageService.saveNotes(notes);
  },

  // --- Appointments ---
  getAppointments: (): Appointment[] => {
     const data = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
     if (!data) {
        StorageService.saveAppointments(MOCK_APPOINTMENTS);
        return MOCK_APPOINTMENTS;
     }
     return JSON.parse(data);
  },

  saveAppointments: (appointments: Appointment[]) => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  },

  // Reset functionality for debugging
  clearAll: () => {
    localStorage.clear();
    window.location.reload();
  }
};
