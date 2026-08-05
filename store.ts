import { useSyncExternalStore } from "react";

export type User = {
  id: string;
  name: string;
  age: number;
  bio: string;
  city: string;
  distanceKm: number;
  interests: string[];
  photo: string;
  verified: boolean;
};

export type Match = {
  user: User;
  matchedAt: number;
  messages: { id: string; fromMe: boolean; text: string; at: number }[];
};

type State = {
  currentUser: User;
  profiles: User[];
  matches: Match[];
  likedIds: string[];
  passedIds: string[];
};

const seedProfiles: User[] = [
  {
    id: "p1",
    name: "מאיה",
    age: 27,
    bio: "צלמת ומטיילת. אוהבת הרים וקפה בבוקר",
    city: "תל אביב",
    distanceKm: 2,
    interests: ["צילום", "טיולים", "קפה", "כלבים"],
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    verified: true,
  },
  {
    id: "p2",
    name: "נועה",
    age: 25,
    bio: "מעצבת UX. גולשת בסופשבוע",
    city: "תל אביב",
    distanceKm: 5,
    interests: ["עיצוב", "גלישה", "מוזיקה"],
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&h=800&fit=crop",
    verified: true,
  },
  {
    id: "p3",
    name: "שירה",
    age: 29,
    bio: "שפית ואופה. מחפשת שותף לארוחות רומנטיות",
    city: "רמת גן",
    distanceKm: 8,
    interests: ["בישול", "יין", "סרטים"],
    photo: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop",
    verified: false,
  },
  {
    id: "p4",
    name: "רותי",
    age: 26,
    bio: "וטרינרית. אוהבת חיות וטבע",
    city: "הרצליה",
    distanceKm: 12,
    interests: ["חיות", "טבע", "ריצה"],
    photo: "https://images.unsplash.com/photo-1534528741773-3e2dbd8c3e6d?w=600&h=800&fit=crop",
    verified: true,
  },
  {
    id: "p5",
    name: "דניאל",
    age: 28,
    bio: "מהנדסת תוכנה. מנגנת גיטרה בזמן הפנוי",
    city: "תל אביב",
    distanceKm: 3,
    interests: ["מוזיקה", "קוד", "קפה"],
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    verified: true,
  },
];

const initialState: State = {
  currentUser: {
    id: "me",
    name: "אתה",
    age: 27,
    bio: "מחפש קשר רציני עם הומור וכימיה",
    city: "תל אביב",
    distanceKm: 0,
    interests: ["מוזיקה", "טיולים", "קפה", "סרטים"],
    photo: "https://images.unsplash.com/photo-1633332755192-727a05c401a2?w=600&h=800&fit=crop",
    verified: true,
  },
  profiles: seedProfiles,
  matches: [],
  likedIds: [],
  passedIds: [],
};

let state: State = initialState;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const store = {
  getState: () => state,
  subscribe(l: () => void) {
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  },
  like(id: string) {
    const profile = state.profiles.find((p) => p.id === id);
    if (!profile) return;
    state = {
      ...state,
      likedIds: [...state.likedIds, id],
      matches: [
        ...state.matches,
        { user: profile, matchedAt: Date.now(), messages: [] },
      ],
    };
    emit();
  },
  pass(id: string) {
    state = { ...state, passedIds: [...state.passedIds, id] };
    emit();
  },
  sendMessage(matchIndex: number, text: string) {
    const matches = [...state.matches];
    matches[matchIndex] = {
      ...matches[matchIndex],
      messages: [
        ...matches[matchIndex].messages,
        { id: crypto.randomUUID(), fromMe: true, text, at: Date.now() },
      ],
    };
    state = { ...state, matches };
    emit();
    setTimeout(() => {
      const replies = ["ממש נחמד!", "ספר לי עוד", "נשמע מעניין!", "מה דעתך על פגישה אמיתית?", "אני מסכימה"];
      const updated = [...state.matches];
      updated[matchIndex] = {
        ...updated[matchIndex],
        messages: [
          ...updated[matchIndex].messages,
          {
            id: crypto.randomUUID(),
            fromMe: false,
            text: replies[Math.floor(Math.random() * replies.length)],
            at: Date.now(),
          },
        ],
      };
      state = { ...state, matches: updated };
      emit();
    }, 1800);
  },
  updateProfile(updates: Partial<User>) {
    state = { ...state, currentUser: { ...state.currentUser, ...updates } };
    emit();
  },
};

export function useStore() {
  return useSyncExternalStore(store.subscribe, store.getState, store.getState);
}