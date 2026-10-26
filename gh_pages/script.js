const outcomes = document.querySelectorAll(".outcome");

outcomes.forEach((outcome) => {
  const button = outcome.querySelector("button");
  button.addEventListener("click", () => {
    const wasOpen = outcome.classList.contains("active");

    outcomes.forEach((item) => {
      item.classList.remove("active");
      item.querySelector("button").setAttribute("aria-expanded", "false");
      item.querySelector(".outcome-icon").textContent = "+";
    });

    if (!wasOpen) {
      outcome.classList.add("active");
      button.setAttribute("aria-expanded", "true");
      outcome.querySelector(".outcome-icon").textContent = "−";
    }
  });
});

const benchmarkGroups = document.querySelectorAll(".benchmark-group");

benchmarkGroups.forEach((group) => {
  group.addEventListener("toggle", () => {
    if (!group.open) return;
    benchmarkGroups.forEach((item) => {
      if (item !== group) item.open = false;
    });
  });
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.getElementById(button.dataset.copyTarget);
    if (!target) return;

    try {
      await navigator.clipboard.writeText(target.innerText);
      const original = button.textContent;
      button.textContent = "Copied";
      window.setTimeout(() => { button.textContent = original; }, 1600);
    } catch {
      button.textContent = "Select & copy";
    }
  });
});

const componentTooltip = document.getElementById("component-tooltip");
const tooltipTriggers = document.querySelectorAll("[data-tooltip]");

const placeTooltip = (x, y) => {
  if (!componentTooltip) return;

  const edge = 12;
  const offset = 14;
  const width = componentTooltip.offsetWidth;
  const height = componentTooltip.offsetHeight;
  let left = x + offset;
  let top = y + offset;

  if (left + width > window.innerWidth - edge) left = x - width - offset;
  if (top + height > window.innerHeight - edge) top = y - height - offset;

  componentTooltip.style.left = `${Math.max(edge, left)}px`;
  componentTooltip.style.top = `${Math.max(edge, top)}px`;
};

const showTooltip = (trigger, x, y) => {
  if (!componentTooltip) return;
  componentTooltip.textContent = trigger.dataset.tooltip;
  componentTooltip.classList.add("visible");
  componentTooltip.setAttribute("aria-hidden", "false");
  placeTooltip(x, y);
};

const hideTooltip = () => {
  if (!componentTooltip) return;
  componentTooltip.classList.remove("visible");
  componentTooltip.setAttribute("aria-hidden", "true");
};

tooltipTriggers.forEach((trigger) => {
  trigger.addEventListener("pointerenter", (event) => {
    showTooltip(trigger, event.clientX, event.clientY);
  });
  trigger.addEventListener("pointermove", (event) => {
    placeTooltip(event.clientX, event.clientY);
  });
  trigger.addEventListener("pointerleave", hideTooltip);
  trigger.addEventListener("focus", () => {
    const rect = trigger.getBoundingClientRect();
    showTooltip(trigger, rect.left + rect.width / 2, rect.top);
  });
  trigger.addEventListener("blur", hideTooltip);
  trigger.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideTooltip();
      trigger.blur();
    }
  });
});

window.addEventListener("resize", hideTooltip);
