import React, { useMemo } from 'react';
import './MoodSelector.css';

// Slider positions mapped to moods
// 0: Chill (budget), 1: Focused (work), 2: Romantic (date), 3: Hungry (quick-bite)
const SLIDER_STOPS = [
  { value: 0, label: 'Chill', mood: 'budget', color: '#10b981' },
  { value: 1, label: 'Focused', mood: 'work', color: '#3b82f6' },
  { value: 2, label: 'Romantic', mood: 'date', color: '#ec4899' },
  { value: 3, label: 'Hungry', mood: 'quick-bite', color: '#f59e0b' },
];

const MoodSelector = ({ selectedMood, onMoodSelect, disabled }) => {
  const sliderValue = useMemo(() => {
    const found = SLIDER_STOPS.find(s => s.mood === selectedMood);
    return found ? found.value : 1; // default to Focused
  }, [selectedMood]);

  const handleChange = (e) => {
    const val = parseInt(e.target.value, 10);
    const stop = SLIDER_STOPS.find(s => s.value === val);
    if (stop) onMoodSelect(stop.mood);
  };

  const currentStop = SLIDER_STOPS.find(s => s.value === sliderValue) || SLIDER_STOPS[1];

  return (
    <div className="mood-selector-compact">
      <div className="slider-row">
        {SLIDER_STOPS.map(s => (
          <span key={s.value} className={`slider-label ${sliderValue === s.value ? 'active' : ''}`} style={{ '--mood-color': s.color }}>
            {s.label}
          </span>
        ))}
      </div>
      <input
        type="range"
        min="0"
        max="3"
        step="1"
        value={sliderValue}
        onChange={handleChange}
        disabled={disabled}
        className="mood-slider"
        style={{ '--mood-color': currentStop.color }}
      />
      <div className="slider-caption">
        Selected: <span style={{ color: currentStop.color }}>{currentStop.label}</span>
      </div>
    </div>
  );
};

export default MoodSelector;
