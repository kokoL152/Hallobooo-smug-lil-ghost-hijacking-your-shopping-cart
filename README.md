# 🎃 Hallobooo - Smug Lil' Ghost Hijacking Your Shopping Cart

A mischievous Halloween-themed Chrome extension featuring Kiro, a cheeky ghost that hijacks your browsing experience with playful animations, interactive storytelling, and exclusive rewards!

## ✨ What Makes This Special

This isn't just another browser extension - it's an **interactive storytelling experience** that:
- 🎭 Adapts to what you're browsing with smart URL classification
- 📖 Tells a fairy-tale narrative through three magical animation sequences
- 🎁 Rewards you with exclusive coupon codes for sharing your "deepest secrets"
- 🎨 Features stunning Canvas-based animations with realistic visual effects
- 👻 Stars Kiro, a smug little ghost with serious attitude

## 🌟 Key Features

### 🎯 Smart Theme System
The extension automatically detects your browsing context and adapts:

- **✈️ Airlines** (United, Delta, etc.): Ghost hijacks your plane
- **👙 Lingerie** (Victoria's Secret, etc.): Ghost shows off confidence in stylish attire  
- **🍫 Food & Chocolate** (Godiva, Lindt, etc.): Ghost devours your treats
- **🎃 Halloween Sites**: Classic spooky jumpscare
- **🔍 General Browsing**: Default mischievous behavior

### 🎬 Three-Act Storytelling Experience

#### Act 1: The Invitation
- Page shake effect announces Kiro's arrival
- Invitation modal: "Trick or Treat for Special Offers?"
- User chooses to accept or decline

#### Act 2: The Provocation
Theme-specific animations based on your browsing:
- **Flight Theme**: Kiro rides a plane across the screen
- **Lingerie Theme**: Shy ghost transforms into confident fashionista
- **Food Theme**: Kiro devours chocolate with delight
- **Halloween Theme**: Spooky jumpscare with pumpkin rain

#### Act 3: The Exchange (Storytelling Magic ✨)
1. **Magic Scroll Animation**: Ancient parchment reveals the deal - "Tell Ghost Your Deepest Secrets for a Sweetest Treat!"
2. **Interactive Survey**: 3 engaging questions to understand your preferences
3. **Data Castle Animation**: Your secrets fly on a winged parchment scroll to a dark gothic castle
4. **Magic Trick**: Kiro pulls your exclusive coupon code from a magical pocket
5. **Reward**: Copy your personalized discount code
6. **Farewell**: Kiro waves goodbye with a cheeky message

### 🎨 Stunning Visual Effects

- **Realistic Circuit Board Edges**: Detailed PCB with IC chips, capacitors, resistors, and electric sparks
- **Gothic Dark Castle**: Multi-tower architecture with glowing windows, lightning effects, and fog
- **Winged Parchment Scroll**: Animated wings with feather details, wax seal, and sparkle trails
- **Cute Ghost Character**: Multiple emotions (smug, defiant, confident, mysterious) with smooth breathing animations
- **Canvas-Based Rendering**: Smooth 60fps animations with particle systems
- **Dynamic Gradients**: Beautiful color transitions and glow effects

### 📊 Marketing Intelligence
Collects valuable user insights:
- Session tracking
- Theme preferences
- User responses to survey questions
- Conversion time metrics
- Timestamp and user agent data

All data is logged to console for marketing analysis.

## 🚀 Quick Start

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/kokoL152/Hallobooo-smug-lil-ghost-hijacking-your-shopping-cart.git
cd Hallobooo-smug-lil-ghost-hijacking-your-shopping-cart
```

2. **Load in Chrome**:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (top right toggle)
   - Click "Load unpacked"
   - Select the project folder

3. **Test it out**:
   - Visit any supported website (airlines, lingerie brands, chocolate sites)
   - Watch Kiro hijack your browsing experience!
   - Complete the interactive story for your reward

### Supported Websites

The extension automatically activates on:
- **Airlines**: United, Delta, American Airlines, Southwest, JetBlue, etc.
- **Lingerie**: Victoria's Secret, Savage X Fenty, ThirdLove, etc.
- **Food**: Godiva, Lindt, Ghirardelli, Hershey's, etc.
- **Halloween**: Spirit Halloween, Party City, Halloween Costumes, etc.
- **General**: Any other website with default theme

## 🎨 Customization

### Theme Configuration
All themes are defined in `src/theme_config.json`:

```json
{
  "themeName": "Your Theme",
  "category": "custom",
  "kairoGhostEmotion": "smug",
  "kickerText": "Your sassy message here!",
  "primaryColor": "#ff6b00",
  "secondaryColor": "#8b0000",
  "couponCode": "SPOOKY20",
  "negotiationQuestions": [...]
}
```

### Generate New Themes
Use the AI-powered theme generator:
```bash
node .kiro/hooks/content_classifier_hook.js
```

This will:
- Analyze URL patterns
- Generate appropriate themes
- Create custom survey questions
- Set personality traits

### Customize Animations
Edit `scripts/animation_engine.js` to modify:
- Animation timing and duration
- Visual effects and particles
- Ghost behaviors and emotions
- Canvas rendering details

## 📁 Project Structure

```
├── manifest.json                          # Chrome extension configuration
├── content_script.js                      # Content script (URL classification & injection)
├── scripts/
│   └── animation_engine.js               # Core animation engine (3,400+ lines)
├── styles/
│   └── halloween_theme.css               # Base theme styles
├── src/
│   └── theme_config.json                 # Theme configurations & survey questions
├── icons/
│   ├── icon.svg                          # Extension icon (SVG)
│   ├── icon16.png                        # 16x16 icon
│   ├── icon48.png                        # 48x48 icon
│   └── icon128.png                       # 128x128 icon
├── docs/
│   └── SYSTEM_FLOW.md                    # System architecture & flow diagrams
└── .kiro/
    └── hooks/
        └── content_classifier_hook.js    # AI theme generator
```

### Key Files

- **`animation_engine.js`**: The heart of the extension
  - Canvas-based animation rendering
  - Theme-specific animation sequences
  - Interactive UI components (modals, surveys, rewards)
  - Storytelling narrative functions
  - Visual effects (castle, parchment, magic tricks)

- **`content_script.js`**: Extension entry point
  - URL classification logic
  - Theme selection based on website
  - Script injection into page context

- **`theme_config.json`**: Configuration database
  - URL classification rules
  - Theme definitions (5 themes)
  - Survey questions (3 per theme)
  - Personality settings

## 🎭 Theme Gallery

### ✈️ Flight Theme
- **Kicker**: "I'm taking this flight before you! Hurry up, or I'll fly away with your seat!"
- **Animation**: Ghost rides a plane across the screen with banner
- **Emotion**: Smug
- **Survey Focus**: Travel preferences and booking urgency

### 👙 Lingerie Theme  
- **Kicker**: "Look how good this is! I'm wearing the last one! You'll never be this confident if you don't buy it now!"
- **Animation**: Shy ghost transforms into confident fashionista with sparkles
- **Emotion**: Defiant → Confident
- **Survey Focus**: Style preferences and confidence factors

### 🍫 Food Theme
- **Kicker**: "Mmm, this chocolate is MINE! You snooze, you lose!"
- **Animation**: Ghost devours chocolate with visible satisfaction
- **Emotion**: Smug → Delighted
- **Survey Focus**: Taste preferences and indulgence triggers

### 🎃 Halloween Theme
- **Kicker**: "BOOOO! Happy Halloween! I've taken over your screen!"
- **Animation**: Jumpscare with pumpkin rain and lightning
- **Emotion**: Mysterious → Mischievous
- **Survey Focus**: Halloween shopping and costume preferences

### 🔍 General Theme
- **Kicker**: "BOOOO! Catch me if you can! I've hijacked your search results!"
- **Animation**: Classic ghost floating with gentle glow
- **Emotion**: Defiant
- **Survey Focus**: General shopping behavior

## 🛠️ Technical Details

### Architecture
- **Manifest Version**: V3 (latest Chrome extension standard)
- **Content Security Policy**: Fully compliant with CSP requirements
- **Animation Engine**: Canvas API with requestAnimationFrame for 60fps
- **Design Pattern**: Event-driven architecture with message passing
- **State Management**: Global animation state machine

### Technologies
- **JavaScript ES6+**: Modern syntax with async/await
- **Canvas 2D API**: Hardware-accelerated rendering
- **Chrome Extension APIs**: Storage, runtime messaging, content scripts
- **CSS3**: Animations, gradients, and transitions
- **JSON**: Configuration and data management

### Performance
- **Optimized Rendering**: Only animates when visible
- **Memory Management**: Proper cleanup of canvas elements
- **Lazy Loading**: Scripts injected only when needed
- **Efficient Animations**: Uses transform and opacity for GPU acceleration

### Browser Compatibility
- Chrome 88+ (Manifest V3 support)
- Edge 88+ (Chromium-based)
- Brave (Chromium-based)
- Opera (Chromium-based)

### System Flow
See [SYSTEM_FLOW.md](docs/SYSTEM_FLOW.md) for detailed architecture diagrams including:
- Main user journey flowchart
- System architecture diagram
- Data flow visualization

## 🎯 Use Cases

### For E-commerce
- **Engagement Boost**: Interactive storytelling increases time on site
- **Data Collection**: Gather valuable customer insights through surveys
- **Conversion Optimization**: Reward system encourages purchases
- **Brand Personality**: Memorable, fun shopping experience

### For Marketing Teams
- **A/B Testing**: Test different themes and messages
- **User Segmentation**: Understand preferences by category
- **Conversion Tracking**: Measure time-to-conversion metrics
- **Behavioral Analysis**: Console logs provide detailed user journey data

### For Developers
- **Learning Resource**: Study Canvas API and Chrome Extension development
- **Template**: Fork and customize for your own projects
- **Animation Examples**: Reference for complex Canvas animations
- **State Management**: Example of managing complex UI states

## 🎃 Halloween Special

This extension was created for the **Kiroween Hackathon 2024**, celebrating the spooky season with a mischievous twist on everyday browsing!

### What Makes It "Kiroween"?
- **Kiro the Ghost**: Our mascot with serious attitude
- **Storytelling Focus**: Three-act narrative structure
- **Fairy-tale Elements**: Magic scrolls, dark castles, and enchanted rewards
- **Playful Data Collection**: "Tell your deepest secrets" narrative
- **Reward Mechanism**: Exclusive coupons for participation

## 🤝 Contributing

Pull requests are welcome! Here are some ideas:

### New Features
- [ ] Add more theme categories (gaming, fashion, tech)
- [ ] Implement sound effects
- [ ] Add more ghost emotions and expressions
- [ ] Create mobile-responsive version
- [ ] Add multi-language support

### Improvements
- [ ] Optimize animation performance
- [ ] Add more survey question types
- [ ] Enhance data visualization
- [ ] Improve accessibility features
- [ ] Add unit tests

### Bug Fixes
- Report issues on GitHub
- Include browser version and steps to reproduce
- Screenshots/videos are helpful!

## 📝 License

MIT License - Feel free to fork and create your own cheeky ghost!

## 👻 Credits

**Created by**: [kokoL152](https://github.com/kokoL152)  
**Event**: Kiroween Hackathon 2024  
**Special Thanks**: Kiro IDE team for the inspiration

### Technologies & Resources
- Chrome Extension APIs
- Canvas 2D API
- Mermaid for diagrams
- AI assistance for theme generation

---

## 🎬 Demo & Screenshots

### Want to see Kiro in action? 

1. Install the extension
2. Visit [United Airlines](https://www.united.com) or [Victoria's Secret](https://www.victoriassecret.com)
3. Accept Kiro's invitation
4. Experience the full storytelling journey
5. Get your exclusive coupon code!

### Visual Preview

<!-- Add screenshots here -->
```
Coming soon: Screenshots and GIFs of:
- Invitation modal
- Theme-specific animations
- Magic scroll sequence
- Data castle animation
- Magic trick reveal
- Coupon reward screen
```

---

**⚠️ Warning**: This ghost has serious attitude. Browse at your own risk! 😈

**🎃 Happy Kiroween!** 👻✨
