# Kiroween Extension - Technical Design

## Architecture Overview

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                        Chrome Browser                        │
├─────────────────────────────────────────────────────────────┤
│  Extension Context          │         Page Context          │
│  ┌──────────────────┐      │      ┌──────────────────┐    │
│  │  manifest.json   │      │      │   Web Page DOM   │    │
│  │  (Config)        │      │      │                  │    │
│  └────────┬─────────┘      │      └────────▲─────────┘    │
│           │                │               │               │
│  ┌────────▼─────────┐      │      ┌────────┴─────────┐    │
│  │ content_script.js│──────┼─────▶│ animation_engine │    │
│  │ (Injector)       │      │      │     .js          │    │
│  └────────┬─────────┘      │      │ (Renderer)       │    │
│           │                │      └────────┬─────────┘    │
│  ┌────────▼─────────┐      │               │               │
│  │theme_config.json │      │      ┌────────▼─────────┐    │
│  │ (Data)           │      │      │  Canvas Elements │    │
│  └──────────────────┘      │      │  UI Components   │    │
│                            │      └──────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Design

### 1. Content Script (`content_script.js`)

**Responsibility**: Entry point, URL classification, script injection

**Key Functions**:
```javascript
loadConfigAndExecute()
  ├─ Load theme_config.json
  ├─ Classify URL
  ├─ Select theme
  ├─ Inject animation_engine.js
  └─ Send initialization message

injectAnimationEngine()
  └─ Create <script> tag with animation_engine.js

initializeTheme(config)
  └─ Post message to page context with theme config
```

**URL Classification Logic**:
```javascript
for (category in urlClassificationRules) {
  if (url.includes(keyword)) {
    return themes[category]
  }
}
return themes['general'] // fallback
```

**Design Decisions**:
- ✅ Use postMessage for cross-context communication (CSP compliant)
- ✅ Inject script via src attribute (not inline)
- ✅ Async/await for clean async flow
- ✅ Error handling with try-catch

---

### 2. Animation Engine (`animation_engine.js`)

**Responsibility**: Core animation logic, UI rendering, state management

**Architecture Pattern**: State Machine

```javascript
animationState = {
  currentPhase: 'invitation' | 'animation' | 'interaction' | 'reward' | 'fadeout',
  loopCount: number,
  maxLoops: number,
  interactionComplete: boolean,
  userAccepted: boolean,
  permanentlyDismissed: boolean
}
```

**Key Modules**:

#### A. Initialization Module
```javascript
initializeAnimationEngine(config)
  ├─ Reset state
  ├─ shakePageEffect()
  └─ createInvitationModal()
```

#### B. Theme Injection Module
```javascript
startFullExperience(config)
  ├─ injectThemeStyles()
  ├─ createKiroGhost()
  ├─ displayKickerNotification()
  └─ executeAnimation()
```

#### C. Animation Execution Module
```javascript
executeAnimation(config)
  └─ switch(animationType)
      ├─ executeFlyToDestinationAnimation()    // Airline
      ├─ executeConfidenceGhostAnimation()     // Lingerie
      ├─ executeChocolateDripsAnimation()      // Food
      └─ executeHalloweenJumpscareAnimation()  // Halloween
```

#### D. Storytelling Module
```javascript
createInteractionUI(config)
  └─ showMagicScrollAnimation()
      └─ createQuestionnaireUI()
          └─ finishQuestionnaire()
              ├─ showDataCastleAnimation()
              ├─ showMagicTrickAnimation()
              └─ showCouponReward()
```

#### E. Canvas Rendering Module
```javascript
// Reusable drawing functions
drawCuteGhost(ctx, x, y, scale, emotion)
drawRealisticDarkCastle(ctx, x, y, color, progress)
drawParchmentScrollWithWings(ctx, x, y, rotation, scale, frame)
drawGothicCastle(ctx, x, y, color)
```

**Design Patterns Used**:
- **State Machine**: Manages animation phases
- **Strategy Pattern**: Different animations per theme
- **Observer Pattern**: Event-driven UI updates
- **Factory Pattern**: Canvas element creation
- **Singleton**: Global animation state

---

## Data Flow

### 1. Extension Load Flow
```
User visits website
  → content_script.js loads
  → Fetch theme_config.json
  → Match URL to category
  → Inject animation_engine.js
  → Post initialization message
  → animation_engine.js receives message
  → Initialize with theme config
```

### 2. User Interaction Flow
```
Page shake
  → Invitation modal
  → User accepts
  → Inject theme styles
  → Create ghost character
  → Execute theme animation
  → Magic scroll animation
  → Survey UI
  → User answers questions
  → Data castle animation
  → Log marketing data
  → Magic trick animation
  → Coupon modal
  → User copies code
  → Goodbye message
  → Fade out
```

### 3. Data Collection Flow
```
Survey start
  → Record session ID
  → Record start time
  → User answers Q1 → Store answer
  → User answers Q2 → Store answer
  → User answers Q3 → Store answer
  → Calculate conversion time
  → Collect metadata (URL, user agent, timestamp)
  → Format marketing data object
  → Log to console
```

---

## Canvas Animation Architecture

### Animation Loop Pattern
```javascript
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // Update state
  frame++
  progress = frame / duration
  
  // Draw elements
  drawBackground()
  drawCharacters()
  drawEffects()
  drawText()
  
  // Continue or complete
  if (frame < duration) {
    requestAnimationFrame(animate)
  } else {
    cleanup()
    callback()
  }
}
```

### Performance Optimizations
- Use `requestAnimationFrame` for 60fps
- Clear only dirty regions when possible
- Use `transform` and `opacity` for GPU acceleration
- Reuse canvas contexts
- Remove canvas elements after use
- Debounce window resize events

---

## State Management

### Animation State Machine
```
[invitation] ──accept──> [animation] ──complete──> [interaction]
     │                                                   │
   decline                                           complete
     │                                                   │
     └──────────────────> [fadeout] <──────────────────┘
```

### Questionnaire State
```javascript
questionnaireState = {
  currentQuestionIndex: 0,
  userAnswers: [],
  isAnimating: boolean,
  startTime: timestamp,
  sessionId: string
}
```

### Transition Rules
- `invitation` → `animation`: User clicks "Yes, Join!"
- `invitation` → `fadeout`: User clicks "No, thanks"
- `animation` → `interaction`: Animation completes max loops
- `interaction` → `reward`: Survey completes
- `reward` → `fadeout`: Coupon displayed for 5 seconds

---

## UI Component Design

### 1. Invitation Modal
**Structure**:
```
┌─────────────────────────────────────┐
│  [Ghost SVG]                        │
│                                     │
│  Company invites you to             │
│  Trick or Treat!                    │
│                                     │
│  🎃 Join our Halloween adventure    │
│     for exclusive treats! 🎃        │
│                                     │
│  [✨ Yes, Join!]  [👋 No, thanks]  │
└─────────────────────────────────────┘
```

**Styling**:
- Gradient background (primaryColor → secondaryColor)
- Centered with fixed position
- Rounded corners (30px)
- Box shadow for depth
- Fade in animation (0.5s)

### 2. Questionnaire UI
**Structure**:
```
┌─────────────────────────────────────┐
│         Question Text               │
│      Question X of 3                │
│                                     │
│  [Option A]  [Ghost]  [Option B]   │
│   [Image]              [Image]      │
│   Label                Label        │
│   Subtitle             Subtitle     │
└─────────────────────────────────────┘
```

**Interaction**:
- Hover: Scale 1.05, enhanced shadow
- Click: Green border flash, ghost flies to option
- Transition: 0.8s animation between questions

### 3. Coupon Modal
**Structure**:
```
┌─────────────────────────────────────┐
│         [Ghost SVG]                 │
│                                     │
│        🎉 You Won! 🎉              │
│                                     │
│  Code has been sent to your account!│
│                                     │
│      ┌─────────────────┐           │
│      │   SPOOKY20      │           │
│      └─────────────────┘           │
│                                     │
│      [📋 Copy Code]                │
└─────────────────────────────────────┘
```

**Behavior**:
- Pulse animation on code
- Copy button feedback (✅ Copied!)
- Auto-dismiss after 5 seconds

---

## Theme Configuration Schema

```json
{
  "themeName": "string",
  "category": "airline|lingerie|food|halloween|general",
  "kairoGhostEmotion": "smug|defiant|confident|mysterious|delighted",
  "kickerText": "string",
  "kickerTextVersion": "string",
  "primaryColor": "#hex",
  "secondaryColor": "#hex",
  "backgroundColor": "#hex",
  "couponCode": "string",
  "animations": {
    "enabled": boolean,
    "type": "string"
  },
  "negotiationQuestions": [
    {
      "id": "string",
      "question": "string",
      "optionA": {
        "image": "emoji",
        "label": "string",
        "subtitle": "string",
        "value": "string"
      },
      "optionB": { /* same structure */ }
    }
  ]
}
```

---

## Security Considerations

### Content Security Policy (CSP)
- ✅ No inline scripts
- ✅ No eval() or Function()
- ✅ Scripts loaded via src attribute
- ✅ No external script sources

### Data Privacy
- ✅ No data sent to external servers
- ✅ Console logging only (local)
- ✅ No persistent storage
- ✅ Session-only data collection

### XSS Prevention
- ✅ No innerHTML with user input
- ✅ Sanitized text content
- ✅ Canvas rendering (no DOM injection)

---

## Error Handling Strategy

### Graceful Degradation
```javascript
try {
  // Core functionality
} catch (error) {
  console.error('Error:', error)
  // Fail silently, don't break page
}
```

### Error Scenarios
1. **Config load failure**: Use default theme
2. **Canvas not supported**: Skip animations
3. **Script injection failure**: Log error, exit gracefully
4. **Animation error**: Stop animation, show static UI

---

## Testing Strategy

### Unit Tests (Future)
- URL classification logic
- State machine transitions
- Data collection formatting
- Canvas drawing functions

### Integration Tests (Future)
- Full user journey
- Theme switching
- Animation sequences
- Data flow end-to-end

### Manual Testing Checklist
- [ ] Test on each supported website category
- [ ] Test accept/decline flows
- [ ] Test all animation types
- [ ] Test survey completion
- [ ] Test coupon copy functionality
- [ ] Test on different screen sizes
- [ ] Test on different browsers
- [ ] Test performance (FPS, memory)

---

## Performance Benchmarks

### Target Metrics
- Initial load: < 100ms
- Animation FPS: 60fps
- Memory usage: < 50MB
- CPU usage: < 5%

### Optimization Techniques
- Lazy load animations
- Reuse canvas contexts
- Minimize DOM manipulation
- Use CSS transforms
- Debounce resize events
- Clean up event listeners

---

## Future Enhancements

### Phase 2
- Sound effects system
- Reduced motion mode
- Keyboard navigation
- Screen reader support

### Phase 3
- Backend API integration
- Real-time analytics
- A/B testing framework
- Custom theme builder UI

### Phase 4
- Mobile browser support
- Multi-language support
- User accounts
- Persistent preferences
