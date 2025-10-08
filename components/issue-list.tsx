"use client";

import type { Issue } from "@/lib/data";
import { Circle, MessageSquare, Clock, CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type IssueListProps = {
  issues: Issue[];
  filter: "all" | "open" | "closed";
  onFilterChange: (filter: "all" | "open" | "closed") => void;
};

export function IssueList({ issues, filter, onFilterChange }: IssueListProps) {
  const allCount = issues.length;
  const openCount = issues.filter((i) => i.state === "open").length;
  const closedCount = issues.filter((i) => i.state === "closed").length;

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border bg-card/30">
        <Tabs
          value={filter}
          onValueChange={(v) => onFilterChange(v as "all" | "open" | "closed")}
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
              value="closed"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent text-xs px-3 py-2"
            >
              Closed ({closedCount})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {issues.length === 0 ? (
        <div className="p-6 text-center">
          <Circle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No {filter !== "all" ? filter : ""} issues
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-auto">
          {issues.map((issue) => (
            <a
              key={issue.id}
              href={issue.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3 hover:bg-accent/50 transition-colors"
            >
              <div className="flex items-start gap-2 mb-2">
                {issue.state === "open" ? (
                  <Circle className="h-4 w-4 text-success fill-success mt-0.5 flex-shrink-0" />
                ) : (
                  <CircleX className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground mb-1 line-clamp-2 text-pretty">
                    {issue.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <span className="font-mono">#{issue.number}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(issue.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                    {issue.comments > 0 && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          {issue.comments}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              {issue.labels.length > 0 && (
                <div className="flex items-center gap-1 ml-6 flex-wrap">
                  {issue.labels.slice(0, 3).map((label) => (
                    <Badge
                      key={label.name}
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5"
                      style={{
                        backgroundColor: `#${label.color}20`,
                        color: `#${label.color}`,
                        borderColor: `#${label.color}40`,
                      }}
                    >
                      {label.name}
                    </Badge>
                  ))}
                  {issue.labels.length > 3 && (
                    <Badge
                      variant="secondary"
                      className="text-xs px-2 py-0 h-5"
                    >
                      +{issue.labels.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
