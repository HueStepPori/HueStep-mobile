import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface StepInputModalProps {
  isOpen: boolean;
  currentSteps: number;
  onClose: () => void;
  onSave: (steps: number) => void;
}

/**
 * 걸음 수를 수동으로 입력할 수 있는 모달
 */
export function StepInputModal({ isOpen, currentSteps, onClose, onSave }: StepInputModalProps) {
  const [inputSteps, setInputSteps] = useState<string>(currentSteps.toString());

  if (!isOpen) return null;

  const handleSave = () => {
    const steps = parseInt(inputSteps, 10);
    if (!isNaN(steps) && steps >= 0) {
      onSave(steps);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">걸음 수 입력</h3>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            오늘의 걸음 수
          </label>
          <Input
            type="number"
            value={inputSteps}
            onChange={(e) => setInputSteps(e.target.value)}
            placeholder="걸음 수를 입력하세요"
            className="text-lg"
            min="0"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSave();
              }
            }}
          />
          <p className="text-xs text-gray-500 mt-2">
            현재: {currentSteps.toLocaleString()}걸음
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            className="flex-1"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}

