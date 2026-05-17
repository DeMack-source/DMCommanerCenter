.terminal-wrapper {
  background: #000;
  color: #0f0;
  font-family: monospace;
  border: 1px solid #333;
  margin: 10px 0;
}

.terminal-header {
  display: flex;
  gap: 6px;
  padding: 6px;
  background: #111;
  border-bottom: 1px solid #333;
}

.terminal-header button {
  background: #222;
  color: #0f0;
  border: 1px solid #333;
  padding: 3px 8px;
  cursor: pointer;
}

.clear-btn {
  margin-left: auto;
  background: #400;
  color: #fff;
}

.terminal-log {
  max-height: 200px;
  overflow-y: auto;
  padding: 6px;
}

.log-entry {
  white-space: pre-wrap;
  margin-bottom: 4px;
}

.log-entry .ts {
  color: #888;
  margin-right: 6px;
}

.log-entry .tag {
  margin-right: 6px;
}

.log-entry.system .tag { color: #0ff; }
.log-entry.alert .tag { color: #f00; }
.log-entry.notice .tag { color: #ff0; }
.log-entry.quote .tag { color: #0f0; }
