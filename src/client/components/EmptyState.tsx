export function EmptyState() {
  return (
    <div className="empty-state">
      <h2>Waiting for data...</h2>
      <p>
        Configure your application to send OpenTelemetry traces to this endpoint:
      </p>
      <p>
        <code>OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318</code>
      </p>
      <p style={{ marginTop: 16 }}>
        tokviz will display token usage and costs from any OTLP source that emits{' '}
        <code>gen_ai.*</code> span attributes.
      </p>
    </div>
  );
}
