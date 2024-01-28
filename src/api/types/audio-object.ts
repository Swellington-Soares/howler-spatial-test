interface AudioObject {
    playerId?: number;
    howl?: Howl;
    howlId?: number;
    url?: string;
    volume?: number;
    loop?: boolean;
    state?: 'PLAYING' | 'STOPPED' | 'PAUSED';
    maxrange?: number;
    pos?: Vector3;
}