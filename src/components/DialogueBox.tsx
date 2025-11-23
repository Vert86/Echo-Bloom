import React from 'react';
import { MessageSquare, X } from 'lucide-react';
import { useFarmStore } from '../store/farmStore';
import { DIALOGUE_TEMPLATES } from '../types/farming';

export const DialogueBox: React.FC = () => {
  const { currentDialogue, closeDialogue, showDialogueBox } = useFarmStore();

  if (!currentDialogue) return null;

  const handleOptionClick = (option: typeof currentDialogue.options[0]) => {
    if (option.action) {
      option.action();
    }

    if (option.nextDialogueId) {
      // Find next dialogue
      const allDialogues = Object.values(DIALOGUE_TEMPLATES).flat();
      const nextDialogue = allDialogues.find(d => d.id === option.nextDialogueId);
      if (nextDialogue) {
        showDialogueBox(nextDialogue);
        return;
      }
    }

    closeDialogue();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-end justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-3xl shadow-2xl max-w-3xl w-full animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-eco-600 to-eco-500 p-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentDialogue.npcIcon}</div>
            <div>
              <h3 className="font-bold text-white text-lg">{currentDialogue.npcName}</h3>
              <MessageSquare size={16} className="text-eco-100" />
            </div>
          </div>
          <button
            onClick={closeDialogue}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Dialogue Text */}
        <div className="p-6">
          <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
            <p className="text-white text-lg leading-relaxed">{currentDialogue.text}</p>
          </div>

          {/* Options */}
          <div className="space-y-2">
            {currentDialogue.options.map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option)}
                className="w-full bg-eco-600 hover:bg-eco-500 text-white px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 text-left flex items-center gap-2"
              >
                <span className="text-xl">💬</span>
                <span>{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
