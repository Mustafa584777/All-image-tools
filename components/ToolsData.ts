export interface ToolInfo {
  id: string;
  slug: string;
  title: string;
  description: string;
  iconName: string;
  category: 'AI & Vision' | 'Code & Dev' | 'Text Extraction';
  badge?: string;
}

export const TOOLS_LIST: ToolInfo[] = [
  {
    id: 'image-to-code',
    slug: 'image-to-code',
    title: 'Image to Code',
    description: 'Convert UI screenshots, wireframes, and design mockups into clean HTML and Tailwind CSS code using Gemini AI.',
    iconName: 'Code',
    category: 'AI & Vision',
    badge: 'AI Pro',
  },
  {
    id: 'handwriting-to-text',
    slug: 'handwriting-to-text',
    title: 'Handwriting to Text',
    description: 'Extract and transcribe handwritten English notes, letters, and documents from images into digital text.',
    iconName: 'FileText',
    category: 'Text Extraction',
    badge: 'Popular',
  },
  {
    id: 'html-to-image',
    slug: 'html-to-image',
    title: 'HTML to Image',
    description: 'Transform live HTML/CSS code snippets or custom web components into high-resolution PNG or JPEG images.',
    iconName: 'Image',
    category: 'Code & Dev',
    badge: 'Utility',
  },
  {
    id: 'hindi-handwriting-to-text',
    slug: 'hindi-handwriting-to-text',
    title: 'Hindi Handwriting to Text',
    description: 'Accurately convert handwritten Hindi notes and Devanagari script from images into digital Hindi text.',
    iconName: 'Languages',
    category: 'Text Extraction',
    badge: 'New',
  },
  {
    id: 'gemini-image-to-prompt',
    slug: 'gemini-image-to-prompt',
    title: 'Gemini Image to Prompt',
    description: 'Upload any image and let Gemini AI generate professional, detailed prompts for Midjourney and Stable Diffusion.',
    iconName: 'Sparkles',
    category: 'AI & Vision',
    badge: 'AI Vision',
  },
];
