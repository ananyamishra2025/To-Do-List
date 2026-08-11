import React from 'react';
import { X, Keyboard } from 'lucide-react';

export function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: 'N', action: 'Create a new task' },
    { key: 'F', action: 'Focus search & filter input' },
    { key: 'D', action: 'Toggle Dark / Light theme' },
    { key: 'S', action: 'Toggle tactile sound effects' },
    { key: 'P', action: 'Toggle Distraction-Free Focus Mode' },
    { key: 'Esc', action: 'Close dialogs or clear selection' },
    { key: '?', action: 'Show keyboard shortcuts guide' }
  ];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content shortcuts-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <Keyboard size={18} />
            <h2>Keyboard Shortcuts</h2>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="shortcuts-list">
          {shortcuts.map((s) => (
            <div key={s.key} className="shortcut-row">
              <span className="shortcut-action">{s.action}</span>
              <kbd className="kbd-badge">{s.key}</kbd>
            </div>
          ))}
        </div>

        <div className="modal-footer shortcuts-footer">
          <button className="btn-save" onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
