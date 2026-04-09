import { useState } from "react";
import { X, MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);

  const phone = "6281234567890";
  const message = encodeURIComponent("Hello! I'd like to book a private driver in Bali.");
  const url = `https://wa.me/${phone}?text=${message}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Tooltip bubble */}
      {showTooltip && (
        <div className="bg-white rounded-2xl shadow-xl p-4 max-w-[220px] border border-gray-100 relative">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
          <p className="text-gray-800 font-semibold text-sm mb-0.5">Chat with us!</p>
          <p className="text-gray-500 text-xs">We're online and ready to help plan your Bali adventure.</p>
        </div>
      )}

      {/* Button */}
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setShowTooltip(false)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <MessageCircle size={20} className="flex-shrink-0" />
        <span className="text-sm whitespace-nowrap">Chat Me</span>
      </a>
    </div>
  );
}
