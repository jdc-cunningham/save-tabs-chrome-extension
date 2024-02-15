const tabsDisp = document.getElementById('tabs');
const closePopupBtn = document.getElementById('close-popup-icon');
const saveBtn = document.getElementById('save-tabs');
const API_BASE_URL = 'http://192.168.1.144:5003';
const topics = document.getElementById('topics');

const postAjax = (url, data, success) => {
  var params = typeof data == 'string' ? data : Object.keys(data).map(
          function(k){ return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]) }
      ).join('&');

  var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
  xhr.open('POST', url);
  xhr.onreadystatechange = function() {
      if (xhr.readyState>3 && xhr.status==200) { success(xhr.responseText); }
  };
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  xhr.send(params);
  return xhr;
}

window.addEventListener('load', () => {
  chrome.runtime.sendMessage({
    action: 'get-tabs'
  });
});

chrome.runtime.onMessage.addListener((request, sender, callback) => {
  const { response } = request;

  if (response?.tabs) {
    console.log(response.tabs);
    response.tabs.forEach(tab => {
      tabsDisp.innerHTML += `<div class="container__tab" data-url="${tab.url}" data-title="${tab.title}">
        <input type="checkbox" checked/>
        <p>${tab.title.substring(0, 30)}${tab.title.length > 30 ? '...' : ''}</p>
      </div>`
    });
  }
});

closePopupBtn.addEventListener('click', () => {
  window.close();
});

saveBtn.addEventListener('click', () => {
  const tabsToSave = [];

  document.querySelectorAll('.container__tab').forEach(tab => {
    if (tab.querySelector('input').checked) {
      tabsToSave.push({
        title: tab.dataset.title,
        url: tab.dataset.url
      });
    }
  });

  postAjax(
    `${API_BASE_URL}/save-tabs`,
    {
      topics: topics.value,
      tabs: JSON.stringify(tabsToSave)
    },
    (response) => {
      if (response === 'tabs saved') {
        tabsDisp.innerHTML = '<div class="container__modal">Saved!</div>';
      } else {
        alert('failed to save');
      }
    }
  );
});
