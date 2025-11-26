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
 * @returns {string} - Category name (transportation, food, clothing, general)
 */
function classifyUrl(url) {
  const urlLower = url.toLowerCase();
  
  // Transportation category
  const transportKeywords = ['flight', 'ticket', 'airline', 'booking', 'car', 'train', 'bus', 'uber', 'lyft', 'taxi', 'rental', 'vehicle'];
  if (transportKeywords.some(keyword => urlLower.includes(keyword))) {
    return 'transportation';
  }
  
  // Clothing category
  const clothingKeywords = ['bra', 'lingerie', 'underwear', 'intimates', 'clothing', 'fashion', 'dress', 'shirt', 'pants', 'shoes', 'wear'];
  if (clothingKeywords.some(keyword => urlLower.includes(keyword))) {
    return 'clothing';
  }
  
  // Food category
  const foodKeywords = ['chocolate', 'candy', 'sweet', 'food', 'restaurant', 'burger', 'pizza', 'coffee', 'eat', 'meal', 'snack', 'dessert'];
  if (foodKeywords.some(keyword => urlLower.includes(keyword))) {
    return 'food';
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
    transportation: {
      category: 'transportation',
      themeName: 'Vehicle Hijacker',
      primaryColor: '#1e3a8a',
      secondaryColor: '#60a5fa',
      backgroundColor: '#e0f2fe',
      kickerText: "I'm taking this ride before you! Catch me if you can! 🚗✈️",
      kairoGhostEmotion: 'smug',
      animations: {
        enabled: true,
        type: 'transportation_ride',
        duration: '5s'
      },
      effects: {
        particles: true,
        particleType: 'clouds',
        sound: 'wind_whisper'
      }
    },
    clothing: {
      category: 'clothing',
      themeName: 'Fashion Showoff',
      primaryColor: '#ec4899',
      secondaryColor: '#fce7f3',
      backgroundColor: '#fdf2f8',
      kickerText: "Look how fabulous I am! This is the last one, better hurry! 😉",
      kairoGhostEmotion: 'defiant',
      animations: {
        enabled: true,
        type: 'clothing_tryOn',
        duration: '3s'
      },
      effects: {
        particles: true,
        particleType: 'sparkles',
        sound: 'soft_chime'
      }
    },
    food: {
      category: 'food',
      themeName: 'Hungry Ghost',
      primaryColor: '#78350f',
      secondaryColor: '#fbbf24',
      backgroundColor: '#fef3c7',
      kickerText: "Mmm, this looks delicious! Too bad it's all MINE now! 🍔",
      kairoGhostEmotion: 'smug',
      animations: {
        enabled: true,
        type: 'food_eating',
        duration: '4s'
      },
      effects: {
        particles: true,
        particleType: 'food_crumbs',
        sound: 'munching'
      }
    },
    general: {
      category: 'general',
      themeName: 'Halloween Terror',
      primaryColor: '#ff6b00',
      secondaryColor: '#8b0000',
      backgroundColor: '#1a1a1a',
      kickerText: "Happy Halloween! 🎃",
      kairoGhostEmotion: 'evil',
      animations: {
        enabled: true,
        type: 'halloween_jumpscare',
        duration: '6s'
      },
      effects: {
        particles: true,
        particleType: 'pumpkins',
        sound: 'evil_laugh'
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
  const categories = ['transportation', 'clothing', 'food', 'general'];
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
      transportation: ['flight', 'ticket', 'airline', 'booking', 'car', 'train', 'bus', 'uber', 'taxi', 'rental', 'vehicle'],
      clothing: ['bra', 'lingerie', 'underwear', 'intimates', 'clothing', 'fashion', 'dress', 'shirt', 'pants', 'shoes', 'wear'],
      food: ['chocolate', 'candy', 'sweet', 'food', 'restaurant', 'burger', 'pizza', 'coffee', 'eat', 'meal', 'snack', 'dessert'],
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
