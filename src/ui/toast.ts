export function showToast(message: string, root: HTMLElement = document.body): void {
  const existing = root.querySelector("[data-toast]");
  existing?.remove();
  const toast = document.createElement("p");
  toast.className = "inline-toast";
  toast.dataset.toast = "true";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  root.append(toast);
  window.setTimeout(() => toast.remove(), 4000);
}
