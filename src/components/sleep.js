async function sleep(ms = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}
export default async function showToast(message, type) {
  let msg = document.createElement("div");
  msg.style.width = `${(window.innerWidth * 20) / 100}px`;
  msg.style.minWidth = "fit-content";
  msg.style.backgroundColor = "black";
  msg.style.color = "white";
  msg.style.height = "fit-content";
  msg.style.padding = "8px";
  msg.style.paddingLeft = "15px";
  msg.style.paddingRight = "15px";
  msg.style.display = "flex";
  msg.style.alignItems = "center";
  msg.style.justifyContent = "center";
  msg.style.fontSize = "1.25rem";
  msg.style.border = "1px solid black";
  msg.style.borderRadius = "30px";
  msg.style.letterSpacing = "0.5px";
  msg.style.zIndex = "1000";
  msg.innerHTML = `${message}`;
  msg.style.position = "absolute";
  msg.style.transition = "all 0.7s ease-out";
  if (Number.parseInt(window.innerWidth) < 400) {
    msg.style.left = `${Number.parseInt((window.innerWidth * 15) / 100)}px`;
  } else if (
    Number.parseInt(window.innerWidth) > 400 &&
    Number.parseInt(window.innerWidth) < 600
  ) {
    msg.style.left = `${Number.parseInt((window.innerWidth * 25) / 100)}px`;
  } else {
    msg.style.left = `${Number.parseInt((window.innerWidth * 40) / 100)}px`;
  }
  msg.style.top = `${Number.parseInt((window.innerHeight * 90) / 100)}px`;
  document.body.appendChild(msg);
  msg.style.display = "none";

  if (type === "short") {
    await sleep(500);
    msg.style.display = "flex";
    await sleep(1000);
    msg.style.display = "none";
    msg.parentElement.removeChild(msg);
  }
  if (type === "medium") {
    await sleep(500);
    msg.style.display = "flex";
    await sleep(2000);
    msg.style.display = "none";
  }
  if (type === "long") {
    await sleep(500);
    msg.style.display = "flex";
    await sleep(3000);
    msg.style.display = "none";
  }
}
