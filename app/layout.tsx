import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'ToolImg - Free Online Image Tools & Multi-Tool Editor',
  description: 'Fast, secure and free online image compressor, resizer, converter, watermark adder, cropper, rotator and filters. Exact replica of ToolImg.',
  openGraph: {
    title: 'ToolImg - Free Online Image Tools & Multi-Tool Editor',
    description: 'Fast, secure and free online image compressor, resizer, converter, watermark adder, cropper, rotator and filters.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolImg - Free Online Image Tools & Multi-Tool Editor',
    description: 'Fast, secure and free online image compressor, resizer, converter, watermark adder, cropper, rotator and filters.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
