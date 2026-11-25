import type { Flow } from './types';
export const qualifications = { pending: 'À analyser', confirmed: 'Confirmée', false_positive: 'Faux positif' };
export const stages = { new: 'Nouveau', investigating: 'À analyser', proposed: 'Réponse proposée', processing: 'En traitement', resolved: 'Résolu' };
export const priorities = { critical: 'Critique', high: 'Haute', medium: 'Modérée', low: 'Basse' };
export const origins = { rule: 'Règle', ml: 'ML', both: 'Règle + ML' };
export const results = { pending: 'Non analysé', normal: 'Sans anomalie', anomaly: 'Anomalie' };
export const date = (s: string) => new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(new Date(s));
export function csvCell(v: unknown) { let s = String(v ?? ''); if (/^[\s]*[=+@-]/.test(s))
    s = "'" + s; return '"' + s.replaceAll('"', '""') + '"'; }
export function makeCsv(headers: string[], rows: unknown[][]) { return '\ufeff' + [headers, ...rows].map(row => row.map(csvCell).join(';')).join('\r\n'); }
export function download(name: string, content: string, type = 'text/csv;charset=utf-8') { const url = URL.createObjectURL(new Blob([content], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
export function filterFlows(flows: Flow[], query: string, protocol: string, result: string, minutes: number, reference: number) { return flows.filter(f => (!query || [f.id, f.source, f.destination, f.assetId].some(x => x.toLowerCase().includes(query.toLowerCase()))) && (protocol === 'all' || f.protocol === protocol) && (result === 'all' || f.result === result) && (minutes === 0 || new Date(f.at).getTime() >= reference - minutes * 60000)); }
