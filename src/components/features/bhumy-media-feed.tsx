
'use client';

import {
  useCollection,
  useFirestore,
  useUser,
  useMemoFirebase,
} from '@/firebase';
import {
  collection,
  query,
  orderBy,
  Timestamp,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageCircle, Send, Loader2, Rss, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { WithId } from '@/firebase/firestore/use-collection';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { useState } from 'react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';

// Corresponds to Post and Comment entities in backend.json
type Post = {
  userId: string;
  username: string;
  userAvatarUrl?: string;
  content: string;
  imageUrl?: string;
  taggedNagarpalika: boolean;
  createdAt: Timestamp;
  likes: number;
};

type Comment = {
  userId: string;
  username: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: Timestamp;
};

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post cannot be empty.')
    .max(500, 'Post cannot exceed 500 characters.'),
  taggedNagarpalika: z.boolean().default(false),
});

type CreatePostForm = z.infer<typeof createPostSchema>;

function CreatePost() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CreatePostForm>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      taggedNagarpalika: false,
    },
  });

  const onSubmit = async (values: CreatePostForm) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);

    const newPost: Omit<Post, 'createdAt'> = {
      userId: user.uid,
      username: user.displayName || user.email || 'Anonymous',
      userAvatarUrl: user.photoURL || '',
      content: values.content,
      taggedNagarpalika: values.taggedNagarpalika,
      likes: 0,
      // No imageUrl for now
    };

    const postsCollection = collection(firestore, 'posts');
    await addDocumentNonBlocking(postsCollection, {
      ...newPost,
      createdAt: serverTimestamp(),
    });
    
    form.reset();
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-start gap-4">
              <Avatar className="h-10 w-10 border">
                <AvatarImage src={user?.photoURL ?? undefined} />
                <AvatarFallback>
                  {user?.displayName?.[0] ?? user?.email?.[0] ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Textarea
                        placeholder="What's happening in your neighborhood?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="taggedNagarpalika"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <Label htmlFor="taggedNagarpalika" className="flex items-center gap-2 cursor-pointer">
                        <AlertCircle className="h-4 w-4 text-yellow-600" />
                        Tag Nagarpalika (for issues)
                      </Label>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Post
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function CommentSection({ postId }: { postId: string }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const commentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'posts', postId, 'comments'),
      orderBy('createdAt', 'asc')
    );
  }, [firestore, postId]);

  const { data: comments, isLoading } = useCollection<Comment>(commentsQuery);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firestore || !user || !newComment.trim()) return;

    setIsSubmitting(true);
    const commentCollection = collection(firestore, 'posts', postId, 'comments');
    await addDocumentNonBlocking(commentCollection, {
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      userAvatarUrl: user.photoURL || '',
      content: newComment,
      createdAt: serverTimestamp(),
    });

    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4 pt-4">
      {isLoading && <Loader2 className="animate-spin" />}
      {comments?.map(comment => (
        <div key={comment.id} className="flex items-start gap-3">
          <Avatar className="h-8 w-8 border">
            <AvatarImage src={comment.userAvatarUrl} />
            <AvatarFallback>{comment.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 rounded-md bg-muted/50 p-3 text-sm">
            <p className="font-semibold">{comment.username}</p>
            <p>{comment.content}</p>
          </div>
        </div>
      ))}
       {user && (
         <form onSubmit={handleAddComment} className="flex items-center gap-2 pt-2">
            <Avatar className="h-8 w-8 border">
                <AvatarImage src={user.photoURL ?? undefined} />
                <AvatarFallback>{user.displayName?.[0] ?? 'U'}</AvatarFallback>
            </Avatar>
            <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                disabled={isSubmitting}
            />
            <Button type="submit" size="icon" variant="ghost" disabled={isSubmitting || !newComment.trim()}>
                <Send className="h-4 w-4" />
            </Button>
         </form>
       )}
    </div>
  );
}

function PostCard({ post }: { post: WithId<Post> }) {
  const [showComments, setShowComments] = useState(false);
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Avatar className="h-11 w-11 border">
            <AvatarImage src={post.userAvatarUrl} />
            <AvatarFallback>{post.username[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="font-semibold">{post.username}</p>
              <p className="text-xs text-muted-foreground">
                {post.createdAt &&
                  formatDistanceToNow(post.createdAt.toDate(), {
                    addSuffix: true,
                  })}
              </p>
            </div>
            <p className="mt-1">{post.content}</p>
            {post.imageUrl && (
              <div className="relative mt-3 aspect-video w-full overflow-hidden rounded-lg border">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  fill
                  className="object-cover"
                />
              </div>
            )}
            {post.taggedNagarpalika && (
                <div className="mt-3 flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-500 font-medium p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                    <AlertCircle className="h-4 w-4" />
                    Nagarpalika Tagged
                </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t pt-2">
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Heart className="h-4 w-4" /> {post.likes}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4" /> Comment
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <Send className="h-4 w-4" /> Share
          </Button>
        </div>
        {showComments && <CommentSection postId={post.id} />}
      </CardContent>
    </Card>
  );
}

export function BhumyMediaFeed() {
  const firestore = useFirestore();

  const postsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'posts'), orderBy('createdAt', 'desc'));
  }, [firestore]);

  const { data: posts, isLoading, error } = useCollection<Post>(postsQuery);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-muted-foreground">
          <Loader2 className="mb-2 h-8 w-8 animate-spin" />
          <p>Loading Bhumy Media feed...</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-destructive bg-destructive/10 p-8 text-center text-destructive-foreground">
          <p className='font-bold'>Error loading feed.</p>
          <p className="text-sm">{error.message}</p>
        </div>
      );
    }
    if (!posts || posts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center text-muted-foreground">
            <Rss className="mb-2 h-10 w-10"/>
            <p className="font-bold">The feed is quiet...</p>
            <p className="text-sm">Be the first to share an update!</p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {posts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <CreatePost />
      {renderContent()}
    </div>
  );
}

    