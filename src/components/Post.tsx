import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

interface Post {
    title: string,
    content: string,
    updatedAt: string
}


const Post = () => {
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

    return (
        <div className="max-w-3xl mx-10 px-4 py-8">
            <header className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{post?.title}</h1>
                <p className="text-sm text-muted-foreground">{formatDate(post?.updatedAt!)}</p>
            </header>

            <article className="prose prose-lg dark:prose-invert">
                <ReactMarkdown>{sanitizeHTML(post?.content as string)}</ReactMarkdown>
            </article>
        </div>
    )
}

export default Post