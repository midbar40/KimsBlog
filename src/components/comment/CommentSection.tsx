import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle } from 'lucide-react';
import CommentForm from './CommentForm'
import CommentList from './CommentList'
import { API_URL } from '../../config/api';

export interface Comment {
    id: number;
    nickname: string;
    password: string;
    content: string;
    profileImage: string;
    timestamp: string;
    replies: Comment[];
}

interface CommentSectionProps {
    postId: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId }) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);

    // 댓글 목록 불러오기
    useEffect(() => {
        const fetchComments = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
                    withCredentials: true,
                    timeout: 10000
                });
                setComments(response.data);
            } catch (error) {
                console.error('댓글 불러오기 실패:', error);
                if (axios.isAxiosError(error)) {
                    console.error('Error details:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        message: error.message
                    });
                }
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [postId]);

    // 댓글 추가
    const handleAddComment = async (commentData: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => {
        try {
            const response = await axios.post(
                `${API_URL}/posts/${postId}/comments`,
                commentData,
                {
                    withCredentials: true,
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            // 서버 응답을 사용하여 상태 업데이트
            const newComment: Comment = {
                ...response.data,
                replies: []
            };
            
            setComments(prev => [...prev, newComment]);
            return true;
        } catch (error) {
            console.error('댓글 추가 실패:', error);
            if (axios.isAxiosError(error)) {
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            }
            alert('댓글 추가에 실패했습니다.');
            return false;
        }
    };

    // 중첩된 댓글까지 고려한 댓글 업데이트 헬퍼 함수
    const updateCommentRecursively = (comments: Comment[], commentId: number, newContent: string): Comment[] => {
        return comments.map(comment => {
            if (comment.id === commentId) {
                return { ...comment, content: newContent };
            }
            if (comment.replies && comment.replies.length > 0) {
                return {
                    ...comment,
                    replies: updateCommentRecursively(comment.replies, commentId, newContent)
                };
            }
            return comment;
        });
    };

    // 댓글 수정
    const handleEditComment = async (commentId: number, newContent: string, password: string) => {
        try {
            const response = await axios.put(
                `${API_URL}/posts/${postId}/comments/${commentId}`,
                {
                    content: newContent,
                    password: password
                },
                {
                    withCredentials: true,
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // 수정된 댓글 내용으로 상태 업데이트 (중첩 댓글 고려)
            setComments(prev => updateCommentRecursively(prev, commentId, newContent));
            return true;
        } catch (error) {
            console.error('댓글 수정 실패:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || '댓글 수정에 실패했습니다.';
                alert(errorMessage);
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            } else {
                alert('댓글 수정에 실패했습니다.');
            }
            return false;
        }
    };

    // 중첩된 댓글까지 고려한 댓글 삭제 헬퍼 함수
    const deleteCommentRecursively = (comments: Comment[], commentId: number): Comment[] => {
        return comments
            .filter(comment => comment.id !== commentId)
            .map(comment => ({
                ...comment,
                replies: comment.replies ? deleteCommentRecursively(comment.replies, commentId) : []
            }));
    };

    // 댓글 삭제
    const handleDeleteComment = async (commentId: number, password: string) => {
        try {
            await axios.delete(
                `${API_URL}/posts/${postId}/comments/${commentId}`,
                {
                    data: { password },
                    withCredentials: true,
                    timeout: 10000,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            // 삭제된 댓글을 상태에서 제거 (중첩 댓글 고려)
            setComments(prev => deleteCommentRecursively(prev, commentId));
            return true;
        } catch (error) {
            console.error('댓글 삭제 실패:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message || '댓글 삭제에 실패했습니다.';
                alert(errorMessage);
                console.error('Error details:', {
                    status: error.response?.status,
                    data: error.response?.data,
                    message: error.message
                });
            } else {
                alert('댓글 삭제에 실패했습니다.');
            }
            return false;
        }
    };

    return (
        <div className="border-t border-stone-300 pt-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MessageCircle className="mr-2" size={20} />
                댓글 작성
            </h3>

            <CommentForm onAddComment={handleAddComment} />

            <div className="mt-6">
                <h4 className="font-medium text-gray-700 mb-4">
                    댓글 {comments.length}개
                </h4>
                
                {loading ? (
                    <div className="text-center py-8 text-gray-500">
                        댓글을 불러오는 중...
                    </div>
                ) : (
                    <CommentList 
                        comments={comments}
                        onEditComment={handleEditComment}
                        onDeleteComment={handleDeleteComment}
                    />
                )}
            </div>
        </div>
    );
};

export default CommentSection;