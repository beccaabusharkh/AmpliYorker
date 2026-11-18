import { STATSIG_EXPERIMENTS } from "../lib/statsig/catalog";
import { clearExposures, getExposures, onExposuresChanged } from "../lib/statsig/exposures";
import { clearForcedAssignments, persistForcedAssignments, readForcedAssignments, setForcedAssignment } from "../lib/statsig/overrides";
import { refreshLocalAssignments } from "../lib/statsig/evaluate";

let mounted = false;

function renderInspector(root: HTMLElement): void {
  const exposures = getExposures();
  const forced = readForcedAssignments();
  const rows = exposures
    .map(
      (item) => `
      <tr>
        <td>${item.gateOrExperiment}</td>
        <td>${item.variant}</td>
        <td>${item.surface}</td>
        <td>${item.isForced ? "forced demo" : "live"}</td>
      </tr>`,
    )
    .join("");
  const forcedList = forced.map((item) => `<li><code>${item.gateOrExperiment}:${item.value}</code></li>`).join("");

  root.innerHTML = `
    <details class="exposure-inspector" data-exposure-inspector>
      <summary>Statsig exposure inspector (local)</summary>
      <p class="simulation-label">Forced demo traffic is labeled and excluded from live experiment conclusions.</p>
      <table>
        <thead><tr><th>Gate / experiment</th><th>Variant</th><th>Surface</th><th>Source</th></tr></thead>
        <tbody>${rows || `<tr><td colspan="4">No exposures yet — interact with paywall or subscribe.</td></tr>`}</tbody>
      </table>
      <p><strong>Forced overrides</strong></p>
      <ul>${forcedList || "<li>none</li>"}</ul>
      <div class="inspector-actions">
        <button type="button" data-force-sub-urgency>Force subscription message: urgency</button>
        <button type="button" data-clear-forced>Clear forced overrides</button>
        <button type="button" data-clear-exposures>Clear exposure log</button>
      </div>
    </details>
  `;

  root.querySelector("[data-force-sub-urgency]")?.addEventListener("click", () => {
    setForcedAssignment(STATSIG_EXPERIMENTS.subscriptionMessage, "urgency");
    refreshLocalAssignments();
    renderInspector(root);
  });

  root.querySelector("[data-clear-forced]")?.addEventListener("click", () => {
    clearForcedAssignments();
    persistForcedAssignments([]);
    refreshLocalAssignments();
    renderInspector(root);
  });

  root.querySelector("[data-clear-exposures]")?.addEventListener("click", () => {
    clearExposures();
    renderInspector(root);
  });
}

export function mountExposureInspector(appRoot: HTMLElement): void {
  if (mounted) {
    return;
  }
  mounted = true;
  const host = document.createElement("aside");
  host.className = "exposure-inspector-host";
  appRoot.append(host);
  renderInspector(host);
  onExposuresChanged(() => renderInspector(host));
}