#!/usr/bin/env node

/**
 * Advanced Content Classifier Hook
 * This script generates theme configurations for The Necronomicon Mirror extension
 * It classifies URLs and generates creative theme configs with optional LLM integration
 */

const fs = require('fs');
const path = require('path');

/**
 * URL Classifier - Determines which category a URL belongs to
 * @param {string} url - The URL to classify
 * @returns {string} - Category name (flight, bras, chocolate, general)
 */
function classifyUrl(url) {
  const urlLower = url.toLowerCase();
  
  // Flight category
  if (urlLower.includes('flight') || 
      urlLower.includes('ticket') || 
      urlLower.includes('airline') ||
      urlLower.includes('booking')) {
    return 'flight';
  }
  
  // Bras/Lingerie category
  if (urlLower.includes('bra') || 
      urlLower.includes('lingerie') || 
      urlLower.includes('underwear') ||
      urlLower.includes('intimates')) {
    return 'bras';
  }
  
  // Chocolate category
  if (urlLower.includes('chocolate') || 
      urlLower.includes('candy') || 
      urlLower.includes('sweet')) {
    return 'chocolate';
  }
  
  // Default to general
  return 'general';
}

/**
 * Configuration Generator - Creates theme config based on category
 * @param {string} category - The category to generate config for
 * @returns {object} - Complete theme configuration object
 */
function generateConfig(category) {
  const configs = {
    flight: {
      category: 'flight',
      themeName: 'Sky Hijacker',
      primaryColor: '#1e3a8a',
      secondaryColor: '#60a5fa',
      backgroundColor: '#e0f2fe',
      kickerText: "I'm taking this flight before you! Hurry up, or I'll fly away with your seat! ✈️",
      kairoGhostEmotion: 'smug',
      animations: {
        enabled: true,
        type: 'hijackFlight',
        duration: '5s'
      },
      effects: {
        particles: true,
        particleType: 'clouds',
        sound: 'wind_whisper'
      }
    },
    bras: {
      category: 'bras',
      themeName: 'Confidence Showoff',
      primaryColor: '#ec4899',
      secondaryColor: '#fce7f3',
      backgroundColor: '#fdf2f8',
      kickerText: "Look how good this is! I'm wearing the last one! You'll never be this confident if you don't buy it now! 😉",
      kairoGhostEmotion: 'defiant',
      animations: {
        enabled: true,
        type: 'confidenceShowoff',
        duration: '3s'
      },
      effects: {
        particles: true,
        particleType: 'sparkles',
        sound: 'soft_chime'
      }
    },
    chocolate: {
      category: 'chocolate',
      themeName: 'Sweet Thief',
      primaryColor: '#78350f',
      secondaryColor: '#fbbf24',
      backgroundColor: '#fef3c7',
      kickerText: "Mmm, this chocolate is MINE! You snooze, you lose! 🍫",
      kairoGhostEmotion: 'smug',
      animations: {
        enabled: true,
        type: 'melting_drips',
        duration: '4s'
      },
      effects: {
        particles: true,
        particleType: 'chocolate_drops',
        sound: 'gentle_crunch'
      }
    },
    general: {
      category: 'general',
      themeName: 'Necronomicon Prankster',
      primaryColor: '#8b0000',
      secondaryColor: '#fbf0d8',
      backgroundColor: '#fbf0d8',
      kickerText: "🎃 BOOOO! Catch me if you can! I've hijacked your search results!",
      kairoGhostEmotion: 'defiant',
      animations: {
        enabled: true,
        type: 'flicker',
        duration: '3s'
      },
      effects: {
        particles: false,
        particleType: 'none',
        sound: 'eerie_whisper'
      }
    }
  };
  
  return configs[category] || configs.general;
}

/**
 * Enhanced Config Generator with LLM creativity (placeholder for MCP integration)
 * @param {string} category - The category to generate config for
 * @returns {object} - Enhanced theme configuration
 */
async function generateEnhancedConfig(category) {
  const baseConfig = generateConfig(category);
  
  // TODO: Integrate with Kiro MCP for LLM-generated creative text
  // For now, return base config with enhanced metadata
  return {
    ...baseConfig,
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      generator: 'content_classifier_hook',
      llmEnhanced: false // Set to true when MCP integration is added
    }
  };
}

/**
 * Main execution function
 */
async function main() {
  console.log('🔮 Necronomicon Mirror - Theme Config Generator');
  console.log('================================================\n');
  
  // Create src directory if it doesn't exist
  const srcDir = path.join(__dirname, '../../src');
  if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
    console.log('✓ Created src directory');
  }
  
  // Generate configs for all categories
  const categories = ['flight', 'bras', 'chocolate', 'general'];
  const themeConfigs = {};
  
  for (const category of categories) {
    const config = await generateEnhancedConfig(category);
    themeConfigs[category] = config;
    console.log(`✓ Generated config for: ${category} (${config.themeName})`);
  }
  
  // Add URL classification rules
  const fullConfig = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    urlClassificationRules: {
      flight: ['flight', 'ticket', 'airline', 'booking'],
      bras: ['bra', 'lingerie', 'underwear', 'intimates'],
      chocolate: ['chocolate', 'candy', 'sweet'],
      general: ['*'] // fallback
    },
    themes: themeConfigs
  };
  
  // Write to theme_config.json
  const outputPath = path.join(srcDir, 'theme_config.json');
  fs.writeFileSync(outputPath, JSON.stringify(fullConfig, null, 2), 'utf8');
  
  console.log('\n✓ Theme configuration generated successfully!');
  console.log(`✓ Output: ${outputPath}`);
  console.log(`✓ Categories: ${categories.join(', ')}`);
  console.log('\n💡 Tip: Integrate Kiro MCP for AI-generated creative content!');
}

// Run the main function
main().catch(error => {
  console.error('❌ Error generating theme config:', error);
  process.exit(1);
});
