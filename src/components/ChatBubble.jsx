import React from "react";
import clsx from "clsx";

export default function ChatBubble({ senderName, text, ts, isUser }) {
  const date = new Date(ts);
  const timeString = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      className={clsx(
        "flex flex-col max-w-[75%] p-3 rounded-2xl break-words",
        isUser ? "ml-auto bg-blue-600 text-white" : "mr-auto bg-white/5 text-white"
      )}
    >
      {!isUser && (
        <div className="text-xs font-semibold text-white/70 mb-1">
          {senderName}
        </div>
      )}
      <div className="text-sm leading-relaxed">{text}</div>
      <div className="text-[10px] text-white/50 mt-1 self-end">
        {timeString}
      </div>
    </div>
  );
}
