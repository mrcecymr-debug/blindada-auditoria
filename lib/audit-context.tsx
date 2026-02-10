import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditAnswer, calculateScore, QUESTIONS } from './audit-data';

export interface SavedAudit {
  id: string;
  name: string;
  date: string;
  answers: Record<string, AuditAnswer>;
  answeredCount: number;
  totalCount: number;
  percentage: number;
  classification: string;
}

interface AuditContextValue {
  answers: Record<string, AuditAnswer>;
  setAnswer: (code: string, answer: string, observation?: string) => void;
  setObservation: (code: string, observation: string) => void;
  clearAll: () => void;
  score: ReturnType<typeof calculateScore>;
  answeredCount: number;
  totalCount: number;
  savedAudits: SavedAudit[];
  saveCurrentAudit: (name: string) => void;
  deleteSavedAudit: (id: string) => void;
  loadSavedAudit: (id: string) => void;
}

const AuditContext = createContext<AuditContextValue | null>(null);

const STORAGE_KEY = '@casa_blindada_answers';
const SAVED_KEY = '@casa_blindada_saved';

export function AuditProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, AuditAnswer>>({});
  const [savedAudits, setSavedAudits] = useState<SavedAudit[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_KEY),
      AsyncStorage.getItem(SAVED_KEY),
    ]).then(([answersData, savedData]) => {
      if (answersData) {
        try { setAnswers(JSON.parse(answersData)); } catch {}
      }
      if (savedData) {
        try { setSavedAudits(JSON.parse(savedData)); } catch {}
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers, loaded]);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(SAVED_KEY, JSON.stringify(savedAudits));
    }
  }, [savedAudits, loaded]);

  const setAnswer = useCallback((code: string, answer: string, observation?: string) => {
    setAnswers(prev => ({
      ...prev,
      [code]: {
        code,
        answer,
        observation: observation ?? prev[code]?.observation ?? '',
      },
    }));
  }, []);

  const setObservation = useCallback((code: string, observation: string) => {
    setAnswers(prev => ({
      ...prev,
      [code]: {
        code,
        answer: prev[code]?.answer ?? '',
        observation,
      },
    }));
  }, []);

  const clearAll = useCallback(() => {
    setAnswers({});
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const score = useMemo(() => calculateScore(answers), [answers]);
  const answeredCount = Object.values(answers).filter(a => a.answer).length;
  const totalCount = QUESTIONS.length;

  const saveCurrentAudit = useCallback((name: string) => {
    const currentScore = calculateScore(answers);
    const currentAnswered = Object.values(answers).filter(a => a.answer).length;
    const newAudit: SavedAudit = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      date: new Date().toISOString(),
      answers: { ...answers },
      answeredCount: currentAnswered,
      totalCount: QUESTIONS.length,
      percentage: currentScore.percentage,
      classification: currentScore.classification,
    };
    setSavedAudits(prev => [newAudit, ...prev]);
  }, [answers]);

  const deleteSavedAudit = useCallback((id: string) => {
    setSavedAudits(prev => prev.filter(a => a.id !== id));
  }, []);

  const loadSavedAudit = useCallback((id: string) => {
    const audit = savedAudits.find(a => a.id === id);
    if (audit) {
      setAnswers({ ...audit.answers });
    }
  }, [savedAudits]);

  const value = useMemo(() => ({
    answers,
    setAnswer,
    setObservation,
    clearAll,
    score,
    answeredCount,
    totalCount,
    savedAudits,
    saveCurrentAudit,
    deleteSavedAudit,
    loadSavedAudit,
  }), [answers, score, answeredCount, totalCount, savedAudits, saveCurrentAudit, deleteSavedAudit, loadSavedAudit]);

  if (!loaded) return null;

  return (
    <AuditContext.Provider value={value}>
      {children}
    </AuditContext.Provider>
  );
}

export function useAudit() {
  const ctx = useContext(AuditContext);
  if (!ctx) throw new Error('useAudit must be used within AuditProvider');
  return ctx;
}
