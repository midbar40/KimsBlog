import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";
import { Button } from "@components/ui/button"
import axios from 'axios'
import { CircleHelp } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@components/ui/dialog"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogTitle,
} from "@components/ui/alert-dialog"
import AutoSave from "./AutoSave";
import DraftLoader from "./DraftLoader";
import { useNavigate, useParams, useBlocker, useBeforeUnload } from "react-router";
import useNavigationGuard from "./useNavigationGuard";

interface Post {
    title: string,
    content: string
}

interface MarkdownEditorProps {
    mode: 'create' | 'edit';
    postId?: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ mode }) => {
    const { id } = useParams();
    const postId = id ? parseInt(id, 10) : undefined;
    let navigate = useNavigate()
    const [post, setPost] = useState<Post>({
        title: '',
        content: ''
    })
    const [isPublishing, setIsPublishing] = useState(false); // ✅ 발행 중 여부
    const [open, setOpen] = useState(false);
    const [warningText, setWarningText] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const blocker = useBlocker(() => isEditing);

    // 글 작성중 이탈 감지하여 경고하기
    // useBlocker + beforeunload  
    useNavigationGuard(
        post.title.trim() !== '' || post.content.trim() !== '',
        '변경사항이 저장되지 않았습니다. 정말 떠나시겠습니까?'
    );

    const showWarning = (text: string) => {
        setWarningText(text);
        setOpen(true);
    };

    const handlePostContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setPost((prevState) => ({
            ...prevState,
            [name]: value
        }))
    }

    // 작성 중 내용 화면 이탈시 경고 함수


    // HTML sanitization을 위한 함수
    const sanitizeHTML = (html: string) => {
        return DOMPurify.sanitize(html);
    };

    // edit mode로 들어왔을 때 해당 게시글 정보를 서버에서 가져온다
    useEffect(() => {
        if (mode === 'edit' && postId) {
            axios.get(`http://localhost:8080/api/posts/${postId}`)
                .then(response => {
                    console.log('response체크', response)
                    setPost({
                        title: response.data?.title,
                        content: response.data?.content
                    })
                })
                .catch(error => console.log("[editPost] 게시글 불러오기 실패"))
        }
    }, [mode])

    // mode가 바뀔 때 post 초기화
    useEffect(() => {
        if (mode === 'create') {
            setPost({ title: '', content: '' });
        }
    }, [mode]);

    // 글 발행하기
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const action = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;

        try {
            if (action.name === 'publish') {
                if (post.title.trim() === "") {
                    showWarning("제목을 작성해주세요");
                    return;
                }
                if (post.content.trim() === "") {
                    showWarning("내용을 작성해주세요");
                    return;
                }

                console.log("📢 게시글을 발행합니다!");
                const response = await axios("http://localhost:8080/api/posts", {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    data: post
                })
                setIsPublishing(true)
                navigate(`/posts/${response.data.id}`)
            } else if (action.name === 'draft') {
                if (post.title.trim() === "" && post.content.trim() === "") {
                    showWarning("제목 혹은 내용을 작성해주세요");
                    return;
                }
                console.log("💾 게시글을 임시 저장합니다!");
                const postWithId = { ...post, id: 1 }; // ID 명시
                axios("http://localhost:8080/api/temp-posts", {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    data: postWithId
                })
            } else if (action.name === 'edit') {
                if (post.title.trim() === "" && post.content.trim() === "") {
                    showWarning("제목 혹은 내용을 작성해주세요");
                    return;
                }
                console.log("게시글 수정 완료");
                axios(`http://localhost:8080/api/posts/${postId}`, {
                    method: "put",
                    headers: { "Content-Type": "application/json" },
                    data: post
                })
                    .then(response => {
                        console.log("✅ 수정완료:", response.data)
                        navigate(`/posts/${postId}`)
                    })
                    .catch(error => console.error("❌ 수정오류:", error))
            }
        } catch (error) {
            console.log('글 발행에러:', error)
        }
    }


    return (
        <>
            <div className="w-full flex flex-col md:flex-row max-h-screen overflow-auto ">
                {/* 글 작성 영역 */}
                <div className="w-full md:w-1/2 overflow-auto ">
                    {/* 카테고리 표시 */}
                    <div className="mt-[10px] p-4 text-[12px]">
                        <span>{`카테고리 > 카테고리 > 카테고리`}</span>
                    </div>
                    <textarea
                        value={post.title}
                        name="title"
                        onChange={handlePostContent}
                        placeholder="제목"
                        className="w-full p-4 border-b border-gray-300 resize-none overflow-hidden focus:outline-0"
                        rows={1}
                        style={{ height: 'auto' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                    <textarea
                        value={post.content}
                        name="content"
                        onChange={handlePostContent}
                        className="w-full p-4  resize-none overflow-hidden focus:outline-0"
                        placeholder="마크다운으로 기록하기"
                        style={{
                            minHeight: '75vh',
                            overflowWrap: 'break-word',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = 'auto';
                            target.style.height = target.scrollHeight + 'px';
                        }}
                    />
                    {/* 버튼 div */}
                    <div
                        className="flex justify-end gap-[10px] p-5"
                    >
                        <Dialog>
                            <DialogTrigger>
                                <span className="cursor-pointer">
                                    <CircleHelp />
                                </span>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>마크다운 작성 가이드</DialogTitle>
                                    <DialogDescription>
                                        <b>Heading</b>	<br />
                                        # H1 <br />
                                        ## H2 <br />
                                        ### H3 <br />
                                        <b>Bold</b>	**bold text** <br />
                                        <b>Italic</b>	*italicized text* <br />
                                        <b>Blockquote</b>	{'>'} blockquote <br />
                                        <b>Ordered List</b>  <br />
                                        1. First item <br />
                                        2. Second item <br />
                                        3. Third item  <br />
                                        <b>Unordered List</b>	<br />
                                        - First item <br />
                                        - Second item <br />
                                        - Third item <br />
                                        <b>Code</b>	'{`code`}' <br />
                                        <b>Horizontal Rule</b>	--- <br />
                                        <b>Link</b>	[title](https://www.example.com) <br />
                                        <b>Image</b> ![alt text](image.jpg) <br /><br />
                                        <a href="https://www.markdownguide.org/cheat-sheet/"> 참고: markdown cheet-sheet</a>
                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <form onSubmit={handleSubmit}>
                            {mode === 'create' && (
                                <>
                                    <Button type="submit" name="draft" variant="outline" className="cursor-pointer mr-3">임시저장</Button>
                                    <Button type="submit" name="publish" className="cursor-pointer mr-3">발행하기</Button>
                                </>
                            )}
                            {mode === 'edit' && (
                                <>
                                    <Button type="submit" name="edit" variant="outline" className="cursor-pointer mr-3">수정완료</Button>
                                </>
                            )}
                        </form>
                    </div>
                </div>
                {/* 마크다운 작성글 미리보기 */}
                <div className="w-full md:w-1/2 pt-5 border-1" style={{ minHeight: '80vh', overflowX: 'hidden' }}>
                    <span className="text-[15px] font-serif pl-4">MarkDown Preview</span>
                    <div className="preview mt-4 max-w-none pt-3 markdown">
                        {/* ReactMarkdown을 JSX로 렌더링 */}
                        <div className="border-b border-gray-300 h-[42px]">
                            <span className="mb-3 pl-4">{post.title}</span>
                        </div>
                        <div className="p-5"
                            style={{
                                overflowWrap: 'break-word',
                                wordBreak: 'break-word'
                            }}
                        >
                            <ReactMarkdown>
                                {sanitizeHTML(post.content)}
                            </ReactMarkdown>
                        </div>
                    </div>
                </div>
            </div>
            {mode === 'create' && (
                <>
                    <DraftLoader onLoadDraft={(draft) => setPost(draft)} /> {/* ✅ 임시 저장 불러오기 */}
                    <AutoSave post={post} isPublishing={isPublishing} />
                </>
            )}
            <>
                <AlertDialog open={open} onOpenChange={setOpen}>
                    <AlertDialogContent>
                        <AlertDialogTitle></AlertDialogTitle>
                        <AlertDialogDescription>
                            {warningText}
                        </AlertDialogDescription>
                        <AlertDialogFooter>
                            <AlertDialogCancel>닫기</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </>
        </>

    );
};

export default MarkdownEditor;
