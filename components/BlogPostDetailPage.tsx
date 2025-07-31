import React, { useState, useEffect, FormEvent } from 'react';
import { blogPosts, blogComments } from '../constants.tsx';
import { ArrowLeftIcon, CalendarIcon, UsersIcon } from './icons.tsx';
import type { Comment } from '../types.ts';
import { CallToAction } from './CallToAction.tsx';

interface BlogPostDetailPageProps {
    postId: number;
    navigate: (page: string, context?: any) => void;
}

const CommentCard: React.FC<{ comment: Comment }> = ({ comment }) => {
    return (
        <div className="flex items-start gap-4">
            <img src={comment.avatarUrl} alt={comment.author} className="w-10 h-10 rounded-full object-cover" />
            <div className="flex-1">
                <div className="flex items-baseline gap-2">
                    <p className="font-bold text-gray-900">{comment.author}</p>
                    <p className="text-xs text-gray-500">{comment.date}</p>
                </div>
                <p className="text-gray-700 mt-1">{comment.text}</p>
                
                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4 pl-4 border-l-2 border-gray-200 space-y-4">
                        {comment.replies.map(reply => <CommentCard key={reply.id} comment={reply} />)}
                    </div>
                )}
            </div>
        </div>
    );
};


export const BlogPostDetailPage: React.FC<BlogPostDetailPageProps> = ({ postId, navigate }) => {
    const postIndex = blogPosts.findIndex(p => p.id === postId);
    const post = blogPosts[postIndex];

    const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
    const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;
    
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState({ author: '', text: '' });
    const [formError, setFormError] = useState('');

    useEffect(() => {
        setComments(blogComments.filter(c => c.postId === postId));
    }, [postId]);

    useEffect(() => {
        // Cleanup function for when the component unmounts or post changes
        const cleanup = () => {
            const scriptToRemove = document.getElementById('blog-post-schema');
            if (scriptToRemove) {
                scriptToRemove.remove();
            }
        };

        if (post) {
            cleanup(); // Clean up any previous script first

            const schema = {
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "mainEntityOfPage": {
                    "@type": "WebPage",
                    "@id": window.location.href
                },
                "headline": post.title,
                "description": post.excerpt,
                "image": post.imageUrl, // Unsplash URLs are absolute
                "author": {
                    "@type": "Organization",
                    "name": "Catazet Insights"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Catazet",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://www.catazet.com/assets/logo/Catazetlogomain.png"
                    }
                },
                "datePublished": post.date,
                "dateModified": post.date // Assuming no modified date is available
            };

            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.id = 'blog-post-schema';
            script.innerHTML = JSON.stringify(schema);
            
            document.head.appendChild(script);
        }

        return cleanup;
    }, [post]);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setNewComment({ ...newComment, [e.target.name]: e.target.value });
    };

    const handleAddComment = (e: FormEvent) => {
        e.preventDefault();
        if (!newComment.author.trim() || !newComment.text.trim()) {
            setFormError('Both name and comment are required.');
            return;
        }
        
        const commentToAdd: Comment = {
            id: Date.now(),
            postId,
            author: newComment.author,
            text: newComment.text,
            date: new Date().toISOString().split('T')[0],
            avatarUrl: `https://i.pravatar.cc/150?u=${newComment.author}`,
            replies: []
        };
        setComments(prev => [...prev, commentToAdd]);
        setNewComment({ author: '', text: '' });
        setFormError('');
    };


    if (!post) {
        return (
            <div className="pt-20 bg-light-gray min-h-screen flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Post not found.</h2>
                    <button onClick={() => navigate('blog')} className="mt-4 bg-primary-blue text-white font-semibold py-2 px-6 rounded-lg">
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="pt-20 bg-white">
            <div className="container mx-auto px-6 py-12 lg:py-20">
                <div className="max-w-3xl mx-auto">
                    {/* Back to Blog Link */}
                    <div className="mb-8">
                        <button onClick={() => navigate('blog')} className="flex items-center gap-2 text-primary-blue font-semibold hover:underline">
                            <ArrowLeftIcon className="w-5 h-5" />
                            <span>Back to Blog</span>
                        </button>
                    </div>

                    {/* Post Header */}
                    <header className="mb-8 text-center">
                        <span className="text-primary-blue font-semibold text-sm uppercase">{post.category}</span>
                        <h1 className="text-3xl md:text-5xl font-poppins font-bold text-gray-900 mt-2">{post.title}</h1>
                        <div className="flex items-center justify-center gap-6 mt-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{post.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <UsersIcon className="w-4 h-4" />
                                <span>by {post.author}</span>
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    <img src={post.imageUrl} alt={post.title} className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-lg mb-8" />

                    {/* Post Content */}
                    <article className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                        {post.content.split('\n\n').map((block, index) => {
                            if (block.startsWith('### ')) {
                                return <h3 key={index} className="!text-3xl !font-poppins !font-bold !mt-12 !mb-4">{block.substring(4)}</h3>;
                            }
                            return <p key={index}>{block}</p>;
                        })}
                    </article>

                    {/* Comments Section */}
                    <div className="mt-16 pt-8 border-t border-gray-200">
                        <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-6">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h2>
                        <div className="space-y-8">
                            {comments.map(comment => <CommentCard key={comment.id} comment={comment} />)}
                        </div>
                    </div>
                    
                    {/* Comment Form */}
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <h3 className="text-2xl font-poppins font-bold text-gray-900 mb-4">Leave a Comment</h3>
                        <form onSubmit={handleAddComment} className="bg-light-gray p-6 rounded-2xl space-y-4">
                            <div>
                                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input type="text" id="author" name="author" value={newComment.author} onChange={handleCommentChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50" />
                            </div>
                            <div>
                                <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-1">Your Comment</label>
                                <textarea id="text" name="text" rows={4} value={newComment.text} onChange={handleCommentChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/50"></textarea>
                            </div>
                             {formError && <p className="text-red-500 text-sm">{formError}</p>}
                            <div>
                                <button type="submit" className="bg-primary-blue text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:opacity-90 transition-opacity">
                                    Post Comment
                                </button>
                            </div>
                        </form>
                    </div>
                    
                    {/* Post Navigation */}
                    <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex-1 min-w-[200px]">
                            {prevPost && (
                                <button onClick={() => navigate('blog-post', { postId: prevPost.id })} className="text-left group w-full p-4 rounded-lg hover:bg-light-gray transition-colors">
                                    <p className="text-xs text-gray-500">Previous Post</p>
                                    <p className="font-semibold text-primary-blue group-hover:underline truncate">{prevPost.title}</p>
                                </button>
                            )}
                        </div>
                         <div className="flex-1 min-w-[200px]">
                            {nextPost && (
                                <button onClick={() => navigate('blog-post', { postId: nextPost.id })} className="text-right group w-full p-4 rounded-lg hover:bg-light-gray transition-colors">
                                    <p className="text-xs text-gray-500">Next Post</p>
                                    <p className="font-semibold text-primary-blue group-hover:underline truncate">{nextPost.title}</p>
                                </button>
                            )}
                        </div>
                    </div>
                    
                    <CallToAction navigate={navigate} />
                </div>
            </div>
        </div>
    );
}