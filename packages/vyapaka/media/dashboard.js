// @ts-check

(function () {
  const vscode = acquireVsCodeApi();

  const refreshBtn = document.getElementById('refreshBtn');
  const reportBtn = document.getElementById('reportBtn');
  const settingsBtn = document.getElementById('settingsBtn');
  
  const workingCount = document.getElementById('workingCount');
  const warningCount = document.getElementById('warningCount');
  const missingCount = document.getElementById('missingCount');
  const unknownCount = document.getElementById('unknownCount');
  
  const toolchainList = document.getElementById('toolchainList');

  // Wire up buttons
  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'refresh' });
      if (toolchainList) {
        toolchainList.innerHTML = '<div class="loading">Refreshing diagnostics...</div>';
      }
    });
  }

  if (reportBtn) {
    reportBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'generateReport' });
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'openSettings' });
    });
  }

  // Handle messages from the extension
  window.addEventListener('message', event => {
    const message = event.data;
    switch (message.type) {
      case 'toolchains':
        updateToolchains(message.payload);
        break;
    }
  });

  function updateToolchains(toolchains) {
    if (!toolchains || !Array.isArray(toolchains)) return;

    let working = 0;
    let warning = 0;
    let missing = 0;
    let unknown = 0;

    let html = '';

    toolchains.forEach(tc => {
      switch (tc.status) {
        case 'working': working++; break;
        case 'warning': warning++; break;
        case 'missing': missing++; break;
        default: unknown++; break;
      }

      let fixHtml = '';
      if (tc.status === 'missing' && tc.fixRecommendation) {
        fixHtml = `
          <div class="fix-recommendation">
            <div class="fix-title">Action Required: ${escapeHtml(tc.fixRecommendation.what)}</div>
            <div>${escapeHtml(tc.fixRecommendation.why)}</div>
            <div class="fix-how">${escapeHtml(tc.fixRecommendation.how)}</div>
          </div>
        `;
      }

      html += `
        <div class="toolchain-card">
          <div class="toolchain-header">
            <span class="toolchain-name">${escapeHtml(tc.displayName)}</span>
            <span class="status-badge status-${tc.status}">${tc.status}</span>
          </div>
          <div class="toolchain-details">${escapeHtml(tc.details || 'No details available')}</div>
          ${fixHtml}
        </div>
      `;
    });

    // Update summary counts
    if (workingCount) workingCount.textContent = working.toString();
    if (warningCount) warningCount.textContent = warning.toString();
    if (missingCount) missingCount.textContent = missing.toString();
    if (unknownCount) unknownCount.textContent = unknown.toString();

    // Update list
    if (toolchainList) {
      toolchainList.innerHTML = html || '<div class="loading">No toolchains detected.</div>';
    }
  }

  function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
      .toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
}());
