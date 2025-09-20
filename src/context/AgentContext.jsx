import React, { createContext, useState } from 'react';


export const AgentContext = createContext();


export const AgentProvider = ({ children }) => {
const [agents, setAgents] = useState([
{ id: 'a1', name: 'Athena', role: 'Moderator', color: 'indigo' },
{ id: 'a2', name: 'Hermes', role: 'Assistant', color: 'teal' },
{ id: 'a3', name: 'Apollo', role: 'Analyst', color: 'amber' },
{ id: 'a4', name: 'Dion', role: 'Creative', color: 'rose' },
]);


const [messages, setMessages] = useState([]); // {id, senderId, text, ts}


return (
<AgentContext.Provider value={{ agents, setAgents, messages, setMessages }}>
{children}
</AgentContext.Provider>
);
};
