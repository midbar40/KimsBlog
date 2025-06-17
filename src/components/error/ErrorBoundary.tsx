// components/ErrorBoundary.tsx
import React from "react";

interface State {
  hasError: boolean;
  error: Error | null;
}
// React에서는 ErrorBoundary를 클래스형 컴포넌트에서만 공식적으로 지원
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
         <div>
            <div><img src="/public/img/system-error.svg" alt="Error page" className="w-150 h-150 mx-auto" /></div>
            <div className='text-center pt-5'><span className='text-xl font-serif'>오류가 발생했습니다, 다시 시도해주세요.</span></div>
        </div>
      )
    }

    return this.props.children;
  }
}

export default ErrorBoundary;