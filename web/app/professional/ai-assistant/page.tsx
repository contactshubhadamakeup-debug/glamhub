// app/professional/ai-assistant/page.tsx
import { AiAssistant } from '@/components/ai/ai-assistant';

export default function AiAssistantPage() {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">AI Assistant</h1>
      <AiAssistant />
    </div>
  );
}