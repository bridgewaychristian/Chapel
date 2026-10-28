import React, {createContext, useContext, useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';
import type {CueId} from '../config/timing';

export type Narration = Partial<Record<CueId, string>>;

/** Parses public/narration/script.txt ("cNN | text" per line, # comments). */
export const parseScript = (raw: string): Narration => {
  const out: Narration = {};
  for (const line of raw.split(/\r?\n/)) {
    const m = line.match(/^\s*(c\d{2})\s*\|\s*(.+?)\s*$/);
    if (m) out[m[1] as CueId] = m[2];
  }
  return out;
};

const NarrationCtx = createContext<Narration>({});

export const NarrationProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [narration, setNarration] = useState<Narration | null>(null);
  const [handle] = useState(() => delayRender('Loading narration script'));

  useEffect(() => {
    fetch(staticFile('narration/script.txt'))
      .then((r) => r.text())
      .then((txt) => {
        setNarration(parseScript(txt));
        continueRender(handle);
      })
      .catch((err) => {
        console.error('Could not load narration script', err);
        setNarration({});
        continueRender(handle);
      });
  }, [handle]);

  if (!narration) return null;
  return <NarrationCtx.Provider value={narration}>{children}</NarrationCtx.Provider>;
};

export const useNarration = () => useContext(NarrationCtx);
export const useLine = (id: CueId) => useContext(NarrationCtx)[id] ?? '';
