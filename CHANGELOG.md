# Changelog

## [0.3.6](https://github.com/waldekmastykarz/tokviz/compare/v0.3.5...v0.3.6) (2026-09-03)

### Maintenance

- Refreshed runtime and development dependencies to keep the dashboard stack current

## [0.3.5](https://github.com/waldekmastykarz/tokviz/compare/v0.3.4...v0.3.5) (2026-08-26)

### Maintenance

- Refreshed runtime and development dependencies to keep the dashboard stack current

## [0.3.4](https://github.com/waldekmastykarz/tokviz/compare/v0.3.3...v0.3.4) (2026-08-25)

### Maintenance

- Refreshed runtime and development dependencies to keep the dashboard stack current

## [0.3.3](https://github.com/waldekmastykarz/tokviz/compare/v0.3.2...v0.3.3) (2026-07-24)

### Maintenance

- Refreshed runtime and development dependencies to keep the dashboard stack current

## [0.3.2](https://github.com/waldekmastykarz/tokviz/compare/v0.3.1...v0.3.2) (2026-07-23)

### Maintenance

- Refreshed runtime and development dependencies to keep the dashboard stack current

## [0.3.1](https://github.com/waldekmastykarz/tokviz/compare/v0.3.0...v0.3.1) (2026-07-15)

### Maintenance

- Refreshed runtime and development dependencies to keep the dashboard stack current

## [0.3.0](https://github.com/waldekmastykarz/tokviz/compare/v0.2.1...v0.3.0) (2026-05-15)

### Features

- Cumulative/per-request toggle on the Overview charts — switch between seeing individual data points per time bucket and a running total

## [0.2.0](https://github.com/waldekmastykarz/tokviz/compare/v0.1.0...v0.2.0) (2026-05-03)

### Features

- Demo mode (`--demo` flag / `npm run demo`) with synthetic data across 5 models for exploring the dashboard without real OTLP data
- SVG favicon and logo in the dashboard header

### Improvements

- Wider request detail dialog for better readability of long prompts

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
