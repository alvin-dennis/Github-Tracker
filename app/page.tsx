"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GitBranch, AlertCircle, Search, Plus } from "lucide-react";
import { RepoCard } from "@/components/repo-card";
import { AddRepoDialog } from "@/components/add-repo-dialog";
import { REPOS, type Repository } from "@/lib/data";
import { ModeToggle } from "@/components/mode-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const [repositories, setRepositories] = useState<Repository[]>(REPOS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [repoToDelete, setRepoToDelete] = useState<string | null>(null);

  const filteredRepos = repositories.filter((repo) =>
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddRepo = (owner: string, name: string) => {
    const newRepo: Repository = {
      id: Date.now().toString(),
      owner,
      name,
      fullName: `${owner}/${name}`,
    };
    setRepositories([...repositories, newRepo]);
    setIsAddDialogOpen(false);
  };

  const handleRemoveRepo = (id: string) => {
    setRepoToDelete(id);
  };

  const confirmRemoveRepo = () => {
    if (repoToDelete) {
      setRepositories(repositories.filter((repo) => repo.id !== repoToDelete));
      setRepoToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <GitBranch className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-semibold text-foreground">
                  GitHub Tracker
                </h1>
              </div>
              <Badge variant="secondary" className="font-mono text-xs">
                {repositories.length}{" "}
                {repositories.length === 1 ? "repo" : "repos"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                size="sm"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Repository
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <div className="relative max-w-md items-center justify-center">
            <Search className="absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search repositories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>
        </div>

        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))]">
          {filteredRepos.map((repo) => (
            <RepoCard
              key={repo.id}
              repository={repo}
              onRemove={() => handleRemoveRepo(repo.id)}
            />
          ))}
        </div>

        {filteredRepos.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No repositories found
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? "Try a different search term"
                : "Add a repository to get started"}
            </p>
          </div>
        )}
      </div>

      <AddRepoDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAdd={handleAddRepo}
      />

      <AlertDialog
        open={repoToDelete !== null}
        onOpenChange={(open) => !open && setRepoToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the repository from your tracker. You can always
              add it back later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRemoveRepo}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
