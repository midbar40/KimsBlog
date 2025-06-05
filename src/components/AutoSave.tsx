import { useEffect } from "react";
import axios from "axios";
import { isPromise } from "util/types";

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
            axios("http://localhost:8080/api/temp-posts", {
                method: "post",
                headers: { "Content-Type": "application/json" },
                data: post
            })
                .then(response => console.log("✅ 자동 저장됨:", response.data) )// 여기에 자동저장 되었을 때 나오는 알림 반응 추가 필요
                .catch(error => console.error("❌ 저장 오류:", error));
        }, 3000); // 3초 동안 입력이 없으면 저장

        return () => clearTimeout(timeoutId);
    }, [isPublishing, post.title, post.content]);

    return null; // UI 요소 없이 실행만 담당
};

export default AutoSave;

