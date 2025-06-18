import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { Button } from '../ui/button';
import { useNavigate } from "react-router";
import { useAuth } from '../auth/AuthContext';
import CommentSection from '../comment/CommentSection';
import { API_URL } from '../../config/api';

interface Post {
    title: string,
    content: string,
    updatedAt: string
}

const Post = () => {
    let navigate = useNavigate()
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);
    const { user } = useAuth();

    // HTML sanitization을 위한 함수
    const sanitizeHTML = (html: string) => {
        return DOMPurify.sanitize(html);
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    // post 가져오기 
    useEffect(() => {
        const getPost = async () => {
            const response = await axios(`${API_URL}/posts/${id}`, {
                method: 'get',
                headers: { "Content-Type": "application/json" }
            })
                .then(response => {
                    setPost(response.data)
                })
                .catch(error => {
                    console.error('post 가져오기 실패', error)
                    alert("글을 불러오는 데 실패했습니다. 다시 시도해주세요.")
                    navigate('/posts')
                })
        }
        getPost();
    }, [id])

    // 글 수정하기
    const editPost = () => {
        console.log('post 수정')
        navigate(`/posts/${id}/edit`)
    }

    // 글 삭제하기
    const deletePost = () => {
        const deleteCheck = confirm("정말 삭제하시겠습니까?");
        if (!deleteCheck) return
        else {
            console.log('post 삭제')
            axios(`${API_URL}/posts/${id}`, {
                method: "delete",
            })
                .then(response => {
                    console.log("✅ 삭제완료:", response.data)
                    navigate('/posts')
                })
                .catch(error => {
                    console.error("❌ 삭제오류:", error)
                    alert("글 삭제에 실패했습니다. 다시 시도해주세요.")
                })
        }
    }

    return (
        <div className="lg:w-[70%] w-full m-auto mt-5 border-t border-stone-300 p-10">
            {/* 기존 포스트 내용 */}
            <header className="mb-8">
                <h1 className="font-serif text-[25px] font-semibold mb-2">{post?.title}</h1>
                <p className="text-sm text-muted-foreground">{formatDate(post?.updatedAt!)}</p>
            </header>

            <article className="prose prose-lg dark:prose-invert mb-8">
                <ReactMarkdown>{sanitizeHTML(post?.content as string)}</ReactMarkdown>
            </article>

            {user?.role === 'ADMIN' && (
                <div className='btn-group mt-6 mb-8 flex gap-2'>
                    <Button variant="outline" className="text-sm text-muted-foreground hover:text-primary cursor-pointer" onClick={editPost}>수정</Button>
                    <Button variant="outline" className="text-sm text-muted-foreground hover:text-destructive cursor-pointer" onClick={deletePost}>삭제</Button>
                </div>
            )}

            {/* 댓글 시스템 */}
            {id && <CommentSection postId={id} />}
        </div>
    )
}

export default Post