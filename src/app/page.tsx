"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type AIInput = {
  query: string;
};

type AIOutputput = {
  rows: any[];
};

export default function Chat() {
  const [input, setInput] = useState("");
  const { messages, sendMessage,  } = useChat();

  return (
    <div className="flex flex-col w-full max-w-4xl py-12 mx-auto px-4 min-h-screen bg-white dark:bg-zinc-950">
      <div className="flex-1 space-y-8 mb-32">
        {messages.map((message) => {
          const isLastMessage = message.id === messages[messages.length - 1].id;

          return (
            <div key={message.id} className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {/* Avatar Icons */}
              <div className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm text-xl">
                {message.role === "user" ? "💁🏻" : "🤖"}
              </div>

              <div className={`flex flex-col gap-3 w-full max-w-[85%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                {message.parts.map((part, i) => {
                  switch (part.type) {
                    // 1. FORMATTED TEXT (AI RESPONSE)
                    case "text":
                      return (
                        <div
                          key={`${message.id}-${i}`}
                          className={`px-6 py-4 rounded-3xl border shadow-sm transition-all ${
                            message.role === "user"
                              ? "bg-zinc-900 text-white border-zinc-800 rounded-tr-none text-xl"
                              : "bg-zinc-50 dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 rounded-tl-none text-zinc-800 dark:text-zinc-200 text-lg"
                          }`}
                        >
                          <article className={`prose prose-zinc dark:prose-invert max-w-none ${message.role === "user" ? "prose-p:text-white" : "prose-xl"} leading-relaxed`}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {part.text}
                            </ReactMarkdown>
                          </article>
                        </div>
                      );

                    // 2. DATABASE QUERY UI
                    case "tool-db":
                      return (
                        <div key={`${message.id}-${i}`} className="w-full my-2 rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10 overflow-hidden animate-in fade-in slide-in-from-left-2 duration-300">
                          <div className="px-4 py-2 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">🔍 Database Query</span>
                          </div>

                          <div className="p-4">
                            {(part.input as unknown as AIInput)?.query && (
                              <pre className="text-xs font-mono bg-zinc-950 text-blue-300 p-3 rounded-xl mb-3 overflow-x-auto shadow-inner">
                                {(part.input as unknown as AIInput).query}
                              </pre>
                            )}
                            
                            {part.state === "output-available" && (
                              <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 w-fit px-3 py-1 rounded-full border border-green-200 dark:border-green-800">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                ✅ Returned {(part.output as unknown as AIOutputput).rows?.length || 0} rows
                              </div>
                            )}
                          </div>
                        </div>
                      );

                    // 3. SCHEMA TOOL UI
                    case "tool-schema":
                      return (
                        <div key={`${message.id}-${i}`} className="flex items-center gap-3 px-4 py-2 my-2 rounded-xl bg-purple-50 dark:bg-purple-900/10 border border-purple-200 dark:border-purple-800 animate-in fade-in duration-300">
                          <span className="text-purple-600">📋</span>
                          <span className="text-sm font-bold text-purple-700 dark:text-purple-300 uppercase tracking-tight">Schema Loaded Successfully</span>
                          {part.state === "output-available" && <span className="ml-auto text-green-500 text-xs">● Live</span>}
                        </div>
                      );

                    // 4. PROCESSING / THINKING STATE
                    case "step-start":
                      // Only show if it's the last message and currently loading
                      if (!isLastMessage ) return null;
                      return (
                        <div key={`${message.id}-${i}`} className="flex items-center gap-3 px-5 py-3 my-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 w-fit">
                          <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce [animation-delay:0.4s]"></span>
                          </div>
                          <span className="text-lg font-medium text-zinc-500 animate-pulse tracking-tight">Processing...</span>
                        </div>
                      );

                    default:
                      return null;
                  }
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* FIXED INPUT FIELD */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ text: input });
          setInput("");
        }}
        className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md pb-10 pt-6 border-t border-zinc-100 dark:border-zinc-900"
      >
        <div className="max-w-4xl mx-auto px-4 relative flex items-center">
          <input
            className="w-full bg-zinc-100 dark:bg-zinc-900 py-4 pl-6 pr-16 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none text-lg transition-all border border-transparent focus:border-zinc-200 dark:text-zinc-100"
            value={input}
            placeholder="Ask your database anything..."
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="absolute right-7 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg transition-colors disabled:opacity-50"
            type="submit"
            disabled={ !input.trim()}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m5 12 7-7 7 7" />
              <path d="M12 19V5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}