import React, { useMemo, useState } from 'react';

function AuthSelectionTabs({ tabs, defaultTabId }) {
  const initialTabId = defaultTabId ?? tabs[0]?.id ?? '';
  const [activeTabId, setActiveTabId] = useState(initialTabId);

  const activeTab = useMemo(
    () => tabs.find((tab) => tab.id === activeTabId) ?? tabs[0],
    [activeTabId, tabs],
  );

  if (!tabs.length) {
    return null;
  }

  return (
    <div className="auth-selection-page">
      <div className="auth-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`tab-btn ${activeTabId === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTabId(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="auth-content">{activeTab?.content}</div>
    </div>
  );
}

export default AuthSelectionTabs;
