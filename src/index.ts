'use strict';

import './style.css';

import { Alignment, Fit, Layout, Rive } from '@rive-app/webgl2';
// ==============================
// ? RIVE
// ==============================

document.addEventListener('DOMContentLoaded', () => {
  // === First Animation ===
  initRiveAnimation({
    canvasId: 'benefit-1',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d1a1922f51259652e546c8_1-benefit-v11.riv',
    artboard: 'benefit-1',
    stateMachine: 'state-machine-1',
    hoverInputName: 'card_hover',
    cursorOnHover: 'pointer',
    cursorOnExit: 'default',
  });

  // === Second Animation ===
  initRiveAnimation({
    canvasId: 'benefit-4',
    src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d1a73a409cf6e7694b6389_4-benefit-v2.riv',
    artboard: 'benefit-4',
    stateMachine: 'state-machine-1',
    hoverInputName: 'cardHovered',
    cursorOnHover: 'grab',
    cursorOnExit: 'default',
  });

  // === Reusable Init Function ===
  function initRiveAnimation({
    canvasId,
    src,
    artboard,
    stateMachine,
    hoverInputName,
    cursorOnHover,
    cursorOnExit,
  }) {
    const riveCanvas = document.getElementById(canvasId);

    if (!riveCanvas) return;

    const layout = new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    });

    const riveInstance = new Rive({
      src,
      canvas: riveCanvas,
      autoplay: true,
      artboard,
      stateMachines: stateMachine,
      layout,

      onLoad: () => {
        riveInstance.resizeDrawingSurfaceToCanvas();

        const inputs = riveInstance.stateMachineInputs(stateMachine);
        const hoverInput = inputs.find((input) => input.name === hoverInputName);

        if (!hoverInput) return;

        const checkCardHover = () => {
          riveCanvas.style.cursor = hoverInput.value === true ? cursorOnHover : cursorOnExit;
          requestAnimationFrame(checkCardHover);
        };

        checkCardHover();
      },
    });

    window.addEventListener('resize', () => {
      riveInstance.resizeDrawingSurfaceToCanvas();
    });
  }
});

// document.addEventListener('DOMContentLoaded', () => {
//   // Define the layout
//   const layout = new Layout({
//     fit: Fit.Cover, // Change to: Fit.Contain, or Cover
//     alignment: Alignment.Center,
//   });
//   // HTML Canvas element to render to
//   const riveCanvas = document.getElementById('benefit-1');
//   // Initialize the Rive instance
//   const riveInstance = new Rive({
//     src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d0eb5cebc37844d2e4beff_benefit-18.riv',
//     canvas: riveCanvas,
//     autoplay: true,
//     artboard: 'automate-reports',
//     stateMachines: 'state-machine-1',
//     layout: layout,
//     onLoad: () => {
//       console.log('Rive animation loaded using WebGL2!');
//       riveInstance.resizeDrawingSurfaceToCanvas(); // ensures crisp rendering
//     },
//   });
//   window.addEventListener('resize', () => {
//     riveInstance.resizeDrawingSurfaceToCanvas();
//   });
// });

// document.addEventListener('DOMContentLoaded', () => {
//   const layout = new Layout({
//     fit: Fit.Contain,
//     alignment: Alignment.Center,
//   });

//   const riveCanvas = document.getElementById('benefit-1');

//   const riveInstance = new Rive({
//     src: 'https://cdn.prod.website-files.com/67bd796453b2d1478e028672/67d0f4218af0c805617a657e_benefit-1-v10.riv',
//     canvas: riveCanvas,
//     autoplay: true,
//     artboard: 'automate-reports',
//     stateMachines: 'state-machine-1',
//     layout: layout,

//     onLoad: () => {
//       riveInstance.resizeDrawingSurfaceToCanvas();

//       const inputs = riveInstance.stateMachineInputs('state-machine-1');
//       const cardHoverInput = inputs.find((input) => input.name === 'card_hover');

//       if (!cardHoverInput) return;

//       function checkCardHover() {
//         riveCanvas.style.cursor = cardHoverInput.value === true ? 'pointer' : 'default';
//         requestAnimationFrame(checkCardHover);
//       }

//       checkCardHover();
//     },
//   });

//   window.addEventListener('resize', () => {
//     riveInstance.resizeDrawingSurfaceToCanvas();
//   });
// });

// ==============================
// ? COPY TO CLIPBOARD
// ==============================

const copyText = document.querySelector('.footer_link-wrapper .footer_address .text-size-medium');
const buttonState = document.querySelector('.footer_copy-wrapper .text-size-regular');
const copyWrapper = document.querySelector('.footer_copy-wrapper');
const clipDefaultIcon = document.querySelector('.footer_clipboard-icon.is-default');
const clipSuccessIcon = document.querySelector('.footer_clipboard-icon.is-copied');

(function () {
  // Function to handle the copy action
  const handleCopy = (e: Event) => {
    e.preventDefault();
    const text = copyText.textContent;
    if (text !== null) {
      navigator.clipboard.writeText(text);
      updateUIOnCopy();
      setTimeout(resetUI, 10000);
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

  // Add event listeners to the copy wrapper
  copyWrapper.addEventListener('click', handleCopy);
  copyWrapper.addEventListener('touchend', handleCopy);
})();

// ==============================
// ? BLUR HIDE
// ==============================

window.addEventListener('scroll', function () {
  const blurComponent = document.querySelector('.blur-component');
  const footer = document.querySelector('.footer');

  const footerRect = footer.getBoundingClientRect();

  if (footerRect.top < window.innerHeight) {
    blurComponent.style.opacity = '0';
    blurComponent.style.pointerEvents = 'none'; // Prevent interactions

    // Wait for the opacity transition before setting display: none
    setTimeout(() => {
      if (footerRect.top < window.innerHeight) {
        // Double-check to avoid flickering
        blurComponent.style.display = 'none';
      }
    }, 300); // Adjust timing based on your CSS transition duration
  } else {
    blurComponent.style.display = 'block'; // Restore display when scrolling up
    setTimeout(() => {
      blurComponent.style.opacity = '1';
      blurComponent.style.pointerEvents = 'auto';
    }, 10); // Small delay to ensure display is set first
  }
});
