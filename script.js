// Function to check if the DOM has added the specified element
function checkDOM(Mutations) {
  for (const Mutation of Mutations) {
    for (const addedNode of Mutation.addedNodes) {
      if (addedNode instanceof HTMLElement) {
        let header = addedNode.querySelector('.input-window-header');
        const modal = addedNode.querySelector('.input-window');
        if (header && header.innerHTML.includes('<h1>SLA Hold Auto-Release</h1>')) {
          console.log('The <div> element with class "input-window-header" and the specified content has been added to the DOM.');
          const buttonDiv = document.createElement('div');
          buttonDiv.className = 'details-group-buttons';
          buttonDiv.style.display = 'grid';
          buttonDiv.style.gridTemplateColumns = '1fr 1fr';
          modal.querySelector('.details-group').append(buttonDiv);
          modal.querySelector('.details-group').style.display = 'flex';
          modal.querySelector('.details-group').style.justifyContent = 'space-between';
          makeButton(modal, '8AM Tomorrow', () => {
            let date = new Date();
            date.setDate(date.getDate() + 1);
            date.setHours(8);
            date.setMinutes(0);
            return date;
          });
          makeButton(modal, '1 Week', () => {
            let date = new Date();
            date.setDate(date.getDate() + 7);
            return date;
          });
          makeButton(modal, '8AM Monday', () => {
            let date = new Date();
            date.setDate(date.getDate() + 1 + date.getDay());
            date.setHours(8);
            date.setMinutes(0);
            return date;
          });
          makeButton(modal, '2 Weeks', () => {
            let date = new Date();
            date.setDate(date.getDate() + 14);
            return date;
          });
          makeButton(modal, '8AM Friday', () => {
            let date = new Date();
            date.setDate(date.getDate() + 5 + date.getDay());
            date.setHours(8);
            date.setMinutes(0);
            return date;
          });
          makeButton(modal, '4 Weeks', () => {
            let date = new Date();
            date.setDate(date.getDate() + 28);
            return date;
          });
        }
      }
    }
  }
}

// Function to make a button and the functionality of said button
function makeButton(modal, buttonName, buttonDate) {
  const sourceButton = modal.querySelector('input[type="submit"][value="Set"]');
  const sourceStyle = window.getComputedStyle(sourceButton);
  const button = document.createElement('button');
  button.textContent = buttonName;
  button.type = 'button';
  button.onclick = () => {
    const date = buttonDate();
    modal.querySelector('#input-field-for-sla_autorelease_datetimeundefined').click();
    setTimeout(() => {
      const regionCode = navigator.language;
      console.log(regionCode);
      const timeField = document.querySelector('.rc-time-picker-panel-input');
      timeField.focus();
      document.execCommand('selectAll', false, null);
      document.execCommand('insertText', false, date.toLocaleTimeString(undefined, { hour: 'numeric', minute: 'numeric' }));
      document.querySelector('.rc-time-picker-panel').remove();
      setTimeout(() => {
        const a = modal.querySelector('#input-field-for-sla_autorelease_date');
        a.focus();
        a.click();
        setTimeout(() => {
          console.log(date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }));
          console.log(date.toLocaleDateString(regionCode, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
          const ds = document.querySelector(`[aria-label$="${date.toLocaleDateString(regionCode, { day: 'numeric', month: 'long', year: 'numeric' })}"]`);
          console.log(ds);
          ds.click();
          const set = modal.querySelector('input[type="submit"][value="Set"]');
          set.click();
        }, 50);
      }, 50);
    }, 50);
  };

  for (attributeKeyNumber in Object.keys(sourceStyle)) {
    const key = sourceStyle[attributeKeyNumber];
    button.style[key] = sourceStyle.getPropertyValue(key);
  }

  modal.querySelector('.details-group-buttons').append(button);
}

// Create a new MutationObserver instance
const observer = new MutationObserver(checkDOM);

// Configure the observer to monitor all changes in the DOM
const config = { childList: true, subtree: true };

// Start observing the DOM for changes
observer.observe(document.documentElement, config);