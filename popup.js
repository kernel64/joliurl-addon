function getLocalizedMessage(messageName) {
  return browser.i18n.getMessage(messageName);
}

function getCurrentTabUrl() {
  browser.tabs
    .query({ active: true, currentWindow: true })
    .then((tabs) => {
      if (tabs.length > 0) {
        const currentTab = tabs[0];
        document.getElementById("longUrlInput").value = currentTab.url;
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la récupération de l'onglet :", error);
    });
}

function copyUrl() {
  var input = document.getElementById("shtUrl");
  input.select();
  input.setSelectionRange(0, 99999);
  document.execCommand("copy");
  document.getElementById("tooltipTxt").style.visibility = 'visible';
  setTimeout(function() {
    document.getElementById("tooltipTxt").style.visibility = 'hidden';
}, 2000);
}

document.addEventListener("DOMContentLoaded", function () {

  document.getElementById("shtUrl").addEventListener("click", copyUrl);
  document.getElementById("copyBtn").addEventListener("click", copyUrl);

  getCurrentTabUrl();

  document.getElementById("shortenBtn").innerHTML = '<i class="fa-solid fa-down-left-and-up-right-to-center"></i>' + getLocalizedMessage("shortenButtonLabel");
  document.getElementById("longUrlInput").placeholder = getLocalizedMessage("LabelLongUrl");
  document.getElementById("emailInput").placeholder = getLocalizedMessage("LabelEmail");

  document.getElementById("shortenBtn").addEventListener("click", function () {
    const apiUrl = "https://joliurl.com/api/url"; // JoliURL API
    const form = document.getElementById("formJoliUrl");
    const formData = new FormData(form);

    fetch(apiUrl, {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 400) {
          return response.json();
        } else {
          throw new Error("Network response was not ok");
        }
      })
      .then((data) => {
        if (typeof data.error !== "undefined") {
          document.getElementById("respKo").style.display = "block";
          document.getElementById("respOk").style.display = "none";
          switch (data.code) {
            case 103 :
              document.getElementById("respKo").innerHTML = getLocalizedMessage("errorUrlMessage");
              break;
            case 104:
              document.getElementById("respKo").innerHTML = getLocalizedMessage("errorEmailMessage");
              break;
            default:
              document.getElementById("respKo").innerHTML = getLocalizedMessage("defaultErrorMessage");
          }
          
        } else {
          document.getElementById("respOk").style.display = "block";
          document.getElementById("respKo").style.display = "none";
          document.getElementById("shtUrl").value = data.short_url;
          document.getElementById("shortenBtn").style.display = "none";
          document.getElementById("sMessage").innerHTML = getLocalizedMessage("defaultSuccessMessage");
          document.getElementById("tooltipTxt").innerText = getLocalizedMessage("copiedMessage");
        }
      })
      .catch((error) => { // default error message
        console.error("Error:", error);
        document.getElementById("respKo").innerHTML = getLocalizedMessage("defaultErrorMessage");
 
      });
    return false;
  });
});
