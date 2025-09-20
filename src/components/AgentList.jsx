import React from 'react';
import AgentCard from './AgentCard';


export default function AgentList({ agents }) {
return (
<div className="space-y-3">
{agents.map((a) => (
<AgentCard key={a.id} agent={a} />
))}
</div>
);
}
