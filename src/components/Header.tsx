import { Database } from "lucide-react";
import { ConnectionStatus } from "@/types/etcd";

interface HeaderProps {
  connectionStatus: ConnectionStatus;
}

export function Header({ connectionStatus }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Database className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            ETCD Manager
          </h1>
          <p className="text-xs text-muted-foreground">
            Key-Value Store Administration
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary/50">
        <span
          className={`w-2 h-2 rounded-full ${
            connectionStatus.connected
              ? "bg-success animate-pulse"
              : "bg-destructive"
          }`}
        />
        <span className="text-sm text-muted-foreground">
          {connectionStatus.connected ? "Conectado em" : "Desconectado"}
        </span>
        {connectionStatus.connected && (
          <code className="text-sm font-mono text-foreground">
            {connectionStatus.endpoint}
          </code>
        )}
      </div>
    </header>
  );
}
