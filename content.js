if (window.location.href.includes("id=")) {


  const meta = document.createElement("meta");
  meta.description = "Start Codeless ❤️ Styles";
  document.head.appendChild(meta);

  const link = document.createElement("link");
  const href = chrome.runtime.getURL("style.css");
  console.log("Codeless ❤️: Got href:", href);
  link.rel = "stylesheet";
  link.type = "text/css";
  link.href = href;
  link.setAttribute("data-creator", "Codeless ❤️ - Bubble UI Helper");
  link.setAttribute("id", "codelesslove");
  document.head.appendChild(link);
  console.log("Codeless ❤️: Appended", link, "to head.")

  const link2 = document.createElement("link");
  link2.rel = "stylesheet";
  link2.type = "text/css";
  link2.href = href;
  document.head.appendChild(link2);
  console.log("Codeless ❤️: Appended", link2, "to head.")


  meta.description = "End Codeless ❤️ Styles";
  document.head.appendChild(meta);

  // document.addEventListener("DOMContentLoaded", () => {
  //   // Force a reflow to ensure styles are applied
  //   setTimeout(() => {
  //     document.querySelectorAll(".options > .fields").forEach(el => {
  //       el.style.display = getComputedStyle(el).display; // Trigger reflow
  //       console.log("Codeless ❤️: Reapplied", link, "to head.")
  //     });
  //   }, 5000);
  // });
}
