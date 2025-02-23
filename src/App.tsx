import React, { useState } from 'react';
import { Download, Loader2, Link2, AlertCircle, Sun, Moon, Music } from 'lucide-react';

interface VideoLink {
  t: string;
  ft: number | string;
  s: string;
  a: string;
}

interface VideoData {
  status: string;
  data: {
    status: string;
    mess: string;
    cover: string;
    desc: string;
    author: string;
    author_name: string;
    author_a: string;
    links: VideoLink[];
  };
}

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [videoData, setVideoData] = useState<VideoData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setVideoData(null);
    
    try {
      const response = await fetch('http://api.pdwteam.com/v1/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: url,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch video');
      }

      const data = await response.json();
      setVideoData(data);
    } catch (err) {
      setError('Failed to fetch video. Please check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-slate-950 text-white' 
        : 'bg-gray-50 text-slate-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        {/* Theme Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-3 rounded-full transition-colors ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700'
                : 'bg-white hover:bg-gray-100 shadow-md'
            }`}
          >
            {isDark ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-slate-700" />
            )}
          </button>
        </div>

        <div className="max-w-2xl mx-auto pt-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className={`text-4xl font-bold mb-3 ${
              isDark
                ? 'bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent'
                : 'text-slate-900'
            }`}>
              TikTok Downloader
            </h1>
            <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Download TikTok videos in high quality
            </p>
          </div>

          {/* URL Input Form */}
          <form onSubmit={handleSubmit} className="mb-8">
            <div className={`p-4 rounded-2xl transition-colors ${
              isDark
                ? 'bg-slate-900'
                : 'bg-white shadow-lg'
            }`}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Link2 className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                      isDark ? 'text-slate-500' : 'text-slate-400'
                    }`} size={20} />
                    <input
                      type="text"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="Paste TikTok video URL here"
                      className={`w-full pl-12 pr-4 py-3 rounded-xl transition-colors ${
                        isDark
                          ? 'bg-slate-800 border-slate-700 focus:border-blue-500'
                          : 'bg-gray-50 border-gray-200 focus:border-blue-500'
                      } border focus:outline-none focus:ring-2 focus:ring-blue-500/20`}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={loading || !url}
                  className={`py-3 px-6 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    isDark
                      ? 'bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700'
                      : 'bg-blue-500 hover:bg-blue-600 disabled:bg-gray-200'
                  } disabled:cursor-not-allowed`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Download size={20} />
                      Download
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 text-red-400 flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>
          </form>

          {/* Video Information and Download Options */}
          {videoData && videoData.data && (
            <div className={`space-y-6 mb-12 ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              {/* Video Details */}
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-900' : 'bg-white shadow-lg'
              }`}>
                <div className="flex items-start gap-4">
                  <img
                    src={videoData.data.author_a}
                    alt={videoData.data.author_name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{videoData.data.author_name}</h3>
                    <p className={`text-sm ${
                      isDark ? 'text-slate-400' : 'text-slate-600'
                    }`}>{videoData.data.author}</p>
                    <p className="mt-2">{videoData.data.desc}</p>
                  </div>
                </div>
              </div>

              {/* Download Options */}
              <div className={`p-6 rounded-xl ${
                isDark ? 'bg-slate-900' : 'bg-white shadow-lg'
              }`}>
                <h3 className="text-lg font-semibold mb-4">Download Options</h3>
                <div className="space-y-3">
                  {videoData.data.links.map((link, index) => (
                    <a
                      key={index}
                      href={link.a}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                        isDark
                          ? 'bg-slate-800 hover:bg-slate-700'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {link.ft === "3" ? (
                          <Music size={20} className={
                            isDark ? 'text-blue-400' : 'text-blue-500'
                          } />
                        ) : (
                          <Download size={20} className={
                            isDark ? 'text-blue-400' : 'text-blue-500'
                          } />
                        )}
                        <span className="font-medium">
                          {link.ft === "3" ? "Audio (MP3)" : `Video ${link.s}`}
                        </span>
                      </div>
                      <span className={`text-sm ${
                        isDark ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        {link.ft === "3" ? "Audio Only" : "MP4"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Features Section */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: 'High Quality', desc: 'Original quality downloads' },
              { title: 'Fast & Free', desc: 'Quick, no-cost service' },
              { title: 'Easy to Use', desc: 'Simple one-click process' }
            ].map((feature, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl transition-colors ${
                  isDark
                    ? 'bg-slate-900'
                    : 'bg-white shadow-md'
                }`}
              >
                <h3 className="text-lg font-medium mb-1">{feature.title}</h3>
                <p className={`${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                } text-sm`}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
