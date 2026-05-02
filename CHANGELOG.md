# Changelog

## 0.1.0 (2026-05-02)

### Features

- Real-time web dashboard for LLM token usage and costs
- OTLP HTTP receiver accepting protobuf and JSON on `/v1/traces`
- Overview tab with token and cost charts over time, summary cards
- Models tab with per-model breakdown of requests, tokens, and costs
- Requests tab with full request table and click-to-drill-down detail view
- WebSocket-based live updates (zero polling)
- Adaptive chart time scale (1s → 10s → 1min → 5min based on data range)
- Empty state with setup instructions
- Light and dark mode (follows system preference)
- CLI options: `--port` (default 4318) and `--no-open`
- Auto-opens browser on start
- Port conflict detection with helpful error message
