import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { CreatePost } from '@/components/posts/CreatePost';
import { PostCard, Post } from '@/components/posts/PostCard';
import { EditPostDialog } from '@/components/posts/EditPostDialog';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchPosts();
    }
  }, [user]);

  const fetchPosts = async () => {
    try {
      // Get all posts first
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Get all unique user IDs from posts
      const userIds = [...new Set(postsData.map(post => post.user_id))];
      
      // Get profiles for all users
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Create profile lookup map
      const profileMap = new Map();
      (profilesData || []).forEach(profile => {
        profileMap.set(profile.user_id, profile);
      });

      // Get all post IDs
      const postIds = postsData.map(post => post.id);
      
      // Get likes and comments for all posts
      const [likesResult, commentsResult] = await Promise.all([
        supabase
          .from('likes')
          .select('*')
          .in('post_id', postIds),
        supabase
          .from('comments')
          .select('*')
          .in('post_id', postIds)
          .order('created_at', { ascending: true })
      ]);

      // Get comment user profiles
      const commentUserIds = [...new Set((commentsResult.data || []).map(comment => comment.user_id))];
      const { data: commentProfilesData } = await supabase
        .from('profiles')
        .select('*')
        .in('user_id', commentUserIds);

      const commentProfileMap = new Map();
      (commentProfilesData || []).forEach(profile => {
        commentProfileMap.set(profile.user_id, profile);
      });

      // Combine everything
      const postsWithDetails: Post[] = postsData.map(post => ({
        ...post,
        profiles: profileMap.get(post.user_id) || null,
        likes: (likesResult.data || []).filter(like => like.post_id === post.id),
        comments: (commentsResult.data || [])
          .filter(comment => comment.post_id === post.id)
          .map(comment => ({
            ...comment,
            profiles: commentProfileMap.get(comment.user_id) || null
          }))
      }));

      setPosts(postsWithDetails);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePostDelete = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <CreatePost onPostCreated={fetchPosts} />
          
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No posts yet. Be the first to share something!</p>
                </div>
              ) : (
                posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onPostUpdate={fetchPosts}
                    onPostDelete={handlePostDelete}
                    onEdit={setEditingPost}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <EditPostDialog
        post={editingPost}
        open={!!editingPost}
        onOpenChange={(open) => !open && setEditingPost(null)}
        onPostUpdated={fetchPosts}
      />
    </div>
  );
};

export default Index;
