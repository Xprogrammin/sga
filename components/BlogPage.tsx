import React, { useState, useMemo, useEffect } from 'react';
import { blogPosts } from '../constants.tsx';
import { BlogPostCard } from './BlogPostCard.tsx';
import { Pagination } from './Pagination.tsx';
import { SearchIcon } from './icons.tsx';

interface BlogPageProps {
    navigate: (page: string, context?: any) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ navigate }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const postsPerPage = 6;

    const filteredPosts = useMemo(() => {
        if (!searchQuery.trim()) {
            return blogPosts;
        }
        return blogPosts.filter(post =>
            post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery]);

    // Reset page to 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="pt-20 bg-white">
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-4xl md:text-6xl font-poppins font-bold text-gray-900 leading-tight">
                            Latest Insights from <span className="text-primary-blue">Our Blog</span>
                        </h1>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-12 max-w-2xl mx-auto">
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <SearchIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search articles by title or keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-blue/50"
                                aria-label="Search blog posts"
                            />
                        </div>
                    </div>

                    {currentPosts.length > 0 ? (
                        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {currentPosts.map((post) => (
                                <BlogPostCard key={post.id} post={post} navigate={navigate} />
                            ))}
                        </div>
                    ) : (
                        <div className="mt-16 text-center text-gray-500 bg-light-gray p-8 rounded-2xl">
                            <h3 className="text-xl font-bold text-gray-800">No Articles Found</h3>
                            <p className="mt-2">We couldn't find any articles matching your search for "{searchQuery}". Try another keyword.</p>
                        </div>
                    )}


                    {totalPages > 1 && (
                        <div className="mt-16">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};
