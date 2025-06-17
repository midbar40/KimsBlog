import React from 'react';
import { Comment } from './CommentSection';
import CommentItem from './CommentItem';

interface CommentListProps {
    comments: Comment[];
    onEditComment: (commentId: number, newContent: string, password: string) => Promise<boolean>;
    onDeleteComment: (commentId: number, password: string) => Promise<boolean>;
}

const CommentList: React.FC<CommentListProps> = ({ 
    comments, 
    onEditComment, 
    onDeleteComment 
}) => {
    if (comments.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                첫 번째 댓글을 작성해보세요!
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onEdit={onEditComment}
                    onDelete={onDeleteComment}
                />
            ))}
        </div>
    );
};

export default CommentList;