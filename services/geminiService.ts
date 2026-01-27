
import { GoogleGenAI } from "@google/genai";
import { GroundingChunk, AuditResult, TrendingSignal } from "../types";

const calculateCredibilityScore = (uri: string): number => {
  try {
    const url = new URL(uri);
    const domain = url.hostname.toLowerCase().replace(/^www\./, '');
    const path = url.pathname.toLowerCase();
    let score = 50;

    const factCheckers = ['snopes.com', 'politifact.com', 'factcheck.org', 'fullfact.org', 'altnews.in', 'boomlive.in', 'reuters.com/fact-check'];
    const academic = ['nature.com', 'science.org', 'thelancet.com', 'mit.edu', 'harvard.edu'];
    const news = ['reuters.com', 'apnews.com', 'nytimes.com', 'bbc.com', 'wsj.com', 'bloomberg.com'];

    if (factCheckers.some(d => domain === d || uri.includes(d))) score = 98;
    else if (academic.some(d => domain === d || domain.endsWith('.' + d))) score = 95;
    else if (news.some(d => domain === d || domain.endsWith('.' + d))) score = 90;
    else if (domain.endsWith('.gov')) score = 94;
    else if (domain.endsWith('.edu')) score = 92;

    if (path.includes('opinion') || path.includes('editorial')) score -= 15;
    if (path.includes('fact-check') || path.includes('verify')) score += 10;
    if (path.includes('blog') || path.includes('forum')) score -= 20;

    const currentYear = new Date().getFullYear();
    if (new RegExp(`${currentYear}|${currentYear - 1}`).test(uri)) score += 5;

    const knownBiased = ['breitbart.com', 'infowars.com', 'rt.com'];
    if (knownBiased.some(d => domain === d)) score = 20;

    const jitter = (uri.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 7) - 3;
    return Math.min(Math.max(score + jitter, 5), 99);
  } catch (e) {
    return 45;
  }
};

export const getTrendingClaims = async (): Promise<TrendingSignal[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const today = new Date().toLocaleDateString();

  const prompt = `Identify 5 currently trending news stories, viral X/Twitter claims, or rumors as of ${today}. 
  Focus on claims that are potentially synthetic or need verification.
  Format each as:
  [ID] CLAIM | SOURCE | REACH | CATEGORY | INTENSITY (Low/Medium/High/Critical) | TIMESTAMP`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const lines = response.text.split('\n').filter(l => l.includes('|'));
    return lines.map((line, i) => {
      const parts = line.split('|').map(p => p.replace(/[\[\]]/g, '').trim());
      return {
        id: parts[0]?.split(' ')[0] || `SIG-${100 + i}`,
        claim: parts[0]?.split(' ').slice(1).join(' ') || parts[1] || "Unknown signal",
        source: parts[1] || "Web",
        reach: parts[2] || "Calculating",
        category: (parts[3] as any) || "Social",
        intensity: (parts[4] as any) || "Medium",
        timestamp: parts[5] || "Just Now"
      };
    }).slice(0, 5);
  } catch (error) {
    console.error("Trends fetch failed:", error);
    return [];
  }
};

export const verifyClaimWithAI = async (query: string, imageBase64?: string): Promise<AuditResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemPrompt = `
    You are the VeriFact Neural Forensics Analyst.
    Your mission: Audit text, URLs, and media for factual integrity and neural synthesis.

    SPECIAL PROTOCOL FOR URLs (X/Twitter, TikTok, News Links):
    1. If a URL is provided, you MUST use the googleSearch tool to retrieve its content. 
    2. Social media links (x.com, twitter.com) are often gated. Use search to find the TEXT of the post, news reports about the post, or public archives.
    3. Do not simply say "I cannot access the link." Search for the claim within the link.
    4. Reconstruct the "Claim Intelligence Vector" before auditing.

    IF MEDIA (IMAGE) IS PROVIDED:
    - Scan for AI generation signatures.
    - Check spatial inconsistencies.

    OUTPUT GUIDELINES:
    - VERDICT: [TRUE | FALSE | PARTIALLY TRUE | SYNTHETIC]
    - FORENSIC SUMMARY: Explain the findings clearly.
    - NO markdown symbols like # or * in final descriptions.
  `;

  try {
    const parts: any[] = [{ text: `Audit this intelligence: ${query}` }];
    if (imageBase64) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: imageBase64 }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        systemInstruction: systemPrompt,
        tools: [{ googleSearch: {} }],
        temperature: 0.1,
      },
    });

    const text = response.text || "Audit stream empty.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const verdictMatch = text.match(/VERDICT:\s*([A-Z\s]+)/i);
    const verdict = verdictMatch ? verdictMatch[1].trim() : "UNVERIFIED";

    const sources: GroundingChunk[] = chunks.map((chunk: any): GroundingChunk => {
      const uri = chunk.web?.uri || "";
      const score = calculateCredibilityScore(uri);
      let type: GroundingChunk['sourceType'] = 'news';
      if (/\.gov|\.edu|un\.org|who\.int/.test(uri)) type = 'official';
      else if (/twitter\.com|x\.com|reddit\.com|tiktok\.com|instagram\.com/.test(uri)) type = 'social';
      return {
        web: chunk.web ? { uri: chunk.web.uri, title: chunk.web.title } : undefined,
        credibilityScore: score,
        sourceType: type
      };
    }).filter(c => !!c.web);

    return {
      text,
      sources,
      verdict,
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    if (error?.message?.includes("Requested entity was not found")) {
      if (window.aistudio?.openSelectKey) window.aistudio.openSelectKey();
      throw new Error("System node re-authentication required.");
    }
    throw error;
  }
};
