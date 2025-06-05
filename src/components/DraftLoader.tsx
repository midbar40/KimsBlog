import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@components/ui/alert-dialog"

interface Post {
    title: string;
    content: string;
}
interface DraftProp {
    onLoadDraft: (post: Post) => void; // ✅ Post 객체를 처리하는 함수로 타입 변경
}


const DraftLoader = ({ onLoadDraft }: DraftProp) => {
    const [draft, setDraft] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:8080/api/temp-posts")
            .then(response => {
                if (response.data) {
                    console.log('임시저장 데이터', response)
                    setDraft(response.data);
                }
            })
            .catch(error => console.error("❌ 임시 저장 불러오기 오류:", error));
    }, []);

    return draft ? (
        <>
            <AlertDialog>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>임시저장 글 불러오기</AlertDialogTitle>
                        <AlertDialogDescription>
                            📝 이전에 저장된 임시 글이 있습니다. 불러오시겠습니까?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>취소</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onLoadDraft(draft)} > 불러오기</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog >
        </>
    ) : null;
};

export default DraftLoader;