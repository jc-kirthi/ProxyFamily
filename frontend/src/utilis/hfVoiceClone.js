import { Client } from "@gradio/client";
import { getAudioSample } from './dbHelper';

/**
 * Attempts to use the Hugging Face TonyAssi/Voice-Clone Gradio Space
 * for true zero-shot voice cloning.
 * This space has a dedicated named endpoint (/clone) and avoids replica routing errors.
 */
export const generateClonedAudio = async (text) => {
  try {
    console.log("🚀 Initializing Hugging Face Voice-Clone Connection...");
    
    // Retrieve the user's enrolled voice sample as the reference audio
    const referenceBlob = await getAudioSample('userVoice');
    if (!referenceBlob) throw new Error("No reference audio found");

    // Connect to the public TonyAssi Voice-Clone Space
    const client = await Client.connect("TonyAssi/Voice-Clone");
    
    console.log("🎙️ Sending text and reference audio for Cloning...");
    
    // The clone space takes: [Text Prompt (str), Reference Audio (blob)]
    // Endpoint is /clone
    const result = await client.predict("/clone", [
      text,            // Text Prompt
      referenceBlob,   // Voice reference audio file
    ]);

    console.log("✅ Voice Generation Success:", result);
    
    // result.data contains the outputs depending on version usually result.data[0] is the audio
    if (result && result.data && result.data[0]) {
        const audioData = result.data[0];
        const audioUrl = typeof audioData === 'string' ? audioData : audioData.url;
        return audioUrl;
    }
    
    throw new Error("Invalid response format from Gradio");
  } catch (err) {
    console.error("❌ Hugging Face Voice-Clone Failed:", err.message);
    return null;
  }
};
