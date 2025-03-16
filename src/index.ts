'use strict';

import './style.css';

import { Alignment, EventType, Fit, Layout, Rive, RiveEventType } from '@rive-app/webgl2';
// ==============================
// ? RIVE
// ==============================

// Add more configurations here for future animations
const animationsConfig = [
  {
    id: 'benefit-1',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d1a1922f51259652e546c8_1-benefit-v11.riv',
    artboard: 'benefit-1',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['card_hover'],
    cursorOnHover: 'pointer',
    cursorOnExit: 'default',
  },
  {
    id: 'benefit-2',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d4232fa1b8c8d4802d6882_2-benefit-v11.riv',
    artboard: 'benefit-2',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverSecurity', 'hoverPerformance'],
    cursorOnHover: 'pointer',
    cursorOnExit: 'default',
    onRiveEvent: handleBenefit2Event, // 🔥 Custom event handler for this animation
  },
  {
    id: 'benefit-3',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d62616bf79b5d0a4464dd8_3-benefit-v4.riv',
    artboard: 'benefit-3',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hover'],
    cursorOnHover: 'pointer',
    cursorOnExit: 'default',
    onRiveEvent: handleBenefit2Event, // 🔥 Custom event handler for this animation
  },
  {
    id: 'benefit-4',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d6204c83c0ed0c6c3ee7a3_4-benefit-v3.riv',
    artboard: 'benefit-4',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'],
    cursorOnHover: 'grab',
    cursorOnExit: 'default',
    onRiveEvent: handleBenefit2Event, // 🔥 Custom event handler for this animation
  },
  {
    id: 'benefit-5',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d6232dae483e2d92b662fc_5-benefit-v3.riv',
    artboard: 'benefit-5',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverIcon'],
    cursorOnHover: 'pointer',
    cursorOnExit: 'default',
    onRiveEvent: handleBenefit2Event, // 🔥 Custom event handler for this animation
  },
  {
    id: 'core-logo',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d31daf1c277d5cc3d641c9_core-logo-v6.riv',
    artboard: 'core-logo',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'], // Optional hover detection (if needed)
    cursorOnHover: 'grab',
    cursorOnExit: 'default',
    autoplay: true,
  },
  // Add more configs here 👇
  // {
  //   id: 'benefit-4',
  //   src: '...',
  //   ...
  // }
];

// Store all Rive instances for access later (events, triggers, etc.)
const riveInstances = {};

// ==============================
// ? INIT ALL ANIMATIONS
// ==============================

animationsConfig.forEach((config) => {
  initRiveAnimation(config);
});

// ==============================
// ? HANDLE WINDOW RESIZE FOR ALL
// ==============================

window.addEventListener('resize', () => {
  Object.values(riveInstances).forEach((instance) => {
    instance.resizeDrawingSurfaceToCanvas();
  });
});

// ==============================
// ? REUSABLE INIT FUNCTION
// ==============================

function initRiveAnimation({
  id,
  src,
  artboard,
  stateMachine,
  hoverInputNames = [],
  cursorOnHover = 'pointer',
  cursorOnExit = 'default',
  autoplay = true,
  isTouchScrollEnabled = true,
  onRiveEvent = null, // Optional: custom event handler
}) {
  const canvas = document.getElementById(id);

  if (!canvas) {
    // console.warn(`❗️ No canvas element found with id: ${id}`);
    return;
  }

  const layout = new Layout({
    fit: Fit.Contain,
    alignment: Alignment.Center,
  });

  const riveInstance = new Rive({
    canvas,
    src,
    artboard,
    stateMachines: stateMachine,
    layout,
    autoplay,
    isTouchScrollEnabled: true,
    automaticallyHandleEvents: true,

    onLoad: () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
      // console.log(`✅ ${id} loaded!`);

      // Hover handling (if hover inputs are provided)
      if (hoverInputNames.length > 0) {
        handleHoverInputs({
          riveInstance,
          canvasElement: canvas,
          stateMachine,
          hoverInputNames,
          cursorOnHover,
          cursorOnExit,
        });
      }
    },
  });

  // Handle Rive events (if an event handler is provided)
  if (onRiveEvent) {
    riveInstance.on(EventType.RiveEvent, onRiveEvent);
  }

  // Save the instance for later use (event triggers, resizing, etc.)
  riveInstances[id] = riveInstance;
}

// ==============================
// ? HOVER HANDLER FUNCTION
// ==============================

function handleHoverInputs({
  riveInstance,
  canvasElement,
  stateMachine,
  hoverInputNames = [],
  cursorOnHover = 'pointer',
  cursorOnExit = 'default',
}) {
  const inputs = riveInstance.stateMachineInputs(stateMachine);

  const hoverInputs = hoverInputNames
    .map((name) => inputs.find((input) => input.name === name))
    .filter(Boolean);

  if (hoverInputs.length === 0) {
    // console.warn(`❗️ No hover inputs found for ${canvasElement.id}`);
    return;
  }

  const checkHoverState = () => {
    const isHovering = hoverInputs.some((input) => input.value === true);
    canvasElement.style.cursor = isHovering ? cursorOnHover : cursorOnExit;

    requestAnimationFrame(checkHoverState);
  };

  checkHoverState();
}

// ==============================
// ? CUSTOM EVENT HANDLER: BENEFIT-2
// ==============================

function handleBenefit2Event(riveEvent) {
  const eventName = riveEvent.data.name;
  const { properties } = riveEvent.data;

  // console.log(`🔥 Event received from benefit-2: ${eventName}`, properties);

  if (eventName === 'securityComplete' || eventName === 'iconPerformanceComplete') {
    // console.log('✅ Event matched, triggering core-logo animation');

    const coreLogoInstance = riveInstances['core-logo'];

    if (!coreLogoInstance) {
      // console.warn('❗️ core-logo instance not found');
      return;
    }

    const coreInputs = coreLogoInstance.stateMachineInputs('state-machine-1');
    const triggerInput = coreInputs.find((input) => input.name === 'startAnimation');

    if (triggerInput) {
      triggerInput.fire();
      // console.log('✅ Fired "startAnimation" trigger on core-logo!');
    } else {
      // console.warn('❗️ No trigger input named "startAnimation" found on core-logo');
    }
  }
}

// ==============================
// ? COPY TO CLIPBOARD
// ==============================

const copyText = document.querySelector('.footer_link-wrapper .footer_address .text-size-medium');
const buttonState = document.querySelector('.footer_copy-wrapper .text-size-regular');
const copyWrapper = document.querySelector('.footer_copy-wrapper');
const clipDefaultIcon = document.querySelector('.footer_clipboard-icon.is-default');
const clipSuccessIcon = document.querySelector('.footer_clipboard-icon.is-copied');

(function () {
  if (!copyText || !buttonState || !copyWrapper || !clipDefaultIcon || !clipSuccessIcon) {
    return; // Exit if any element is missing
  }

  // Function to handle the copy action
  const handleCopy = (e) => {
    e.preventDefault();
    const text = copyText.textContent;
    if (text !== null) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          updateUIOnCopy();
          setTimeout(resetUI, 10000);
        })
        .catch((err) => {
          console.error('❗️ Failed to copy:', err);
        });
    }
  };

  // Function to update the UI when text is copied
  const updateUIOnCopy = () => {
    buttonState.textContent = `Successfully copied!`;
    copyWrapper.classList.add('copied');
    clipDefaultIcon.classList.add('hidden');
    clipSuccessIcon.classList.remove('hidden');
  };

  // Function to reset the UI after a delay
  const resetUI = () => {
    buttonState.textContent = `Copy address`;
    copyWrapper.classList.remove('copied');
    clipDefaultIcon.classList.remove('hidden');
    clipSuccessIcon.classList.add('hidden');
  };

  // Add event listeners to the copy wrapper (safe because we checked earlier)
  copyWrapper.addEventListener('click', handleCopy);
  copyWrapper.addEventListener('touchend', handleCopy);
})();

// ==============================
// ? BLUR HIDE
// ==============================

window.addEventListener('scroll', function () {
  const blurComponent = document.querySelector('.blur-component');
  const footer = document.querySelector('.footer');

  if (!blurComponent || !footer) {
    return; // Exit early if either element is missing
  }

  const footerRect = footer.getBoundingClientRect();

  if (footerRect.top < window.innerHeight) {
    blurComponent.style.opacity = '0';
    blurComponent.style.pointerEvents = 'none'; // Prevent interactions

    setTimeout(() => {
      // Double-check again to avoid flickering if scrolling fast
      const footerRectCheck = footer.getBoundingClientRect();
      if (footerRectCheck.top < window.innerHeight) {
        blurComponent.style.display = 'none';
      }
    }, 300);
  } else {
    blurComponent.style.display = 'block'; // Restore display when scrolling up
    setTimeout(() => {
      blurComponent.style.opacity = '1';
      blurComponent.style.pointerEvents = 'auto';
    }, 10);
  }
});
