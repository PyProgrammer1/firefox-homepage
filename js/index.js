let searchEngineOpt, searchEngine;
document.addEventListener("DOMContentLoaded", function () {
    updateTime();
    setInterval(updateTime, 100);
    searchEngineOpt = document.getElementById("engine").value;
    if (localStorage.getItem("engine")) {
        searchEngine = localStorage.getItem("engine");
        document.getElementById("engine").value = searchEngine;
    } else {
        searchEngine = document.getElementById("engine").value;
    }
    document.getElementById("engine").addEventListener("change", function () {
        searchEngineOpt = document.getElementById("engine").value;
        searchEngine = searchEngineOpt;
        localStorage.setItem("engine", searchEngineOpt);
    });
    document.getElementById("goBtn").addEventListener("click", go);
    var urlInput = document.getElementById("url");
    if (urlInput) {
        urlInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                go(e);
            }
        });
    }
});

function go(event) {
    if (event) event.preventDefault();
    var url = document.getElementById("url").value;
    const regex = /https?:\/\//i;
    if (url.value != "") {
        if (regex.test(url) && !url.includes(" ")) {
            window.location.href = url;
        } else {
            window.location.href = "https://" + searchEngine + "/search?q=" + url.replaceAll(" ", "+");
        }
    }
}

function updateTime() {
    const date = new Date();
    const formatter = new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hourCycle: "h12"
    });
    const timeObj = document.getElementById("clock");
    var currentTime = formatter.format(date);
    timeObj.innerHTML = currentTime;
}


function openSettings() {
  document.getElementById("settings-flyout").style.width = "250px";
}

function closeSettings() {
  document.getElementById("settings-flyout").style.width = "0";

}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(reg => console.log("SW registered:", reg.scope))
      .catch(err => console.error("SW registration failed:", err));
  });
}
