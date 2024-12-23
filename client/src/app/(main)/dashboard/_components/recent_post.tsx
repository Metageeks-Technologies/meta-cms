import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const trendingPosts = [
  {
    id: 1,
    title: "How to Build a Blog with Next.js",
    author: "Olivia Martin",
    authorEmail: "olivia.martin@email.com",
    avatarSrc: "/avatars/01.png",
    likes: 250,
    summary: "In this post, we'll walk you through how to set up a full-featured blog with Next.js.",
    date: "2024-12-05",
  },
  {
    id: 2,
    title: "Mastering React for Beginners",
    author: "Jackson Lee",
    authorEmail: "jackson.lee@email.com",
    avatarSrc: "/avatars/02.png",
    likes: 220,
    summary: "A comprehensive guide to mastering React and building modern web apps with it.",
    date: "2024-11-28",
  },
  {
    id: 3,
    title: "Understanding Typescript in 2024",
    author: "Isabella Nguyen",
    authorEmail: "isabella.nguyen@email.com",
    avatarSrc: "/avatars/03.png",
    likes: 180,
    summary: "This post covers the essentials of TypeScript and why it's a great tool for developers in 2024.",
    date: "2024-11-20",
  },
];

export function TrendingPosts() {
  return (
    <div className="space-y-8 ">
      {/* Trending Posts Section */}
      {trendingPosts.map((post) => (
        <div key={post.id} className="flex items-center space-x-4 p-3 border-b border-gray-800 hover:transition-all">
          <Avatar className="h-14 w-14">
            <AvatarImage src={post.avatarSrc} alt={`Avatar of ${post.author}`} />
            <AvatarFallback>{post.author[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold">{post.title}</h3>
            <p className="text-sm text-muted-foreground">{post.summary}</p>
            <p className="text-xs text-gray-500">
              By {post.author} · {post.date}
            </p>
            <div className="flex items-center justify-between text-sm font-medium">
              <span className="text-green-600">Likes: {post.likes}</span>
              <a href={`mailto:${post.authorEmail}`} className="text-blue-500 hover:underline">
Contact Author              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
