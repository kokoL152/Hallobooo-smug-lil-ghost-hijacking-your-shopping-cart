# 🎃 Hallobooo - Smug Lil' Ghost Hijacking Your Shopping Cart

A mischievous Halloween-themed Chrome extension featuring a cheeky ghost that hijacks your browsing experience with playful animations and sassy messages!

## 🌟 Features

### Dynamic Theme System
The extension automatically detects what you're browsing and adapts its personality:

- **✈️ Flight Booking Sites**: Ghost hijacks your plane with a smug grin
- **👙 Lingerie Shopping**: Ghost shows off confidence in stylish attire
- **🍫 Chocolate Sites**: Ghost steals your sweets
- **🔍 General Browsing**: Classic spooky ghost pranks

### Stunning Visual Effects
- **Torn Edge Circuit Boards**: Realistic PCB effects with IC chips, capacitors, and electric sparks
- **Animated Ghost Character**: Multiple emotions (smug, defiant, confident) with smooth animations
- **Beautiful Banners**: Gradient backgrounds with sparkle effects
- **Particle Systems**: Dynamic particle effects for each theme

### Personality
This isn't your friendly neighborhood ghost - it's a **smug, cheeky troublemaker** that:
- Taunts you with sassy messages
- Hijacks your shopping experience
- Shows off with confidence
- Makes you laugh (or rage) with its attitude

## 🚀 Installation

1. Clone this repository:
```bash
git clone https://github.com/kokoL152/Hallobooo-smug-lil-ghost-hijacking-your-shopping-cart.git
```

2. Open Chrome and navigate to `chrome://extensions/`

3. Enable "Developer mode" in the top right

4. Click "Load unpacked" and select the project folder

5. The ghost is now ready to haunt your browsing! 👻

## 🎨 Customization

### Generate New Themes
Run the theme generator to create custom configurations:
```bash
node .kiro/hooks/content_classifier_hook.js
```

### Modify Ghost Personality
Edit `.kiro/hooks/content_classifier_hook.js` to change:
- `kickerText`: The sassy messages
- `kairoGhostEmotion`: Ghost expressions (smug, defiant, confident, etc.)
- `primaryColor` & `secondaryColor`: Theme colors

## 📁 Project Structure

```
├── manifest.json              # Chrome extension configuration
├── content_script.js          # Main content script
├── scripts/
│   └── animation_engine.js    # Animation and rendering engine
├── styles/
│   └── halloween_theme.css    # Base theme styles
├── src/
│   └── theme_config.json      # Generated theme configurations
├── icons/
│   └── icon.svg              # Extension icon
└── .kiro/
    └── hooks/
        └── content_classifier_hook.js  # Theme generator
```

## 🎭 Themes

### Flight Theme
- **Message**: "I'm taking this flight before you! Hurry up, or I'll fly away with your seat! ✈️"
- **Animation**: Ghost rides a plane across the screen
- **Emotion**: Smug

### Lingerie Theme
- **Message**: "Look how good this is! I'm wearing the last one! You'll never be this confident if you don't buy it now! 😉"
- **Animation**: Shy ghost transforms into confident fashionista
- **Emotion**: Defiant

### Chocolate Theme
- **Message**: "Mmm, this chocolate is MINE! You snooze, you lose! 🍫"
- **Emotion**: Smug

### General Theme
- **Message**: "🎃 BOOOO! Catch me if you can! I've hijacked your search results!"
- **Emotion**: Defiant

## 🛠️ Technical Details

- **Manifest Version**: V3 (latest Chrome extension standard)
- **Content Security Policy**: Compliant with CSP requirements
- **Animation**: Canvas-based rendering for smooth 60fps animations
- **Architecture**: Modular design with theme classification system

## 🎃 Halloween Special

This extension was created for the Kiroween Hackathon, celebrating the spooky season with a mischievous twist on everyday browsing!

## 📝 License

MIT License - Feel free to fork and create your own cheeky ghost!

## 🤝 Contributing

Pull requests are welcome! Feel free to:
- Add new themes
- Create new ghost emotions
- Improve animations
- Make the ghost even more sassy

## 👻 Credits

Created with love (and a bit of mischief) for the Kiroween Hackathon 2024.

---

**Warning**: This ghost has attitude. Browse at your own risk! 😈
