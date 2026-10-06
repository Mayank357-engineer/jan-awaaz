// ========================================================
// gemma.js — Jan Awaaz: LM Studio / Gemma AI Integration
// ========================================================

const GEMMA_API_URL = 'http://localhost:1234/v1/chat/completions';
const GEMMA_MODEL = 'gemma'; // LM Studio will route to whatever is loaded

let _gemmaAvailable = null;
let _gemmaCheckTime = 0;
let _gemmaModelId = GEMMA_MODEL;

// ── Check if LM Studio is running ────────────────────────
async function isGemmaAvailable() {
  const now = Date.now();
  if (_gemmaAvailable !== null && (now - _gemmaCheckTime) < 30000) {
    return _gemmaAvailable;
  }
  try {
    const resp = await fetch('http://localhost:1234/v1/models', { 
      method: 'GET',
      signal: AbortSignal.timeout(3000)
    });
    if (!resp.ok) throw new Error(`LM Studio returned ${resp.status}`);
    const data = await resp.json();
    _gemmaModelId = data.data?.[0]?.id || GEMMA_MODEL;
    _gemmaAvailable = Boolean(data.data?.length);
  } catch {
    _gemmaAvailable = false;
  }
  _gemmaCheckTime = now;
  return _gemmaAvailable;
}

// ── Core API call ────────────────────────────────────────
async function callGemma(messages, temperature = 0.7, maxTokens = 1024) {
  try {
    const resp = await fetch(GEMMA_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: _gemmaModelId,
        messages: messages,
        temperature: temperature,
        max_tokens: maxTokens,
        stream: false
      }),
      signal: AbortSignal.timeout(30000)
    });
    if (!resp.ok) throw new Error('API error: ' + resp.status);
    const data = await resp.json();
    return data.choices[0].message.content;
  } catch (e) {
    console.warn('Gemma API call failed:', e.message);
    return null;
  }
}

// ── 1. Analyze infrastructure image ─────────────────────
async function analyzeImage(imageBase64) {
  const available = await isGemmaAvailable();

  if (available) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are an AI assistant that analyzes photos of public infrastructure problems in India. 
Respond ONLY with a valid JSON object, no other text. The JSON must have exactly these fields:
{
  "type": one of "pothole", "broken_streetlight", "overflowing_drain", "burst_pipeline", "garbage",
  "severity": one of "high", "medium", "low",
  "description_hindi": a 2-3 sentence description in Hindi of the problem and its impact,
  "description_english": a 2-3 sentence description in English
}`
        },
        {
          role: 'user',
          content: [
            { type: 'text', text: 'Analyze this photo of a public infrastructure issue. Identify the type, severity, and describe the problem.' },
            { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
          ]
        }
      ];
      const result = await callGemma(messages, 0.3, 512);
      if (result) {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }
    } catch (e) {
      console.warn('Image analysis failed, using mock:', e.message);
    }
  }

  // Mock fallback
  return getMockAnalysis();
}

function getMockAnalysis() {
  const types = ['pothole', 'broken_streetlight', 'overflowing_drain', 'burst_pipeline', 'garbage'];
  const type = types[Math.floor(Math.random() * types.length)];
  const severities = ['high', 'medium', 'low'];
  const severity = severities[Math.floor(Math.random() * severities.length)];

  const descriptions = {
    pothole: {
      hi: 'सड़क पर गड्ढा पाया गया है जो वाहनों और पैदल चलने वालों के लिए खतरनाक है। तुरंत मरम्मत की आवश्यकता है।',
      en: 'A pothole has been detected on the road that is dangerous for vehicles and pedestrians. Immediate repair is needed.'
    },
    broken_streetlight: {
      hi: 'स्ट्रीटलाइट खराब है और काम नहीं कर रही। रात में अंधेरा रहता है जिससे सुरक्षा का खतरा है।',
      en: 'Streetlight is broken and not functioning. Darkness at night poses safety risks.'
    },
    overflowing_drain: {
      hi: 'नाला उफन रहा है और गंदा पानी सड़क पर आ गया है। स्वास्थ्य और स्वच्छता का खतरा।',
      en: 'Drain is overflowing and dirty water has spread on the road. Health and hygiene risk.'
    },
    burst_pipeline: {
      hi: 'पानी की पाइपलाइन से रिसाव हो रहा है। पानी बर्बाद हो रहा है और सड़क पर जमा हो रहा है।',
      en: 'Water pipeline is leaking. Water is being wasted and accumulating on the road.'
    },
    garbage: {
      hi: 'कूड़े का ढेर जमा है जो वातावरण को प्रदूषित कर रहा है। सफाई की तुरंत जरूरत।',
      en: 'Garbage pile has accumulated polluting the environment. Immediate cleaning needed.'
    }
  };

  return {
    type,
    severity,
    description_hindi: descriptions[type].hi,
    description_english: descriptions[type].en
  };
}

// ── 2. Read signboard from image ─────────────────────────
async function readSignboard(imageBase64, nearbyShops) {
  const available = await isGemmaAvailable();
  if (!available) return null;

  try {
    const shopList = nearbyShops.map(s => s.name).join(', ');
    const messages = [
      {
        role: 'system',
        content: `You read shop signboards from photos. If you can read any shop/business name signboard in the image, respond with ONLY the shop name. If it matches any of these nearby shops: [${shopList}], respond with the exact matching name. If no signboard is visible, respond with "NONE".`
      },
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Can you read any shop signboard in this image?' },
          { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
        ]
      }
    ];
    const result = await callGemma(messages, 0.2, 100);
    if (result && result.trim() !== 'NONE') {
      const matched = nearbyShops.find(s => 
        result.toLowerCase().includes(s.name.toLowerCase()) || 
        s.name.toLowerCase().includes(result.trim().toLowerCase())
      );
      return matched ? matched.name : { read: result.trim(), verified: false };
    }
  } catch (e) {
    console.warn('Signboard reading failed:', e.message);
  }
  return null;
}

// ── 3. Polish user description ───────────────────────────
async function polishDescription(userText, originalAnalysis) {
  const available = await isGemmaAvailable();
  if (!available) return userText;

  try {
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant. Take the user's description of a public infrastructure problem and:
1. Polish the language (make it clear, respectful, professional)
2. Remove any abusive, irrelevant, or offensive content
3. Keep the same language (Hindi or English) as the input
4. Keep it concise (2-4 sentences)
5. Do NOT change the factual content
Respond with ONLY the polished text, nothing else.`
      },
      {
        role: 'user',
        content: `Original AI analysis: ${originalAnalysis}\n\nUser's edited description:\n${userText}`
      }
    ];
    const result = await callGemma(messages, 0.4, 256);
    return result || userText;
  } catch (e) {
    console.warn('Polish failed:', e.message);
    return userText;
  }
}

// ── 4. Moderate comment ──────────────────────────────────
async function moderateComment(text) {
  // First check local bad-word list
  if (containsBadWords(text)) {
    let cleaned = text;
    BAD_WORDS_HI.forEach(w => {
      const regex = new RegExp(w, 'gi');
      cleaned = cleaned.replace(regex, '***');
    });
    return { isClean: false, cleanedText: cleaned };
  }

  const available = await isGemmaAvailable();
  if (!available) return { isClean: true, cleanedText: text };

  try {
    const messages = [
      {
        role: 'system',
        content: `Check if this text contains abuse, hate speech, irrelevant content, or offensive language (in Hindi, Hinglish, or English). Respond with JSON: {"isClean": true/false, "cleanedText": "cleaned version if not clean, or original if clean"}`
      },
      { role: 'user', content: text }
    ];
    const result = await callGemma(messages, 0.2, 256);
    if (result) {
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.warn('Moderation failed:', e.message);
  }
  return { isClean: true, cleanedText: text };
}

// ── 5. Chatbot response ──────────────────────────────────
async function chatbotResponse(messages, lang = 'hi') {
  const available = await isGemmaAvailable();
  const systemMsg = lang === 'hi'
    ? `आप "जन आवाज़" ऐप के सहायक हैं। आप नागरिकों की सार्वजनिक बुनियादी ढांचे की समस्याओं (गड्ढे, टूटी लाइट, नाला, पाइपलाइन, कूड़ा) को समझने और रिपोर्ट करने में मदद करते हैं।
    
पूछें: 1) क्या समस्या है? 2) कहाँ है? 3) कितनी गंभीर है? 4) कब से है?
सरल हिंदी में बात करें। जवाब छोटे रखें। जब सारी जानकारी मिल जाए, तो कहें "रिपोर्ट बनाने के लिए तैयार" और JSON दें: {"ready": true, "type": "...", "severity": "...", "description": "...", "landmark": "..."}`
    : `You are the "Jan Awaaz" app assistant. You help citizens report public infrastructure problems (potholes, broken streetlights, drains, pipelines, garbage).

Ask: 1) What is the problem? 2) Where is it? 3) How severe? 4) How long?
Keep answers short and simple. When you have enough info, say "Ready to create report" and provide JSON: {"ready": true, "type": "...", "severity": "...", "description": "...", "landmark": "..."}`;

  if (available) {
    try {
      const fullMessages = [
        { role: 'system', content: systemMsg },
        ...messages
      ];
      const result = await callGemma(fullMessages, 0.7, 512);
      if (result) return result;
    } catch (e) {
      console.warn('Chatbot response failed:', e.message);
    }
  }

  // Mock chatbot responses
  return getMockChatbotResponse(messages, lang);
}

function getMockChatbotResponse(messages, lang) {
  const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() || '';
  const msgCount = messages.filter(m => m.role === 'user').length;

  if (lang === 'hi') {
    if (msgCount <= 1) return 'नमस्ते! 🙏 मैं आपकी मदद करने के लिए यहाँ हूँ। कृपया बताइए - आपके इलाके में क्या समस्या है? (गड्ढा, टूटी लाइट, नाला, पाइपलाइन लीक, कूड़ा)';
    if (msgCount === 2) return 'समझा। यह समस्या कहाँ है? कोई पास की दुकान या जगह का नाम बताइए ताकि स्थान पहचाना जा सके।';
    if (msgCount === 3) return 'ठीक है। यह समस्या कितनी गंभीर है?\n\n🔴 गंभीर - तुरंत खतरा\n🟡 मध्यम - परेशानी है\n🟢 सामान्य - छोटी समस्या';
    return '✅ धन्यवाद! आपकी रिपोर्ट बनाने के लिए तैयार है। कृपया 📸 रिपोर्ट टैब पर जाएं और फोटो लें।\n\n{"ready": true, "type": "pothole", "severity": "medium", "description": "इलाके में समस्या है जिसे ठीक करने की जरूरत है।", "landmark": "बताया गया स्थान"}';
  } else {
    if (msgCount <= 1) return 'Hello! 🙏 I\'m here to help you report infrastructure issues. What problem do you see? (Pothole, Broken Light, Drain, Pipeline, Garbage)';
    if (msgCount === 2) return 'Got it. Where exactly is this problem? Please mention a nearby shop or landmark.';
    if (msgCount === 3) return 'Thanks. How severe is this problem?\n\n🔴 High - Immediate danger\n🟡 Medium - Causing inconvenience\n🟢 Low - Minor issue';
    return '✅ Thank you! Your report is ready. Please go to the 📸 Report tab and take a photo.\n\n{"ready": true, "type": "pothole", "severity": "medium", "description": "Infrastructure issue reported in the area that needs fixing.", "landmark": "As described"}';
  }
}

// ── 6. Generate professional report text ─────────────────
async function generateReportText(analysis, address, landmark, lang = 'hi') {
  const available = await isGemmaAvailable();
  const typeLabel = lang === 'hi' ? REPORT_TYPES[analysis.type]?.hi : REPORT_TYPES[analysis.type]?.en;

  if (available) {
    try {
      const prompt = lang === 'hi'
        ? `एक पेशेवर शिकायत रिपोर्ट लिखें (3-4 वाक्य, हिंदी में):
समस्या: ${typeLabel}
स्थान: ${address}
लैंडमार्क: ${landmark || 'N/A'}
गंभीरता: ${analysis.severity}
विवरण: ${analysis.description_hindi}`
        : `Write a professional complaint report (3-4 sentences, English):
Problem: ${typeLabel}
Location: ${address}
Landmark: ${landmark || 'N/A'}
Severity: ${analysis.severity}
Description: ${analysis.description_english || analysis.description_hindi}`;

      const result = await callGemma([
        { role: 'system', content: 'You write concise, professional infrastructure complaint reports for Indian municipalities. Keep it factual and respectful.' },
        { role: 'user', content: prompt }
      ], 0.5, 256);
      if (result) return result;
    } catch (e) {
      console.warn('Report generation failed:', e.message);
    }
  }

  // Fallback: construct report from data
  if (lang === 'hi') {
    return `📍 स्थान: ${address}${landmark ? ` (${landmark} के पास)` : ''}\n\n⚠️ समस्या: ${typeLabel}\n🔴 गंभीरता: ${SEVERITY_CONFIG[analysis.severity].hi}\n\n${analysis.description_hindi}\n\nसंबंधित अधिकारियों से कार्यवाही की अपेक्षा है।`;
  } else {
    return `📍 Location: ${address}${landmark ? ` (Near ${landmark})` : ''}\n\n⚠️ Issue: ${typeLabel}\n🔴 Severity: ${SEVERITY_CONFIG[analysis.severity].en}\n\n${analysis.description_english || analysis.description_hindi}\n\nAction expected from concerned authorities.`;
  }
}
