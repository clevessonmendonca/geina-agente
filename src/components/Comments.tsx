import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircle, Send, ThumbsUp, Reply } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: string;
  authorAvatar: string;
  date: string;
  likes: number;
  replies: Comment[];
  isLiked?: boolean;
}

interface CommentsProps {
  comments: Comment[];
  onAddComment: (content: string) => void;
  onLikeComment: (commentId: string) => void;
  onReply: (commentId: string, content: string) => void;
}

const Comments: React.FC<CommentsProps> = ({
  comments,
  onAddComment,
  onLikeComment,
  onReply
}) => {
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const handleSubmitReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReply(commentId, replyContent.trim());
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora mesmo';
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return 'Ontem';
    return date.toLocaleDateString('pt-BR');
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-caixa-blue rounded-full flex items-center justify-center text-caixa-white font-semibold text-sm">
            {comment.author.charAt(0)}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-50 rounded-caixa-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-caixa-black">{comment.author}</span>
                <span className="text-xs text-caixa-gray">{formatDate(comment.date)}</span>
              </div>
            </div>
            
            <p className="text-caixa-black mb-3">{comment.content}</p>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onLikeComment(comment.id)}
                className={`flex items-center space-x-1 text-sm transition-colors duration-200 ${
                  comment.isLiked 
                    ? 'text-caixa-blue' 
                    : 'text-caixa-gray hover:text-caixa-blue'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                <span>{comment.likes}</span>
              </button>
              
              {!isReply && (
                <button
                  onClick={() => setReplyingTo(comment.id)}
                  className="flex items-center space-x-1 text-sm text-caixa-gray hover:text-caixa-blue transition-colors duration-200"
                >
                  <Reply className="w-4 h-4" />
                  <span>Responder</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Formulário de resposta */}
          {replyingTo === comment.id && (
            <div className="mt-3">
              <form onSubmit={(e) => { e.preventDefault(); handleSubmitReply(comment.id); }}>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Escreva uma resposta..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-caixa focus:outline-none focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!replyContent.trim()}
                    className="px-4 py-2 bg-caixa-blue text-caixa-white rounded-caixa hover:bg-caixa-blue-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {/* Respostas */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {comment.replies.map(reply => renderComment(reply, true))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Formulário de novo comentário */}
      <div className="flex space-x-3">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-caixa-blue rounded-full flex items-center justify-center text-caixa-white font-semibold text-sm">
            {user?.nome.charAt(0) || 'U'}
          </div>
        </div>
        
        <div className="flex-1">
          <form onSubmit={handleSubmitComment}>
            <div className="flex space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Adicione um comentário..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-caixa focus:outline-none focus:ring-2 focus:ring-caixa-blue focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="px-4 py-2 bg-caixa-blue text-caixa-white rounded-caixa hover:bg-caixa-blue-light transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Lista de comentários */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-caixa-gray">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Seja o primeiro a comentar!</p>
          </div>
        ) : (
          comments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default Comments;
