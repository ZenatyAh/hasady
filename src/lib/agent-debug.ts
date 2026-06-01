// #region agent log
export function agentLog(
  location: string,
  message: string,
  data: Record<string, unknown>,
  hypothesisId: string,
  runId = 'pre-fix'
) {
  fetch('http://127.0.0.1:7907/ingest/f5dac036-1bc7-42cd-b2e7-c5e1e6970171', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '753c82',
    },
    body: JSON.stringify({
      sessionId: '753c82',
      runId,
      hypothesisId,
      location,
      message,
      data,
      timestamp: Date.now(),
    }),
  }).catch(() => {});
}
// #endregion
