import { Pencil, Trash2, Copy, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EtcdEntry } from "@/types/etcd";
import { toast } from "@/hooks/use-toast";

interface KeyValueTableProps {
  entries: EtcdEntry[];
  onEdit: (entry: EtcdEntry) => void;
  onDelete: (entry: EtcdEntry) => void;
}

function truncateValue(value: string, maxLength: number = 50): string {
  if (value.length <= maxLength) return value;
  return value.slice(0, maxLength) + "...";
}

function isJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function KeyValueTable({ entries, onEdit, onDelete }: KeyValueTableProps) {
  const copyToClipboard = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copiado!",
      description: `${label} copiado para a área de transferência`,
    });
  };

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <ChevronRight className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Nenhuma chave encontrada
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Não há chaves correspondentes à sua busca. Tente um termo diferente ou crie uma nova chave.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
              Chave
            </th>
            <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4">
              Valor
            </th>
            <th className="text-center text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 w-24">
              Versão
            </th>
            <th className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-4 w-32">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {entries.map((entry) => (
            <tr
              key={entry.key}
              className="group hover:bg-secondary/30 transition-colors duration-150"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code className="text-sm font-mono text-primary break-all">
                    {entry.key}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(entry.key, "Chave")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <code
                    className={`text-sm font-mono ${
                      isJson(entry.value)
                        ? "text-ayu-blue"
                        : "text-muted-foreground"
                    }`}
                  >
                    {truncateValue(entry.value.replace(/\n/g, " "))}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(entry.value, "Valor")}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                  v{entry.version}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="icon"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(entry)}
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="icon"
                    size="icon"
                    className="h-8 w-8 hover:text-destructive"
                    onClick={() => onDelete(entry)}
                    title="Deletar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
