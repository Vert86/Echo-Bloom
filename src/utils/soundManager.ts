// Sound Manager for Echo Bloom Farm
// This will handle all sound effects and background music

type SoundType =
  | 'plant'
  | 'water'
  | 'harvest'
  | 'purchase'
  | 'levelup'
  | 'notification'
  | 'animal'
  | 'build'
  | 'bgm';

class SoundManager {
  private enabled: boolean = true;
  private volume: number = 0.5;

  constructor() {
    // Initialize sound effects
    // In a real implementation, you would load actual audio files
    // For now, we'll use the Web Audio API to generate simple tones
  }

  play(soundType: SoundType) {
    if (!this.enabled) return;

    // Use Web Audio API for simple sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = this.volume;

    // Different sounds for different actions
    switch (soundType) {
      case 'plant':
        oscillator.frequency.value = 440;
        oscillator.type = 'sine';
        break;
      case 'water':
        oscillator.frequency.value = 330;
        oscillator.type = 'sine';
        break;
      case 'harvest':
        oscillator.frequency.value = 550;
        oscillator.type = 'square';
        break;
      case 'purchase':
        oscillator.frequency.value = 660;
        oscillator.type = 'triangle';
        break;
      case 'levelup':
        oscillator.frequency.value = 880;
        oscillator.type = 'square';
        break;
      case 'notification':
        oscillator.frequency.value = 500;
        oscillator.type = 'sine';
        break;
      case 'animal':
        oscillator.frequency.value = 350;
        oscillator.type = 'sawtooth';
        break;
      case 'build':
        oscillator.frequency.value = 220;
        oscillator.type = 'square';
        break;
    }

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  playBackgroundMusic() {
    // In a real implementation, this would play a looping background track
    console.log('Background music playing...');
  }

  stopBackgroundMusic() {
    console.log('Background music stopped...');
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
  }
}

export const soundManager = new SoundManager();

// Helper functions to play sounds
export const playSoundEffect = (soundType: SoundType) => {
  soundManager.play(soundType);
};

export const toggleSound = (enabled: boolean) => {
  soundManager.setEnabled(enabled);
};

export const setMasterVolume = (volume: number) => {
  soundManager.setVolume(volume);
};

/**
 * Future implementation with actual audio files:
 *
 * const SOUND_FILES = {
 *   plant: '/sounds/plant.mp3',
 *   water: '/sounds/water.mp3',
 *   harvest: '/sounds/harvest.mp3',
 *   purchase: '/sounds/purchase.mp3',
 *   levelup: '/sounds/levelup.mp3',
 *   notification: '/sounds/notification.mp3',
 *   animal: '/sounds/animal.mp3',
 *   build: '/sounds/build.mp3',
 *   bgm: '/sounds/background-music.mp3'
 * };
 *
 * Add to public/sounds/ directory:
 * - plant.mp3 (digging/planting sound)
 * - water.mp3 (water splashing)
 * - harvest.mp3 (satisfying collection sound)
 * - purchase.mp3 (cash register ding)
 * - levelup.mp3 (celebration fanfare)
 * - notification.mp3 (gentle chime)
 * - animal.mp3 (various animal sounds)
 * - build.mp3 (construction sounds)
 * - background-music.mp3 (peaceful farming music)
 */
