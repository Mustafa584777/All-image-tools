import { TOOLS_LIST } from '@/components/ToolsData';
import ToolClientView from '@/components/ToolClientView';

export async function generateStaticParams() {
  return TOOLS_LIST.map((tool) => ({
    slug: tool.slug,
  }));
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ToolClientView initialSlug={slug} />;
}
