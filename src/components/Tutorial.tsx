import React from 'react';
import { useGameStore } from '../store/gameStore';
import { ArrowRight } from 'lucide-react';

const TUTORIAL_STEPS = [
  {
    title: 'Welcome to Echo Bloom! 🌿',
    content: 'You\'re managing a post-cataclysm community in an isolated valley. Your goal is to build a resilient, circular economy where every resource is used efficiently.',
    icon: '👋'
  },
  {
    title: 'The Systemic Load Meter',
    content: 'This is your main constraint. It tracks unused waste, unmet needs, and resource deficits. If it stays at 100% for 5 consecutive cycles, your community collapses.',
    icon: '⚠️'
  },
  {
    title: 'Three Micro-Cultures',
    content: 'Your community has three groups: Hydroponic Guild (food), Bio-Engineers (tech & recycling), and Archive Keepers (research & morale). Each needs specific inputs and produces specific outputs.',
    icon: '👥'
  },
  {
    title: 'Resource Cycling',
    content: 'Create closed loops! For example: Food → Gray Water → Purified Water → Food production. Waste from one building should become input for another.',
    icon: '♻️'
  },
  {
    title: 'Power-Ups',
    content: 'Use Flow Peek to preview upcoming cycles, Rewind Cycle to undo mistakes, and System Auditor to identify inefficient buildings. Use them wisely - they\'re limited!',
    icon: '✨'
  },
  {
    title: 'Ready to Start!',
    content: 'Start by building a Hydroponic Farm to produce food, then add buildings to process waste and create a sustainable loop. Good luck!',
    icon: '🚀'
  }
];

export const Tutorial: React.FC = () => {
  const { tutorialCompleted, tutorialStep, completeTutorialStep } = useGameStore();
  const [show, setShow] = React.useState(!tutorialCompleted);

  if (!show || tutorialCompleted) return null;

  const currentStep = TUTORIAL_STEPS[tutorialStep] || TUTORIAL_STEPS[TUTORIAL_STEPS.length - 1];
  const isLastStep = tutorialStep >= TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      completeTutorialStep();
      setShow(false);
    } else {
      completeTutorialStep();
    }
  };

  const handleSkip = () => {
    while (tutorialStep < TUTORIAL_STEPS.length - 1) {
      completeTutorialStep();
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-xl max-w-xl w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-5xl">{currentStep.icon}</span>
            <div>
              <h2 className="text-xl font-bold text-eco-400">{currentStep.title}</h2>
              <p className="text-xs text-slate-400">Step {tutorialStep + 1} of {TUTORIAL_STEPS.length}</p>
            </div>
          </div>
          <button onClick={handleSkip} className="btn btn-secondary p-2 text-xs">
            Skip
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 rounded-full overflow-hidden bg-slate-700">
            <div
              className="h-full bg-eco-500 transition-all duration-300"
              style={{ width: `${((tutorialStep + 1) / TUTORIAL_STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
          <p className="text-slate-200 leading-relaxed">{currentStep.content}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleNext}
            className="btn btn-primary flex-1"
          >
            {isLastStep ? "Let's Go!" : 'Next'}
            <ArrowRight size={18} className="inline ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};
