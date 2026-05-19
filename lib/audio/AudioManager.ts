/**
 * Client-safe HTML5 Audio Manager for Next.js cinematic web applications.
 * Handles preloading, audio play safety fallback, and clean volume setting.
 */
export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private isPreloaded = false;

  constructor(src: string) {
    if (typeof window !== 'undefined') {
      this.audio = new Audio(src);
      this.audio.preload = 'auto';
    }
  }

  /**
   * Preloads the audio source asset cleanly on the client side.
   */
  preload() {
    if (this.isPreloaded || !this.audio) return;
    try {
      this.audio.load();
      this.isPreloaded = true;
    } catch (err) {
      console.warn('Audio preloading failed:', err);
    }
  }

  /**
   * Triggers audio playback with safe volume levels, returning a promise.
   */
  play(volume = 0.65): Promise<void> {
    if (!this.audio) return Promise.resolve();
    try {
      this.audio.volume = volume;
      return this.audio.play();
    } catch (err) {
      console.warn('Audio playback was blocked or failed:', err);
      return Promise.resolve();
    }
  }

  /**
   * Seeks the audio to a specific playback time in seconds.
   */
  seek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
    }
  }

  /**
   * Returns the direct HTMLAudioElement wrapper if needed.
   */
  getElement(): HTMLAudioElement | null {
    return this.audio;
  }
}
