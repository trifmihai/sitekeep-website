'use strict';

import './style.css';

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
