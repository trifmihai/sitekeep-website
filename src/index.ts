'use strict';

import { Alignment, EventType, Fit, Layout, Rive } from '@rive-app/webgl2';

// Animation configurations
const animationsConfig = [
  {
    id: 'benefit-1',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d1a1922f51259652e546c8_1-benefit-v11.riv',
    artboard: 'benefit-1',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['card_hover'],
    cursorOnHover: 'pointer',
  },
  {
    id: 'benefit-2',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d4232fa1b8c8d4802d6882_2-benefit-v11.riv',
    artboard: 'benefit-2',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverSecurity', 'hoverPerformance'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'benefit-3',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d62616bf79b5d0a4464dd8_3-benefit-v4.riv',
    artboard: 'benefit-3',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hover'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'benefit-4',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d6204c83c0ed0c6c3ee7a3_4-benefit-v3.riv',
    artboard: 'benefit-4',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'],
    cursorOnHover: 'grab',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'benefit-5',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d6232dae483e2d92b662fc_5-benefit-v3.riv',
    artboard: 'benefit-5',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverIcon'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'core-logo',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d31daf1c277d5cc3d641c9_core-logo-v6.riv',
    artboard: 'core-logo',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'],
    cursorOnHover: 'grab',
    autoplay: true,
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
    { rootMargin: '0px 0px 600px 0px', threshold: 0.01 }
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
