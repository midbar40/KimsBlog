import React, { useState } from 'react';
import { Edit3, Trash2, Lock, Save, X } from 'lucide-react';
import { Comment } from './CommentSection';

interface CommentItemProps {
    comment: Comment;
    onEdit: (commentId: number, newContent: string, password: string) => Promise<boolean>;
    onDelete: (commentId: number, password: string) => Promise<boolean>;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment, onEdit, onDelete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [editPassword, setEditPassword] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deletePassword, setDeletePassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // 수정 시작
    const startEdit = () => {
        setIsEditing(true);
        setEditContent(comment.content);
        setEditPassword('');
    };

    // 수정 완료
    const handleEdit = async () => {
        if (!editContent.trim()) {
            alert('댓글 내용을 입력해주세요.');
            return;
        }

        if (!editPassword.trim()) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        const success = await onEdit(comment.id, editContent, editPassword);
        
        if (success) {
            setIsEditing(false);
            setEditPassword('');
        } else {
            // 실패 시 비밀번호만 초기화 (내용은 유지)
            setEditPassword('');
        }
        setIsLoading(false);
    };

    // 수정 취소
    const cancelEdit = () => {
        setIsEditing(false);
        setEditContent(comment.content);
        setEditPassword('');
    };

    // 삭제 처리
    const handleDelete = async () => {
        if (!deletePassword.trim()) {
            alert('비밀번호를 입력해주세요.');
            return;
        }

        setIsLoading(true);
        const success = await onDelete(comment.id, deletePassword);
        
        if (success) {
            setIsDeleting(false);
            setDeletePassword('');
        } else {
            // 실패 시 비밀번호만 초기화
            setDeletePassword('');
        }
        setIsLoading(false);
    };

    // 삭제 취소
    const cancelDelete = () => {
        setIsDeleting(false);
        setDeletePassword('');
    };

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <div className="text-2xl flex-shrink-0">{comment.profileImage}</div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900">{comment.nickname}</span>
                            <span className="text-sm text-gray-500">{comment.timestamp}</span>
                        </div>
                        
                        {isEditing ? (
                            <div className="mt-2">
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    rows={3}
                                    maxLength={500}
                                    disabled={isLoading}
                                />
                                <div className="mt-2 mb-2">
                                    <input
                                        type="password"
                                        value={editPassword}
                                        onChange={(e) => setEditPassword(e.target.value)}
                                        placeholder="비밀번호 확인"
                                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleEdit}
                                        disabled={isLoading}
                                        className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 flex items-center disabled:opacity-50"
                                    >
                                        <Save size={14} className="mr-1" />
                                        {isLoading ? '저장 중...' : '저장'}
                                    </button>
                                    <button
                                        onClick={cancelEdit}
                                        disabled={isLoading}
                                        className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 flex items-center disabled:opacity-50"
                                    >
                                        <X size={14} className="mr-1" />
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-800 mt-1 whitespace-pre-wrap break-words">{comment.content}</p>
                        )}
                    </div>
                </div>
                
                {!isEditing && !isDeleting && (
                    <div className="flex space-x-2 flex-shrink-0">
                        <button
                            onClick={startEdit}
                            className="p-1 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded"
                            title="수정"
                        >
                            <Edit3 size={16} />
                        </button>
                        <button
                            onClick={() => setIsDeleting(true)}
                            className="p-1 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded"
                            title="삭제"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                )}
            </div>
            
            {/* 삭제 확인 */}
            {isDeleting && !isEditing && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded">
                    <div className="flex items-center mb-2">
                        <Lock size={16} className="text-red-500 mr-2" />
                        <span className="text-sm font-medium text-red-700">댓글 삭제</span>
                    </div>
                    <input
                        type="password"
                        value={deletePassword}
                        onChange={(e) => setDeletePassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500 mb-2 disabled:opacity-50"
                        disabled={isLoading}
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50 cursor-pointer"
                        >
                            {isLoading ? '삭제 중...' : '삭제'}
                        </button>
                        <button
                            onClick={cancelDelete}
                            disabled={isLoading}
                            className="px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 disabled:opacity-50 cursor-pointer"
                        >
                            취소
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentItem;