import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { generateLyrics } from './lib/gemini';
import { Sparkles, Copy, Check, Feather, Loader2 } from 'lucide-react';

export default function App() {
  const [topic, setTopic] = useState('');
  const [language, setLanguage] = useState('Hinglish');
  const [vibe, setVibe] = useState('Sufi / Soulful');
  const [selectedInspirations, setSelectedInspirations] = useState<string[]>(['The Local Train', 'Official Banjaare', 'Anuv Jain']);
  const [loading, setLoading] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [copied, setCopied] = useState(false);

  const languages = ['Hinglish', 'Pure Hindi (Devanagari)', 'Urdu (Roman)', 'English'];
  const vibes = [
    'Sufi / Soulful', 
    'Raw / Heartbreak (Indie)', 
    'Ghazal / Poetic',
    'Desi Hip-Hop / Rap', 
    'Folk / Traditional'
  ];
  const allInspirations = ['The Local Train', 'Official Banjaare', 'Anuv Jain', 'Prateek Kuhad', 'When Chai Met Toast', 'Bayaan', 'Ali Sethi'];

  const toggleInspiration = (artist: string) => {
    setSelectedInspirations(prev => 
      prev.includes(artist) ? prev.filter(a => a !== artist) : [...prev, artist]
    );
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    setLyrics(''); // Clear previous lyrics to show loading beautifully
    setCopied(false);
    
    try {
      const result = await generateLyrics(topic, language, vibe, selectedInspirations);
      setLyrics(result || 'Apologies, the pen ran dry. Please try again.');
    } catch (err) {
      console.error(err);
      setLyrics('Failed to reach the muse. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!lyrics) return;
    navigator.clipboard.writeText(lyrics);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden">
      {/* Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-white/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Editor Panel (Left) */}
      <div className="w-full md:w-[400px] lg:w-[500px] border-r border-white/10 p-6 md:p-12 flex flex-col shrink-0 overflow-y-auto z-10 bg-ink-900/80 backdrop-blur-sm">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <Feather className="w-6 h-6 text-white/80" />
            <h1 className="text-3xl font-serif font-medium tracking-wide">Syahi</h1>
          </div>
          <p className="text-sm text-white/50 tracking-wider uppercase font-medium">Soulful Lyrics Writer</p>
        </div>

        <form onSubmit={handleGenerate} className="flex flex-col gap-8 flex-1">
          <div className="flex flex-col gap-3">
            <label htmlFor="topic" className="text-sm font-medium text-white/70">What's the song about?</label>
            <textarea 
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="A modern heartbreak in a rainy city, missing someone who never existed..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all resize-none"
              required
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="vibe" className="text-sm font-medium text-white/70">Vibe & Genre</label>
            <div className="relative">
              <select 
                id="vibe"
                value={vibe}
                onChange={(e) => setVibe(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all cursor-pointer"
              >
                {vibes.map(v => <option key={v} value={v} className="bg-ink-800 text-white">{v}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-b border-white/50 w-2.5 h-2.5 -rotate-45" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="language" className="text-sm font-medium text-white/70">Language</label>
            <div className="relative">
              <select 
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full appearance-none bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-white/30 transition-all cursor-pointer"
              >
                {languages.map(l => <option key={l} value={l} className="bg-ink-800 text-white">{l}</option>)}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none border-l border-b border-white/50 w-2.5 h-2.5 -rotate-45" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-white/70">Inspirations (Optional)</label>
            <div className="flex flex-wrap gap-2">
              {allInspirations.map((artist) => {
                const isSelected = selectedInspirations.includes(artist);
                return (
                  <button
                    key={artist}
                    type="button"
                    onClick={() => toggleInspiration(artist)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border ${
                      isSelected 
                        ? 'bg-white/20 border-white/30 text-white' 
                        : 'bg-transparent border-white/10 text-white/50 hover:bg-white/5'
                    }`}
                  >
                    {artist}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button 
              type="submit"
              disabled={loading || !topic.trim()}
              className="w-full flex items-center justify-center gap-2 bg-white text-ink-900 py-4 rounded-xl font-medium hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Writing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Write Lyrics
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Output Panel (Right) */}
      <div className="flex-1 relative bg-ink-900 flex flex-col pt-12 md:p-12 overflow-y-auto">
        <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col justify-center min-h-[60vh] md:min-h-0 px-6 pb-12 md:p-0">
          
          <AnimatePresence mode="wait">
            {!lyrics && !loading ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="text-center flex flex-col items-center justify-center h-full text-white/30"
              >
                <Feather className="w-12 h-12 mb-6 opacity-50" />
                <p className="font-serif text-xl italic">The ink waits for your prompt.</p>
              </motion.div>
            ) : loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center flex flex-col items-center justify-center h-full text-white/50"
              >
                <motion.div 
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Feather className="w-10 h-10 mb-6 text-white/40" />
                </motion.div>
                <p className="text-sm tracking-widest uppercase">Channeling the muse...</p>
              </motion.div>
            ) : (
              <motion.div
                key="lyrics"
                initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="w-full relative"
              >
                {/* Action Bar */}
                <div className="flex justify-end mb-6 sticky top-0 z-20 bg-ink-900/80 backdrop-blur-sm py-4 md:py-0 md:bg-transparent md:backdrop-blur-none">
                  <button 
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-sm font-medium text-white/80 transition-colors border border-white/5"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied' : 'Copy Lyrics'}
                  </button>
                </div>

                {/* Lyrics Content */}
                <div className="font-serif text-lg md:text-xl leading-[2.2] tracking-wide text-paper whitespace-pre-wrap">
                  {lyrics}
                </div>
                
                {/* Decorative End */}
                <div className="mt-16 flex justify-center pb-24 md:pb-0">
                  <div className="w-16 h-px bg-white/10" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
