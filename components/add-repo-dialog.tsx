"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type AddRepoDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (owner: string, name: string) => void;
};

export function AddRepoDialog({
  open,
  onOpenChange,
  onAdd,
}: AddRepoDialogProps) {
  const [owner, setOwner] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (owner.trim() && name.trim()) {
      onAdd(owner.trim(), name.trim());
      setOwner("");
      setName("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Add Repository</DialogTitle>
          <DialogDescription>
            Enter the owner and repository name to track issues and pull
            requests.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                placeholder="vercel"
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Repository Name</Label>
              <Input
                id="name"
                placeholder="next.js"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-background border-border"
              />
            </div>
            <div className="text-xs text-muted-foreground">
              Example: owner = &quot;vercel&quot;, name = &quot;next.js&quot;
              for vercel/next.js
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!owner.trim() || !name.trim()}>
              Add Repository
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
