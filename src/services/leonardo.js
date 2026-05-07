const LEONARDO_API_KEY = import.meta.env.VITE_LEONARDO_API_KEY;
const BASE_URL = 'https://cloud.leonardo.ai/api/rest/v1';

const headers = {
  'Authorization': `Bearer ${LEONARDO_API_KEY}`,
  'Content-Type': 'application/json',
};

// Generate image from prompt
export async function generateImage(prompt, options = {}) {
  const {
    negativePrompt = "blurry, low quality, distorted, ugly, deformed, extra limbs, watermark, text, logo",
    width = 1024,
    height = 1024,
    modelId = '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3', // Leonardo PhotoReal
    numImages = 1,
  } = options;

  try {
    // Start generation
    const response = await fetch(`${BASE_URL}/generations`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        prompt,
        negative_prompt: negativePrompt,
        width,
        height,
        modelId,
        num_images: numImages,
        presetStyle: 'PHOTOGRAPHY',
        photoReal: true,
        photoRealStrength: 0.55,
        alchemy: true,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const generationId = data.sdGenerationJob.generationId;

    // Poll for completion
    return await pollGenerationStatus(generationId);
  } catch (error) {
    console.error('Leonardo API error:', error);
    throw error;
  }
}

// Poll until image is ready
async function pollGenerationStatus(generationId, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds

    const response = await fetch(`${BASE_URL}/generations/${generationId}`, {
      headers,
    });

    const data = await response.json();
    const generation = data.generations_by_pk;

    if (generation.status === 'COMPLETE') {
      return generation.generated_images.map(img => ({
        url: img.url,
        id: img.id,
      }));
    }

    if (generation.status === 'FAILED') {
      throw new Error('Image generation failed');
    }
  }

  throw new Error('Generation timeout');
}

// Get user's credits
export async function getCredits() {
  try {
    const response = await fetch(`${BASE_URL}/me`, { headers });
    const data = await response.json();
    return data.user_details?.subscription_tokens || 0;
  } catch (error) {
    console.error('Failed to fetch credits:', error);
    return 0;
  }
}