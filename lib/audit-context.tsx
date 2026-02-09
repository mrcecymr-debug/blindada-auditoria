import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuditAnswer, calculateScore, QUESTIONS } from './audit-data';

interface AuditContextValue {
  answers: Record<string, AuditAnswer>;
  setAnswer: (code: string, answer: string, observation?: string) => void;
  setObservation: (code: string, observation: string) => void;
  clearAll: () => void;
  score: ReturnType<typeof calculateScore>;
  answeredCount: number;
  totalCount: number;
}

const AuditContext = createContext<AuditContextValue | null>(null);

const STORAGE_KEY = '@casa_blindada_answers';

export function AuditProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, AuditAnswer>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(data => {
      if (data) {
        try {
          setAnswers(JSON.parse(data));
        } catch {}
      }
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    }
  }, [answers, loaded]);

  const setAnswer = (code: string, answer: string, observation?: string) => {
    setAnswers(prev => ({
      ...prev,
      [code]: {
        code,
        answer,
        observation: observation ?? prev[code]?.observation ?? '',
      },
    }));
  };

  const setObservation = (code: string, observation: string) => {
    setAnswers(prev => ({
      ...prev,
      [code]: {
        code,
        answer: prev[code]?.answer ?? '',
        observation,
      },
    }));
  };

  const clearAll = () => {
    setAnswers({});
    AsyncStorage.removeItem(STORAGE_KEY);
  };

  const score = useMemo(() => calculateScore(answers), [answers]);
  const answeredCount = Object.values(answers).filter(a => a.answer).length;
  const totalCount = QUESTIONS.length;

  const value = useMemo(() => ({
    answers,
    setAnswer,
    setObservation,
    clearAll,
    score,
    answeredCount,
    totalCount,
  }), [answers, score, answeredCount, totalCount]);

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
