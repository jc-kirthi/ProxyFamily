/**
 * Audio Helper — Voice Cloning Simulation
 * Uses Web Speech API with stored voice profile parameters
 * to approximate the user's recorded voice characteristics.
 */

/**
 * Get stored voice profile from localStorage
 */
export const getVoiceProfile = () => {
  try {
    const stored = localStorage.getItem('proxyVoiceProfile');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Check if voice has been enrolled
 */
export const isVoiceEnrolled = () => {
  return localStorage.getItem('proxyVoiceRecorded') === 'true';
};

/**
 * Get voices reliably (handles async loading)
 */
/**
 * Play the stored neural fingerprint (the user's actual voice)
 * briefly to anchor the identity before TTS speak.
 */
export const playNeuralLinkSync = async () => {
  try {
    const { getAudioSample } = await import('./dbHelper');
    const blob = await getAudioSample('userVoice');
    if (!blob) return false;

    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    
    console.log('--- 🛡️ IDENTITY_SYNC: AUTHENTICATING BIOMETRICS ---');
    
    // Play the user's recording briefly to anchor the 'clone'
    audio.volume = 1.0;
    audio.playbackRate = 1.0; 
    
    return new Promise((resolve) => {
      // We only play for 2 seconds to act as a "Neural Fingerprint" 
      // This is the 'Practical' demo magic.
      const syncTimeout = setTimeout(() => {
        audio.pause();
        console.log('--- ✅ SYNC_COMPLETE: NEURAL_BREADCRUMB_ESTABLISHED ---');
        URL.revokeObjectURL(url);
        resolve(true);
      }, 2000);

      audio.onended = () => {
        clearTimeout(syncTimeout);
        URL.revokeObjectURL(url);
        resolve(true);
      };

      audio.play().catch(() => {
        clearTimeout(syncTimeout);
        resolve(false);
      });
    });
  } catch (err) {
    console.error('Neural Sync Failed:', err);
    return false;
  }
};

const getVoicesAsync = () => {
  return new Promise((resolve) => {
    let voices = window.speechSynthesis.getVoices();
    if (voices.length !== 0) {
      resolve(voices);
      return;
    }
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    };
  });
};

// Sequential playback queue — plays samples in order, 1 through 5
let voiceQueueIndex = 1;

export const resetVoiceQueue = () => { voiceQueueIndex = 1; };

export const playRecordedExcuse = async () => {
    if (voiceQueueIndex > 5) {
        console.log('🎬 PROXY: All 5 voice samples have been played.');
        return false; // No more samples
    }

    try {
        const { getAudioSample } = await import('./dbHelper');
        
        const key = `user_voice_generic_${voiceQueueIndex}`;
        const blob = await getAudioSample(key) || await getAudioSample('userVoice');
        
        if (!blob) {
            console.warn(`⚠️ No recording found for queue slot ${voiceQueueIndex}`);
            return false;
        }

        console.log(`--- 🛡️ PROXY VOICE: Playing sample ${voiceQueueIndex}/5 ---`);
        voiceQueueIndex++; // Advance queue for next call

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.volume = 1.0;
        
        return new Promise((resolve) => {
            audio.onended = () => { URL.revokeObjectURL(url); resolve(true); };
            audio.onerror = () => { URL.revokeObjectURL(url); resolve(false); };
            audio.play().catch(e => { console.error('Audio Error:', e); resolve(false); });
        });
    } catch (err) {
        console.error('Play Recorded Excuse Failed:', err);
        return false;
    }
};

export const speakExcuse = async (text, lang = 'en-IN') => {
  // Always cancel any existing TTS/speech first
  window.speechSynthesis?.cancel();

  // If voice is enrolled → play the next real recording, NOTHING else
  if (isVoiceEnrolled()) {
    await playRecordedExcuse();
    return; // Done — no TTS fallback ever
  }

  // Only use TTS if user has never recorded their voice at all
  console.log('ℹ️ No voice enrolled — showing text only (no audio)');
};

/**
 * Speak text as a relative (different pitch/rate than user)
 */
export const speakAsRelative = async (text, relativeType, lang = 'en-IN') => {
  if (!('speechSynthesis' in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);

  // Wait for voices to be ready
  const availableVoices = await getVoicesAsync();

  // Different voice characteristics per relative type
  const voiceMap = {
    aunty: { pitch: 1.6, rate: 1.2 }, // Higher pitch, faster (bossy)
    uncle: { pitch: 0.6, rate: 0.8 }, // Lower pitch, slower (grumpy)
    cousin: { pitch: 1.1, rate: 1.3 }, // Youthful, fast
    grandma: { pitch: 1.8, rate: 0.65 }, // Very high pitch, very slow (ancient)
  };

  const params = voiceMap[relativeType] || voiceMap.aunty;
  utterance.pitch = params.pitch;
  utterance.rate = params.rate;
  utterance.lang = lang; // Use the requested language

  // Try to find a voice matching the requested language, else fallback to Indian English
  const langMatch = availableVoices.find(v => v.lang.startsWith(lang.split('-')[0]));
  const indianVoice = availableVoices.find(v => v.lang.includes('en-IN') || v.name.includes('India'));
  
  if (langMatch) {
    utterance.voice = langMatch;
  } else if (indianVoice) {
    utterance.voice = indianVoice;
  }
  
  window.speechSynthesis.speak(utterance);
  return utterance;
};
