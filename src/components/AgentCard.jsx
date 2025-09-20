import React from 'react';


export default function AgentCard({ agent }) {
return (
<div className="agent-card p-3 rounded-xl glass-card flex items-center gap-3">
<div className={`avatar w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-gradient-to-br from-${agent.color}-500 to-${agent.color}-700`}>
{agent.name[0]}
</div>
<div>
<div className="font-semibold">{agent.name}</div>
<div className="text-xs text-white/70">{agent.role}</div>
</div>
</div>
);
}
