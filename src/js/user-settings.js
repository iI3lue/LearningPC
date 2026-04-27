// Lightweight user settings for LearningPC
// Persisted in localStorage with a dedicated namespace to avoid collisions
(function(){
  const KEY_AUTO_CONTINUE = 'auto_subcat_continue';
  const KEY_SHOW_PROMPT = 'show_subcat_prompt';
  // Fallback defaults
  const defaults = {
    [KEY_AUTO_CONTINUE]: false,
    [KEY_SHOW_PROMPT]: true
  };

  function _load(key, def) {
    try {
      const v = localStorage.getItem(key);
      if (v === null) return def;
      return JSON.parse(v);
    } catch (e) {
      return def;
    }
  }

  function _save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignore */ }
  }

  // Public API exposed on global window
  window.LearningPCSettings = {
    getAutoContinue: function(){ return _load(KEY_AUTO_CONTINUE, defaults[KEY_AUTO_CONTINUE]); },
    setAutoContinue: function(val){ _save(KEY_AUTO_CONTINUE, !!val); },
    getShowPrompt: function(){ return _load(KEY_SHOW_PROMPT, defaults[KEY_SHOW_PROMPT]); },
    setShowPrompt: function(val){ _save(KEY_SHOW_PROMPT, !!val); },
    // Convenience helpers
    isAutoContinueEnabled: function(){ return this.getAutoContinue(); },
    shouldShowPrompt: function(){ return this.getShowPrompt(); }
  };
})();
