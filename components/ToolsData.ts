export interface ImageTool {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: 'Compress & Resize' | 'Convert & Export' | 'Edit & Enhance' | 'Privacy & Utils';
  badge?: string;
  popular?: boolean;
}

export const TOOLS_LIST: ImageTool[] = [
  {
    id: 'compressor',
    title: 'Image Compressor',
    description: 'Compress PNG, JPEG, and WebP images with custom quality slider and instant file size reduction.',
    iconName: 'Minimize2',
    category: 'Compress & Resize',
    badge: 'Popular',
    popular: true,
  },
  {
    id: 'resizer',
    title: 'Image Resizer',
    description: 'Resize photos by exact pixel dimensions (width & height) or percentage with aspect ratio lock.',
    iconName: 'Maximize2',
    category: 'Compress & Resize',
    badge: 'Fast',
    popular: true,
  },
  {
    id: 'converter',
    title: 'Image Converter',
    description: 'Convert images between PNG, JPEG, WEBP, and BMP formats instantly in your browser.',
    iconName: 'Repeat',
    category: 'Convert & Export',
    badge: 'Essential',
    popular: true,
  },
  {
    id: 'watermark',
    title: 'Watermark Image',
    description: 'Protect your photos by adding custom text or logo watermarks with adjustable position and opacity.',
    iconName: 'ShieldCheck',
    category: 'Edit & Enhance',
    badge: 'Pro',
    popular: true,
  },
  {
    id: 'crop',
    title: 'Crop Image',
    description: 'Crop images easily with preset aspect ratios (1:1, 16:9, 4:3) or custom bounding box.',
    iconName: 'Crop',
    category: 'Edit & Enhance',
    popular: true,
  },
  {
    id: 'rotate',
    title: 'Rotate & Flip',
    description: 'Rotate images by 90°, 180°, 270° or flip them horizontally and vertically.',
    iconName: 'RotateCw',
    category: 'Edit & Enhance',
  },
  {
    id: 'filters',
    title: 'Filters & Adjustments',
    description: 'Fine-tune brightness, contrast, saturation, blur, sepia, and grayscale effects.',
    iconName: 'Sliders',
    category: 'Edit & Enhance',
  },
  {
    id: 'pdf',
    title: 'Images to PDF',
    description: 'Combine multiple images into a single professional PDF document with custom margins.',
    iconName: 'FileText',
    category: 'Convert & Export',
    badge: 'New',
    popular: true,
  },
  {
    id: 'base64',
    title: 'Base64 Image Encoder',
    description: 'Convert any image to Base64 data URL string for embedding in CSS or HTML code.',
    iconName: 'Code',
    category: 'Privacy & Utils',
  },
  {
    id: 'invert',
    title: 'Invert Colors',
    description: 'Create a negative photo effect by reversing all image color values.',
    iconName: 'SunMedium',
    category: 'Edit & Enhance',
  },
  {
    id: 'ai-enhancer',
    title: 'AI Image Analyzer',
    description: 'Analyze image composition and get AI-powered suggestions for lighting, mood, and enhancement.',
    iconName: 'Sparkles',
    category: 'Edit & Enhance',
    badge: 'AI',
    popular: true,
  },
];
