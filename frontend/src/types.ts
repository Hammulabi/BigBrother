export type Qualification = 'pending' | 'confirmed' | 'false_positive';
export type Stage = 'new' | 'investigating' | 'proposed' | 'processing' | 'resolved';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export interface Audit {
    at: string;
    actor: string;
    message: string;
}
export interface Flow {
    id: string;
    at: string;
    source: string;
    destination: string;
    sourcePort: number;
    destinationPort: number;
    protocol: 'TCP' | 'UDP' | 'ICMP';
    bytes: number;
    duration: number;
    assetId: string;
    result: 'pending' | 'normal' | 'anomaly';
}
export interface Alert {
    id: string;
    title: string;
    assetId: string;
    at: string;
    priority: Priority;
    origin: 'rule' | 'ml' | 'both';
    qualification: Qualification;
    stage: Stage;
    flowIds: string[];
    evidence: string[];
    score: number | null;
    threshold: number | null;
    model: string | null;
    history: Audit[];
}
export interface Asset {
    id: string;
    name: string;
    ip: string;
    zone: string;
    status: 'normal' | 'warning' | 'critical' | 'unknown';
    lastSeen: string | null;
    x: number;
    y: number;
}
export interface Link {
    source: string;
    target: string;
    provenance: string;
}
export interface Service {
    name: string;
    status: 'up' | 'down' | 'unknown';
    detail: string;
    lastSeen: string | null;
}
export interface Snapshot {
    sourceMode?: 'demo' | 'laboratory';
    generatedAt: string;
    flows: Flow[];
    alerts: Alert[];
    assets: Asset[];
    links: Link[];
    services: Service[];
    model: {
        name: string;
        version: string;
        threshold: number;
        metrics: null | {
            precision: number;
            recall: number;
            f1: number;
            falsePositivesPerHour: number;
        };
    };
}
export interface AlertUpdate {
    qualification: Qualification;
    stage: Stage;
    reason: string;
}
