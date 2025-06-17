import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Comment } from './CommentSection';

// 프로필 이미지 옵션들
const profileImages = [
    '😀', '😎', '🤔', '😊', '🙂', '😐', '🤨', '😏', 
    '🐶', '🐱', '🐰', '🐻', '🦊', '🐸', '🐼', '🦁'
];

interface CommentFormProps {
    onAddComment: (commentData: Omit<Comment, 'id' | 'timestamp' | 'replies'>) => Promise<boolean>;
}

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
    const [formData, setFormData] = useState({
        nickname: '',
        password: '',
        content: '',
        profileImage: '😀'
    });
    const [showProfilePicker, setShowProfilePicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!formData.nickname.trim() || !formData.password.trim() || !formData.content.trim()) {
            alert('닉네임, 비밀번호, 내용을 모두 입력해주세요.');
            return;
        }

        setIsSubmitting(true);
        const success = await onAddComment(formData);
        
        if (success) {
            setFormData({
                nickname: '',
                password: '',
                content: '',
                profileImage: '😀'
            });
        }
        setIsSubmitting(false);
    };

    return (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* 프로필 이미지 선택 */}
                <div className="relative">
                    <label className="block text-sm font-medium mb-2">프로필</label>
                    <button
                        onClick={() => setShowProfilePicker(!showProfilePicker)}
                        className="w-full p-2 border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-100 disabled:opacity-50"
                        disabled={isSubmitting}
                    >
                        <span className="text-2xl">{formData.profileImage}</span>
                        <span className="text-sm text-gray-600">선택</span>
                    </button>
                    
                    {showProfilePicker && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-2">
                            <div className="grid grid-cols-8 gap-1">
                                {profileImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setFormData(prev => ({ ...prev, profileImage: img }));
                                            setShowProfilePicker(false);
                                        }}
                                        className="p-2 hover:bg-gray-100 rounded text-xl"
                                        disabled={isSubmitting}
                                    >
                                        {img}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 닉네임 */}
                <div>
                    <label className="block text-sm font-medium mb-2">닉네임</label>
                    <input
                        type="text"
                        value={formData.nickname}
                        onChange={(e) => setFormData(prev => ({ ...prev, nickname: e.target.value }))}
                        placeholder="닉네임을 입력하세요"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        maxLength={20}
                        disabled={isSubmitting}
                    />
                </div>

                {/* 비밀번호 */}
                <div>
                    <label className="block text-sm font-medium mb-2">비밀번호</label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="수정/삭제용 비밀번호"
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        maxLength={20}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            {/* 댓글 내용 */}
            <textarea
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="댓글을 입력하세요..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:opacity-50"
                rows={4}
                maxLength={500}
                disabled={isSubmitting}
            />
            
            <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-500">
                    {formData.content.length}/500
                </span>
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer"
                >
                    {isSubmitting ? '작성 중...' : '댓글 작성'}
                </Button>
            </div>
        </div>
    );
};

export default CommentForm;