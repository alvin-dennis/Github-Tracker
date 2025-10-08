export type Repository = {
  id: string
  owner: string
  name: string
  fullName: string
}

export type Issue = {
  id: number
  number: number
  title: string
  state: "open" | "closed"
  created_at: string
  updated_at: string
  user: {
    login: string
    avatar_url: string
  }
  labels: Array<{
    name: string
    color: string
  }>
  comments: number
  html_url: string
}

export type PullRequest = {
  id: number
  number: number
  title: string
  state: "open" | "closed"
  created_at: string
  updated_at: string
  user: {
    login: string
    avatar_url: string
  }
  draft: boolean
  merged_at: boolean
  comments: number
  html_url: string
  head: {
    ref: string
  }
  base: {
    ref: string
  }
}

export const REPOS: Repository[] = [
  {
    id: "1",
    owner: "gtech-mulearn",
    name: "mulearnhome",
    fullName: "Mulearn Home",
  },
  {
    id: "2",
    owner: "gtech-mulearn",
    name: "mulearnbackend",
    fullName: "Mulearn Backend",
  },
  {
    id: "3",
    owner: "The-Purple-Movement",
    name: "Beyond-Syllabus",
    fullName: "Beyond Syllabus",
  },
  {
    id: "4",
    owner: "The-Purple-Movement",
    name: "WikiSyllabus",
    fullName: "WikiSyllabus",
  },
  {
    id: "5",
    owner: "The-Purple-Movement",
    name: "techmyrmidons-web",
    fullName: "Techmyrmidons",
  },
  {
    id: "6",
    owner: "inovus-labs",
    name: "festive-js",
    fullName: "Festive-JS",
  },
];

