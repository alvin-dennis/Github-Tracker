"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GitPullRequest,
  Circle,
  AlertCircle,
  X,
  ExternalLink,
} from "lucide-react";
import type { Repository, Issue, PullRequest } from "@/lib/data";
import { IssueList } from "@/components/issue-list";
import { PullRequestList } from "@/components/pull-request-list";

type RepoCardProps = {
  repository: Repository;
  onRemove: () => void;
};

export function RepoCard({ repository, onRemove }: RepoCardProps) {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [pullRequests, setPullRequests] = useState<PullRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [issueFilter, setIssueFilter] = useState<"all" | "open" | "closed">(
    "all"
  );
  const [prFilter, setPrFilter] = useState<
    "all" | "open" | "merged" | "closed"
  >("all");

  useEffect(() => {
    fetchData();
  }, [repository.fullName]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [openIssuesRes, closedIssuesRes, openPrsRes, closedPrsRes] =
        await Promise.all([
          fetch(
            `/api/github/${repository.owner}/${repository.name}?type=issues&state=open`
          ),
          fetch(
            `/api/github/${repository.owner}/${repository.name}?type=issues&state=closed`
          ),
          fetch(
            `/api/github/${repository.owner}/${repository.name}?type=pulls&state=open`
          ),
          fetch(
            `/api/github/${repository.owner}/${repository.name}?type=pulls&state=closed`
          ),
        ]);

      if (
        !openIssuesRes.ok ||
        !closedIssuesRes.ok ||
        !openPrsRes.ok ||
        !closedPrsRes.ok
      ) {
        const errorRes = [
          openIssuesRes,
          closedIssuesRes,
          openPrsRes,
          closedPrsRes,
        ].find((res) => !res.ok);
        const errorData = errorRes ? await errorRes.json() : null;
        throw new Error(errorData?.error || "Failed to fetch data");
      }

      const openIssuesData = await openIssuesRes.json();
      const closedIssuesData = await closedIssuesRes.json();
      const openPrsData = await openPrsRes.json();
      const closedPrsData = await closedPrsRes.json();

      const actualOpenIssues = openIssuesData.filter(
        (issue: Issue) => !issue.html_url.includes("/pull/")
      );
      const actualClosedIssues = closedIssuesData.filter(
        (issue: Issue) => !issue.html_url.includes("/pull/")
      );

      const hacktoberfestOpenIssues = actualOpenIssues.filter((issue: Issue) =>
        issue.labels.some(
          (label) =>
            label.name.toLowerCase() === "hacktoberfest" ||
            label.name.toLowerCase() === "hacktoberfest-mulearn"
        )
      );

      const hacktoberfestClosedIssues = actualClosedIssues.filter(
        (issue: Issue) =>
          issue.labels.some(
            (label) =>
              label.name.toLowerCase() === "hacktoberfest" ||
              label.name.toLowerCase() === "hacktoberfest-mulearn"
          )
      );

      const octoberPRs = [...openPrsData, ...closedPrsData]
        .map((pr: PullRequest) => ({
          ...pr,
          merged: pr.merged_at !== null && pr.merged_at !== undefined,
        }))
        .filter((pr) => {
          const createdDate = new Date(pr.created_at);
          const year = createdDate.getFullYear();
          const month = createdDate.getMonth();
          return year === 2025 && month === 9;
        });

      setIssues([...hacktoberfestOpenIssues, ...hacktoberfestClosedIssues]);
      setPullRequests(octoberPRs);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load data";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const filteredIssues = issues.filter((issue) => {
    if (issueFilter === "all") return true;
    return issue.state === issueFilter;
  });

  const filteredPRs = pullRequests.filter((pr) => {
    if (prFilter === "all") return true;
    if (prFilter === "merged") return pr.merged_at;
    if (prFilter === "closed") return pr.state === "closed" && !pr.merged_at;
    return pr.state === prFilter && !pr.merged_at;
  });

  const openIssuesCount = issues.filter((i) => i.state === "open").length;
  const closedIssuesCount = issues.filter((i) => i.state === "closed").length;
  const openPRsCount = pullRequests.filter(
    (pr) => pr.state === "open" && !pr.merged_at
  ).length;
  const mergedPRsCount = pullRequests.filter((pr) => pr.merged_at).length;
  const closedPRsCount = pullRequests.filter(
    (pr) => pr.state === "closed" && !pr.merged_at
  ).length;

  return (
    <Card className="bg-card border-border overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-border bg-card/50">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <a
              href={`https://github.com/${repository.fullName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-mono text-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
            >
              <span className="truncate">{repository.fullName}</span>
              <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
            </a>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Remove repository"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Circle className="h-3 w-3 text-success fill-success" />
            <span className="text-muted-foreground">
              {openIssuesCount} open / {closedIssuesCount} closed
            </span>
            <span className="text-muted-foreground/60 text-[10px]">
              (hacktoberfest)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <GitPullRequest className="h-3 w-3 text-primary" />
            <span className="text-muted-foreground">
              {openPRsCount} open / {mergedPRsCount} merged / {closedPRsCount}{" "}
              closed
            </span>
            <span className="text-muted-foreground/60 text-[10px]">
              (Oct 2025)
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            <p className="text-sm text-muted-foreground mt-2">Loading...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center">
            <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              className="mt-3 bg-transparent"
            >
              Retry
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="issues" className="h-full flex flex-col">
            <TabsList className="w-full rounded-none border-b border-border bg-transparent p-0 h-auto">
              <TabsTrigger
                value="issues"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Issues
              </TabsTrigger>
              <TabsTrigger
                value="prs"
                className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
              >
                Pull Requests
              </TabsTrigger>
            </TabsList>
            <TabsContent value="issues" className="flex-1 overflow-auto m-0">
              <IssueList
                issues={filteredIssues}
                filter={issueFilter}
                onFilterChange={setIssueFilter}
              />
            </TabsContent>
            <TabsContent value="prs" className="flex-1 overflow-auto m-0">
              <PullRequestList
                pullRequests={filteredPRs}
                filter={prFilter}
                onFilterChange={setPrFilter}
              />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </Card>
  );
}
