import React from 'react';
import { AgentProvider } from './context/AgentContext';
import Home from './pages/Home';


export default function App() {
return (
<AgentProvider>
<Home />
</AgentProvider>
);
}
