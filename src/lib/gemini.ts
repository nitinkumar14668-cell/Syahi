import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateLyrics(topic: string, language: string, vibe: string, inspirations: string[]) {
  const inspirationInstruction = inspirations.length > 0 
    ? `2. Channel the depth and rawness of indie artists like ${inspirations.map(i => `"${i}"`).join(', ')}.`
    : `2. Channel the depth and rawness of soulful indie artists and poetic verses.`;

  const prompt = `You are a profoundly soulful and real human lyricist, deeply inspired by poetic indie music, sufi rock, and raw human emotions. Write a beautiful, deep, and poetic song lyric. 
  
Theme / Topic: ${topic}
Language: ${language}
Vibe / Style: ${vibe}

Instructions:
1. The writing MUST NOT sound like generic AI. Avoid basic ABAB rhymes or clichéd phrases.
${inspirationInstruction}
3. Use rich, evocative metaphors (like ink, fate, wanderer, restless nights, raw heartbreak, or profound love).
4. Structure the song with varied elements and INCLUDE explicit square bracket markers (like [Intro], [Verse 1], [Pre-Chorus], [Chorus], [Instrumental Break], [Bridge], [Outro]) before each section. Let the flow be natural and human.
5. If the language is Hindi or Hinglish, infuse it with slight Urdu/Sufi vocabulary (like 'muntazir', 'fitoor', 'ranjish', 'syahi', 'bairan') where it fits naturally.
6. Only output the lyrics, do not include any conversational text or explanations before or after. Provide a poetic title at the top.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.9,
      topP: 0.95,
      systemInstruction: "You are a legendary songwriter known for deeply emotional, poetic, and raw indie hits that touch the soul."
    }
  });

  return response.text;
}
