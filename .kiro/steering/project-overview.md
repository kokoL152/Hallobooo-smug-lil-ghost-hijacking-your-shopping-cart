---
inclusion: always
---

# Kiroween Extension - Project Overview

## What is This Project?

Kiroween is a Halloween-themed Chrome extension that creates an **interactive storytelling experience** on e-commerce websites. It features Kiro, a mischievous ghost character that guides users through a three-act narrative, collecting marketing insights while rewarding them with exclusive coupon codes.

## Project Goals

1. **Engagement**: Create a memorable, fun shopping experience
2. **Data Collection**: Gather valuable user preference insights
3. **Conversion**: Incentivize purchases with exclusive coupons
4. **Brand Personality**: Establish a playful, mischievous brand voice

## Core Concept

The extension uses **storytelling** to make data collection feel like a game rather than a survey:
- **Act 1**: Invitation - "Trick or Treat for Special Offers?"
- **Act 2**: Provocation - Theme-specific animations (plane, lingerie, chocolate, jumpscare)
- **Act 3**: Exchange - "Tell your deepest secrets" → Survey → Reward

## Key Technologies

- **Chrome Extension API** (Manifest V3)
- **Canvas 2D API** for animations
- **JavaScript ES6+** for logic
- **CSS3** for styling
- **JSON** for configuration

## Architecture Pattern

**Event-Driven State Machine**:
```
invitation → animation → interaction → reward → fadeout
```

## File Structure

```
├── manifest.json              # Extension config
├── content_script.js          # URL classifier & injector
├── scripts/
│   └── animation_engine.js   # Core animation logic (3,400+ lines)
├── src/
│   └── theme_config.json     # Theme definitions & survey questions
├── styles/
│   └── halloween_theme.css   # Base styles
└── .kiro/
    ├── specs/                # Requirements, design, tasks
    ├── steering/             # Project guidance docs
    └── hooks/                # AI theme generator
```

## Current Status

**Phase**: Production Ready ✅
**Version**: 1.0.0
**Last Updated**: December 2024

### Completed Features
- ✅ 5 theme categories (airline, lingerie, food, halloween, general)
- ✅ 4 unique animation sequences
- ✅ 3-act storytelling experience
- ✅ Interactive survey system (15 questions total)
- ✅ 3 narrative animations (magic scroll, data castle, magic trick)
- ✅ Coupon reward system
- ✅ Marketing data collection
- ✅ Realistic visual effects (circuit boards, gothic castle, winged parchment)

### In Progress
- 🚧 Cross-browser testing
- 🚧 Performance optimization

### Planned
- ⏳ Accessibility features
- ⏳ Sound effects
- ⏳ Analytics dashboard
- ⏳ Mobile support

## Development Principles

1. **User Experience First**: Animations must be smooth and delightful
2. **Performance Matters**: 60fps animations, < 50MB memory
3. **Privacy Focused**: No external servers, console logging only
4. **Graceful Degradation**: Never break the host website
5. **Maintainable Code**: Clear naming, comprehensive documentation

## Common Tasks

### Adding a New Theme
1. Add URL keywords to `theme_config.json` → `urlClassificationRules`
2. Create theme object in `themes` section
3. Define 3 survey questions
4. (Optional) Create custom animation in `animation_engine.js`

### Modifying Animations
1. Locate animation function in `animation_engine.js`
2. Adjust timing: Change `duration` variable
3. Adjust visuals: Modify Canvas drawing code
4. Test: Reload extension and visit matching website

### Debugging
1. Open Chrome DevTools Console
2. Look for `🎨 Initializing Animation Engine...` message
3. Check for errors in red
4. Verify theme selection: `Theme: [name]`
5. Watch animation state transitions

## Important Notes

### CSP Compliance
- ❌ Never use inline scripts
- ❌ Never use `eval()` or `new Function()`
- ✅ Always inject scripts via `src` attribute
- ✅ Use `postMessage` for cross-context communication

### Performance
- Always use `requestAnimationFrame` for animations
- Clean up canvas elements after use
- Remove event listeners when done
- Test on low-end devices

### State Management
- Animation state is global singleton
- Use state machine pattern for phase transitions
- Never mutate state directly in callbacks
- Always validate state before transitions

## Getting Help

### Documentation
- **Requirements**: `.kiro/specs/kiroween-extension/requirements.md`
- **Design**: `.kiro/specs/kiroween-extension/design.md`
- **Tasks**: `.kiro/specs/kiroween-extension/tasks.md`
- **System Flow**: `docs/SYSTEM_FLOW.md`
- **README**: `README.md`

### Code Navigation
- **Entry Point**: `content_script.js` → `loadConfigAndExecute()`
- **Main Logic**: `animation_engine.js` → `initializeAnimationEngine()`
- **Theme Config**: `src/theme_config.json`
- **Styles**: `styles/halloween_theme.css`

### Testing
1. Load extension in Chrome: `chrome://extensions/`
2. Visit test sites:
   - Airline: https://www.united.com
   - Lingerie: https://www.victoriassecret.com
   - Food: https://www.godiva.com
   - Halloween: https://www.spirithalloween.com
3. Accept invitation and complete full journey
4. Check console for data logs

## Contact

**Developer**: kokoL152
**Repository**: https://github.com/kokoL152/Hallobooo-smug-lil-ghost-hijacking-your-shopping-cart
**Event**: Kiroween Hackathon 2024
