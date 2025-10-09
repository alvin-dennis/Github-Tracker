"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, X } from "lucide-react";
import Image from "next/image";
import { RepoCard } from "@/components/repo-card";
import { REPOS, type Repository } from "@/lib/data";
import { ModeToggle } from "@/components/mode-toggle";

export default function Home() {
  const [repositories] = useState<Repository[]>(REPOS);
  const [searchQuery] = useState("");;

  const filteredRepos = repositories.filter((repo) =>
    repo.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/hficon.png"
                  alt="Hacktoberfest logo"
                  width={120}
                  height={60}
                  className="w-auto h-10 object-contain"
                  priority
                />
                <span className="text-lg font-semibold text-primary"><X /></span>
                <Image
                  src="/mulearnicon.png"
                  alt="MuLearn logo"
                  width={120}
                  height={60}
                  className="w-auto h-10 object-contain"
                  priority
                />
              </div>

              <Badge variant="secondary" className="font-mono text-xs">
                {repositories.length}{" "}
                {repositories.length === 1 ? "repo" : "repos"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))]">
          {filteredRepos.map((repo) => (
            <RepoCard key={repo.id} repository={repo} />
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
    </div>
  );
}
