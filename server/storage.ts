import { type User, type InsertUser, type Translation, type InsertTranslation } from "@shared/schema";
import { randomUUID } from "crypto";

interface InternalTranslation {
  id: string;
  koreanText: string;
  chineseText: string;
  romanization: string;
  createdAt: Date | string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getTranslations(): Promise<Translation[]>;
  createTranslation(translation: InsertTranslation): Promise<Translation>;
  clearTranslations(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private translations: InternalTranslation[];

  constructor() {
    this.users = new Map();
    this.translations = [];
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTranslations(): Promise<Translation[]> {
    const sorted = [...this.translations].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.map(t => ({
      ...t,
      createdAt: typeof t.createdAt === 'string' ? t.createdAt : t.createdAt.toISOString(),
    }));
  }

  async createTranslation(insertTranslation: InsertTranslation): Promise<Translation> {
    const trimmedData = {
      koreanText: insertTranslation.koreanText.trim(),
      chineseText: insertTranslation.chineseText.trim(),
      romanization: insertTranslation.romanization.trim(),
    };

    if (!trimmedData.koreanText || !trimmedData.chineseText || !trimmedData.romanization) {
      throw new Error("All translation fields must contain non-empty text");
    }

    const internalTranslation: InternalTranslation = {
      id: randomUUID(),
      ...trimmedData,
      createdAt: new Date().toISOString(),
    };
    this.translations.unshift(internalTranslation);
    
    return {
      ...internalTranslation,
      createdAt: internalTranslation.createdAt as string,
    };
  }

  async clearTranslations(): Promise<void> {
    this.translations = [];
  }
}

export const storage = new MemStorage();
