/**
 * The Necronomicon Mirror - Universal Animation Engine
 * This engine handles theme initialization and animation execution
 */

/**
 * Global animation state manager
 */
const animationState = {
  currentPhase: 'invitation', // phases: invitation, animation, interaction, reward, fadeout
  loopCount: 0,
  maxLoops: 1,
  interactionComplete: false,
  userAccepted: false,
  permanentlyDismissed: false
};

/**
 * Questionnaire state
 */
const questionnaireState = {
  currentQuestionIndex: 0,
  userAnswers: [],
  isAnimating: false
};

/**
 * Create questionnaire UI
 */
function createQuestionnaireUI(config) {
  const uiId = 'necro-questionnaire-ui';
  
  // Remove existing UI if any
  const existingUI = document.getElementById(uiId);
  if (existingUI) {
    existingUI.remove();
  }
  
  // Reset questionnaire state
  questionnaireState.currentQuestionIndex = 0;
  questionnaireState.userAnswers = [];
  questionnaireState.isAnimating = false;
  
  // Create main container
  const container = document.createElement('div');
  container.id = uiId;
  container.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999998;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.5s ease;
    pointer-events: all;
  `;
  
  // Question display
  const questionDiv = document.createElement('div');
  questionDiv.id = 'necro-question';
  questionDiv.style.cssText = `
    font-size: 32px;
    font-weight: bold;
    color: ${config.primaryColor};
    text-align: center;
    margin-bottom: 20px;
    max-width: 800px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 15%;
    left: 50%;
    transform: translateX(-50%);
  `;
  
  // Progress indicator
  const progressDiv = document.createElement('div');
  progressDiv.id = 'necro-progress';
  progressDiv.style.cssText = `
    font-size: 18px;
    color: #666;
    text-align: center;
    position: absolute;
    top: 22%;
    left: 50%;
    transform: translateX(-50%);
  `;
  
  // Options container
  const optionsContainer = document.createElement('div');
  optionsContainer.id = 'necro-options';
  optionsContainer.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 100px;
    position: relative;
  `;
  
  // Option A
  const optionA = createOptionElement('A', config);
  
  // Ghost in the middle
  const ghostContainer = document.createElement('div');
  ghostContainer.id = 'necro-quiz-ghost';
  ghostContainer.innerHTML = createGhostSVG(config.kairoGhostEmotion, config.primaryColor);
  ghostContainer.style.cssText = `
    width: 120px;
    height: 150px;
    animation: breathe 3s ease-in-out infinite;
    transition: all 0.5s ease;
  `;
  
  // Option B
  const optionB = createOptionElement('B', config);
  
  optionsContainer.appendChild(optionA);
  optionsContainer.appendChild(ghostContainer);
  optionsContainer.appendChild(optionB);
  
  container.appendChild(questionDiv);
  container.appendChild(progressDiv);
  container.appendChild(optionsContainer);
  document.body.appendChild(container);
  
  // Load first question
  loadQuestion(config, 0);
  
  // Fade in
  setTimeout(() => {
    container.style.opacity = '1';
  }, 100);
  
  console.log('✓ Questionnaire UI created');
}

/**
 * Create option element
 */
function createOptionElement(type, config) {
  const option = document.createElement('div');
  option.className = `necro-option necro-option-${type}`;
  option.style.cssText = `
    width: 200px;
    height: 280px;
    background: white;
    border: 5px solid ${config.secondaryColor};
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 30px;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  `;
  
  // Image/emoji
  const image = document.createElement('div');
  image.className = 'option-image';
  image.style.cssText = `
    font-size: 80px;
    margin-bottom: 25px;
    line-height: 1;
  `;
  
  // Label
  const label = document.createElement('div');
  label.className = 'option-label';
  label.style.cssText = `
    font-size: 20px;
    font-weight: bold;
    color: ${config.primaryColor};
    text-align: center;
    padding: 0 10px;
    line-height: 1.3;
  `;
  
  // Subtitle
  const subtitle = document.createElement('div');
  subtitle.className = 'option-subtitle';
  subtitle.style.cssText = `
    font-size: 14px;
    color: #666;
    text-align: center;
    margin-top: 8px;
    padding: 0 10px;
  `;
  
  option.appendChild(image);
  option.appendChild(label);
  option.appendChild(subtitle);
  
  // Hover effect
  option.onmouseover = () => {
    if (!questionnaireState.isAnimating) {
      option.style.transform = 'scale(1.05)';
      option.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.3)';
    }
  };
  
  option.onmouseout = () => {
    if (!questionnaireState.isAnimating) {
      option.style.transform = 'scale(1)';
      option.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
    }
  };
  
  option.onclick = () => {
    if (!questionnaireState.isAnimating) {
      handleOptionClick(type, config);
    }
  };
  
  return option;
}

/**
 * Load question
 */
function loadQuestion(config, index) {
  const questions = config.negotiationQuestions;
  if (!questions || index >= questions.length) return;
  
  const question = questions[index];
  
  // Update question text
  const questionDiv = document.getElementById('necro-question');
  if (questionDiv) {
    questionDiv.textContent = question.question;
  }
  
  // Update progress indicator
  const progressDiv = document.getElementById('necro-progress');
  if (progressDiv) {
    progressDiv.textContent = `Question ${index + 1} of ${questions.length}`;
  }
  
  // Update option A
  const optionA = document.querySelector('.necro-option-A');
  if (optionA) {
    optionA.querySelector('.option-image').textContent = question.optionA.image;
    optionA.querySelector('.option-label').textContent = question.optionA.label;
    optionA.querySelector('.option-subtitle').textContent = question.optionA.subtitle || '';
    optionA.dataset.value = question.optionA.value;
  }
  
  // Update option B
  const optionB = document.querySelector('.necro-option-B');
  if (optionB) {
    optionB.querySelector('.option-image').textContent = question.optionB.image;
    optionB.querySelector('.option-label').textContent = question.optionB.label;
    optionB.querySelector('.option-subtitle').textContent = question.optionB.subtitle || '';
    optionB.dataset.value = question.optionB.value;
  }
  
  console.log(`✓ Loaded question ${index + 1}/${questions.length}`);
}

/**
 * Handle option click
 */
function handleOptionClick(type, config) {
  questionnaireState.isAnimating = true;
  
  const option = document.querySelector(`.necro-option-${type}`);
  const ghost = document.getElementById('necro-quiz-ghost');
  const question = config.negotiationQuestions[questionnaireState.currentQuestionIndex];
  
  // Get answer value
  const answerValue = option.dataset.value;
  const answer = {
    questionId: question.id,
    question: question.question,
    selectedOption: type,
    value: answerValue,
    timestamp: new Date().toISOString()
  };
  
  questionnaireState.userAnswers.push(answer);
  
  // Flash green border
  option.style.border = `5px solid #00ff00`;
  option.style.boxShadow = '0 0 30px rgba(0, 255, 0, 0.8)';
  
  // Animate ghost flying to option
  const optionRect = option.getBoundingClientRect();
  const ghostRect = ghost.getBoundingClientRect();
  
  const deltaX = optionRect.left + optionRect.width / 2 - (ghostRect.left + ghostRect.width / 2);
  const deltaY = optionRect.top - ghostRect.top - 50;
  
  ghost.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.8)`;
  
  // After animation, load next question or finish
  setTimeout(() => {
    questionnaireState.currentQuestionIndex++;
    
    if (questionnaireState.currentQuestionIndex >= config.negotiationQuestions.length) {
      // Finished all questions
      finishQuestionnaire(config);
    } else {
      // Reset ghost position
      ghost.style.transform = '';
      
      // Reset option styles
      option.style.border = `5px solid ${config.secondaryColor}`;
      option.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
      
      // Load next question
      loadQuestion(config, questionnaireState.currentQuestionIndex);
      questionnaireState.isAnimating = false;
    }
  }, 800);
}

/**
 * Finish questionnaire
 */
function finishQuestionnaire(config) {
  console.log('📊 Questionnaire Complete!');
  console.log('User Answers:', questionnaireState.userAnswers);
  console.log('Kicker Text Version:', config.kickerTextVersion);
  
  // Send data to analytics (simulated)
  console.log('📤 Sending data to company analytics...');
  console.log(JSON.stringify({
    theme: config.category,
    kickerTextVersion: config.kickerTextVersion,
    answers: questionnaireState.userAnswers,
    completedAt: new Date().toISOString()
  }, null, 2));
  
  // Remove questionnaire UI
  const ui = document.getElementById('necro-questionnaire-ui');
  if (ui) {
    ui.style.opacity = '0';
    setTimeout(() => {
      ui.remove();
      // Show reward
      showRewardMessage(config);
      // Fade out after 5 seconds
      setTimeout(() => {
        fadeOutAllElements();
      }, 5000);
    }, 500);
  }
}

/**
 * Create interaction UI (now starts questionnaire)
 */
function createInteractionUI(config) {
  // Directly start questionnaire instead of showing button
  createQuestionnaireUI(config);
}



/**
 * Show reward message
 */
function showRewardMessage(config) {
  const rewardId = 'necro-reward-message';
  
  const rewardDiv = document.createElement('div');
  rewardDiv.id = rewardId;
  rewardDiv.textContent = '✨ You got a spooky discount! ✨';
  rewardDiv.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    padding: 20px 40px;
    background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
    color: white;
    font-size: 24px;
    font-weight: bold;
    border-radius: 15px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.4);
    z-index: 999999;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  
  document.body.appendChild(rewardDiv);
  
  setTimeout(() => {
    rewardDiv.style.opacity = '1';
  }, 100);
}

/**
 * Fade out all Necronomicon elements
 */
function fadeOutAllElements() {
  animationState.currentPhase = 'fadeout';
  
  // Show final goodbye message
  showGoodbyeMessage();
  
  const elements = [
    document.getElementById('necro-interaction-ui'),
    document.getElementById('necro-reward-message'),
    document.getElementById('necro-animation-canvas'),
    document.getElementById('kiro-ghost')
  ];
  
  elements.forEach(el => {
    if (el) {
      el.style.transition = 'opacity 1s ease';
      el.style.opacity = '0';
      setTimeout(() => {
        if (el.parentNode) {
          el.remove();
        }
      }, 1000);
    }
  });
  
  // Fade out circuit board edges
  const styleElement = document.getElementById('necronomicon-theme-styles');
  if (styleElement) {
    setTimeout(() => {
      styleElement.remove();
    }, 1000);
  }
  
  console.log('✓ All elements faded out');
}

/**
 * Show goodbye message
 */
function showGoodbyeMessage() {
  const goodbyeId = 'necro-goodbye-message';
  
  const goodbyeDiv = document.createElement('div');
  goodbyeDiv.id = goodbyeId;
  goodbyeDiv.innerHTML = `
    <div style="font-size: 48px; margin-bottom: 20px;">👻</div>
    <div style="font-size: 32px; font-weight: bold;">The mischievous ghost has left!</div>
    <div style="font-size: 24px; margin-top: 10px; opacity: 0.8;">Your PC is back to you 💻</div>
  `;
  goodbyeDiv.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 40px 60px;
    background: linear-gradient(135deg, #ff6b00, #8b0000);
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
    border-radius: 20px;
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.5);
    z-index: 9999999;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  
  document.body.appendChild(goodbyeDiv);
  
  setTimeout(() => {
    goodbyeDiv.style.opacity = '1';
  }, 100);
  
  // Fade out goodbye message after 3 seconds
  setTimeout(() => {
    goodbyeDiv.style.opacity = '0';
    setTimeout(() => {
      if (goodbyeDiv.parentNode) {
        goodbyeDiv.remove();
      }
    }, 500);
  }, 3000);
}

/**
 * Extract company name from URL
 */
function getCompanyName() {
  const hostname = window.location.hostname;
  
  // Remove www. if present
  const cleanHostname = hostname.replace(/^www\./, '');
  
  // Split by dots
  const parts = cleanHostname.split('.');
  
  // Get the part before .com/.net/.org etc (the main domain)
  const mainDomain = parts[0];
  
  // Capitalize first letter
  return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
}

/**
 * Shake page effect
 */
function shakePageEffect() {
  const shakeStyle = document.createElement('style');
  shakeStyle.id = 'necro-shake-style';
  shakeStyle.textContent = `
    @keyframes necroShake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
    
    body.necro-shaking {
      animation: necroShake 0.15s ease-in-out 3;
    }
  `;
  
  document.head.appendChild(shakeStyle);
  document.body.classList.add('necro-shaking');
  
  // Remove shake after animation
  setTimeout(() => {
    document.body.classList.remove('necro-shaking');
    setTimeout(() => {
      if (shakeStyle.parentNode) {
        shakeStyle.remove();
      }
    }, 500);
  }, 500);
}

/**
 * Create invitation modal
 */
function createInvitationModal(config) {
  const modalId = 'necro-invitation-modal';
  
  // Check if already dismissed
  if (animationState.permanentlyDismissed) {
    console.log('User previously dismissed invitation');
    return;
  }
  
  // Create modal overlay
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 9999999;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.5s ease;
  `;
  
  // Create modal content
  const modalContent = document.createElement('div');
  modalContent.style.cssText = `
    background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
    padding: 50px;
    border-radius: 30px;
    box-shadow: 0 10px 50px rgba(0, 0, 0, 0.5);
    text-align: center;
    max-width: 600px;
    position: relative;
  `;
  
  // Ghost SVG
  const ghostDiv = document.createElement('div');
  ghostDiv.innerHTML = createGhostSVG(config.kairoGhostEmotion, '#ffffff');
  ghostDiv.style.cssText = `
    width: 150px;
    height: 180px;
    margin: 0 auto 30px;
    animation: breathe 3s ease-in-out infinite;
  `;
  
  // Company name
  const companyName = getCompanyName();
  
  // Title
  const title = document.createElement('h2');
  title.textContent = `${companyName} invites you to Trick or Treat!`;
  title.style.cssText = `
    color: white;
    font-size: 32px;
    font-weight: bold;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  `;
  
  // Subtitle
  const subtitle = document.createElement('p');
  subtitle.textContent = '🎃 Join our Halloween adventure for exclusive treats! 🎃';
  subtitle.style.cssText = `
    color: rgba(255, 255, 255, 0.9);
    font-size: 18px;
    margin-bottom: 30px;
  `;
  
  // Buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.cssText = `
    display: flex;
    gap: 20px;
    justify-content: center;
  `;
  
  // Yes button
  const yesButton = document.createElement('button');
  yesButton.textContent = '✨ Yes, Join!';
  yesButton.style.cssText = `
    padding: 15px 40px;
    font-size: 20px;
    font-weight: bold;
    background: white;
    color: ${config.primaryColor};
    border: none;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `;
  
  yesButton.onmouseover = () => {
    yesButton.style.transform = 'scale(1.1)';
    yesButton.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.4)';
  };
  
  yesButton.onmouseout = () => {
    yesButton.style.transform = 'scale(1)';
    yesButton.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
  };
  
  yesButton.onclick = () => {
    handleInvitationAccept(config);
  };
  
  // No button
  const noButton = document.createElement('button');
  noButton.textContent = '👋 No, thanks';
  noButton.style.cssText = `
    padding: 15px 40px;
    font-size: 20px;
    font-weight: bold;
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 2px solid white;
    border-radius: 50px;
    cursor: pointer;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  `;
  
  noButton.onmouseover = () => {
    noButton.style.background = 'rgba(255, 255, 255, 0.3)';
    noButton.style.transform = 'scale(1.05)';
  };
  
  noButton.onmouseout = () => {
    noButton.style.background = 'rgba(255, 255, 255, 0.2)';
    noButton.style.transform = 'scale(1)';
  };
  
  noButton.onclick = () => {
    handleInvitationDecline();
  };
  
  // Assemble modal
  buttonsDiv.appendChild(yesButton);
  buttonsDiv.appendChild(noButton);
  
  modalContent.appendChild(ghostDiv);
  modalContent.appendChild(title);
  modalContent.appendChild(subtitle);
  modalContent.appendChild(buttonsDiv);
  
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  // Fade in
  setTimeout(() => {
    modal.style.opacity = '1';
  }, 100);
  
  console.log('✓ Invitation modal created');
}

/**
 * Handle invitation accept
 */
function handleInvitationAccept(config) {
  console.log('✅ User accepted invitation!');
  
  animationState.userAccepted = true;
  animationState.currentPhase = 'animation';
  
  // Remove modal
  const modal = document.getElementById('necro-invitation-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
      
      // Start the full experience
      startFullExperience(config);
    }, 500);
  }
}

/**
 * Handle invitation decline
 */
function handleInvitationDecline() {
  console.log('❌ User declined invitation');
  
  animationState.permanentlyDismissed = true;
  animationState.currentPhase = 'fadeout';
  
  // Remove modal
  const modal = document.getElementById('necro-invitation-modal');
  if (modal) {
    modal.style.opacity = '0';
    setTimeout(() => {
      modal.remove();
    }, 500);
  }
  
  // Remove all Kiro elements permanently
  removeAllKiroElements();
  
  console.log('✓ Kiro permanently dismissed for this session');
}

/**
 * Remove all Kiro elements
 */
function removeAllKiroElements() {
  const elements = [
    document.getElementById('necro-interaction-ui'),
    document.getElementById('necro-questionnaire-ui'),
    document.getElementById('necro-reward-message'),
    document.getElementById('necro-animation-canvas'),
    document.getElementById('kiro-ghost'),
    document.getElementById('necro-kicker'),
    document.getElementById('necronomicon-theme-styles')
  ];
  
  elements.forEach(el => {
    if (el && el.parentNode) {
      el.remove();
    }
  });
}

/**
 * Start full experience after acceptance
 */
function startFullExperience(config) {
  // Inject theme styles
  injectThemeStyles(config);
  
  // Create and inject Kiro Ghost component
  createKiroGhost(config);
  
  // Display kicker text notification
  displayKickerNotification(config.kickerText);
  
  // Execute animation based on type
  executeAnimation(config);
  
  console.log('✓ Full experience started!');
}

/**
 * Global initialization function called by content_script.js
 * @param {Object} config - Theme configuration object
 */
function initializeAnimationEngine(config) {
  console.log('🎨 Initializing Animation Engine...');
  console.log('Theme:', config.themeName);
  console.log('Emotion:', config.kairoGhostEmotion);
  
  // Reset animation state
  animationState.currentPhase = 'invitation';
  animationState.loopCount = 0;
  animationState.interactionComplete = false;
  animationState.userAccepted = false;
  
  // Check if user previously dismissed
  if (animationState.permanentlyDismissed) {
    console.log('User previously dismissed, skipping initialization');
    return;
  }
  
  // Shake page effect
  shakePageEffect();
  
  // Show invitation modal after shake
  setTimeout(() => {
    createInvitationModal(config);
  }, 600);
  
  console.log('✓ Animation Engine initialized with invitation flow!');
}

/**
 * Inject dynamic theme styles into the page
 * @param {Object} config - Theme configuration
 */
function injectThemeStyles(config) {
  const styleId = 'necronomicon-theme-styles';
  
  // Remove existing styles if any
  const existingStyle = document.getElementById(styleId);
  if (existingStyle) {
    existingStyle.remove();
  }
  
  // Create new style element
  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    :root {
      --necro-primary: ${config.primaryColor};
      --necro-secondary: ${config.secondaryColor};
      --necro-background: ${config.backgroundColor};
    }
    
    body {
      background-color: ${config.backgroundColor} !important;
      transition: background-color 0.5s ease !important;
      position: relative;
      overflow-x: hidden;
    }
    
    /* Torn edge effect - Top Left Corner with realistic circuit board */
    body::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      width: 350px;
      height: 350px;
      background: 
        /* White silkscreen traces */
        repeating-linear-gradient(
          15deg,
          transparent 0px,
          transparent 18px,
          rgba(220, 255, 220, 0.4) 18px,
          rgba(220, 255, 220, 0.4) 20px,
          transparent 20px,
          transparent 40px
        ),
        repeating-linear-gradient(
          75deg,
          transparent 0px,
          transparent 22px,
          rgba(220, 255, 220, 0.35) 22px,
          rgba(220, 255, 220, 0.35) 24px,
          transparent 24px,
          transparent 48px
        ),
        /* IC Chip 1 - large black rectangle with pins */
        linear-gradient(90deg, transparent 18%, rgba(30, 30, 30, 0.95) 20%, rgba(30, 30, 30, 0.95) 38%, transparent 40%),
        linear-gradient(0deg, transparent 25%, rgba(30, 30, 30, 0.95) 27%, rgba(30, 30, 30, 0.95) 45%, transparent 47%),
        /* IC Chip pins (gold) */
        repeating-linear-gradient(90deg, transparent 20%, rgba(255, 200, 50, 0.9) 20.5%, rgba(255, 200, 50, 0.9) 21%, transparent 21%, transparent 22%),
        /* IC Chip 2 */
        linear-gradient(90deg, transparent 58%, rgba(30, 30, 30, 0.95) 60%, rgba(30, 30, 30, 0.95) 75%, transparent 77%),
        linear-gradient(0deg, transparent 55%, rgba(30, 30, 30, 0.95) 57%, rgba(30, 30, 30, 0.95) 72%, transparent 74%),
        /* Capacitors - cylindrical */
        radial-gradient(ellipse 10px 18px at 30% 68%, rgba(60, 100, 180, 0.9), rgba(40, 70, 140, 0.9) 60%, rgba(30, 50, 100, 0.8) 80%, transparent 85%),
        radial-gradient(ellipse 8px 15px at 78% 42%, rgba(180, 140, 60, 0.9), rgba(140, 100, 40, 0.9) 60%, transparent 75%),
        /* Resistors - small rectangles with bands */
        linear-gradient(90deg, transparent 43%, rgba(200, 180, 140, 0.9) 45%, rgba(200, 180, 140, 0.9) 52%, transparent 54%),
        linear-gradient(0deg, transparent 78%, rgba(200, 180, 140, 0.9) 80%, rgba(200, 180, 140, 0.9) 84%, transparent 86%),
        /* Mounting screws */
        radial-gradient(circle at 10% 10%, rgba(180, 180, 180, 0.9) 3px, rgba(120, 120, 120, 0.8) 4px, rgba(80, 80, 80, 0.6) 5px, transparent 6px),
        radial-gradient(circle at 90% 90%, rgba(180, 180, 180, 0.9) 3px, rgba(120, 120, 120, 0.8) 4px, rgba(80, 80, 80, 0.6) 5px, transparent 6px),
        /* Gold/copper pads */
        radial-gradient(circle at 15% 20%, rgba(255, 200, 50, 0.9) 4px, rgba(255, 200, 50, 0.3) 5px, transparent 6px),
        radial-gradient(circle at 40% 35%, rgba(255, 200, 50, 0.9) 5px, rgba(255, 200, 50, 0.3) 6px, transparent 7px),
        radial-gradient(circle at 25% 50%, rgba(255, 200, 50, 0.9) 3px, rgba(255, 200, 50, 0.3) 4px, transparent 5px),
        radial-gradient(circle at 50% 60%, rgba(255, 200, 50, 0.9) 6px, rgba(255, 200, 50, 0.3) 7px, transparent 8px),
        radial-gradient(circle at 70% 25%, rgba(255, 200, 50, 0.9) 4px, rgba(255, 200, 50, 0.3) 5px, transparent 6px),
        radial-gradient(circle at 60% 75%, rgba(255, 200, 50, 0.9) 5px, rgba(255, 200, 50, 0.3) 6px, transparent 7px),
        /* Copper trace lines */
        linear-gradient(90deg, transparent 20%, rgba(200, 150, 80, 0.5) 22%, rgba(200, 150, 80, 0.5) 24%, transparent 26%),
        linear-gradient(0deg, transparent 35%, rgba(200, 150, 80, 0.5) 37%, rgba(200, 150, 80, 0.5) 39%, transparent 41%),
        linear-gradient(45deg, transparent 50%, rgba(200, 150, 80, 0.4) 52%, rgba(200, 150, 80, 0.4) 54%, transparent 56%),
        /* Fine grid texture */
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          rgba(40, 120, 60, 0.3) 0.5px,
          transparent 1px,
          transparent 2px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          rgba(40, 120, 60, 0.3) 0.5px,
          transparent 1px,
          transparent 2px
        ),
        /* Base green PCB color */
        radial-gradient(circle at 30% 30%, rgba(30, 130, 76, 0.95), rgba(20, 100, 60, 0.98)),
        linear-gradient(135deg, rgba(25, 115, 70, 0.95), rgba(18, 90, 55, 0.98));
      clip-path: polygon(
        0 0,
        100% 0,
        96% 8%,
        100% 14%,
        92% 22%,
        96% 30%,
        88% 38%,
        92% 46%,
        84% 54%,
        88% 62%,
        78% 70%,
        70% 78%,
        62% 88%,
        54% 84%,
        46% 92%,
        38% 88%,
        30% 96%,
        22% 92%,
        14% 100%,
        8% 96%,
        0 100%
      );
      z-index: 999996;
      pointer-events: none;
      animation: circuitFlicker 4s ease-in-out infinite, edgeHueRotate 10s linear infinite;
      background-size: 
        auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto;
      box-shadow: 
        /* Soft outer glow */
        0 0 30px rgba(34, 139, 34, 0.4),
        0 0 50px rgba(34, 139, 34, 0.2),
        /* Inner depth */
        inset 0 0 40px rgba(0, 0, 0, 0.3),
        inset -5px -5px 20px rgba(0, 0, 0, 0.4),
        /* Component highlights */
        inset 10px 10px 30px rgba(184, 115, 51, 0.15),
        /* Edge lighting */
        0 2px 8px rgba(218, 165, 32, 0.3),
        /* Electric spark effect */
        0 0 15px rgba(100, 200, 255, 0.4),
        inset 5px 5px 10px rgba(100, 200, 255, 0.2);
      animation: circuitFlicker 4s ease-in-out infinite, edgeHueRotate 10s linear infinite, electricSpark 2s ease-in-out infinite;
    }
    
    /* Add pseudo-element for IC chips and components */
    body::before::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background:
        /* IC chip 1 */
        linear-gradient(90deg, transparent 18%, rgba(40, 40, 40, 0.8) 20%, rgba(40, 40, 40, 0.8) 35%, transparent 37%),
        linear-gradient(0deg, transparent 28%, rgba(40, 40, 40, 0.8) 30%, rgba(40, 40, 40, 0.8) 45%, transparent 47%),
        /* IC chip 2 */
        linear-gradient(90deg, transparent 58%, rgba(40, 40, 40, 0.8) 60%, rgba(40, 40, 40, 0.8) 72%, transparent 74%),
        linear-gradient(0deg, transparent 58%, rgba(40, 40, 40, 0.8) 60%, rgba(40, 40, 40, 0.8) 72%, transparent 74%),
        /* Capacitors (small rectangles) */
        radial-gradient(ellipse 8px 15px at 30% 65%, rgba(180, 140, 60, 0.9), rgba(100, 70, 30, 0.8) 70%, transparent 71%),
        radial-gradient(ellipse 8px 15px at 75% 40%, rgba(180, 140, 60, 0.9), rgba(100, 70, 30, 0.8) 70%, transparent 71%),
        /* Resistors */
        radial-gradient(ellipse 12px 4px at 45% 80%, rgba(200, 180, 140, 0.8), transparent 70%),
        radial-gradient(ellipse 12px 4px at 65% 25%, rgba(200, 180, 140, 0.8), transparent 70%);
    }
    
    /* Torn edge effect - Bottom Right Corner with realistic circuit board */
    body::after {
      content: '';
      position: fixed;
      bottom: 0;
      right: 0;
      width: 350px;
      height: 350px;
      background: 
        /* White silkscreen traces */
        repeating-linear-gradient(
          -15deg,
          transparent 0px,
          transparent 20px,
          rgba(220, 255, 220, 0.4) 20px,
          rgba(220, 255, 220, 0.4) 22px,
          transparent 22px,
          transparent 44px
        ),
        repeating-linear-gradient(
          -75deg,
          transparent 0px,
          transparent 25px,
          rgba(220, 255, 220, 0.35) 25px,
          rgba(220, 255, 220, 0.35) 27px,
          transparent 27px,
          transparent 52px
        ),
        /* IC Chip 1 */
        linear-gradient(90deg, transparent 22%, rgba(30, 30, 30, 0.95) 24%, rgba(30, 30, 30, 0.95) 40%, transparent 42%),
        linear-gradient(0deg, transparent 30%, rgba(30, 30, 30, 0.95) 32%, rgba(30, 30, 30, 0.95) 48%, transparent 50%),
        /* IC Chip 2 */
        linear-gradient(90deg, transparent 62%, rgba(30, 30, 30, 0.95) 64%, rgba(30, 30, 30, 0.95) 78%, transparent 80%),
        linear-gradient(0deg, transparent 60%, rgba(30, 30, 30, 0.95) 62%, rgba(30, 30, 30, 0.95) 76%, transparent 78%),
        /* Capacitors */
        radial-gradient(ellipse 10px 18px at 35% 72%, rgba(60, 100, 180, 0.9), rgba(40, 70, 140, 0.9) 60%, transparent 80%),
        radial-gradient(ellipse 8px 15px at 82% 38%, rgba(180, 140, 60, 0.9), rgba(140, 100, 40, 0.9) 60%, transparent 75%),
        /* Resistors */
        linear-gradient(90deg, transparent 48%, rgba(200, 180, 140, 0.9) 50%, rgba(200, 180, 140, 0.9) 56%, transparent 58%),
        linear-gradient(0deg, transparent 82%, rgba(200, 180, 140, 0.9) 84%, rgba(200, 180, 140, 0.9) 88%, transparent 90%),
        /* Mounting screws */
        radial-gradient(circle at 10% 90%, rgba(180, 180, 180, 0.9) 3px, rgba(120, 120, 120, 0.8) 4px, rgba(80, 80, 80, 0.6) 5px, transparent 6px),
        radial-gradient(circle at 90% 10%, rgba(180, 180, 180, 0.9) 3px, rgba(120, 120, 120, 0.8) 4px, rgba(80, 80, 80, 0.6) 5px, transparent 6px),
        /* Gold/copper pads */
        radial-gradient(circle at 80% 75%, rgba(255, 200, 50, 0.9) 5px, rgba(255, 200, 50, 0.3) 6px, transparent 7px),
        radial-gradient(circle at 60% 60%, rgba(255, 200, 50, 0.9) 4px, rgba(255, 200, 50, 0.3) 5px, transparent 6px),
        radial-gradient(circle at 70% 45%, rgba(255, 200, 50, 0.9) 6px, rgba(255, 200, 50, 0.3) 7px, transparent 8px),
        radial-gradient(circle at 50% 80%, rgba(255, 200, 50, 0.9) 5px, rgba(255, 200, 50, 0.3) 6px, transparent 7px),
        radial-gradient(circle at 30% 70%, rgba(255, 200, 50, 0.9) 4px, rgba(255, 200, 50, 0.3) 5px, transparent 6px),
        radial-gradient(circle at 85% 50%, rgba(255, 200, 50, 0.9) 5px, rgba(255, 200, 50, 0.3) 6px, transparent 7px),
        /* Copper trace lines */
        linear-gradient(-90deg, transparent 25%, rgba(200, 150, 80, 0.5) 27%, rgba(200, 150, 80, 0.5) 29%, transparent 31%),
        linear-gradient(180deg, transparent 40%, rgba(200, 150, 80, 0.5) 42%, rgba(200, 150, 80, 0.5) 44%, transparent 46%),
        linear-gradient(-45deg, transparent 55%, rgba(200, 150, 80, 0.4) 57%, rgba(200, 150, 80, 0.4) 59%, transparent 61%),
        /* Fine grid texture */
        repeating-linear-gradient(
          0deg,
          transparent 0px,
          rgba(40, 120, 60, 0.3) 0.5px,
          transparent 1px,
          transparent 2px
        ),
        repeating-linear-gradient(
          90deg,
          transparent 0px,
          rgba(40, 120, 60, 0.3) 0.5px,
          transparent 1px,
          transparent 2px
        ),
        /* Base green PCB color */
        radial-gradient(circle at 70% 70%, rgba(30, 130, 76, 0.95), rgba(20, 100, 60, 0.98)),
        linear-gradient(-45deg, rgba(25, 115, 70, 0.95), rgba(18, 90, 55, 0.98));
      clip-path: polygon(
        100% 100%,
        0 100%,
        4% 92%,
        0 86%,
        8% 78%,
        4% 70%,
        12% 62%,
        8% 54%,
        16% 46%,
        12% 38%,
        22% 30%,
        30% 22%,
        38% 12%,
        46% 16%,
        54% 8%,
        62% 12%,
        70% 4%,
        78% 8%,
        86% 0,
        92% 4%,
        100% 0
      );
      z-index: 999996;
      pointer-events: none;
      animation: circuitFlicker 4s ease-in-out infinite 2s, edgeHueRotate 10s linear infinite 5s;
      background-size: 
        auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto, auto;
      box-shadow: 
        /* Soft outer glow */
        0 0 30px rgba(34, 139, 34, 0.4),
        0 0 50px rgba(34, 139, 34, 0.2),
        /* Inner depth */
        inset 0 0 40px rgba(0, 0, 0, 0.3),
        inset 5px 5px 20px rgba(0, 0, 0, 0.4),
        /* Component highlights */
        inset -10px -10px 30px rgba(184, 115, 51, 0.15),
        /* Edge lighting */
        0 -2px 8px rgba(218, 165, 32, 0.3),
        /* Electric spark effect */
        0 0 15px rgba(100, 200, 255, 0.4),
        inset -5px -5px 10px rgba(100, 200, 255, 0.2);
      animation: circuitFlicker 4s ease-in-out infinite 2s, edgeHueRotate 10s linear infinite 5s, electricSpark 2s ease-in-out infinite 1s;
    }
    
    /* Circuit board flicker animation - more realistic */
    @keyframes circuitFlicker {
      0%, 100% { 
        opacity: 0.92;
        filter: brightness(1) contrast(1.05);
      }
      20% { 
        opacity: 0.95;
        filter: brightness(1.15) contrast(1.08);
      }
      40% { 
        opacity: 0.88;
        filter: brightness(0.95) contrast(1.03);
      }
      60% { 
        opacity: 0.93;
        filter: brightness(1.08) contrast(1.06);
      }
      80% { 
        opacity: 0.90;
        filter: brightness(1.02) contrast(1.04);
      }
    }
    
    /* Subtle hue rotation for tech effect */
    @keyframes edgeHueRotate {
      0% { 
        filter: hue-rotate(0deg) brightness(1) saturate(1);
      }
      25% { 
        filter: hue-rotate(3deg) brightness(1.08) saturate(1.1);
      }
      50% { 
        filter: hue-rotate(0deg) brightness(1) saturate(1);
      }
      75% { 
        filter: hue-rotate(-3deg) brightness(1.08) saturate(1.1);
      }
      100% { 
        filter: hue-rotate(0deg) brightness(1) saturate(1);
      }
    }
    
    /* Electric spark animation - simulates short circuit */
    @keyframes electricSpark {
      0%, 90%, 100% { 
        box-shadow: 
          0 0 30px rgba(34, 139, 34, 0.4),
          0 0 50px rgba(34, 139, 34, 0.2),
          inset 0 0 40px rgba(0, 0, 0, 0.3);
      }
      92% { 
        box-shadow: 
          0 0 40px rgba(100, 200, 255, 0.8),
          0 0 60px rgba(100, 200, 255, 0.6),
          inset 0 0 30px rgba(100, 200, 255, 0.4),
          0 0 80px rgba(255, 255, 255, 0.5);
      }
      94% { 
        box-shadow: 
          0 0 30px rgba(34, 139, 34, 0.4),
          0 0 50px rgba(34, 139, 34, 0.2),
          inset 0 0 40px rgba(0, 0, 0, 0.3);
      }
      96% { 
        box-shadow: 
          0 0 35px rgba(100, 200, 255, 0.7),
          0 0 55px rgba(100, 200, 255, 0.5),
          inset 0 0 25px rgba(100, 200, 255, 0.3);
      }
    }
    
    /* Kiro Ghost styles - visible in corner by default */
    #kiro-ghost {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 100px;
      height: 120px;
      z-index: 999999;
      pointer-events: none;
      opacity: 0.7;
      animation: ghostFloat 5s ease-in-out infinite, ghostGlow 3s ease-in-out infinite alternate;
    }
    
    /* Gentle floating animation - slower and smoother */
    @keyframes ghostFloat {
      0%, 100% { 
        transform: translate(-50%, -50%) translateY(0px) rotate(-0.5deg); 
      }
      25% { 
        transform: translate(-50%, -50%) translateY(-8px) rotate(0.5deg); 
      }
      50% { 
        transform: translate(-50%, -50%) translateY(-15px) rotate(0deg); 
      }
      75% { 
        transform: translate(-50%, -50%) translateY(-8px) rotate(-0.5deg); 
      }
    }
    
    /* Softer ethereal glow effect */
    @keyframes ghostGlow {
      0% { 
        filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15)) drop-shadow(0 0 20px rgba(255, 255, 255, 0.3));
        opacity: 0.92;
      }
      100% { 
        filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.2)) drop-shadow(0 0 30px rgba(255, 255, 255, 0.5));
        opacity: 0.98;
      }
    }
    
    /* Ghost eye blink animation - slower */
    .ghost-eye {
      transform-origin: center;
      animation: blink 6s ease-in-out infinite;
    }
    
    @keyframes blink {
      0%, 95%, 100% { transform: scaleY(1); }
      97% { transform: scaleY(0.15); }
    }
    
    /* Ghost body subtle breathing */
    .ghost-body {
      animation: bodyBreath 4s ease-in-out infinite;
    }
    
    @keyframes bodyBreath {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.02); }
    }
    
    /* Breathing animation for static ghost */
    @keyframes breathe {
      0%, 100% { 
        transform: translateY(0px) scale(1); 
      }
      50% { 
        transform: translateY(-10px) scale(1.03); 
      }
    }
    
    /* Kicker notification styles */
    #necro-kicker {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, ${config.primaryColor}, ${config.secondaryColor});
      color: white;
      padding: 15px 30px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      z-index: 999998;
      font-family: 'Georgia', serif;
      font-size: 16px;
      animation: slideDown 0.5s ease-out, fadeOut 0.5s ease-in 4.5s forwards;
      pointer-events: none;
    }
    
    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
      }
    }
    
    @keyframes fadeOut {
      to {
        opacity: 0;
        transform: translateX(-50%) translateY(-20px);
      }
    }
    
    /* Animation canvas */
    #necro-animation-canvas {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 999997;
    }
  `;
  
  document.head.appendChild(style);
  console.log('✓ Theme styles injected');
}

/**
 * Create and inject Kiro Ghost component
 * @param {Object} config - Theme configuration
 */
function createKiroGhost(config) {
  const ghostId = 'kiro-ghost';
  
  // Remove existing ghost if any
  const existingGhost = document.getElementById(ghostId);
  if (existingGhost) {
    existingGhost.remove();
  }
  
  // Create ghost element
  const ghost = document.createElement('div');
  ghost.id = ghostId;
  
  // Create SVG ghost based on emotion
  ghost.innerHTML = createGhostSVG(config.kairoGhostEmotion, config.primaryColor);
  
  document.body.appendChild(ghost);
  console.log('✓ Kiro Ghost created with emotion:', config.kairoGhostEmotion);
}

/**
 * Create SVG ghost based on emotion - Cute rounded mascot style
 * @param {string} emotion - Ghost emotion
 * @param {string} color - Primary color
 * @returns {string} - SVG markup
 */
function createGhostSVG(emotion, color) {
  // Use white/light color for classic ghost look
  const ghostColor = '#ffffff';
  
  // Define expressions for different emotions - more rounded and cute
  const expressions = {
    mysterious: {
      leftEye: { cx: 30, cy: 32, rx: 4, ry: 6 },
      rightEye: { cx: 50, cy: 32, rx: 4, ry: 6 },
      mouth: 'M35,48 Q40,52 45,48'
    },
    adventurous: {
      leftEye: { cx: 30, cy: 30, rx: 5, ry: 7 },
      rightEye: { cx: 50, cy: 30, rx: 5, ry: 7 },
      mouth: 'M32,48 Q40,56 48,48'
    },
    confident: {
      leftEye: { cx: 30, cy: 32, rx: 5, ry: 6 },
      rightEye: { cx: 50, cy: 32, rx: 5, ry: 6 },
      mouth: 'M30,48 Q40,54 50,48'
    },
    delighted: {
      leftEye: { cx: 30, cy: 30, rx: 4, ry: 7 },
      rightEye: { cx: 50, cy: 30, rx: 4, ry: 7 },
      mouth: 'M28,46 Q40,58 52,46'
    },
    smug: {
      leftEye: { cx: 30, cy: 32, rx: 3, ry: 5 },
      rightEye: { cx: 50, cy: 32, rx: 3, ry: 5 },
      mouth: 'M32,48 Q40,52 48,48', // Smirk
      eyebrow: true,
      eyebrowLeft: 'M26,26 L34,28',
      eyebrowRight: 'M46,28 L54,26'
    },
    defiant: {
      leftEye: { cx: 30, cy: 30, rx: 5, ry: 6 },
      rightEye: { cx: 50, cy: 30, rx: 5, ry: 6 },
      mouth: 'M30,50 L50,50', // Straight confident line
      eyebrow: true,
      eyebrowLeft: 'M26,24 L34,26',
      eyebrowRight: 'M46,26 L54,24'
    }
  };
  
  const expr = expressions[emotion] || expressions.mysterious;
  
  return `
    <svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Soft gradient for ghost body -->
        <radialGradient id="ghostGradient" cx="50%" cy="40%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="70%" style="stop-color:#f8f8f8;stop-opacity:0.98" />
          <stop offset="100%" style="stop-color:#e8e8e8;stop-opacity:0.95" />
        </radialGradient>
        
        <!-- Soft shadow filter -->
        <filter id="ghostShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dx="0" dy="4" result="offsetblur"/>
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.2"/>
          </feComponentTransfer>
          <feMerge>
            <feMergeNode/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
        
        <!-- Inner glow -->
        <filter id="innerGlow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <!-- Ghost body - more rounded and cute with smoother waves -->
      <path class="ghost-body"
            d="M40,8 Q15,8 15,35 Q15,50 15,62 L15,70 Q20,65 25,70 Q30,75 35,70 Q40,65 40,70 Q40,65 45,70 Q50,75 55,70 Q60,65 65,70 L65,62 Q65,50 65,35 Q65,8 40,8 Z" 
            fill="url(#ghostGradient)" 
            stroke="none"
            filter="url(#ghostShadow)"/>
      
      <!-- Subtle highlight on top -->
      <ellipse cx="40" cy="22" rx="18" ry="12" fill="#ffffff" opacity="0.4"/>
      
      <!-- Left eye - simple oval -->
      <ellipse class="ghost-eye" 
               cx="${expr.leftEye.cx}" 
               cy="${expr.leftEye.cy}" 
               rx="${expr.leftEye.rx}" 
               ry="${expr.leftEye.ry}" 
               fill="#2a2a2a"/>
      
      <!-- Right eye - simple oval -->
      <ellipse class="ghost-eye" 
               cx="${expr.rightEye.cx}" 
               cy="${expr.rightEye.cy}" 
               rx="${expr.rightEye.rx}" 
               ry="${expr.rightEye.ry}" 
               fill="#2a2a2a"/>
      
      <!-- Eyebrows for smug/defiant emotions -->
      ${expr.eyebrow ? `
        <path d="${expr.eyebrowLeft}" 
              stroke="#2a2a2a" 
              stroke-width="2.5" 
              stroke-linecap="round"
              fill="none"/>
        <path d="${expr.eyebrowRight}" 
              stroke="#2a2a2a" 
              stroke-width="2.5" 
              stroke-linecap="round"
              fill="none"/>
      ` : ''}
      
      <!-- Mouth - simple curve -->
      <path d="${expr.mouth}" 
            stroke="#2a2a2a" 
            stroke-width="2.5" 
            stroke-linecap="round"
            fill="none"/>
      
      <!-- Cheek blush for delighted emotion -->
      ${emotion === 'delighted' ? `
        <ellipse cx="22" cy="42" rx="5" ry="4" fill="#ffb3d9" opacity="0.5"/>
        <ellipse cx="58" cy="42" rx="5" ry="4" fill="#ffb3d9" opacity="0.5"/>
      ` : ''}
      
      <!-- Subtle shine spots -->
      <circle cx="26" cy="28" r="2" fill="#ffffff" opacity="0.6"/>
      <circle cx="46" cy="26" r="2" fill="#ffffff" opacity="0.6"/>
    </svg>
  `;
}

/**
 * Display kicker text notification
 * @param {string} kickerText - Text to display
 */
function displayKickerNotification(kickerText) {
  const kickerId = 'necro-kicker';
  
  // Remove existing notification if any
  const existingKicker = document.getElementById(kickerId);
  if (existingKicker) {
    existingKicker.remove();
  }
  
  // Create notification element
  const kicker = document.createElement('div');
  kicker.id = kickerId;
  kicker.textContent = kickerText;
  
  document.body.appendChild(kicker);
  
  // Auto-remove after animation
  setTimeout(() => {
    if (kicker.parentNode) {
      kicker.remove();
    }
  }, 5000);
  
  console.log('✓ Kicker notification displayed:', kickerText);
}

/**
 * Execute animation based on configuration
 * @param {Object} config - Theme configuration
 */
function executeAnimation(config) {
  if (!config.animations || !config.animations.enabled) {
    console.log('ℹ️ Animations disabled');
    return;
  }
  
  const animationType = config.animations.type;
  console.log('🎬 Executing animation:', animationType);
  
  switch (animationType) {
    case 'floating_planes':
    case 'hijackFlight':
    case 'transportation_ride':
      executeFlyToDestinationAnimation(config);
      break;
    case 'gentle_glow':
    case 'confidenceShowoff':
    case 'clothing_tryOn':
      executeConfidenceGhostAnimation(config);
      break;
    case 'melting_drips':
    case 'food_eating':
      executeChocolateDripsAnimation(config);
      break;
    case 'flicker':
    case 'halloween_jumpscare':
      executeHalloweenJumpscareAnimation(config);
      break;
    default:
      console.log('⚠️ Unknown animation type:', animationType);
  }
}

/**
 * FlyToDestination Animation - Kiro ghost riding a plane
 * @param {Object} config - Theme configuration
 */
function executeFlyToDestinationAnimation(config) {
  console.log('✈️ Starting FlyToDestination animation...');
  
  // Create canvas for animation
  const canvas = createAnimationCanvas();
  const ctx = canvas.getContext('2d');
  
  // Animation state
  const animation = {
    phase: 'flying_in', // phases: flying_in, paused, flying_out
    x: -200,
    y: canvas.height / 2,
    targetY: canvas.height / 2,
    speed: 3,
    pauseTimer: 0,
    pauseDuration: 180,
    rotation: 0,
    bobOffset: 0,
    time: 0,
    completedLoops: 0
  };
  
  // Draw Kiro ghost on plane
  function drawGhostOnPlane(x, y, rotation, scale = 2.5) { // Further increased scale for visibility
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    
    // Draw plane body (larger)
    ctx.fillStyle = config.primaryColor;
    ctx.globalAlpha = 0.9;
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.lineTo(50, 0);
    ctx.lineTo(62, 6);
    ctx.lineTo(50, 12);
    ctx.lineTo(-50, 12);
    ctx.closePath();
    ctx.fill();
    
    // Draw plane wings
    ctx.beginPath();
    ctx.moveTo(-12, 6);
    ctx.lineTo(-38, -20);
    ctx.lineTo(-32, -20);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();
    
    ctx.beginPath();
    ctx.moveTo(-12, 6);
    ctx.lineTo(-38, 32);
    ctx.lineTo(-32, 32);
    ctx.lineTo(-6, 6);
    ctx.closePath();
    ctx.fill();
    
    // Draw plane tail
    ctx.beginPath();
    ctx.moveTo(-50, 6);
    ctx.lineTo(-62, -12);
    ctx.lineTo(-56, -12);
    ctx.lineTo(-47, 6);
    ctx.closePath();
    ctx.fill();
    
    // Draw cute ghost sitting on plane using unified design
    ctx.save();
    ctx.translate(12, -6);
    drawCuteGhost(ctx, 0, 0, 0.8, 'smug');
    ctx.restore();
    
    ctx.restore();
  }
  
  // Draw kicker text with beautiful banner
  function drawKickerText(text, alpha) {
    ctx.save();
    
    const bannerX = canvas.width / 2;
    const bannerY = 100; // Move to top to avoid ghost
    const bannerWidth = Math.min(700, canvas.width * 0.8);
    const bannerHeight = 80;
    const bannerRadius = 15;
    
    // Banner shadow
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2 + 5, bannerY - bannerHeight/2 + 5, bannerWidth, bannerHeight, bannerRadius);
    ctx.fill();
    
    // Banner background with gradient
    ctx.globalAlpha = alpha * 0.95;
    const gradient = ctx.createLinearGradient(bannerX - bannerWidth/2, bannerY, bannerX + bannerWidth/2, bannerY);
    gradient.addColorStop(0, config.primaryColor);
    gradient.addColorStop(0.5, config.secondaryColor);
    gradient.addColorStop(1, config.primaryColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2, bannerY - bannerHeight/2, bannerWidth, bannerHeight, bannerRadius);
    ctx.fill();
    
    // Banner border with glow
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = config.primaryColor;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2, bannerY - bannerHeight/2, bannerWidth, bannerHeight, bannerRadius);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Text with shadow
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Word wrap for long text
    const words = text.split(' ');
    const maxWidth = bannerWidth - 40;
    let line = '';
    let lines = [];
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    
    // Draw lines
    const lineHeight = 32;
    const startY = bannerY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, bannerX, startY + i * lineHeight);
    });
    
    // Sparkle effects around banner
    if (alpha > 0.8) {
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      const sparkles = [
        { x: bannerX - bannerWidth/2 - 20, y: bannerY - bannerHeight/2 - 10 },
        { x: bannerX + bannerWidth/2 + 20, y: bannerY - bannerHeight/2 - 10 },
        { x: bannerX - bannerWidth/2 - 15, y: bannerY + bannerHeight/2 + 15 },
        { x: bannerX + bannerWidth/2 + 15, y: bannerY + bannerHeight/2 + 15 }
      ];
      
      sparkles.forEach((sparkle, i) => {
        const sparkleAlpha = alpha * (0.5 + Math.sin(animation.time * 0.1 + i) * 0.5);
        ctx.globalAlpha = sparkleAlpha;
        ctx.beginPath();
        ctx.arc(sparkle.x, sparkle.y, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Cross sparkle
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(sparkle.x - 6, sparkle.y);
        ctx.lineTo(sparkle.x + 6, sparkle.y);
        ctx.moveTo(sparkle.x, sparkle.y - 6);
        ctx.lineTo(sparkle.x, sparkle.y + 6);
        ctx.stroke();
      });
    }
    
    ctx.restore();
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    animation.time++;
    animation.bobOffset = Math.sin(animation.time * 0.05) * 8;
    
    switch (animation.phase) {
      case 'flying_in':
        animation.x += animation.speed;
        animation.rotation = Math.sin(animation.time * 0.1) * 0.05;
        
        if (animation.x >= canvas.width / 2 - 100) {
          animation.phase = 'paused';
          animation.pauseTimer = 0;
        }
        break;
        
      case 'paused':
        animation.pauseTimer++;
        animation.rotation = Math.sin(animation.time * 0.08) * 0.08;
        
        // Show kicker text
        const textAlpha = Math.min(1, animation.pauseTimer / 30);
        if (animation.pauseTimer < animation.pauseDuration - 30) {
          drawKickerText(config.kickerText, textAlpha);
        } else {
          drawKickerText(config.kickerText, 1 - (animation.pauseTimer - (animation.pauseDuration - 30)) / 30);
        }
        
        if (animation.pauseTimer >= animation.pauseDuration) {
          animation.phase = 'flying_out';
          animation.speed = 5;
        }
        break;
        
      case 'flying_out':
        animation.x += animation.speed;
        animation.speed += 0.1; // Accelerate
        animation.rotation = -0.1;
        
        if (animation.x > canvas.width + 200) {
          animation.completedLoops++;
          
          // Check if we've completed max loops
          if (animation.completedLoops >= animationState.maxLoops) {
            // Stop animation and show interaction UI
            canvas.style.opacity = '0';
            setTimeout(() => {
              canvas.style.display = 'none';
              createInteractionUI(config);
            }, 500);
            return; // Stop animation loop
          }
          
          // Reset for next loop
          animation.phase = 'flying_in';
          animation.x = -200;
          animation.speed = 3;
          animation.time = 0;
        }
        break;
    }
    
    // Draw ghost on plane
    drawGhostOnPlane(animation.x, animation.y + animation.bobOffset, animation.rotation);
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('✓ FlyToDestination animation started');
}

/**
 * ConfidenceGhost Animation - Shy to confident transformation
 * @param {Object} config - Theme configuration
 */
function executeConfidenceGhostAnimation(config) {
  console.log('✨ Starting ConfidenceGhost animation...');
  
  // Create canvas for animation
  const canvas = createAnimationCanvas();
  const ctx = canvas.getContext('2d');
  
  // Animation state
  const animation = {
    phase: 'shy', // phases: shy, flash, confident
    x: 120,
    y: canvas.height - 180,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    scale: 1.5,
    rotation: 0,
    opacity: 0.7,
    flashTimer: 0,
    flashDuration: 80,
    confidenceTimer: 0,
    time: 0,
    completedLoops: 0
  };
  
  // Particle system for confidence aura
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      angle: (Math.PI * 2 * i) / 30,
      distance: 0,
      speed: 0.5 + Math.random() * 0.5,
      size: 3 + Math.random() * 4,
      opacity: 0,
      hue: Math.random() * 60 + 300 // Pink/purple range
    });
  }
  
  // Draw Kiro ghost with optional lingerie
  function drawGhost(x, y, scale, rotation, opacity, emotion = 'shy', wearingLingerie = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.globalAlpha = opacity;
    
    // Use unified cute ghost design
    drawCuteGhost(ctx, 0, 0, scale, emotion);
    
    // Draw lingerie on top if wearing - positioned on chest area
    if (wearingLingerie) {
      ctx.save();
      ctx.scale(scale, scale);
      ctx.strokeStyle = config.primaryColor;
      ctx.fillStyle = config.primaryColor;
      ctx.globalAlpha = opacity * 0.8;
      ctx.lineWidth = 2;
      
      // Bra straps (from shoulders to cups) - adjusted position
      ctx.beginPath();
      ctx.moveTo(-20, -15);
      ctx.lineTo(-12, -2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(20, -15);
      ctx.lineTo(12, -2);
      ctx.stroke();
      
      // Bra band (horizontal line under cups) - lower position
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-18, 5);
      ctx.lineTo(18, 5);
      ctx.stroke();
      
      // Bra cups (filled semi-circles) - positioned on chest, not face
      ctx.globalAlpha = opacity * 0.6;
      ctx.fillStyle = config.primaryColor;
      ctx.beginPath();
      ctx.arc(-10, -2, 9, 0.2, Math.PI - 0.2);
      ctx.lineTo(-10, 5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.arc(10, -2, 9, 0.2, Math.PI - 0.2);
      ctx.lineTo(10, 5);
      ctx.closePath();
      ctx.fill();
      
      // Cup outlines
      ctx.globalAlpha = opacity * 0.9;
      ctx.strokeStyle = config.primaryColor;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(-10, -2, 9, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(10, -2, 9, 0.2, Math.PI - 0.2);
      ctx.stroke();
      
      // Center bow (between cups) - adjusted position
      ctx.fillStyle = config.primaryColor;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.moveTo(-5, 2);
      ctx.lineTo(-8, -2);
      ctx.lineTo(-5, -6);
      ctx.lineTo(0, -2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(5, 2);
      ctx.lineTo(8, -2);
      ctx.lineTo(5, -6);
      ctx.lineTo(0, -2);
      ctx.closePath();
      ctx.fill();
      
      // Center circle for bow
      ctx.beginPath();
      ctx.arc(0, -2, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Decorative lace pattern
      ctx.globalAlpha = opacity * 0.5;
      ctx.strokeStyle = config.primaryColor;
      ctx.lineWidth = 1;
      for (let i = -8; i <= 8; i += 4) {
        ctx.beginPath();
        ctx.arc(-10 + i, -2, 2, 0, Math.PI);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(10 + i, -2, 2, 0, Math.PI);
        ctx.stroke();
      }
      
      ctx.restore();
    }
    
    ctx.restore();
  }
  
  // Draw flash effect
  function drawFlash(intensity) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = intensity;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }
  
  // Draw confidence banner
  function drawConfidenceBanner(text, alpha) {
    ctx.save();
    
    const bannerX = canvas.width / 2;
    const bannerY = 100;
    const bannerWidth = Math.min(700, canvas.width * 0.8);
    const bannerHeight = 90;
    const bannerRadius = 15;
    
    // Banner shadow
    ctx.globalAlpha = alpha * 0.3;
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2 + 5, bannerY - bannerHeight/2 + 5, bannerWidth, bannerHeight, bannerRadius);
    ctx.fill();
    
    // Banner background with gradient
    ctx.globalAlpha = alpha * 0.95;
    const gradient = ctx.createLinearGradient(bannerX - bannerWidth/2, bannerY, bannerX + bannerWidth/2, bannerY);
    gradient.addColorStop(0, config.primaryColor);
    gradient.addColorStop(0.5, config.secondaryColor);
    gradient.addColorStop(1, config.primaryColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2, bannerY - bannerHeight/2, bannerWidth, bannerHeight, bannerRadius);
    ctx.fill();
    
    // Banner border with glow
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.shadowColor = config.primaryColor;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2, bannerY - bannerHeight/2, bannerWidth, bannerHeight, bannerRadius);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Text with shadow
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Word wrap
    const words = text.split(' ');
    const maxWidth = bannerWidth - 40;
    let line = '';
    let lines = [];
    
    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        lines.push(line.trim());
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());
    
    // Draw lines
    const lineHeight = 28;
    const startY = bannerY - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, i) => {
      ctx.fillText(line, bannerX, startY + i * lineHeight);
    });
    
    ctx.restore();
  }
  
  // Draw particles
  function drawParticles() {
    particles.forEach(particle => {
      if (particle.opacity > 0) {
        const x = animation.x + Math.cos(particle.angle) * particle.distance;
        const y = animation.y + Math.sin(particle.angle) * particle.distance;
        
        ctx.save();
        ctx.fillStyle = `hsl(${particle.hue}, 80%, 70%)`;
        ctx.globalAlpha = particle.opacity;
        ctx.beginPath();
        ctx.arc(x, y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Sparkle effect
        ctx.strokeStyle = `hsl(${particle.hue}, 100%, 90%)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x - particle.size * 1.5, y);
        ctx.lineTo(x + particle.size * 1.5, y);
        ctx.moveTo(x, y - particle.size * 1.5);
        ctx.lineTo(x, y + particle.size * 1.5);
        ctx.stroke();
        ctx.restore();
      }
    });
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animation.time++;
    
    switch (animation.phase) {
      case 'shy':
        // Ghost hides in corner, slowly building courage
        animation.opacity = 0.7 + Math.sin(animation.time * 0.03) * 0.1;
        
        if (animation.time > 120) {
          animation.phase = 'flash';
          animation.flashTimer = 0;
        }
        
        drawGhost(animation.x, animation.y, animation.scale, 0, animation.opacity, 'shy');
        break;
        
      case 'flash':
        animation.flashTimer++;
        
        // Flash effect - simulate changing clothes
        const flashIntensity = Math.sin((animation.flashTimer / animation.flashDuration) * Math.PI) * 0.7;
        drawFlash(flashIntensity);
        
        // Move ghost to center during flash
        const progress = animation.flashTimer / animation.flashDuration;
        animation.x = 120 + (animation.targetX - 120) * progress;
        animation.y = (canvas.height - 180) + (animation.targetY - (canvas.height - 180)) * progress;
        animation.scale = 1.5 + 1.0 * progress; // Scale from 1.5 to 2.5
        animation.opacity = 0.7 + 0.3 * progress;
        
        // Show lingerie appearing during flash (after halfway)
        const wearingLingerie = animation.flashTimer > animation.flashDuration / 2;
        const emotion = wearingLingerie ? 'confident' : 'shy';
        
        drawGhost(animation.x, animation.y, animation.scale, 0, animation.opacity, emotion, wearingLingerie);
        
        if (animation.flashTimer >= animation.flashDuration) {
          animation.phase = 'confident';
          animation.confidenceTimer = 0;
        }
        break;
        
      case 'confident':
        animation.confidenceTimer++;
        
        // Rotate and float
        animation.rotation = Math.sin(animation.confidenceTimer * 0.02) * 0.15;
        const floatY = animation.targetY + Math.sin(animation.confidenceTimer * 0.03) * 20;
        
        // Update particles
        particles.forEach(particle => {
          particle.distance += particle.speed;
          particle.angle += 0.02;
          particle.opacity = Math.max(0, Math.min(1, 1 - particle.distance / 150));
          
          if (particle.distance > 150) {
            particle.distance = 0;
            particle.angle = Math.random() * Math.PI * 2;
          }
        });
        
        // Draw particles first (behind ghost)
        drawParticles();
        
        // Draw confident ghost wearing lingerie
        drawGhost(animation.x, floatY, animation.scale, animation.rotation, animation.opacity, 'confident', true);
        
        // Reset after a while
        if (animation.confidenceTimer > 300) {
          animation.completedLoops++;
          
          // Check if we've completed max loops
          if (animation.completedLoops >= animationState.maxLoops) {
            // Stop animation and show interaction UI
            canvas.style.opacity = '0';
            setTimeout(() => {
              canvas.style.display = 'none';
              createInteractionUI(config);
            }, 500);
            return; // Stop animation loop
          }
          
          // Reset for next loop
          animation.phase = 'shy';
          animation.x = 120;
          animation.y = canvas.height - 180;
          animation.scale = 1.5;
          animation.rotation = 0;
          animation.opacity = 0.7;
          animation.time = 0;
          particles.forEach(p => { p.distance = 0; p.opacity = 0; });
        }
        break;
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('✓ ConfidenceGhost animation started');
}

/**
 * ChocolateDrips Animation - Melting effect
 * @param {Object} config - Theme configuration
 */
/**
 * ChocolateDrips Animation - Ghost eating chocolate
 * @param {Object} config - Theme configuration
 */
function executeChocolateDripsAnimation(config) {
  console.log('🍫 Starting ChocolateDrips animation...');
  
  // Create canvas for animation
  const canvas = createAnimationCanvas();
  const ctx = canvas.getContext('2d');
  
  // Animation state
  const animation = {
    phase: 'entering', // phases: entering, eating, satisfied
    ghostX: -150,
    ghostY: canvas.height / 2,
    targetX: canvas.width / 2 - 100,
    chocolateX: canvas.width / 2 + 100,
    chocolateY: canvas.height / 2,
    chocolateSize: 1,
    biteTimer: 0,
    satisfiedTimer: 0,
    time: 0,
    completedLoops: 0
  };
  
  // Draw chocolate bar
  function drawChocolate(x, y, size, bites = 0) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(size, size);
    
    // Chocolate bar
    ctx.fillStyle = config.primaryColor;
    ctx.strokeStyle = '#5a2d0c';
    ctx.lineWidth = 2;
    
    const segments = 4 - bites;
    const segmentWidth = 30;
    const segmentHeight = 40;
    
    for (let i = 0; i < segments; i++) {
      ctx.fillRect(i * segmentWidth, 0, segmentWidth - 2, segmentHeight);
      ctx.strokeRect(i * segmentWidth, 0, segmentWidth - 2, segmentHeight);
      
      // Segment lines
      ctx.strokeStyle = '#8b4513';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(i * segmentWidth + segmentWidth/2, 0);
      ctx.lineTo(i * segmentWidth + segmentWidth/2, segmentHeight);
      ctx.stroke();
    }
    
    // Bite mark if any
    if (bites > 0) {
      ctx.fillStyle = '#d2691e';
      ctx.beginPath();
      ctx.arc(segments * segmentWidth, segmentHeight/2, 15, -Math.PI/2, Math.PI/2);
      ctx.fill();
    }
    
    ctx.restore();
  }
  
  // Draw ghost eating
  function drawEatingGhost(x, y, mouthOpen) {
    ctx.save();
    ctx.translate(x, y);
    
    // Use unified cute ghost design
    drawCuteGhost(ctx, 0, 0, 2, mouthOpen ? 'happy' : 'smug');
    
    // Add chocolate smudge on mouth if eating - darker and more visible
    if (animation.biteTimer > 0) {
      ctx.scale(2, 2);
      
      // Darker chocolate color
      ctx.fillStyle = '#5a2d0c'; // Dark chocolate brown
      ctx.globalAlpha = 0.9;
      
      // Left smudge
      ctx.beginPath();
      ctx.arc(-6, -8, 3.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Right smudge
      ctx.beginPath();
      ctx.arc(6, -8, 3.5, 0, Math.PI * 2);
      ctx.fill();
      
      // Add highlight for 3D effect
      ctx.fillStyle = '#8b4513';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(-6.5, -9, 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(5.5, -9, 1.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.globalAlpha = 1;
    }
    
    ctx.restore();
  }
  
  // Draw banner
  function drawBanner(text, alpha) {
    ctx.save();
    const bannerX = canvas.width / 2;
    const bannerY = 100;
    const bannerWidth = Math.min(600, canvas.width * 0.7);
    const bannerHeight = 70;
    
    ctx.globalAlpha = alpha * 0.95;
    const gradient = ctx.createLinearGradient(bannerX - bannerWidth/2, bannerY, bannerX + bannerWidth/2, bannerY);
    gradient.addColorStop(0, config.primaryColor);
    gradient.addColorStop(0.5, config.secondaryColor);
    gradient.addColorStop(1, config.primaryColor);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.roundRect(bannerX - bannerWidth/2, bannerY - bannerHeight/2, bannerWidth, bannerHeight, 15);
    ctx.fill();
    
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, bannerX, bannerY);
    
    ctx.restore();
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animation.time++;
    
    switch (animation.phase) {
      case 'entering':
        animation.ghostX += 4;
        
        if (animation.ghostX >= animation.targetX) {
          animation.phase = 'eating';
          animation.biteTimer = 0;
        }
        
        drawChocolate(animation.chocolateX, animation.chocolateY, 2, 0);
        drawEatingGhost(animation.ghostX, animation.ghostY, false);
        break;
        
      case 'eating':
        animation.biteTimer++;
        const bites = Math.floor(animation.biteTimer / 60);
        const mouthOpen = (animation.biteTimer % 60) < 30;
        
        // Move ghost closer to chocolate
        if (animation.biteTimer % 60 === 0 && bites < 4) {
          animation.ghostX += 20;
        }
        
        drawChocolate(animation.chocolateX, animation.chocolateY, 2, Math.min(bites, 3));
        drawEatingGhost(animation.ghostX, animation.ghostY, mouthOpen);
        
        if (bites >= 4) {
          animation.phase = 'satisfied';
          animation.satisfiedTimer = 0;
        }
        break;
        
      case 'satisfied':
        animation.satisfiedTimer++;
        
        const bannerAlpha = Math.min(1, animation.satisfiedTimer / 30);
        drawBanner(config.kickerText, bannerAlpha);
        
        drawEatingGhost(animation.ghostX, animation.ghostY, false);
        
        if (animation.satisfiedTimer > 180) {
          animation.completedLoops++;
          
          // Check if we've completed max loops
          if (animation.completedLoops >= animationState.maxLoops) {
            // Stop animation and show interaction UI
            canvas.style.opacity = '0';
            setTimeout(() => {
              canvas.style.display = 'none';
              createInteractionUI(config);
            }, 500);
            return; // Stop animation loop
          }
          
          // Reset for next loop
          animation.phase = 'entering';
          animation.ghostX = -150;
          animation.biteTimer = 0;
          animation.satisfiedTimer = 0;
        }
        break;
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('✓ ChocolateDrips animation started');
}

/**
 * Universal cute ghost drawing function for Canvas
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} scale - Scale factor
 * @param {string} emotion - Ghost emotion
 */
function drawCuteGhost(ctx, x, y, scale, emotion = 'smug') {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Ghost body with cute rounded shape
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3 / scale;
  ctx.beginPath();
  ctx.arc(0, -20, 25, Math.PI, 0, false);
  ctx.lineTo(25, 10);
  ctx.lineTo(20, 5);
  ctx.lineTo(15, 10);
  ctx.lineTo(10, 5);
  ctx.lineTo(5, 10);
  ctx.lineTo(0, 5);
  ctx.lineTo(-5, 10);
  ctx.lineTo(-10, 5);
  ctx.lineTo(-15, 10);
  ctx.lineTo(-20, 5);
  ctx.lineTo(-25, 10);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // Highlight for 3D effect
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.beginPath();
  ctx.ellipse(-8, -28, 12, 8, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Eyes based on emotion
  ctx.fillStyle = '#2a2a2a';
  if (emotion === 'smug' || emotion === 'evil') {
    // Smug narrowed eyes
    ctx.beginPath();
    ctx.ellipse(-8, -22, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -22, 3, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eyebrows - smug angle
    ctx.strokeStyle = '#2a2a2a';
    ctx.lineWidth = 2.5 / scale;
    ctx.beginPath();
    ctx.moveTo(-12, -26);
    ctx.lineTo(-4, -24);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(4, -24);
    ctx.lineTo(12, -26);
    ctx.stroke();
    
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-9, -24, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -24, 1.5, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // Normal happy eyes
    ctx.beginPath();
    ctx.ellipse(-8, -22, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(8, -22, 4, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Eye shine
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-9, -24, 1.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(7, -24, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Mouth
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 2.5 / scale;
  ctx.beginPath();
  if (emotion === 'smug' || emotion === 'evil') {
    // Smirk
    ctx.moveTo(-8, -12);
    ctx.quadraticCurveTo(0, -10, 8, -12);
  } else {
    // Happy smile
    ctx.arc(0, -10, 8, 0.2, Math.PI - 0.2);
  }
  ctx.stroke();
  
  // Rosy cheeks for cute effect
  ctx.fillStyle = 'rgba(255, 182, 193, 0.5)';
  ctx.beginPath();
  ctx.ellipse(-15, -12, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(15, -12, 4, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  
  ctx.restore();
}

/**
 * Halloween Jumpscare Animation - Cute ghost grows to fill screen
 * @param {Object} config - Theme configuration
 */
function executeHalloweenJumpscareAnimation(config) {
  console.log('🎃 Starting Halloween Jumpscare animation...');
  
  // Create canvas for animation
  const canvas = createAnimationCanvas();
  const ctx = canvas.getContext('2d');
  
  // Animation state
  const animation = {
    phase: 'approaching', // phases: approaching, jumpscare, pumpkin_rain
    ghostX: canvas.width + 100,
    ghostY: 100,
    targetX: canvas.width / 2,
    targetY: canvas.height / 2,
    scale: 1,
    rotation: 0,
    flashIntensity: 0,
    time: 0,
    pumpkins: [],
    completedLoops: 0
  };
  
  // Initialize pumpkins for rain
  for (let i = 0; i < 30; i++) {
    animation.pumpkins.push({
      x: Math.random() * canvas.width,
      y: -Math.random() * canvas.height,
      speed: 2 + Math.random() * 3,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      size: 20 + Math.random() * 30
    });
  }
  

  
  // Draw Happy Halloween text in mouth
  function drawHalloweenText(scale) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2 - 8 * scale);
    ctx.scale(scale, scale);
    
    ctx.fillStyle = '#ff6b00';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.font = 'bold 40px "Creepster", "Nosifer", cursive';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 20;
    
    ctx.strokeText('Happy Halloween!', 0, 0);
    ctx.fillText('Happy Halloween!', 0, 0);
    
    ctx.restore();
  }
  
  // Draw pumpkin
  function drawPumpkin(x, y, size, rotation) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.scale(size / 30, size / 30);
    
    // Pumpkin body
    ctx.fillStyle = '#ff6b00';
    ctx.strokeStyle = '#8b4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 25, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    
    // Pumpkin segments
    ctx.beginPath();
    ctx.moveTo(-20, -15);
    ctx.quadraticCurveTo(-20, 0, -20, 15);
    ctx.moveTo(-10, -20);
    ctx.quadraticCurveTo(-10, 0, -10, 20);
    ctx.moveTo(10, -20);
    ctx.quadraticCurveTo(10, 0, 10, 20);
    ctx.moveTo(20, -15);
    ctx.quadraticCurveTo(20, 0, 20, 15);
    ctx.stroke();
    
    // Jack-o-lantern face
    ctx.fillStyle = '#000000';
    // Eyes
    ctx.beginPath();
    ctx.moveTo(-15, -8);
    ctx.lineTo(-10, -12);
    ctx.lineTo(-5, -8);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(5, -8);
    ctx.lineTo(10, -12);
    ctx.lineTo(15, -8);
    ctx.closePath();
    ctx.fill();
    
    // Nose
    ctx.beginPath();
    ctx.moveTo(-2, 0);
    ctx.lineTo(0, -5);
    ctx.lineTo(2, 0);
    ctx.closePath();
    ctx.fill();
    
    // Mouth
    ctx.beginPath();
    ctx.arc(0, 5, 12, 0, Math.PI);
    ctx.fill();
    
    // Stem
    ctx.fillStyle = '#228b22';
    ctx.fillRect(-3, -28, 6, 8);
    
    ctx.restore();
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    animation.time++;
    
    switch (animation.phase) {
      case 'approaching':
        // Ghost flies in from right
        animation.ghostX -= 5;
        animation.ghostY = 100 + Math.sin(animation.time * 0.05) * 20;
        
        if (animation.ghostX <= animation.targetX) {
          animation.phase = 'jumpscare';
          animation.time = 0;
        }
        
        drawCuteGhost(ctx, animation.ghostX, animation.ghostY, animation.scale, 'smug');
        break;
        
      case 'jumpscare':
        // Screen flashes and ghost grows
        animation.flashIntensity = Math.sin(animation.time * 0.3) * 0.5 + 0.5;
        animation.scale = 1 + (animation.time / 60) * 15;
        animation.ghostX = animation.targetX;
        animation.ghostY = animation.targetY;
        
        // Flash effect with colorful sparkles
        ctx.fillStyle = `rgba(255, 182, 193, ${animation.flashIntensity * 0.2})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        drawCuteGhost(ctx, animation.ghostX, animation.ghostY, animation.scale, 'smug');
        
        // Show Happy Halloween text when ghost is big enough
        if (animation.scale > 8) {
          drawHalloweenText(animation.scale);
        }
        
        if (animation.time > 120) {
          animation.phase = 'pumpkin_rain';
          animation.time = 0;
        }
        break;
        
      case 'pumpkin_rain':
        // Background darkens
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Pumpkins fall
        animation.pumpkins.forEach(pumpkin => {
          pumpkin.y += pumpkin.speed;
          pumpkin.rotation += pumpkin.rotationSpeed;
          
          if (pumpkin.y > canvas.height + 50) {
            pumpkin.y = -50;
            pumpkin.x = Math.random() * canvas.width;
          }
          
          drawPumpkin(pumpkin.x, pumpkin.y, pumpkin.size, pumpkin.rotation);
        });
        
        // Show text
        ctx.fillStyle = '#ff6b00';
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.font = 'bold 80px "Creepster", cursive';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 30;
        ctx.strokeText('Happy Halloween!', canvas.width / 2, canvas.height / 2);
        ctx.fillText('Happy Halloween!', canvas.width / 2, canvas.height / 2);
        
        // Reset after a while
        if (animation.time > 300) {
          animation.completedLoops++;
          
          // Check if we've completed max loops
          if (animation.completedLoops >= animationState.maxLoops) {
            // Stop animation and show interaction UI
            canvas.style.opacity = '0';
            setTimeout(() => {
              canvas.style.display = 'none';
              createInteractionUI(config);
            }, 500);
            return; // Stop animation loop
          }
          
          // Reset for next loop
          animation.phase = 'approaching';
          animation.ghostX = canvas.width + 100;
          animation.scale = 1;
          animation.time = 0;
        }
        break;
    }
    
    requestAnimationFrame(animate);
  }
  
  animate();
  console.log('✓ Halloween Jumpscare animation started');
}

/**
 * Create animation canvas element
 * @returns {HTMLCanvasElement} - Canvas element
 */
function createAnimationCanvas() {
  const canvasId = 'necro-animation-canvas';
  
  // Remove existing canvas if any
  let canvas = document.getElementById(canvasId);
  if (canvas) {
    canvas.remove();
  }
  
  // Create new canvas
  canvas = document.createElement('canvas');
  canvas.id = canvasId;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  document.body.appendChild(canvas);
  
  // Handle window resize
  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
  
  return canvas;
}

// Make function globally accessible
window.initializeAnimationEngine = initializeAnimationEngine;

// Listen for initialization message from content script
window.addEventListener('message', (event) => {
  // Only accept messages from same origin
  if (event.source !== window) return;
  
  if (event.data.type === 'NECRO_INIT_THEME' && event.data.config) {
    console.log('📨 Received theme initialization message');
    initializeAnimationEngine(event.data.config);
  }
});

console.log('✓ Animation Engine loaded and ready');
