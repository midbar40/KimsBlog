import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { useNavigate } from "react-router";
import ScrollToTopBtn from './ScrollToTopBtn';


type Post = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
}

function PostList() {
    let navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Spring은 0부터 시작
    const [totalPages, setTotalPages] = useState(0);
    const size = 10;

    // HTML sanitization을 위한 함수
    const stripMarkdown = (text: string) => {
        return text
            .replace(/^#{1,6}\s+/gm, "")  //  제목(`##`, `###`) 제거
            .replace(/\*\*(.*?)\*\*/g, "$1") //  굵은 텍스트(`**bold**`) 제거
            .replace(/~~(.*?)~~/g, "$1") //  취소선(`~~text~~`) 제거
            .replace(/\[(.*?)\]\(.*?\)/g, "$1") //  링크(`[text](url)`) 제거
            .replace(/`(.*?)`/g, "$1") //  인라인 코드(`text`) 제거
            .replace(/^\s*-\s+/gm, "") //  리스트(`- text`) 제거
            .replace(/^\s*\*\s+/gm, "") // 리스트(`* text`) 제거
            .replace(/^>\s+/gm, ""); //  인용구(`> text`) 제거
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    };

    useEffect(() => {
        const getPosts = async () => {
            const response = await axios(`http://localhost:8080/api/posts/paged?page=${currentPage}&size=${size}`, {
                method: 'get',
                headers: { "Content-Type": "application/json" }
            })
                .then(response => {
                    setPosts(response.data.content)
                    setTotalPages(response.data.totalPages)
                })
                .catch(error => {
                    console.error('posts 가져오기 실패', error)
                    navigate('/error') 
                })
        }
        getPosts()
    }, [currentPage])



    return (
        <div className='lg:w-[55%] w-full m-auto mt-5'>
            <div>
                {posts.map((post: Post) => (
                    <Card className="w-full hover:shadow-md transition mb-4 cursor-pointer active:bg-indigo-100" key={post.id} onClick={() => navigate(`${post.id}`)}>
                        <CardHeader>
                            <CardTitle className="font-serif text-[25px] font-semibold">{post.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground line-clamp-2">{stripMarkdown(post.content.slice(0, 100))}</p>
                            <div className="text-sm text-right mt-2 text-gray-500">
                                {formatDate(post.updatedAt)}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* 페이지네이션 */}
            <div className='flex justify-center max-w-3xl mt-10 mb-10'>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        className='cursor-pointer pl-5'
                        key={index}
                        onClick={() => setCurrentPage(index)}
                        style={{ margin: '0 5px', fontWeight: currentPage === index ? 'bold' : 'normal' }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <ScrollToTopBtn />
        </div>

    )
}

export default PostList
