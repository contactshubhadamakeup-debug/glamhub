// components/ai/ai-assistant.tsx
import { useState } from 'react';

export function AiAssistant() {
  const [drafts, setDrafts] = useState<{ enquiryId: string; clientName: string; message: string; suggestedReply: string; confidence: number }[]>([]);
  const [newDraft, setNewDraft] = useState<{ enquiryId: string; clientMessage: string; serviceInterest?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [followUps, setFollowUps] = useState<{ quoteId: string; clientName: string; daysSinceQuote: number; suggestedMessage: string }[]>([]);
  const [activeTab, setActiveTab] = useState<'replies' | 'followups'>('replies');

  const handleGenerateDraft = async () => {
    if (!newDraft) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/draft-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newDraft),
      });
      const data = await res.json();
      setDrafts((prev) => [
        ...prev,
        {
          enquiryId: newDraft.enquiryId,
          clientName: 'Client', // Would come from API
          message: newDraft.clientMessage,
          suggestedReply: data.suggestedReply,
          confidence: data.confidence,
        },
      ]);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
      setNewDraft(null);
    }
  };

  const handleSendReply = (draft: any) => {
    // Professional explicitly sends - AI never auto-sends
    alert(`Sending reply: "${draft.suggestedReply}"`);
    setDrafts(drafts.filter((d) => d !== draft));
  };

  const handleGetFollowUps = async () => {
    try {
      const res = await fetch('/api/ai/follow-up-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      setFollowUps(data);
    } catch {
      // Error handling
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => setActiveTab('replies')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'replies' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Reply Drafts
        </button>
        <button
          onClick={() => setActiveTab('followups')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'followups' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Follow-up Suggestions
        </button>
      </div>

      {activeTab === 'replies' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">AI Reply Drafts</h3>
          <p className="text-sm text-gray-500 mb-4">
            AI suggests replies. You review and send. AI never auto-sends.
          </p>
          <div className="space-y-4">
            {drafts.map((d, i) => (
              <div key={i} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-700">{d.clientName}</span>
                  <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                    Confidence: {(d.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{d.suggestedReply}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendReply(d)}
                    className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700"
                  >
                    Review & Send
                  </button>
                  <button
                    onClick={() => setDrafts(drafts.filter((_, idx) => idx !== i))}
                    className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm font-medium hover:bg-gray-300"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ))}
            {drafts.length === 0 && (
              <p className="text-gray-500 text-sm">No reply drafts yet.</p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold text-navy-900 mb-2">Generate New Draft</h4>
            <div className="space-y-3">
              <input
                placeholder="Enquiry ID"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                onChange={(e) => setNewDraft({ ...newDraft!, enquiryId: e.target.value })}
              />
              <textarea
                placeholder="Client's message"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                onChange={(e) => setNewDraft({ ...newDraft!, clientMessage: e.target.value })}
              />
              <button
                onClick={handleGenerateDraft}
                disabled={loading || !newDraft}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium disabled:opacity-50 hover:bg-emerald-700"
              >
                {loading ? 'Generating...' : 'Generate Draft'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'followups' && (
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Follow-up Suggestions</h3>
          <p className="text-sm text-gray-500 mb-4">
            AI suggests follow-ups for quotes with no response after 7 days.
          </p>
          <button
            onClick={handleGetFollowUps}
            className="mb-4 bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700"
          >
            Refresh Suggestions
          </button>
          <div className="space-y-3">
            {followUps.map((f) => (
              <div key={f.quoteId} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-semibold text-gray-700">{f.clientName}</span>
                  <span className="text-xs text-gray-500">{f.daysSinceQuote} days since quote</span>
                </div>
                <p className="text-gray-700 mb-3">{f.suggestedMessage}</p>
                <button
                  onClick={() => alert(`Sending follow-up to ${f.clientName}`)}
                  className="bg-emerald-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-emerald-700"
                >
                  Send Follow-up
                </button>
              </div>
            ))}
            {followUps.length === 0 && (
              <p className="text-gray-500 text-sm">No follow-up suggestions at this time.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}