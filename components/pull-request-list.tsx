"use client";

import type { PullRequest } from "@/lib/data";
import {
  GitPullRequest,
  MessageSquare,
  Clock,
  GitMerge,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PullRequestListProps = {
  pullRequests: PullRequest[];
  filter: "all" | "open" | "merged" | "closed";
  onFilterChange: (filter: "all" | "open" | "merged" | "closed") => void;
};

export function PullRequestList({
  pullRequests,
  filter,
  onFilterChange,
}: PullRequestListProps) {
  const allCount = pullRequests.length;
  const openCount = pullRequests.filter(
    (pr) => pr.state === "open" && !pr.merged_at
  ).length;
  const mergedCount = pullRequests.filter((pr) => pr.merged_at).length;
  const closedCount = pullRequests.filter(
    (pr) => pr.state === "closed" && !pr.merged_at
  ).length;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/30">
        <Tabs
          value={filter}
          onValueChange={(v) =>
            onFilterChange(v as "all" | "open" | "merged" | "closed")
          }
        >
          <TabsList className="w-full rounded-none bg-transparent p-0 h-auto justify-start">
            <TabsTrigger
              value="all"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-3 py-2"
            >
              All ({allCount})
            </TabsTrigger>
            <TabsTrigger
              value="open"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-3 py-2"
            >
              Open ({openCount})
            </TabsTrigger>
            <TabsTrigger
              value="merged"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-3 py-2"
            >
              Merged ({mergedCount})
            </TabsTrigger>
            <TabsTrigger
              value="closed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-3 py-2"
            >
              Closed ({closedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {pullRequests.length === 0 ? (
        <div className="p-6 text-center">
          <GitPullRequest className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No {filter !== "all" ? filter : ""} pull requests
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-auto">
          {pullRequests.map((pr) => (
            <a
              key={pr.id}
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                {pr.draft ? (
                  <GitPullRequest className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                ) : pr.merged_at ? (
                  <GitMerge className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                ) : pr.state === "closed" ? (
                  <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                ) : (
                  <GitPullRequest className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2 text-pretty">
                    {pr.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span className="font-mono">#{pr.number}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(pr.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {pr.comments > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {pr.comments}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-6">
                {pr.draft && (
                  <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                    Draft
                  </Badge>
                )}
                {pr.merged_at && (
                  <Badge
                    variant="secondary"
                    className="text-xs px-2 py-0 h-5 bg-purple-500/20 text-purple-500"
                  >
                    Merged
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground font-mono">
                  {pr.head.ref} → {pr.base.ref}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
