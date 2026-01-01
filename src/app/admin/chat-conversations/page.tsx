"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ADMIN_FLAG_KEY = "himexplore_admin_logged_in";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface ChatConversation {
  _id: string;
  sessionId: string;
  messages: ChatMessage[];
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  leadCaptured: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminChatConversationsPage() {
  const router = useRouter();
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedConversation, setSelectedConversation] =
    useState<ChatConversation | null>(null);

  async function loadConversations() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/chat-conversations");

      if (response.status === 401) {
        localStorage.removeItem(ADMIN_FLAG_KEY);
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load chat conversations");
      }

      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load conversations",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem(ADMIN_FLAG_KEY);
    if (!isLoggedIn) {
      router.push("/admin/login");
      return;
    }

    loadConversations();
  }, [router]);

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-600">Loading chat conversations...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadConversations}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-white hover:bg-emerald-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">
            Chat Conversations
          </h1>
          <button
            onClick={() => router.push("/admin/enquiries")}
            className="rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
          >
            Back to Enquiries
          </button>
        </div>

        {conversations.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow">
            <p className="text-slate-600">No chat conversations yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-slate-800">
                All Conversations ({conversations.length})
              </h2>
              <div className="space-y-3">
                {conversations.map((conv) => (
                  <button
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full rounded-lg border p-4 text-left transition-all ${
                      selectedConversation?._id === conv._id
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-slate-200 bg-white hover:border-emerald-300"
                    }`}
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-900">
                        {conv.userName || "Anonymous User"}
                      </span>
                      {conv.leadCaptured && (
                        <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700">
                          Lead
                        </span>
                      )}
                    </div>
                    <p className="mb-2 text-xs text-slate-600">
                      {conv.messages.length} messages
                    </p>
                    <p className="text-xs text-slate-500">
                      {formatDate(conv.updatedAt)}
                    </p>
                    {conv.userEmail && (
                      <p className="mt-1 text-xs text-slate-600">
                        {conv.userEmail}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-6 shadow">
              {selectedConversation ? (
                <>
                  <div className="mb-4 border-b border-slate-200 pb-4">
                    <h2 className="text-lg font-semibold text-slate-900">
                      Conversation Details
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      Started: {formatDate(selectedConversation.createdAt)}
                    </p>
                    {selectedConversation.userName && (
                      <p className="text-sm text-slate-600">
                        User: {selectedConversation.userName}
                      </p>
                    )}
                    {selectedConversation.userEmail && (
                      <p className="text-sm text-slate-600">
                        Email: {selectedConversation.userEmail}
                      </p>
                    )}
                    {selectedConversation.userPhone && (
                      <p className="text-sm text-slate-600">
                        Phone: {selectedConversation.userPhone}
                      </p>
                    )}
                  </div>

                  <div className="max-h-[600px] space-y-3 overflow-y-auto">
                    {selectedConversation.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${
                            msg.role === "user"
                              ? "bg-emerald-500 text-white"
                              : "bg-slate-100 text-slate-800"
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p
                            className={`mt-1 text-xs ${msg.role === "user" ? "text-emerald-100" : "text-slate-500"}`}
                          >
                            {formatDate(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex h-full items-center justify-center py-12">
                  <p className="text-slate-500">
                    Select a conversation to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

