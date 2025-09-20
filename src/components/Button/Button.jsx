import React from 'react';


export default function Button({ onClick, children, className = '' }) {
return (
<button
onClick={onClick}
className={`px-4 py-2 rounded-2xl shadow backdrop-blur-sm border border-white/10 hover:scale-[1.02] transition-transform ${className}`}
>
{children}
</button>
);
}
