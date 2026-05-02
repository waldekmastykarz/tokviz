import { useState, useEffect, useRef, useCallback } from 'react';
import { GenAISpan, WSMessage } from '../types';

export function useWebSocket() {
  const [spans, setSpans] = useState<GenAISpan[]>([]);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    const isDev = window.location.port === '5173';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = isDev ? 'localhost:4318' : window.location.host;
    const ws = new WebSocket(`${protocol}//${host}/ws`);
    wsRef.current = ws;

    ws.onopen = () => setConnected(true);

    ws.onclose = () => {
      setConnected(false);
      // Reconnect after 2s
      setTimeout(connect, 2000);
    };

    ws.onerror = () => {
      ws.close();
    };

    ws.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      if (message.type === 'init') {
        setSpans(message.data.spans);
      } else if (message.type === 'spans') {
        setSpans((prev) => [...prev, ...message.data]);
      }
    };
  }, []);

  useEffect(() => {
    connect();
    return () => {
      wsRef.current?.close();
    };
  }, [connect]);

  return { spans, connected };
}
