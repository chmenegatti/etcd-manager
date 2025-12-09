"use client";

import { Search, Plus, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onRefresh: () => void;
  totalKeys: number;
  filteredKeys: number;
}

export function Toolbar({
  searchQuery,
  onSearchChange,
  onCreateClick,
  onRefresh,
  totalKeys,
  filteredKeys,
}: ToolbarProps) {
  return (
    <div className="px-6 py-4 border-b border-border bg-card/50">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por chave..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:border-primary focus:ring-primary"
            />
          </div>
          <Button
            variant="icon"
            size="icon"
            onClick={onRefresh}
            title="Atualizar dados"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-sm text-muted-foreground">
            {filteredKeys === totalKeys ? (
              <>{totalKeys} chaves</>
            ) : (
              <>
                {filteredKeys} de {totalKeys} chaves
              </>
            )}
          </span>
          <Button onClick={onCreateClick}>
            <Plus className="w-4 h-4" />
            Nova Chave
          </Button>
        </div>
      </div>
    </div>
  );
}
