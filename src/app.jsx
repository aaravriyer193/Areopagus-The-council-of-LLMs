import React from 'react';
import { AgentProvider } from './context/AgentContext.jsx';
import Home from './pages/home.jsx';


export default function App() {
return (
<AgentProvider>
<Home />
</AgentProvider>
);
}
