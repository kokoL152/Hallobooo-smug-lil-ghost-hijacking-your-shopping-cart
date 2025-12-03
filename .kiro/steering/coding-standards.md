---
inclusion: always
---

# Kiroween Extension - Coding Standards

## JavaScript Style Guide

### Naming Conventions

**Functions**: camelCase, descriptive verbs
```javascript
// ✅ Good
function createInvitationModal(config) { }
function handleOptionClick(type, config) { }
function showMagicScrollAnimation(config, callback) { }

// ❌ Bad
function modal(c) { }
function click(t, c) { }
function anim(c, cb) { }
```

**Variables**: camelCase, descriptive nouns
```javascript
// ✅ Good
const animationState = { }
const questionnaireState = { }
const currentQuestionIndex = 0

// ❌ Bad
const state = { }
const qState = { }
const idx = 0
```

**Constants**: UPPER_SNAKE_CASE for true constants
```javascript
// ✅ Good
const MAX_LOOPS = 1
const ANIMATION_DURATION = 180

// ❌ Bad
const maxLoops = 1
const animDuration = 180
```

**Canvas Context**: Use `ctx` consistently
```javascript
// ✅ Good
const ctx = canvas.getContext('2d')
ctx.fillStyle = '#ff6b00'

// ❌ Bad
const context = canvas.getContext('2d')
const c = canvas.getContext('2d')
```

### Function Structure

**Always include JSDoc comments**:
```javascript
/**
 * Show magic scroll animation with ancient parchment
 * @param {Object} config - Theme configuration
 * @param {Function} callback - Called when animation completes
 */
function showMagicScrollAnimation(config, callback) {
  // Implementation
}
```

**Keep functions focused** (Single Responsibility):
```javascript
// ✅ Good - Each function does one thing
function createCanvas() { }
function drawGhost(ctx, x, y) { }
function animateGhost() { }

// ❌ Bad - Function does too much
function createAndDrawAndAnimateGhost() { }
```

**Use early returns** for validation:
```javascript
// ✅ Good
function loadQuestion(config, index) {
  if (!config || !config.negotiationQuestions) return
  if (index >= config.negotiationQuestions.length) return
  
  // Main logic here
}

// ❌ Bad
function loadQuestion(config, index) {
  if (config && config.negotiationQuestions) {
    if (index < config.negotiationQuestions.length) {
      // Main logic deeply nested
    }
  }
}
```

### Async/Await Pattern

**Always use async/await** instead of promises:
```javascript
// ✅ Good
async function loadConfigAndExecute() {
  try {
    const response = await fetch(configUrl)
    const config = await response.json()
    await injectAnimationEngine()
  } catch (error) {
    console.error('Error:', error)
  }
}

// ❌ Bad
function loadConfigAndExecute() {
  fetch(configUrl)
    .then(response => response.json())
    .then(config => injectAnimationEngine())
    .catch(error => console.error(error))
}
```

### Error Handling

**Always wrap risky code** in try-catch:
```javascript
// ✅ Good
try {
  const config = JSON.parse(themeConfigJson)
  window.postMessage({ type: 'NECRO_INIT_THEME', config }, '*')
} catch (error) {
  console.error('❌ Error initializing theme:', error)
}

// ❌ Bad
const config = JSON.parse(themeConfigJson)
window.postMessage({ type: 'NECRO_INIT_THEME', config }, '*')
```

**Fail gracefully**, never break the host page:
```javascript
// ✅ Good
function executeAnimation(config) {
  try {
    // Animation logic
  } catch (error) {
    console.error('Animation error:', error)
    // Continue with static UI
    createInteractionUI(config)
  }
}
```

### Canvas Best Practices

**Always save/restore context**:
```javascript
// ✅ Good
function drawGhost(ctx, x, y, scale) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  // Drawing code
  ctx.restore()
}

// ❌ Bad
function drawGhost(ctx, x, y, scale) {
  ctx.translate(x, y)
  ctx.scale(scale, scale)
  // Drawing code - transforms persist!
}
```

**Clear canvas before drawing**:
```javascript
// ✅ Good
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // Draw new frame
  requestAnimationFrame(animate)
}

// ❌ Bad
function animate() {
  // Draw new frame - overlaps previous!
  requestAnimationFrame(animate)
}
```

**Use requestAnimationFrame**:
```javascript
// ✅ Good
function animate() {
  // Update and draw
  if (frame < duration) {
    requestAnimationFrame(animate)
  }
}

// ❌ Bad
function animate() {
  // Update and draw
  if (frame < duration) {
    setTimeout(animate, 16) // Not synced with display
  }
}
```

### State Management

**Never mutate state directly**:
```javascript
// ✅ Good
animationState.currentPhase = 'animation'
animationState.userAccepted = true

// ❌ Bad
animationState = { currentPhase: 'animation' } // Loses other properties
```

**Validate state before transitions**:
```javascript
// ✅ Good
function handleInvitationAccept(config) {
  if (animationState.permanentlyDismissed) return
  
  animationState.userAccepted = true
  animationState.currentPhase = 'animation'
  startFullExperience(config)
}
```

### Event Listeners

**Always clean up**:
```javascript
// ✅ Good
function createCanvas() {
  const canvas = document.createElement('canvas')
  
  const handleResize = () => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  window.addEventListener('resize', handleResize)
  
  // Store reference for cleanup
  canvas._resizeHandler = handleResize
  
  return canvas
}

function removeCanvas(canvas) {
  if (canvas._resizeHandler) {
    window.removeEventListener('resize', canvas._resizeHandler)
  }
  canvas.remove()
}
```

### CSS-in-JS

**Use template literals** for multi-line styles:
```javascript
// ✅ Good
element.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${config.primaryColor};
`

// ❌ Bad
element.style.position = 'fixed'
element.style.top = '50%'
element.style.left = '50%'
// ... many lines
```

**Use CSS variables** for theme colors:
```javascript
// ✅ Good
const style = document.createElement('style')
style.textContent = `
  :root {
    --necro-primary: ${config.primaryColor};
    --necro-secondary: ${config.secondaryColor};
  }
  
  .necro-element {
    background: var(--necro-primary);
  }
`
```

## File Organization

### Import Order
1. External dependencies (none in this project)
2. Internal modules
3. Configuration files
4. Styles

### Function Order in Files
1. State declarations
2. Initialization functions
3. UI creation functions
4. Animation functions
5. Helper/utility functions
6. Event handlers
7. Cleanup functions

### Comments

**Use section comments** for major blocks:
```javascript
/**
 * ============================================
 * QUESTIONNAIRE SYSTEM
 * ============================================
 */

/**
 * Create questionnaire UI
 */
function createQuestionnaireUI(config) { }

/**
 * Load question
 */
function loadQuestion(config, index) { }
```

**Explain WHY, not WHAT**:
```javascript
// ✅ Good
// Use postMessage instead of direct call for CSP compliance
window.postMessage({ type: 'NECRO_INIT_THEME', config }, '*')

// ❌ Bad
// Post message to window
window.postMessage({ type: 'NECRO_INIT_THEME', config }, '*')
```

## Performance Guidelines

### Animation Optimization

**Minimize canvas operations**:
```javascript
// ✅ Good - Set once
ctx.fillStyle = '#ff6b00'
for (let i = 0; i < 10; i++) {
  ctx.fillRect(i * 10, 0, 8, 8)
}

// ❌ Bad - Set repeatedly
for (let i = 0; i < 10; i++) {
  ctx.fillStyle = '#ff6b00'
  ctx.fillRect(i * 10, 0, 8, 8)
}
```

**Use transform for positioning**:
```javascript
// ✅ Good - GPU accelerated
element.style.transform = `translate(${x}px, ${y}px)`

// ❌ Bad - Triggers layout
element.style.left = `${x}px`
element.style.top = `${y}px`
```

### Memory Management

**Remove elements when done**:
```javascript
// ✅ Good
function cleanup() {
  const canvas = document.getElementById('necro-canvas')
  if (canvas) {
    canvas.remove()
  }
}

// ❌ Bad
function cleanup() {
  const canvas = document.getElementById('necro-canvas')
  if (canvas) {
    canvas.style.display = 'none' // Still in memory!
  }
}
```

## Security Guidelines

### CSP Compliance

**Never use inline scripts**:
```javascript
// ✅ Good
const script = document.createElement('script')
script.src = chrome.runtime.getURL('scripts/animation_engine.js')
document.head.appendChild(script)

// ❌ Bad
const script = document.createElement('script')
script.textContent = 'function init() { }'
document.head.appendChild(script)
```

**Never use eval**:
```javascript
// ✅ Good
const config = JSON.parse(configString)

// ❌ Bad
const config = eval('(' + configString + ')')
```

### XSS Prevention

**Never use innerHTML with user input**:
```javascript
// ✅ Good
element.textContent = userInput

// ❌ Bad
element.innerHTML = userInput
```

## Testing Guidelines

### Manual Testing Checklist

Before committing:
- [ ] Test on airline website
- [ ] Test on lingerie website
- [ ] Test on food website
- [ ] Test accept flow
- [ ] Test decline flow
- [ ] Check console for errors
- [ ] Verify animations run at 60fps
- [ ] Check memory usage in DevTools

### Console Logging

**Use emoji prefixes** for visibility:
```javascript
console.log('🎨 Initializing Animation Engine...')
console.log('✓ Theme styles injected')
console.log('❌ Error loading config:', error)
console.log('📊 Questionnaire Complete!')
```

## Git Commit Messages

### Format
```
type: brief description

- Detailed point 1
- Detailed point 2
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting, no code change
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding tests
- `chore`: Maintenance

### Examples
```
feat: add data castle animation with winged parchment

- Implement realistic gothic castle rendering
- Create winged parchment scroll with flapping animation
- Add flight trajectory with motion trail
- Include lightning and fog effects
```

```
fix: prevent memory leak in canvas animations

- Remove canvas elements after animation completes
- Clean up event listeners properly
- Add null checks before removal
```

## Code Review Checklist

Before merging:
- [ ] All functions have JSDoc comments
- [ ] No console.error in production code
- [ ] All canvas contexts are saved/restored
- [ ] Event listeners are cleaned up
- [ ] No memory leaks (test with DevTools)
- [ ] Animations run at 60fps
- [ ] Code follows naming conventions
- [ ] Error handling is comprehensive
- [ ] CSP compliant (no inline scripts/eval)
- [ ] Tested on multiple websites
