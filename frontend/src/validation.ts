import type { Snapshot } from './types';
type RecordValue = Record<string, unknown>;
const record = (v: unknown): v is RecordValue => v !== null && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown): v is string => typeof v === 'string';
const num = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);
const iso = (v: unknown) => str(v) && Number.isFinite(Date.parse(v));
const strings = (v: unknown) => Array.isArray(v) && v.every(str);
const choice = (v: unknown, values: string[]) => str(v) && values.includes(v);
const optionalDate = (v: unknown) => v === null || iso(v);
const optionalNumber = (v: unknown) => v === null || num(v);
const rows = (v: unknown, check: (r: RecordValue) => boolean) => Array.isArray(v) && v.every(r => record(r) && check(r));
export function validSnapshot(v: unknown): v is Snapshot {
    if (!record(v) || !iso(v.generatedAt) || !(v.sourceMode === undefined || choice(v.sourceMode, ['demo', 'laboratory'])))
        return false;
    const goodFlows = rows(v.flows, f => str(f.id) && iso(f.at) && str(f.source) && str(f.destination) && num(f.sourcePort) && num(f.destinationPort) && choice(f.protocol, ['TCP', 'UDP', 'ICMP']) && num(f.bytes) && num(f.duration) && str(f.assetId) && choice(f.result, ['pending', 'normal', 'anomaly']));
    const goodAlerts = rows(v.alerts, a => str(a.id) && str(a.title) && str(a.assetId) && iso(a.at) && choice(a.priority, ['critical', 'high', 'medium', 'low']) && choice(a.origin, ['rule', 'ml', 'both']) && choice(a.qualification, ['pending', 'confirmed', 'false_positive']) && choice(a.stage, ['new', 'investigating', 'proposed', 'processing', 'resolved']) && strings(a.flowIds) && strings(a.evidence) && optionalNumber(a.score) && optionalNumber(a.threshold) && (a.model === null || str(a.model)) && rows(a.history, h => iso(h.at) && str(h.actor) && str(h.message)));
    const goodAssets = rows(v.assets, a => str(a.id) && str(a.name) && str(a.ip) && str(a.zone) && choice(a.status, ['normal', 'warning', 'critical', 'unknown']) && optionalDate(a.lastSeen) && num(a.x) && a.x >= 0 && a.x <= 730 && num(a.y) && a.y >= 0 && a.y <= 375);
    const goodLinks = rows(v.links, l => str(l.source) && str(l.target) && str(l.provenance));
    const goodServices = rows(v.services, s => str(s.name) && choice(s.status, ['up', 'down', 'unknown']) && str(s.detail) && optionalDate(s.lastSeen));
    const m = v.model;
    const goodModel = record(m) && str(m.name) && str(m.version) && num(m.threshold) && (m.metrics === null || (record(m.metrics) && ['precision', 'recall', 'f1', 'falsePositivesPerHour'].every(k => num((m.metrics as RecordValue)[k]))));
    return Boolean(goodFlows && goodAlerts && goodAssets && goodLinks && goodServices && goodModel);
}
