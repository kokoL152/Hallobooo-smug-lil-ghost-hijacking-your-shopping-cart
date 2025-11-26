// Content script for The Necronomicon Mirror - Rule Executor

/**
 * Load theme configuration and execute matching theme
 */
async function loadConfigAndExecute() {
  try {
    console.log('🔮 Necronomicon Mirror has been activated!');
    
    // Load theme configuration
    const configUrl = chrome.runtime.getURL('src/theme_config.json');
    const response = await fetch(configUrl);
    const config = await response.json();
    
    // Get current URL
    const currentUrl = window.location.href.toLowerCase();
    console.log('📍 Current URL:', currentUrl);
    
    // Find matching category based on URL classification rules
    let matchedCategory = 'general'; // default fallback
    const urlRules = config.urlClassificationRules;
    
    for (const [category, keywords] of Object.entries(urlRules)) {
      if (category === 'general') continue; // Check general last
      
      // Check if any keyword matches the current URL
      const isMatch = keywords.some(keyword => 
        currentUrl.includes(keyword.toLowerCase())
      );
      
      if (isMatch) {
        matchedCategory = category;
        console.log(`✓ Matched category: ${category}`);
        break;
      }
    }
    
    // Get theme configuration for matched category
    const themeConfig = config.themes[matchedCategory];
    
    if (!themeConfig) {
      console.warn(`⚠️ No theme config found for category: ${matchedCategory}`);
      return;
    }
    
    console.log(`✓ Loading theme: ${themeConfig.themeName}`);
    console.log(`✓ Emotion: ${themeConfig.kairoGhostEmotion}`);
    console.log(`✓ Kicker: ${themeConfig.kickerText}`);
    
    // Serialize theme config to pass to injected script
    const themeConfigJson = JSON.stringify(themeConfig);
    
    // Inject animation engine script first
    await injectAnimationEngine();
    
    // Initialize the animation engine with theme config
    await initializeTheme(themeConfigJson);
    
    console.log('✓ Theme initialization complete!');
    
  } catch (error) {
    console.error('❌ Error loading config and executing theme:', error);
  }
}

/**
 * Inject the animation engine script into the page
 */
async function injectAnimationEngine() {
  try {
    const scriptUrl = chrome.runtime.getURL('scripts/animation_engine.js');
    
    // Inject script using src attribute (CSP compliant)
    const script = document.createElement('script');
    script.src = scriptUrl;
    script.type = 'text/javascript';
    
    // Wait for script to load
    await new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = reject;
      (document.head || document.documentElement).appendChild(script);
    });
    
    console.log('✓ Animation engine injected');
  } catch (error) {
    console.error('❌ Error injecting animation engine:', error);
  }
}

/**
 * Initialize theme with configuration
 * @param {string} themeConfigJson - Serialized theme configuration
 */
async function initializeTheme(themeConfigJson) {
  try {
    // Store config in a custom event for the page to access
    const config = JSON.parse(themeConfigJson);
    
    // Dispatch custom event with config data
    window.postMessage({
      type: 'NECRO_INIT_THEME',
      config: config
    }, '*');
    
    console.log('✓ Theme initialization message sent');
  } catch (error) {
    console.error('❌ Error initializing theme:', error);
  }
}

// Execute when page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadConfigAndExecute);
} else {
  loadConfigAndExecute();
}
