import React from 'react';
import type { BlogPost } from '../types.ts';

interface BlogPostCardProps {
  post: BlogPost;
  navigate: (page: string, context?: any) => void;
}

export const BlogPostCard: React.FC<BlogPostCardProps> = ({ post, navigate }) => {
  return (
    <div className="bg-light-gray rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl">
      <div className="overflow-hidden">
        <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-dark-text mb-2">{post.title}</h3>
        <p className="text-gray-600 flex-grow mb-4">{post.excerpt}</p>
        <div className="mt-auto">
          <button
            onClick={() => navigate('blog-post', { postId: post.id })}
            className="inline-block bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg shadow-sm hover:opacity-90 transition-opacity"
          >
            Read More
          </button>
        </div>
      </div>
    </div>
  );
};