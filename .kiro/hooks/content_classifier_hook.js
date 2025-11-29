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
      kickerTextVersion: Math.random() > 0.5 ? 'HighProvocation' : 'LowProvocation',
      couponCode: 'SPOOKY20',
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
      },
      negotiationQuestions: [
        {
          id: 'transport_q1',
          question: 'Want the scenic route or the speedy escape?',
          optionA: {
            label: 'Window Seat',
            image: '🪟',
            value: 'window_seat'
          },
          optionB: {
            label: 'Aisle Seat',
            image: '🚶',
            value: 'aisle_seat'
          }
        },
        {
          id: 'transport_q2',
          question: 'Money or Time? Which is king?',
          optionA: {
            label: 'Save Money',
            subtitle: '(More Layovers)',
            image: '💰',
            value: 'save_money'
          },
          optionB: {
            label: 'Save Time',
            subtitle: '(Direct Flight)',
            image: '⚡',
            value: 'save_time'
          }
        },
        {
          id: 'transport_q3',
          question: 'Control freak or last-minute thrill-seeker?',
          optionA: {
            label: 'Buy Now',
            image: '🎯',
            value: 'buy_now'
          },
          optionB: {
            label: 'Wait until Tomorrow',
            image: '🎲',
            value: 'wait_tomorrow'
          }
        }
      ]
    },
    clothing: {
      category: 'clothing',
      themeName: 'Fashion Showoff',
      primaryColor: '#ec4899',
      secondaryColor: '#fce7f3',
      backgroundColor: '#fdf2f8',
      kickerText: "Look how fabulous I am! This is the last one, better hurry! 😉",
      kickerTextVersion: Math.random() > 0.5 ? 'HighProvocation' : 'LowProvocation',
      couponCode: 'FASHION15',
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
      },
      negotiationQuestions: [
        {
          id: 'clothing_q1',
          question: 'Comfort or Confidence? Pick your power!',
          optionA: {
            label: 'Comfort First',
            image: '☁️',
            value: 'comfort'
          },
          optionB: {
            label: 'Look Stunning',
            image: '✨',
            value: 'confidence'
          }
        },
        {
          id: 'clothing_q2',
          question: 'Safe bet or bold statement?',
          optionA: {
            label: 'Classic Style',
            subtitle: '(Timeless)',
            image: '👔',
            value: 'classic'
          },
          optionB: {
            label: 'Trendy Style',
            subtitle: '(Stand Out)',
            image: '🎨',
            value: 'trendy'
          }
        },
        {
          id: 'clothing_q3',
          question: 'Quality investment or quantity spree?',
          optionA: {
            label: 'One Premium Item',
            image: '💎',
            value: 'quality'
          },
          optionB: {
            label: 'Multiple Items',
            image: '🛍️',
            value: 'quantity'
          }
        }
      ]
    },
    food: {
      category: 'food',
      themeName: 'Hungry Ghost',
      primaryColor: '#78350f',
      secondaryColor: '#fbbf24',
      backgroundColor: '#fef3c7',
      kickerText: "Mmm, this looks delicious! Too bad it's all MINE now! 🍔",
      kickerTextVersion: Math.random() > 0.5 ? 'HighProvocation' : 'LowProvocation',
      couponCode: 'TREAT10',
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
      },
      negotiationQuestions: [
        {
          id: 'food_q1',
          question: 'Guilty pleasure or health kick?',
          optionA: {
            label: 'Indulgent Treat',
            image: '🍰',
            value: 'indulgent'
          },
          optionB: {
            label: 'Healthy Option',
            image: '🥗',
            value: 'healthy'
          }
        },
        {
          id: 'food_q2',
          question: 'Adventure or comfort zone?',
          optionA: {
            label: 'Try Something New',
            subtitle: '(Exotic)',
            image: '🌶️',
            value: 'adventurous'
          },
          optionB: {
            label: 'Stick to Favorites',
            subtitle: '(Classic)',
            image: '🍕',
            value: 'familiar'
          }
        },
        {
          id: 'food_q3',
          question: 'Solo feast or sharing is caring?',
          optionA: {
            label: 'All for Me',
            image: '😋',
            value: 'solo'
          },
          optionB: {
            label: 'Share with Friends',
            image: '👥',
            value: 'sharing'
          }
        }
      ]
    },
    general: {
      category: 'general',
      themeName: 'Halloween Terror',
      primaryColor: '#ff6b00',
      secondaryColor: '#8b0000',
      backgroundColor: '#1a1a1a',
      kickerText: "Happy Halloween! 🎃",
      kickerTextVersion: Math.random() > 0.5 ? 'HighProvocation' : 'LowProvocation',
      couponCode: 'HALLOWEEN25',
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
      },
      negotiationQuestions: [
        {
          id: 'general_q1',
          question: 'Trick or Treat? What\'s your vibe?',
          optionA: {
            label: 'Spooky Trick',
            image: '👻',
            value: 'trick'
          },
          optionB: {
            label: 'Sweet Treat',
            image: '🍬',
            value: 'treat'
          }
        },
        {
          id: 'general_q2',
          question: 'Scary or silly? Choose your Halloween!',
          optionA: {
            label: 'Horror Vibes',
            subtitle: '(Terrifying)',
            image: '🎃',
            value: 'scary'
          },
          optionB: {
            label: 'Fun Vibes',
            subtitle: '(Playful)',
            image: '🎉',
            value: 'silly'
          }
        },
        {
          id: 'general_q3',
          question: 'Party animal or cozy night in?',
          optionA: {
            label: 'Go Out',
            image: '🎊',
            value: 'party'
          },
          optionB: {
            label: 'Stay Home',
            image: '🏠',
            value: 'cozy'
          }
        }
      ]
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
