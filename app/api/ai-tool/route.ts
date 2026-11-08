import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { toolSlug, imageBase64, mimeType, customPrompt } = await req.json();

    let systemInstruction = "";
    let prompt = customPrompt || "Analyze this image and provide the requested conversion.";

    if (toolSlug === 'image-to-code') {
      systemInstruction = "You are an expert frontend developer and UI/UX engineer. Analyze the uploaded UI screenshot or mockup image and write clean, semantic HTML with Tailwind CSS classes to replicate the design accurately. Return ONLY valid code block inside markdown format.";
      prompt = "Generate clean HTML and Tailwind CSS code for this UI mockup screenshot.";
    } else if (toolSlug === 'handwriting-to-text') {
      systemInstruction = "You are an expert OCR and handwriting transcription assistant. Accurately transcribe all handwritten English text from the provided image into clean, formatted digital text.";
      prompt = "Transcribe the handwritten text in this image accurately.";
    } else if (toolSlug === 'hindi-handwriting-to-text') {
      systemInstruction = "आप एक विशेषज्ञ हिंदी हस्तलेखन पहचान (OCR) सहायक हैं। छवि में दिए गए हिंदी हस्तलिखित नोट्स को सटीक रूप से देवनागरी डिजिटल टेक्स्ट में ट्रांसक्राइब करें।";
      prompt = "इस छवि में दिए गए हिंदी हस्तलिखित पाठ (handwriting) को सटीक हिंदी देवनागरी पाठ में बदलें।";
    } else if (toolSlug === 'gemini-image-to-prompt') {
      systemInstruction = "You are an expert AI prompt engineer. Analyze the uploaded image and generate a highly detailed, professional prompt suitable for image generation models like Midjourney v6, Stable Diffusion XL, or Gemini Imagen. Describe the subject, lighting, mood, color palette, camera angle, and artistic style in vivid detail.";
      prompt = "Analyze this image and generate an exceptional AI image generation prompt.";
    }

    const contents: any[] = [];
    if (imageBase64) {
      contents.push({
        inlineData: {
          mimeType: mimeType || 'image/jpeg',
          data: imageBase64,
        }
      });
    }
    contents.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: { parts: contents },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
      }
    });

    return NextResponse.json({ result: response.text || "No result generated." });
  } catch (error: any) {
    console.error("AI Tool Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process request." }, { status: 500 });
  }
}
