import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CommentProps {
  author: string
  avatarUrl: string
  content: string
  createdAt: string
}

export default function Comment({ author, avatarUrl, content, createdAt }: CommentProps) {
  return (
    <div className="flex space-x-4">
      <Avatar>
        <AvatarImage src={avatarUrl} alt={author} />
        <AvatarFallback>{author.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{author}</span>
            <span className="ml-2 text-sm text-muted-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="mt-2 text-sm">{content}</div>
      </div>
    </div>
  )
} 