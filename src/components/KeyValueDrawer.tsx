"use client";

import { useEffect, useState } from "react";
import { X, Save, Code, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EtcdEntry } from "@/types/etcd";

interface KeyValueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string, value: string) => void;
  editingEntry: EtcdEntry | null;
}

function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

function formatJson(str: string): string {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export function KeyValueDrawer({
  isOpen,
  onClose,
  onSave,
  editingEntry,
}: KeyValueDrawerProps) {
  const [key, setKey] = useState("");
  const [value, setValue] = useState("");
  const isEditing = editingEntry !== null;

  useEffect(() => {
    if (editingEntry) {
      setKey(editingEntry.key);
      setValue(editingEntry.value);
    } else {
      setKey("");
      setValue("");
    }
  }, [editingEntry, isOpen]);

  const handleSave = () => {
    if (!key.trim()) return;
    onSave(key, value);
  };

  const handleFormatJson = () => {
    if (isValidJson(value)) {
      setValue(formatJson(value));
    }
  };

  const isJson = isValidJson(value);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-4xl bg-card border-l border-border shadow-2xl z-50 animate-slide-in-right flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {isEditing ? "Editar Chave" : "Nova Chave"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isEditing
                ? "Modifique o valor desta chave"
                : "Adicione uma nova chave ao ETCD"}
            </p>
          </div>
          <Button variant="icon" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="key" className="text-sm font-medium text-foreground">
              Chave
            </Label>
            <Input
              id="key"
              type="text"
              placeholder="/config/example/key"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={isEditing}
              className={`font-mono ${isEditing ? "opacity-60 cursor-not-allowed" : ""}`}
            />
            {isEditing && (
              <p className="text-xs text-muted-foreground">
                A chave não pode ser alterada durante a edição
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="value" className="text-sm font-medium text-foreground">
                Valor
              </Label>
              <div className="flex items-center gap-2">
                {isJson && (
                  <span className="text-xs text-ayu-green flex items-center gap-1">
                    <Code className="w-3 h-3" />
                    JSON válido
                  </span>
                )}
                {!isJson && value.trim() && (
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Texto simples
                  </span>
                )}
                {isJson && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleFormatJson}
                    className="h-7 text-xs"
                  >
                    Formatar JSON
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              id="value"
              placeholder='{"key": "value"} ou texto simples'
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="min-h-[480px] font-mono text-sm resize-y"
            />
          </div>

          {editingEntry && (
            <div className="rounded-lg bg-secondary/50 p-4 space-y-2">
              <h4 className="text-sm font-medium text-foreground">Informações</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Versão:</span>
                  <span className="ml-2 text-foreground">{editingEntry.version}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Criação:</span>
                  <span className="ml-2 text-foreground font-mono">{editingEntry.createRevision}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Modificação:</span>
                  <span className="ml-2 text-foreground font-mono">{editingEntry.modRevision}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-card">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={!key.trim()}>
            <Save className="w-4 h-4" />
            Salvar
          </Button>
        </div>
      </div>
    </>
  );
}
