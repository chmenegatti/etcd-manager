"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { KeyValueTable } from "@/components/KeyValueTable";
import { KeyValueDrawer } from "@/components/KeyValueDrawer";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { EtcdEntry, ConnectionStatus } from "@/types/etcd";
import { toast } from "@/hooks/use-toast";
import { deleteKey, listKeys, upsertKey } from "@/lib/api";

const defaultEndpoint = process.env.NEXT_PUBLIC_ETCD_ENDPOINT ?? "127.0.0.1:2379";

export default function Page() {
  const [searchQuery, setSearchQuery] = useState("/");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EtcdEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<EtcdEntry | null>(null);
  const queryClient = useQueryClient();

  const connectionStatus: ConnectionStatus = {
    connected: true,
    endpoint: defaultEndpoint,
  };

  const { data: entries = [], isFetching, refetch } = useQuery({
    queryKey: ["entries", searchQuery],
    queryFn: () => listKeys(searchQuery || "/"),
    retry: 1,
  });

  const upsertMutation = useMutation({
    mutationFn: ({ key, value }: { key: string; value: string }) => upsertKey(key, value),
    onSuccess: (item) => {
      toast({ title: "Chave salva", description: `A chave ${item.key} foi salva.` });
      setEditingEntry(item);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao salvar", description: error?.message ?? "Falha ao salvar chave", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (key: string) => deleteKey(key),
    onSuccess: (_, key) => {
      toast({ title: "Chave deletada", description: `A chave ${key} foi removida.` });
      setDeletingEntry(null);
      queryClient.invalidateQueries({ queryKey: ["entries"] });
    },
    onError: (error: any) => {
      toast({ title: "Erro ao deletar", description: error?.message ?? "Falha ao deletar chave", variant: "destructive" });
    },
  });

  const filteredEntries = useMemo(() => entries, [entries]);

  const handleCreateClick = () => {
    setEditingEntry(null);
    setIsDrawerOpen(true);
  };

  const handleEditClick = (entry: EtcdEntry) => {
    setEditingEntry(entry);
    setIsDrawerOpen(true);
  };

  const handleDeleteClick = (entry: EtcdEntry) => {
    setDeletingEntry(entry);
  };

  const handleSave = (key: string, value: string) => {
    upsertMutation.mutate({ key, value });
  };

  const handleConfirmDelete = () => {
    if (deletingEntry) {
      deleteMutation.mutate(deletingEntry.key);
    }
  };

  const handleRefresh = async () => {
    await refetch();
    toast({ title: "Dados atualizados", description: "A lista de chaves foi recarregada." });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header connectionStatus={connectionStatus} />

      <Toolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={handleCreateClick}
        onRefresh={handleRefresh}
        totalKeys={entries.length}
        filteredKeys={filteredEntries.length}
      />

      <main className="flex-1 overflow-hidden">
        {isFetching ? (
          <div className="p-6 text-sm text-muted-foreground">Carregando chaves...</div>
        ) : upsertMutation.isError || deleteMutation.isError ? (
          <div className="p-6 text-sm text-destructive">
            Erro ao comunicar com o ETCD: {(upsertMutation.error as any)?.message || (deleteMutation.error as any)?.message || "verifique o backend"}
          </div>
        ) : (
          <KeyValueTable entries={filteredEntries} onEdit={handleEditClick} onDelete={handleDeleteClick} />
        )}
      </main>

      <KeyValueDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSave={handleSave}
        editingEntry={editingEntry}
      />

      <DeleteConfirmDialog
        entry={deletingEntry}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingEntry(null)}
      />
    </div>
  );
}
