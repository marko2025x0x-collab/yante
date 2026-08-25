'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContactInfo {
  phone: string;
  phoneRaw: string;
  telegramUsername: string;
  telegramUrl: string;
  instagramUsername: string;
  instagramUrl: string;
  tiktokUsername: string;
  tiktokUrl: string;
  emailGeneral: string;
  emailWholesale: string;
  address: string;
  addressNote: string;
  workingHours: string;
}

const DEFAULT_CONTACTS: ContactInfo = {
  phone: '+380 (97) 123-45-67',
  phoneRaw: '+380971234567',
  telegramUsername: '@yanti_support_bot',
  telegramUrl: 'https://t.me/yanti_support_bot',
  instagramUsername: 'yanti_titanium',
  instagramUrl: 'https://instagram.com/yanti_titanium',
  tiktokUsername: '@yanti_titanium',
  tiktokUrl: 'https://tiktok.com/@yanti_titanium',
  emailGeneral: 'info@yanti-titanium.ua',
  emailWholesale: 'wholesale@yanti-titanium.ua',
  address: 'м. Київ, вул. Велика Васильківська, 72',
  addressNote: 'Самовивіз та консультація майстра за попереднім узгодженням',
  workingHours: 'Пн-Сб: 10:00 – 19:00, Нд: Вихідний',
};

interface ContactStoreState {
  contacts: ContactInfo;
  updateContacts: (newContacts: Partial<ContactInfo>) => void;
  resetContacts: () => void;
}

export const useContactStore = create<ContactStoreState>()(
  persist(
    (set) => ({
      contacts: DEFAULT_CONTACTS,
      updateContacts: (newContacts) =>
        set((state) => ({
          contacts: { ...state.contacts, ...newContacts },
        })),
      resetContacts: () => set({ contacts: DEFAULT_CONTACTS }),
    }),
    {
      name: 'yanti-contacts-storage-v1',
    }
  )
);
