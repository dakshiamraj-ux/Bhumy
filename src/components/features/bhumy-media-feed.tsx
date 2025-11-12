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
import {
  Heart,
  MessageCircle,
  Send,
  Loader2,
  Rss,
  AlertCircle,
  CheckCircle,
  XCircle,
  Info,
  Wrench,
  Plus,
  Image as ImageIcon,
  X,
} from 'lucide-react';
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
  FormLabel,
} from '@/components/ui/form';
import { Input } from '../ui/input';
import { useState, useRef } from 'react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import Image from 'next/image';
import { Checkbox } from '../ui/checkbox';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';


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
  condition: 'Clean' | 'Full' | 'Overflowing' | 'Damaged';
};

type Comment = {
  userId: string;
  username: string;
  userAvatarUrl?: string;
  content: string;
  createdAt: Timestamp;
};

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const createPostSchema = z.object({
  content: z
    .string()
    .min(1, 'Post cannot be empty.')
    .max(500, 'Post cannot exceed 500 characters.'),
  condition: z.enum(['Clean', 'Full', 'Overflowing', 'Damaged'], {
    required_error: 'You must select a condition.',
  }),
  taggedNagarpalika: z.boolean().default(false),
  image: z
    .any()
    .refine((file) => !file || file.size <= MAX_FILE_SIZE, `Max image size is 4MB.`)
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ).optional(),
});

type CreatePostFormValues = z.infer<typeof createPostSchema>;

const conditionOptions = {
    Clean: { icon: CheckCircle, color: 'text-green-600', label: 'Clean' },
    Full: { icon: Info, color: 'text-yellow-600', label: 'Full' },
    Overflowing: { icon: XCircle, color: 'text-red-600', label: 'Overflowing' },
    Damaged: { icon: Wrench, color: 'text-orange-600', label: 'Damaged' },
};


function CreatePostDialog() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const form = useForm<CreatePostFormValues>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      content: '',
      condition: undefined,
      taggedNagarpalika: false,
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const resetForm = () => {
    form.reset();
    setImagePreview(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  }


  const onSubmit = async (values: CreatePostFormValues) => {
    if (!firestore || !user) return;
    setIsSubmitting(true);

    const newPost: Omit<Post, 'createdAt'> & {imageUrl?: string} = {
      userId: user.uid,
      username: user.displayName || user.email || 'Anonymous',
      userAvatarUrl: user.photoURL || '',
      content: values.content,
      taggedNagarpalika: values.taggedNagarpalika,
      likes: 0,
      condition: values.condition,
    };
    
    if (imagePreview) {
        newPost.imageUrl = imagePreview;
    }


    const postsCollection = collection(firestore, 'posts');
    await addDocumentNonBlocking(postsCollection, {
      ...newPost,
      createdAt: serverTimestamp(),
    });
    
    resetForm();
    setIsSubmitting(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            resetForm();
        }
    }}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-24 right-6 h-16 w-16 rounded-full shadow-lg z-20 md:bottom-8 md:right-8">
            <Plus className="h-8 w-8" />
            <span className="sr-only">Report Waste</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Report Waste in Your Area</DialogTitle>
          <DialogDescription>
            Help your community by reporting the status of local waste bins.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., The bin near the park entrance is overflowing..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                   <FormLabel>Photo</FormLabel>
                   <FormControl>
                        <div 
                            className="relative flex justify-center items-center h-48 w-full border-2 border-dashed rounded-lg cursor-pointer hover:border-primary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="hidden"
                                accept="image/*"
                            />
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover rounded-md" />
                                     <Button 
                                        variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6 z-10"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImagePreview(null);
                                            form.setValue('image', null);
                                            if(fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        >
                                            <X className="h-4 w-4"/>
                                    </Button>
                                </>
                            ) : (
                                <div className="text-center text-muted-foreground">
                                    <ImageIcon className="mx-auto h-8 w-8" />
                                    <p className="text-sm mt-2">Click to upload a photo</p>
                                </div>
                            )}
                        </div>
                   </FormControl>
                   <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="condition"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condition</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the bin's condition" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(conditionOptions).map(([key, {icon: Icon, color, label}]) => (
                        <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                                <Icon className={`h-4 w-4 ${color}`} />
                                <span>{label}</span>
                            </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="taggedNagarpalika"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Tag Municipal Authority</FormLabel>
                    <FormMessage />
                  </div>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Post Report
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
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
  const ConditionIcon = conditionOptions[post.condition]?.icon || Info;
  const conditionColor = conditionOptions[post.condition]?.color || 'text-gray-500';

  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4">
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
                <div className={`flex items-center gap-1.5 text-sm font-medium ${conditionColor}`}>
                    <ConditionIcon className="h-4 w-4"/>
                    <span>{post.condition}</span>
                </div>
              </div>
            </div>
            <p className="mt-3">{post.content}</p>
            {post.taggedNagarpalika && (
                <div className="mt-3 flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-500 font-medium p-2 rounded-md bg-yellow-500/10 border border-yellow-500/20">
                    <AlertCircle className="h-4 w-4" />
                    Municipal Authority Tagged
                </div>
            )}
        </div>
        {post.imageUrl && (
              <div className="relative mt-0 aspect-square w-full overflow-hidden border-y">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  fill
                  className="object-cover"
                />
              </div>
        )}
        <div className="flex items-center justify-between border-t px-2">
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
        {showComments && 
            <div className="p-4 border-t">
                <CommentSection postId={post.id} />
            </div>
        }
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
            <p className="text-sm">Be the first to report a waste issue!</p>
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
    <div className="mx-auto max-w-2xl space-y-6 pb-24">
      {renderContent()}
      <CreatePostDialog />
    </div>
  );
}
