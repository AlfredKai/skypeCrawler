// This is just a record for another solutions about crawling old messages rather than using setInterval polling.
// However, this solution is not promising because the chlidList change event and the attribute change event are not triggered at the same time.
// The attribute change event is triggered after the childList change event.
const scrollViewDiv = document.getElementsByClassName('scrollViewport')[0];
let elements = scrollViewDiv.querySelectorAll('div[aria-label]:not([aria-label=""])');
if (window.observer) observer.disconnect();

const detectNodeChange = (mutationList, observer) => {
  if (mutationList.length > 0) {
    console.info('mutationList', mutationList.length);
    elements = scrollViewDiv.querySelectorAll('div[aria-label]:not([aria-label=""])');
    console.info('elements length', elements.length);
    console.info('elements 0', elements[0].getAttribute('aria-label'));
    console.info('elements 0', elements[0]);
    console.info('elements -1', elements[elements.length - 1].getAttribute('aria-label'));
    console.info('elements -1', elements[elements.length - 1]);
  }
};

const observer = new MutationObserver(detectNodeChange);
observer.observe(scrollViewDiv, { childList: true, subtree: true });

observer.disconnect();

const scrollViewDiv2 = document.getElementsByClassName('scrollViewport')[0];
const detectNodeChange = (mutationList, observer) => {
  if (mutationList.length > 0) {
    mutationList.forEach((mutation) => {
      if (mutation.type === 'attributes') {
        console.info(mutation.target.getAttribute('aria-label'), mutation.target);
      }
      if (mutation.addedNodes.length === 1 && mutation.addedNodes[0].title === '其他選項') return;
      if (mutation.removedNodes.length === 1 && mutation.removedNodes[0].title === '其他選項') return;
      if (mutation.addedNodes.length > 0) {
        mutation.addedNodes.forEach((node) => {
          console.info('addedNodes', node);
        });
      }
      if (mutation.removedNodes.length > 0) {
        console.info('removedNodes', mutation.removedNodes.length);
      }
    });
  }
};

const observer = new MutationObserver(detectNodeChange);
observer.observe(scrollViewDiv2, { attributeFilter: ['aria-label'], childList: true, subtree: true });

observer.disconnect();