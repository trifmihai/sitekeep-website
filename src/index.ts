'use strict';

import { Alignment, EventType, Fit, Layout, Rive } from '@rive-app/webgl2';

// Animation configurations
const animationsConfig = [
  {
    id: 'benefit-1',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67e17ee80859e933a42d83f0_1-benefit-hover-v13.riv',
    artboard: 'benefit-1',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['card_hover'],
    cursorOnHover: 'pointer',
  },
  {
    id: 'benefit-2',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67e1679dc7641658199fc374_2-benefit-hover-v12.riv',
    artboard: 'benefit-2',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hoverSecurity', 'hoverPerformance'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'benefit-3',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67e163d361a1037bd531caad_3-benefit-hover-v5.riv',
    artboard: 'benefit-3',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['hover'],
    cursorOnHover: 'pointer',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'benefit-4',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67e156f3b9ac3af412b8c0ca_4-benefit-v6.riv',
    artboard: 'benefit-4',
    stateMachine: 'state-machine-1',
    hoverInputNames: ['cardHovered'],
    cursorOnHover: 'grab',
    onRiveEvent: handleBenefit2Event,
  },
  {
    id: 'benefit-5',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67e15cef3fabb802fc34997a_5-benefit-hover-v6.riv',
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
