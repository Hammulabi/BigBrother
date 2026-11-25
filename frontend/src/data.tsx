import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import type { Snapshot, Alert, AlertUpdate } from './types';
import { makeDemo } from './demo';
import { validSnapshot } from './validation';
export { validSnapshot } from './validation';
const MODE = import.meta.env.VITE_DATA_MODE === 'api' ? 'api' : 'demo';
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/$/, '');
const KEY = 'bigbrother-demo-v1';
async function request<T>(path: string, init?: RequestInit): Promise<T> { const r = await fetch(BASE + '/api/v1' + path, { ...init, credentials: 'include', headers: { 'Content-Type': 'application/json', ...init?.headers }, signal: AbortSignal.timeout(12000) }); if (!r.ok)
    throw new Error(`API ${r.status} : demande refusée ou service indisponible.`); return r.json(); }
function initial(): Snapshot | null { if (MODE !== 'demo')
    return null; try {
    const cached = localStorage.getItem(KEY);
    if (cached) {
        const parsed = JSON.parse(cached);
        if (validSnapshot(parsed))
            return parsed;
    }
}
catch { /* Fall back to explicit demo data. */ } return makeDemo(); }
interface DataContext {
    data: Snapshot | null;
    mode: string;
    error: string;
    connection: string;
    paused: boolean;
    setPaused: (v: boolean) => void;
    reload: () => void;
    updateAlert: (id: string, update: AlertUpdate) => Promise<void>;
    reset: () => void;
}
const Context = createContext<DataContext | null>(null);
export function Provider({ children }: {
    children: ReactNode;
}) {
    const [data, setData] = useState<Snapshot | null>(initial);
    const [error, setError] = useState('');
    const [connection, setConnection] = useState(MODE === 'demo' ? 'Démo locale' : 'Connexion…');
    const [paused, setPaused] = useState(false);
    const latest = useRef<Snapshot | null>(null);
    const reload = useCallback(async () => { if (MODE === 'demo') {
        setError('');
        setConnection('Démo locale');
        return;
    } try {
        const s = await request<Snapshot>('/snapshot');
        if (!validSnapshot(s))
            throw new Error('Format de données incompatible avec le contrat.');
        setData(s);
        setError('');
    }
    catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur réseau');
    } }, []);
    useEffect(() => { if (MODE === 'demo' && data)
        localStorage.setItem(KEY, JSON.stringify(data)); }, [data]);
    useEffect(() => { void reload(); }, [reload]);
    useEffect(() => { if (!paused && latest.current) {
        setData(latest.current);
        latest.current = null;
    } }, [paused]);
    useEffect(() => { if (MODE !== 'api')
        return; const stream = new EventSource(BASE + '/api/v1/stream', { withCredentials: true }); stream.onopen = () => setConnection('En direct'); stream.onerror = () => setConnection('Reconnexion…'); stream.onmessage = (e) => { try {
        const s: unknown = JSON.parse(e.data);
        if (!validSnapshot(s))
            throw new Error();
        if (paused)
            latest.current = s;
        else
            setData(s);
        setError('');
    }
    catch {
        setError('Événement SSE invalide : dernière vue conservée.');
    } }; return () => stream.close(); }, [paused]);
    async function updateAlert(id: string, update: AlertUpdate) { if (!update.reason.trim())
        throw new Error('Une justification est obligatoire.'); if (update.reason.length > 2000)
        throw new Error('La justification est limitée à 2 000 caractères.'); if (MODE === 'api') {
        const a = await request<Alert>(`/alerts/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(update) });
        setData(d => d ? { ...d, alerts: d.alerts.map(old => old.id === id ? a : old) } : d);
        return;
    } setData(d => d ? { ...d, alerts: d.alerts.map(a => a.id === id ? { ...a, qualification: update.qualification, stage: update.stage, history: [...a.history, { at: new Date().toISOString(), actor: 'Yanis · démo locale', message: `Qualification : ${update.qualification} ; étape : ${update.stage}. ${update.reason.trim()}` }] } : a) } : d); }
    function reset() { if (MODE === 'demo') {
        setData(makeDemo());
        setPaused(false);
    } }
    return <Context.Provider value={{ data, mode: MODE, error, connection, paused, setPaused, reload: () => void reload(), updateAlert, reset }}>{children}</Context.Provider>;
}
export function useData() { const value = useContext(Context); if (!value)
    throw new Error('Provider manquant'); return value; }
