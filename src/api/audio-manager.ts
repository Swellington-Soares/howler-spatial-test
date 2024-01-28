import { Howl } from 'howler';
import { Vector3 } from './types/vector';
import { PlayerAudio } from './types/player-audio';

class AudioManager {
  private static instancia: AudioManager | null = null;
  public playerId : number | null = null;
  private _audios = new Map<number, AudioObject>();

  private currentAudio: PlayerAudio | null = null;
  public onLoad?: ((audioInfo?: AudioObject) => void) | null = null;
  public onPlay?: ((audioInfo?: AudioObject) => void) | null = null;
  public onPause?: ((audioInfo?: AudioObject) => void) | null = null;
  public onStop?: ((audioInfo?: AudioObject) => void) | null = null;
  public onVolumeChange?: ((audioInfo?: AudioObject) => void) | null = null;
  public onRateChange?: ((audioInfo?: AudioObject) => void) | null = null;
  public onEnd?: ((audioInfo?: AudioObject) => void) | null = null;
  public onSeekChange?: ((audioInfo?: AudioObject) => void) | null = null;
  public onError?: ((audioInfo?: AudioObject, error?: unknown) => void) | null = null;


  private constructor() {
    // O construtor é privado para evitar a criação de instâncias fora da classe.
  }
  static getInstance(): AudioManager {
    if (!AudioManager.instancia) {
      AudioManager.instancia = new AudioManager();
    }
    return AudioManager.instancia;
  }

  private DoLoad(audioInfo?: AudioObject) {
    if (this.onLoad) this.onLoad(audioInfo);
  }

  private DoPlay(audioInfo?: AudioObject) {
    if (this.onPlay) this.onPlay(audioInfo);
  }
  private DoPause(audioInfo?: AudioObject) {
    if (this.onPause) this.onPause(audioInfo);
  }
  private DoStop(audioInfo?: AudioObject) {
    if (this.onStop) this.onStop(audioInfo);
  }
  private DoVolumeChange(audioInfo?: AudioObject) {
    if (this.onVolumeChange) this.onVolumeChange(audioInfo);
  }
  private DoRateChange(audioInfo?: AudioObject) {
    if (this.onRateChange) this.onRateChange(audioInfo);
  }
  private DoEnd(audioInfo?: AudioObject) {
    if (this.onEnd) this.onEnd(audioInfo);
  }
  private DoSeekChange(audioInfo?: AudioObject) {
    if (this.onSeekChange) this.onSeekChange(audioInfo);
  }

  private DoError(audioInfo?: AudioObject, error?: unknown) {
    if (this.onError) this.onError(audioInfo, error);
  }

  updateGlobalPosition(x: number, y: number, z: number): void {
    Howler.pos(x, y, z);
  }

  setOwner(playerId: number) {
    this.playerId = playerId
  }

  setAudio(
    url: string,
    pos: Vector3,
    volume: number = 0.5,
    loop: boolean = false,
    maxrange: number,
    playerId: number,
  ): void {
    const self = this;
    this.destroy(playerId);
    const audioObj: AudioObject = {};
    audioObj.howl = new Howl({
      src: [url, url],
      format: ['m4a', 'mp3'],
      html5: false,
      autoplay: false,
      loop: loop,
      volume: volume,
      onload(soundId: number) {
        audioObj.playerId = playerId;
        audioObj.howlId = soundId;
        audioObj.loop = loop;
        audioObj.maxrange = maxrange;
        audioObj.url = url;
        audioObj.volume = volume;
        audioObj.pos = pos;
        audioObj.howlId = audioObj.howl?.play();
        self._audios.set(playerId, audioObj);
        self.DoLoad(audioObj);
      },
      onend() {
        self.DoEnd(audioObj);
      },
      onloaderror(_: number, error: unknown) {
        self.DoError(audioObj, error);
      },
      onpause() {
        self.DoPause(audioObj);
      },
      onplay(soundid: number) {
        audioObj.howl?.pos(pos.x, pos.y, pos.z, soundid);
        audioObj.howl?.pannerAttr(
          {
            panningModel: 'HRTF',
            refDistance: 1.0,
            rolloffFactor: -5.0,
            distanceModel: 'linear',
            maxDistance: 400
          },
          soundid
        );
        audioObj.howl?.pannerAttr(audioObj.howl.pannerAttr(), soundid);
        self.DoPlay(audioObj);
      },
      onplayerror(_: number, error: unknown) {
        self.DoError(audioObj, error);
      },
      onrate() {
        self.DoRateChange(audioObj);
      },
      onseek() {
        self.DoSeekChange(audioObj);
      },
      onstop() {
        self.DoStop(audioObj);
      },
      onvolume() {
        self.DoVolumeChange(audioObj);
      }
    });

    if (playerId == this.playerId) {
      this.currentAudio = { howlId: audioObj.howlId, playerId: playerId };
    }
  }

  resume(playerId?: number): void {}
  stop(playerId?: number): void {}
  pause(playerId?: number): void {}
  setRate(newrate: number, playerId?: number): void {}
  setVolume(newvolume: number, playerId?: number): void {}
  setPos(x: number, y: number, z: number, playerId?: number): void {}
  destroy(playerId?: number): void {}
}

const SoundManager = AudioManager.getInstance();
export { SoundManager };
