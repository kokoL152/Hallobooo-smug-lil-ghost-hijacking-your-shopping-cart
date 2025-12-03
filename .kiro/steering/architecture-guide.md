---
inclusion: always
---

# Kiroween Extension - Architecture Guide

## System Architecture

### Extension Context vs Page Context

```
┌─────────────────────────────────────────────────────────┐
│                    Chrome Browser                        │
├──────────────────────────┬──────────────────────────────┤
│   Extension Context      │      Page Context            │
│   (Isolated)             │      (Website's DOM)         │
│                          │                              │
│   manifest.json          │                              │
│        ↓                 │                              │
│   content_script.js ─────┼────→ animation_engine.js    │
│        ↓                 │            ↓                 │
│   theme_config.json      │      Canvas Elements         │
│                          │      UI Components           │
└──────────────────────────┴──────────────────────────────┘
```

**Key Principle**: Content script runs in isolated context, animation engine runs in page context for DOM manipulation.

---

## Data Flow Architecture

### 1. Initialization Flow

```
User visits website
    ↓
content_script.js loads
    ↓
Fetch theme_config.json
    ↓
URL Classification
    ↓
Select matching theme
    ↓
Inject animation_engine.js via <script src>
    ↓
postMessage with theme config
    ↓
animation_engine.js receives message
    ↓
initializeAnimationEngine(config)
```

### 2. State Machine Flow

```
[INVITATION]
    ↓ accept
[ANIMATION] (theme-specific)
    ↓ complete
[INTERACTION] (magic scroll → survey)
    ↓ complete
[REWARD] (data castle → magic trick → coupon)
    ↓ timeout
[FADEOUT]
    ↓
[END]
```

**State Transitions**:
- `invitation → fadeout`: User declines
- `invitation → animation`: User accepts
- `animation → interaction`: Animation completes
- `interaction → reward`: Survey completes
- `reward → fadeout`: Coupon displayed for 5s

---

## Component Architecture

### Core Components

#### 1. Content Script (`content_script.js`)
**Responsibility**: Bootstrap and configuration
**Key Functions**:
- `loadConfigAndExecute()` - Entry point
- `injectAnimationEngine()` - Script injection
- `initializeTheme()` - Message passing

**Design Pattern**: Facade Pattern (simple interface to complex system)

#### 2. Animation Engine (`animation_engine.js`)
**Responsibility**: All UI and animation logic
**Modules**:
- State Management
- Theme Injection
- Animation Execution
- Storytelling Sequence
- Canvas Rendering
- UI Components

**Design Pattern**: State Machine + Strategy Pattern

#### 3. Theme Configuration (`theme_config.json`)
**Responsibility**: Data and configuration
**Structure**:
```json
{
  "urlClassificationRules": { },
  "themes": {
    "airline": { },
    "lingerie": { },
    "food": { },
    "halloween": { },
    "general": { }
  }
}
```

---

## Animation Architecture

### Animation Loop Pattern

All animations follow this pattern:

```javascript
function executeAnimation(config) {
  const canvas = createAnimationCanvas()
  const ctx = canvas.getContext('2d')
  
  let frame = 0
  const duration = 180 // frames
  
  function animate() {
    // 1. Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // 2. Calculate progress
    const progress = frame / duration
    
    // 3. Update state
    updateAnimationState(progress)
    
    // 4. Draw frame
    drawBackground(ctx)
    drawCharacters(ctx, progress)
    drawEffects(ctx, progress)
    drawText(ctx, progress)
    
    // 5. Continue or complete
    frame++
    if (frame < duration) {
      requestAnimationFrame(animate)
    } else {
      cleanup(canvas)
      callback()
    }
  }
  
  animate()
}
```

### Canvas Rendering Hierarchy

```
Canvas Element
    ↓
Context (ctx)
    ↓
Drawing Functions
    ├─ drawBackground()
    ├─ drawCharacters()
    │   ├─ drawCuteGhost()
    │   ├─ drawRealisticDarkCastle()
    │   └─ drawParchmentScrollWithWings()
    ├─ drawEffects()
    │   ├─ drawSparkles()
    │   ├─ drawTrails()
    │   └─ drawParticles()
    └─ drawText()
        ├─ drawBanner()
        └─ drawSubtitle()
```

**Principle**: Reusable drawing functions, composable animations

---

## State Management Architecture

### Global State

```javascript
// Animation state (singleton)
const animationState = {
  currentPhase: string,    // Current phase in state machine
  loopCount: number,       // Animation loop counter
  maxLoops: number,        // Max loops before proceeding
  interactionComplete: boolean,
  userAccepted: boolean,
  permanentlyDismissed: boolean
}

// Questionnaire state
const questionnaireState = {
  currentQuestionIndex: number,
  userAnswers: array,
  isAnimating: boolean,
  startTime: timestamp,
  sessionId: string
}
```

**Access Pattern**: Direct property access (no getters/setters needed for this scale)

### State Validation

Always validate before transitions:

```javascript
function transitionToPhase(newPhase) {
  // Validate current state
  if (animationState.permanentlyDismissed) return
  
  // Validate transition is allowed
  const allowedTransitions = {
    'invitation': ['animation', 'fadeout'],
    'animation': ['interaction'],
    'interaction': ['reward'],
    'reward': ['fadeout']
  }
  
  if (!allowedTransitions[animationState.currentPhase].includes(newPhase)) {
    console.error('Invalid transition')
    return
  }
  
  // Perform transition
  animationState.currentPhase = newPhase
}
```

---

## UI Component Architecture

### Component Hierarchy

```
Page
├─ Circuit Board Edges (CSS pseudo-elements)
├─ Kiro Ghost (SVG, fixed position)
├─ Kicker Notification (temporary)
├─ Animation Canvas (full screen)
├─ Invitation Modal
├─ Questionnaire UI
│   ├─ Question Text
│   ├─ Progress Indicator
│   └─ Options Container
│       ├─ Option A
│       ├─ Ghost (center)
│       └─ Option B
├─ Storytelling Canvases
│   ├─ Magic Scroll Canvas
│   ├─ Data Castle Canvas
│   └─ Magic Trick Canvas
├─ Coupon Modal
└─ Goodbye Message
```

### Component Lifecycle

```
Create → Mount → Animate → Interact → Unmount → Cleanup
```

**Example**:
```javascript
// Create
const modal = document.createElement('div')
modal.id = 'necro-modal'

// Mount
document.body.appendChild(modal)

// Animate
setTimeout(() => modal.style.opacity = '1', 100)

// Interact
modal.onclick = handleClick

// Unmount
setTimeout(() => {
  modal.style.opacity = '0'
  setTimeout(() => {
    // Cleanup
    modal.remove()
  }, 500)
}, 5000)
```

---

## Communication Architecture

### Cross-Context Communication

**Problem**: Content script and page context are isolated

**Solution**: postMessage API

```javascript
// Content Script (Extension Context)
window.postMessage({
  type: 'NECRO_INIT_THEME',
  config: themeConfig
}, '*')

// Animation Engine (Page Context)
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data.type === 'NECRO_INIT_THEME') {
    initializeAnimationEngine(event.data.config)
  }
})
```

**Security**: Only accept messages from same window

---

## Performance Architecture

### Optimization Strategies

#### 1. Canvas Optimization
- Reuse canvas contexts
- Minimize state changes
- Use transform for positioning
- Clear only dirty regions (when possible)

#### 2. Memory Management
- Remove DOM elements after use
- Clean up event listeners
- Avoid memory leaks in closures
- Use WeakMap for element metadata

#### 3. Animation Performance
- Use requestAnimationFrame
- Target 60fps (16.67ms per frame)
- Offload to GPU with transform/opacity
- Debounce resize events

#### 4. Lazy Loading
- Inject scripts only when needed
- Create UI components on demand
- Load animations progressively

### Performance Monitoring

```javascript
// FPS Counter
let lastTime = performance.now()
let frames = 0

function animate() {
  frames++
  const now = performance.now()
  
  if (now - lastTime >= 1000) {
    console.log(`FPS: ${frames}`)
    frames = 0
    lastTime = now
  }
  
  // Animation logic
  requestAnimationFrame(animate)
}
```

---

## Error Handling Architecture

### Error Boundaries

```javascript
// Top-level error boundary
try {
  initializeAnimationEngine(config)
} catch (error) {
  console.error('Fatal error:', error)
  // Fail silently, don't break page
}

// Component-level error boundary
function createComponent() {
  try {
    // Component logic
  } catch (error) {
    console.error('Component error:', error)
    // Return fallback UI
    return createFallbackUI()
  }
}
```

### Graceful Degradation

```javascript
function executeAnimation(config) {
  try {
    // Try Canvas animation
    const canvas = document.createElement('canvas')
    if (!canvas.getContext) {
      throw new Error('Canvas not supported')
    }
    // Animation logic
  } catch (error) {
    console.warn('Animation failed, using static UI')
    // Fallback to static UI
    createStaticUI(config)
  }
}
```

---

## Security Architecture

### Content Security Policy (CSP)

**Requirements**:
- No inline scripts
- No eval() or Function()
- No external script sources

**Implementation**:
```javascript
// ✅ CSP Compliant
const script = document.createElement('script')
script.src = chrome.runtime.getURL('scripts/animation_engine.js')
document.head.appendChild(script)

// ❌ CSP Violation
const script = document.createElement('script')
script.textContent = 'alert("XSS")'
document.head.appendChild(script)
```

### XSS Prevention

**Principle**: Never trust user input

```javascript
// ✅ Safe
element.textContent = userInput

// ❌ Unsafe
element.innerHTML = userInput
```

### Data Privacy

**Principle**: No external data transmission

- All data stays local
- Console logging only
- No analytics services
- No external APIs

---

## Testing Architecture

### Testing Pyramid

```
        /\
       /  \      E2E Tests (Manual)
      /────\     
     /      \    Integration Tests (Future)
    /────────\   
   /          \  Unit Tests (Future)
  /────────────\
```

### Current Testing Strategy

**Manual Testing**:
1. Load extension
2. Visit test websites
3. Complete full user journey
4. Verify console logs
5. Check performance metrics

**Future Automated Testing**:
- Unit tests for utility functions
- Integration tests for user flows
- Performance benchmarks
- Visual regression tests

---

## Scalability Considerations

### Adding New Themes

1. **Configuration** (`theme_config.json`):
   - Add URL keywords to `urlClassificationRules`
   - Create theme object in `themes`
   - Define 3 survey questions

2. **Animation** (`animation_engine.js`):
   - (Optional) Create custom animation function
   - Add case to `executeAnimation()` switch

3. **Testing**:
   - Test on target websites
   - Verify animation performance
   - Check data collection

### Adding New Features

1. **Design**: Document in `.kiro/specs/`
2. **Implement**: Follow coding standards
3. **Test**: Manual testing checklist
4. **Document**: Update README and steering docs
5. **Deploy**: Git commit and push

---

## Deployment Architecture

### Extension Packaging

```
kiroween-extension/
├── manifest.json          # Required
├── content_script.js      # Required
├── scripts/               # Required
├── src/                   # Required
├── styles/                # Required
├── icons/                 # Required
├── docs/                  # Optional (not packaged)
└── .kiro/                 # Optional (not packaged)
```

### Distribution

1. **Development**: Load unpacked in Chrome
2. **Production**: Package as .crx file
3. **Chrome Web Store**: Submit for review

---

## Monitoring & Debugging

### Console Logging Strategy

```javascript
// Initialization
console.log('🎨 Initializing Animation Engine...')

// Success
console.log('✓ Theme styles injected')

// Errors
console.error('❌ Error loading config:', error)

// Data
console.log('📊 Questionnaire Complete!')
console.log(JSON.stringify(data, null, 2))
```

### DevTools Usage

1. **Console**: View logs and errors
2. **Performance**: Monitor FPS and memory
3. **Network**: Check resource loading
4. **Elements**: Inspect DOM changes
5. **Sources**: Debug JavaScript

---

## Future Architecture Considerations

### Phase 2: Backend Integration
- RESTful API for data collection
- Authentication system
- Real-time analytics dashboard

### Phase 3: Advanced Features
- WebSocket for real-time updates
- Service Worker for offline support
- IndexedDB for local storage

### Phase 4: Scale
- CDN for asset delivery
- Load balancing for API
- Caching strategies
- A/B testing infrastructure
