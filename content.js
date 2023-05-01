const messages = [];
let scrollTo = 0;

// [2] if full page that shows contacts and messages, [0] if only shows messages
const scrollViewDiv = document.getElementsByClassName('scrollViewport')[2];
if (!scrollViewDiv) {
  console.error('Could not find the parent div');
}

saveMessages(scrollViewDiv);

// switching scrollTo to 0 and 1 to trigger fetching older messages
function scrollViewToGetOlderMessages() {
  console.info('scrolling', scrollTo);
  scrollViewDiv.scrollTop = scrollTo;
  scrollTo = scrollTo == 0 ? 1 : 0;
}

function checkNewMessage() {
  if (messages[messages.length - 1] === getMessageElements(scrollViewDiv)[0].getAttribute('aria-label')) {
    console.info('no new message');
    return false;
  }
  return true;
}

const doTask = () => {
  scrollViewToGetOlderMessages();
  if (checkNewMessage()) {
    appendNewMessages(scrollViewDiv);
  }
};

const task = setInterval(doTask, 1000);

function stopTask() {
  clearInterval(task);
  downloadMessages(messages);
}

function getMessageElements(root) {
  const elements = root.querySelectorAll('div[aria-label]:not([aria-label=""])');
  console.info('elements length', elements.length);
  return root.querySelectorAll('div[aria-label]:not([aria-label=""])');
}

function saveMessages(root) {
  console.info('saving messages');
  let elements = getMessageElements(root);
  for (let index = elements.length - 1; index >= 0; index--) {
    const element = elements[index];
    messages.push(element.getAttribute('aria-label'));
  }
}

function appendNewMessages(root) {
  console.info('appending new messages');
  const elements = root.querySelectorAll('div[aria-label]:not([aria-label=""])');
  let startIndex = -1;
  // the app will crash if remove the try catch block, don't know why
  try {
    for (let index = elements.length - 1; index >= 0; index--) {
      if (messages[messages.length - 1] === elements[index].getAttribute('aria-label')) {
        startIndex = index;
        break;
      }
    }
    console.info('appending new messages startIndex', startIndex);
    if (startIndex === -1) {
      console.warn('startIndex === -1');
      return;
    }
    for (let index = startIndex - 1; index >= 0; index--) {
      const element = elements[index];
      messages.push(element.getAttribute('aria-label'));
    }
  } catch (e) {
    console.warn('???', e);
  }
}

function downloadMessages(messages) {
  const blob = new Blob([messages.join('\n')], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'messages.txt';

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
