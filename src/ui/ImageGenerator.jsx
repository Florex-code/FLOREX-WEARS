import React, { useState } from 'react';
import { generateImage, getCredits } from '../services/leonardo.js';
import '../styles/imageGenerator.css';

export default function ImageGenerator({ onImageGenerated, defaultPrompt = '' }) {
  const [prompt, setPrompt] = useState(defaultPrompt);
  const [loading, setLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [error, setError] = useState(null);
  const [credits, setCredits] = useState(null);

  // Check credits on mount
  React.useEffect(() => {
    getCredits().then(setCredits);
  }, []);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const images = await generateImage(prompt, {
        width: 1024,
        height: 1024,
      });
      setGeneratedImages(images);
      if (onImageGenerated) onImageGenerated(images[0].url);
    } catch (err) {
      setError(err.message || 'Failed to generate image');
    } finally {
      setLoading(false);
      // Refresh credits
      getCredits().then(setCredits);
    }
  };

  const presetPrompts = [
    "Navy blue hoodie, streetwear style, on white background, product photography, studio lighting, high quality fashion photo",
    "Elegant satin shirt, champagne color, luxury menswear, flat lay photography, minimal background, professional product shot",
    "Wide leg trousers, stone color, women's fashion, model wearing, clean background, editorial style photography",
    "Knit polo shirt, midnight blue, smart casual, folded neatly, white background, ecommerce product photo",
  ];

  return (
    <div className="imageGenerator">
      <div className="generatorHeader">
        <h3>✨ AI Image Generator</h3>
        {credits !== null && (
          <span className="creditsBadge">
            {credits} credits left
          </span>
        )}
      </div>

      <div className="generatorBody">
        <div className="promptSection">
          <label>Describe your product</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Navy hoodie, streetwear style, on white background..."
            rows={3}
          />
          
          <div className="presetPrompts">
            <span className="presetLabel">Quick prompts:</span>
            <div className="presetButtons">
              {presetPrompts.map((p, idx) => (
                <button
                  key={idx}
                  className="presetBtn"
                  onClick={() => setPrompt(p)}
                  title={p}
                >
                  {p.split(',')[0]}...
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          className="btn primary generateBtn"
          onClick={handleGenerate}
          disabled={loading || !prompt.trim()}
        >
          {loading ? (
            <>
              <span className="spinner"></span>
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>

        {error && (
          <div className="errorMessage">
            ⚠️ {error}
          </div>
        )}

        {generatedImages.length > 0 && (
          <div className="resultsSection">
            <h4>Generated Images</h4>
            <div className="generatedGrid">
              {generatedImages.map((img, idx) => (
                <div key={idx} className="generatedItem">
                  <img src={img.url} alt={`Generated ${idx + 1}`} />
                  <div className="generatedActions">
                    <button 
                      className="btn primary"
                      onClick={() => onImageGenerated?.(img.url)}
                    >
                      Use This
                    </button>
                    <a 
                      href={img.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn ghost"
                    >
                      View Full
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
