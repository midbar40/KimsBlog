import { useCallback, useEffect } from 'react';
import {
    useBeforeUnload,
} from 'react-router-dom';
import { useBlocker } from 'react-router'; // ❌ react-router-dom 아님

export default function useNavigationGuard(shouldBlock: boolean, message: string) {
    const blocker = useBlocker(shouldBlock);

    // 새로고침 또는 탭 닫기
    useBeforeUnload(
        useCallback(
            (event) => {
                if (shouldBlock) {
                    event.preventDefault();
                    event.returnValue = message;
                }
            },
            [shouldBlock, message]
        )
    );

    // 뒤로가기 등 라우터 이동
    useEffect(() => {
        if (blocker.state === "blocked") {
            const confirmLeave = window.confirm(message);
            if (confirmLeave) blocker.proceed();
            else blocker.reset();
        }
    }, [blocker, message]);
}
