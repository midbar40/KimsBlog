import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        // 라우터에서 발생한 에러 응답
        return (
            <div>
                <div><img src="/public/img/system-error.svg" alt="Error page" className="w-150 h-150 mx-auto" /></div>
                <div className='text-center pt-5'><span className='text-xl font-serif'>오류가 발생했습니다</span></div>
                <p className="text-red-500">
                    {error.status} - {error.statusText}
                </p>
            </div>
        );
    }

    // 그 외 일반적인 자바스크립트 오류
    return (
        <div>
            <div><img src="/public/img/system-error.svg" alt="Error page" className="w-150 h-150 mx-auto" /></div>
            <div className='text-center pt-5'><span className='text-xl font-serif'>예기치 못한 오류가 발생했습니다</span></div>
            <p className="text-gray-500">{(error as Error)?.message}</p>
        </div>
    );
}
