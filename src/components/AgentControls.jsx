import React from 'react';
import Button from './Button/Button';


export default function AgentControls({ onClear, onExport }) {
return (
<div className="p-4 rounded-2xl glass-card">
<h4 className="font-semibold">Controls</h4>
<div className="mt-3 flex flex-col gap-3">
<Button onClick={onClear}>Clear Discussion</Button>
<Button onClick={onExport} className="bg-white/5">Export Log</Button>
</div>
</div>
);
}
