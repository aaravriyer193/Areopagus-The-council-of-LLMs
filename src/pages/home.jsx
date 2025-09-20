import React, { useState, useRef } from 'react';
<div>
<SplitText as="h1" className="text-4xl font-extrabold tracking-tight">AREOPAGUS</SplitText>
<DecryptedText className="mt-1 text-sm text-white/70">Multi-agent roundtable</DecryptedText>
</div>


<div className="flex items-center gap-4">
<BubbleMenu items={[{ label: 'New Session' }, { label: 'Settings' }, { label: 'Docs' }]} />
<GlassIcons name="sparkle" />
</div>
</header>


<main className="px-6 grid grid-cols-12 gap-6">
<aside className="col-span-3">
<SpotlightCard title="Council" subtitle={`${agents.length} agents`}>
<div className="p-4">
<AgentList agents={agents} />
</div>
</SpotlightCard>
</aside>


<section className="col-span-6 flex flex-col gap-4">
<SpotlightCard title="Discussion" subtitle="Live council feed">
<div className="p-3 flex flex-col gap-3 max-h-[58vh] overflow-auto" ref={feedRef}>
{messages.length === 0 && <div className="text-sm text-white/60">No messages yet. Start by asking the council a question.</div>}
{messages.map((m) => {
const sender = m.senderId === 'user' ? { name: 'You' } : m.senderId === 'system' ? { name: 'System' } : agents.find((a) => a.id === m.senderId) || { name: m.senderId };
return <ChatBubble key={m.id} senderName={sender.name} text={m.text} ts={m.ts} />;
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
<div className="mb-3 text-sm text-white/70">Run automated rounds or tweak agent settings (backend required).</div>
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
