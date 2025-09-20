import React, { useState, useRef } from 'react';
import SplitText from 'src/components/SplitText.jsx';
import DecryptedText from 'src/components/DecryptedText.jsx';
import BubbleMenu from 'src/components/BubbleMenu.jsx';
import GlassIcons from 'src/components/GlassIcons.jsx';
import SpotlightCard from './components/SpotlightCard.jsx';
import AgentList from 'src/components/AgentList.jsx';
import ChatBubble from 'src/components/ChatBubble.jsx';
import Button from 'src/components/Button.jsx';
import AgentControls from 'src/components/AgentControls.jsx';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [agents, setAgents] = useState([
    { id: 'council', name: 'Council Moderator' },
  ]);
  const feedRef = useRef(null);

  // 🟢 Core: Function call to Netlify serverless
  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      senderId: 'user',
      text: prompt,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setPrompt('');

    try {
      const res = await fetch('/.netlify/functions/roundtable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      // data = [councilMessage]
      setMessages((prev) => [...prev, ...data]);

      // Auto scroll to bottom
      setTimeout(() => {
        if (feedRef.current) {
          feedRef.current.scrollTop = feedRef.current.scrollHeight;
        }
      }, 100);
    } catch (err) {
      console.error('Error sending:', err);
      const errorMsg = {
        id: Date.now().toString(),
        senderId: 'system',
        text: `⚠️ ${err.message}`,
        ts: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  const handleClear = () => setMessages([]);
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(messages, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'areopagus-transcript.json';
    a.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <header className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        <div>
          <SplitText as="h1" className="text-4xl font-extrabold tracking-tight">
            AREOPAGUS
          </SplitText>
          <DecryptedText className="mt-1 text-sm text-white/70">
            Multi-agent roundtable
          </DecryptedText>
        </div>

        <div className="flex items-center gap-4">
          <BubbleMenu
            items={[
              { label: 'New Session', onClick: handleClear },
              { label: 'Settings' },
              { label: 'Docs' },
            ]}
          />
          <GlassIcons name="sparkle" />
        </div>
      </header>

      <main className="px-6 grid grid-cols-12 gap-6 flex-1">
        <aside className="col-span-3">
          <SpotlightCard title="Council" subtitle={`${agents.length} agents`}>
            <div className="p-4">
              <AgentList agents={agents} />
            </div>
          </SpotlightCard>
        </aside>

        <section className="col-span-6 flex flex-col gap-4">
          <SpotlightCard title="Discussion" subtitle="Live council feed">
            <div
              className="p-3 flex flex-col gap-3 max-h-[58vh] overflow-auto"
              ref={feedRef}
            >
              {messages.length === 0 && (
                <div className="text-sm text-white/60">
                  No messages yet. Start by asking the council a question.
                </div>
              )}
              {messages.map((m) => {
                const sender =
                  m.senderId === 'user'
                    ? { name: 'You' }
                    : m.senderId === 'system'
                    ? { name: 'System' }
                    : agents.find((a) => a.id === m.senderId) || {
                        name: m.senderId,
                      };
                return (
                  <ChatBubble
                    key={m.id}
                    senderName={sender.name}
                    text={m.text}
                    ts={m.ts}
                  />
                );
              })}
            </div>
          </SpotlightCard>

          <div className="flex gap-3 items-center">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask the council..."
              className="flex-1 p-3 rounded-2xl bg-white/5 border border-white/6 outline-none"
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </section>

        <aside className="col-span-3">
          <div className="space-y-4">
            <AgentControls onClear={handleClear} onExport={handleExport} />

            <SpotlightCard title="Quick Tools" subtitle="Utilities">
              <div className="p-4">
                <div className="mb-3 text-sm text-white/70">
                  Run automated rounds or tweak agent settings (backend
                  required).
                </div>
                <div className="flex flex-col gap-2">
                  <Button>Run Round</Button>
                  <Button className="bg-white/5">Add Agent</Button>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </aside>
      </main>

      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <DecryptedText>Built with Areopagus • beta</DecryptedText>
      </footer>
    </div>
  );
}
