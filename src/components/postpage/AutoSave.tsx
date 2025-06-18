import { useEffect } from "react";
import axios from "axios";
import { API_URL } from '../../config/api';

interface Post {
    title: string;
    content: string;
}

interface AutoSaveProp {
    post: Post; //  post 객체를 명확하게 포함
    isPublishing: boolean; // 발행여부 포함함
}

const AutoSave = ({ post, isPublishing }: AutoSaveProp) => { //  content를 props로 받음
    useEffect(() => {
        if (isPublishing || (!post.title.trim() && !post.content.trim())) return; // 빈 값이면 저장하지 않음

        const timeoutId = setTimeout(() => {
            const postWithId = { ...post, id: 1 }; // ID 명시
            axios(`${API_URL}/temp-posts`, {
                method: "put",
                headers: { "Content-Type": "application/json" },
                data: postWithId
            })
                .then(response => console.log("✅ 자동 저장됨:", response.data))
                .catch(error => {
                    console.error("❌ 저장 오류:", error)
                    alert("글 자동 저장에 실패했습니다. 다시 시도해주세요.")
                });
        }, 3000); // 3초 동안 입력이 없으면 저장

        return () => clearTimeout(timeoutId);
    }, [isPublishing, post.title, post.content]);

    return null; // UI 요소 없이 실행만 담당
};

export default AutoSave;

