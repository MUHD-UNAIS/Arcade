export const requestFullscreen = () => {
  const elem = document.documentElement;
  try {
    let promise;
    if (elem.requestFullscreen) {
      promise = elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      promise = elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      promise = elem.msRequestFullscreen();
    }
    
    // Modern browsers return a promise, older ones might return undefined
    if (promise && typeof promise.catch === 'function') {
      promise.catch((err) => console.warn("Fullscreen request rejected:", err));
    }
  } catch (e) {
    console.warn("Fullscreen request failed", e);
  }
};

export const isFullscreen = () => {
  return !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.mozFullScreenElement ||
    document.msFullscreenElement
  );
};

export const toggleFullscreen = () => {
  const elem = document.documentElement;
  if (!isFullscreen()) {
    try {
      let promise;
      if (elem.requestFullscreen) {
        promise = elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        promise = elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        promise = elem.msRequestFullscreen();
      }
      
      if (promise && typeof promise.catch === 'function') {
        promise.catch((err) => console.warn("Fullscreen request rejected:", err));
      }
    } catch (e) {
      console.warn("Fullscreen request failed", e);
    }
  } else {
    try {
      let promise;
      if (document.exitFullscreen) {
        promise = document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        promise = document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        promise = document.msExitFullscreen();
      }
      
      if (promise && typeof promise.catch === 'function') {
        promise.catch((err) => console.warn("Fullscreen exit rejected:", err));
      }
    } catch (e) {
      console.warn("Fullscreen exit failed", e);
    }
  }
};
