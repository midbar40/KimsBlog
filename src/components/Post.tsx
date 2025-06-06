import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { Button } from './ui/button';
import { useNavigate } from "react-router";


interface Post {
    title: string,
    content: string,
    updatedAt: string
}


const Post = () => {
    let navigate = useNavigate()
    const { id } = useParams();
    const [post, setPost] = useState<Post | null>(null);

    // HTML sanitization을 위한 함수
    const sanitizeHTML = (html: string) => {
        return DOMPurify.sanitize(html);
    };


    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    // post 가져오기 
    useEffect(
        () => {
            const getPost = async () => {
                const response = await axios(`http://localhost:8080/api/posts/${id}`, {
                    method: 'get',
                    headers: { "Content-Type": "application/json" }
                })
                setPost(response.data)
            }
            getPost();
        }, [id])

    // 글 수정하기
    const editPost = () => {
        console.log('post 수정')
        // markdown입력에디터가 다시 활성화 되어야 한다
        navigate(`/posts/${id}/edit`)

        // axios(`http://localhost:8080/api/posts/${id}`, {
        //     method: "put",
        //     headers: { "Content-Type": "application/json" },
        //     data: post
        // })
        //     .then(response => {
        //         console.log("✅ 수정완료:", response.data)
        //         navigate(`/posts/${id}`)
        //     })
        //     .catch(error => console.error("❌ 수정오류:", error))
    }

    // 글 삭제하기
    const deletePost = () => {
        const deleteCheck = confirm("정말 삭제하시겠습니까?");
        if (!deleteCheck) return
        else {
            console.log('post 삭제')
            axios(`http://localhost:8080/api/posts/${id}`, {
                method: "delete",
            })
                .then(response => {
                    console.log("✅ 삭제완료:", response.data)
                    navigate('/posts')
                })
                .catch(error => console.error("❌ 삭제오류:", error))
        }
    }

    return (
        <div className="max-w-3xl mx-10 px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{post?.title}</h1>
                <p className="text-sm text-muted-foreground">{formatDate(post?.updatedAt!)}</p>
            </header>

            <article className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{sanitizeHTML(post?.content as string)}</ReactMarkdown>
            </article>
            <div className='btn-group mt-6 flex gap-2'>
                <Button variant="outline" className="text-sm text-muted-foreground hover:text-primary cursor-pointer" onClick={editPost}>수정</Button>
                <Button variant="outline" className="text-sm text-muted-foreground hover:text-destructive cursor-pointer" onClick={deletePost}>삭제</Button>
            </div>
        </div>
    )
}

export default Post