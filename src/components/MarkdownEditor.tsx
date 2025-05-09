import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

const MarkdownEditor = () => {
    const [markdown, setMarkdown] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(e.target.value);
    };

    // HTML sanitization을 위한 함수
    const sanitizeHTML = (html: string) => {
        return DOMPurify.sanitize(html);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/2">
                <textarea
                    value={markdown}
                    onChange={handleInputChange}
                    className="w-full h-96 p-4 border border-gray-300 rounded-md"
                    placeholder="Write your markdown here..."
                />
            </div>
            <div className="w-full md:w-1/2 p-4 border-l border-gray-300">
                <h3 className="text-xl font-semibold">Preview</h3>
                <div className="preview mt-4">
                    {/* ReactMarkdown을 JSX로 렌더링 */}
                    <ReactMarkdown>{sanitizeHTML(markdown)}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default MarkdownEditor;
