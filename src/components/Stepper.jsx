import React from 'react';
import { Minus, Plus } from 'lucide-react';

export default function Stepper({
  id,
  label,
  hint,
  value,
  min = 1,
  max = 120,
  step = 1,
  unit = '',
  onChange,
}) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(Math.max(min, value - step));
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(Math.min(max, value + step));
    }
  };

  const handleInputChange = (e) => {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val)) {
      const clamped = Math.min(max, Math.max(min, val));
      onChange(clamped);
    }
  };

  return (
    <div className="stepper-row">
      <div className="stepper-label-wrap">
        <label htmlFor={id} className="stepper-label">
          {label}
        </label>
        {hint && <span className="stepper-hint">{hint}</span>}
      </div>

      <div className="zen-stepper" role="group" aria-label={label}>
        <button
          type="button"
          className="zen-stepper-btn"
          onClick={handleDecrement}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
        >
          <Minus strokeWidth={2} />
        </button>

        <div className="zen-stepper-value-container">
          <input
            id={id}
            type="number"
            className="zen-stepper-input"
            value={value}
            min={min}
            max={max}
            onChange={handleInputChange}
            aria-label={`${label} input`}
          />
          {unit && <span className="zen-stepper-unit">{unit}</span>}
        </div>

        <button
          type="button"
          className="zen-stepper-btn"
          onClick={handleIncrement}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
        >
          <Plus strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
