import { useState, useMemo } from "react";
import { Header } from "@/components/Header";
import { Toolbar } from "@/components/Toolbar";
import { KeyValueTable } from "@/components/KeyValueTable";
import { KeyValueDrawer } from "@/components/KeyValueDrawer";
import { DeleteConfirmDialog } from "@/components/DeleteConfirmDialog";
import { mockEtcdData } from "@/data/mockData";
import { EtcdEntry, ConnectionStatus } from "@/types/etcd";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const [entries, setEntries] = useState<EtcdEntry[]>(mockEtcdData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EtcdEntry | null>(null);
  const [deletingEntry, setDeletingEntry] = useState<EtcdEntry | null>(null);

  const connectionStatus: ConnectionStatus = {
    connected: true,
    endpoint: "127.0.0.1:2379",
  };

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter((entry) =>
      entry.key.toLowerCase().includes(query)
    );
  }, [entries, searchQuery]);

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
    if (editingEntry) {
      // Update existing entry
      setEntries((prev) =>
        prev.map((e) =>
          e.key === key
            ? {
                ...e,
                value,
                version: e.version + 1,
                modRevision: e.modRevision + 1,
              }
            : e
        )
      );
      toast({
        title: "Chave atualizada",
        description: `A chave ${key} foi atualizada com sucesso.`,
      });
    } else {
      // Create new entry
      const newEntry: EtcdEntry = {
        key,
        value,
        version: 1,
        createRevision: Date.now(),
        modRevision: Date.now(),
      };
      setEntries((prev) => [newEntry, ...prev]);
      toast({
        title: "Chave criada",
        description: `A chave ${key} foi criada com sucesso.`,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (deletingEntry) {
      setEntries((prev) => prev.filter((e) => e.key !== deletingEntry.key));
      toast({
        title: "Chave deletada",
        description: `A chave ${deletingEntry.key} foi removida.`,
        variant: "destructive",
      });
      setDeletingEntry(null);
    }
  };

  const handleRefresh = () => {
    setEntries(mockEtcdData);
    setSearchQuery("");
    toast({
      title: "Dados atualizados",
      description: "A lista de chaves foi recarregada.",
    });
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
        <KeyValueTable
          entries={filteredEntries}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
        />
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
};

export default Index;
