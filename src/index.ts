'use strict';

import { Alignment, EventType, Fit, Layout, Rive } from '@rive-app/webgl2';

// Animation configurations
const animationsConfig = [
  {
    id: 'benefit-1',
    src: 'https://cdn.prod.website-files.com/64efc1d0232db54f18991fb1/67e36d9d552122910cd06178_1-benefit-hover-v13.riv',
    artboard: 'benefit-1',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['card_hover'],
    cursorOnHover: 'pointer',
    isTouchScrollEnabled: true,
  },
  {
    id: 'benefit-2',
    src: 'https://cdn.prod.website-files.com/64efc1d0232db54f18991fb1/67e34b4ea69562ad972c179a_2-benefit-hover-v13.riv',
    artboard: 'benefit-2',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverSecurity', 'hoverPerformance'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
    isTouchScrollEnabled: true,
  },
  {
    id: 'benefit-3',
    src: 'https://cdn.prod.website-files.com/64efc1d0232db54f18991fb1/67e36da30fd47e238f9f4c50_3-benefit-hover-v5.riv',
    artboard: 'benefit-3',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hover'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
    isTouchScrollEnabled: true,
  },
  {
    id: 'benefit-4',
    src: 'https://cdn.prod.website-files.com/64efc1d0232db54f18991fb1/67e36dabf07624c041b6ca00_4-benefit-hover-v6.riv',
    artboard: 'benefit-4',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'],
    cursorOnHover: 'grab',
    onRiveEvent: handleBenefit2Event,
    isTouchScrollEnabled: true,
  },
  {
    id: 'benefit-5',
    src: 'https://cdn.prod.website-files.com/64efc1d0232db54f18991fb1/67e36db220c9c3469f14430e_5-benefit-hover-v6.riv',
    artboard: 'benefit-5',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverIcon'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
    isTouchScrollEnabled: true,
  },
  {
    id: 'core-logo',
    src: 'https://cdn.prod.website-files.com/64efc1d0232db54f18991fb1/67e36dbc6a5df7cfedd92d23_core-logo-v6.riv',
    artboard: 'core-logo',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'],
    cursorOnHover: 'grab',
    autoplay: true,
    isTouchScrollEnabled: true,
  },
];

const riveInstances = {};

// Intersection Observer to lazy load animations
window.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const config = animationsConfig.find((a) => a.id === entry.target.id);
          if (config && !riveInstances[config.id]) {
            initRiveAnimation(config);
          }
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px 1200px 0px', threshold: 0.01 }
  );

  animationsConfig.forEach(({ id }) => {
    const canvas = document.getElementById(id);
    if (canvas) observer.observe(canvas);
  });
});

window.addEventListener('resize', () => {
  Object.values(riveInstances).forEach((instance) => {
    instance.resizeDrawingSurfaceToCanvas();
  });
});

function initRiveAnimation({
  id,
  src,
  artboard,
  stateMachine,
  hoverInputNames = [],
  cursorOnHover,
  cursorOnExit = 'default',
  autoplay = true,
  onRiveEvent = null,
}) {
  const canvas = document.getElementById(id);
  if (!canvas) return;

  const layout = new Layout({ fit: Fit.Contain, alignment: Alignment.Center });

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
      if (hoverInputNames.length) {
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

  if (onRiveEvent) riveInstance.on(EventType.RiveEvent, onRiveEvent);

  riveInstances[id] = riveInstance;
}

function handleHoverInputs({
  riveInstance,
  canvasElement,
  stateMachine,
  hoverInputNames,
  cursorOnHover,
  cursorOnExit,
}) {
  const inputs = riveInstance.stateMachineInputs(stateMachine);
  const hoverInputs = hoverInputNames
    .map((name) => inputs.find((input) => input.name === name))
    .filter(Boolean);

  function checkHoverState() {
    const isHovering = hoverInputs.some((input) => input.value);
    canvasElement.style.cursor = isHovering ? cursorOnHover : cursorOnExit;
    requestAnimationFrame(checkHoverState);
  }

  checkHoverState();
}

function handleBenefit2Event(riveEvent) {
  if (['securityComplete', 'iconPerformanceComplete'].includes(riveEvent.data.name)) {
    const coreLogo = riveInstances['core-logo'];
    const triggerInput = coreLogo
      ?.stateMachineInputs('state-machine-1')
      .find((input) => input.name === 'startAnimation');
    if (triggerInput) triggerInput.fire();
  }
}
