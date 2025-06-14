import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const Login = () => {
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const { login, isAuthenticated, user, loading } = useAuth()

    // 이미 로그인되어 있으면 홈으로 리다이렉트
    useEffect(() => {
        if (isAuthenticated && user && !loading) {
            console.log('Already authenticated, redirecting to home...');
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, user, loading, navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        console.log('Login form submitted');
        
        if (id === '' || password === '') {
            alert('아이디와 비밀번호를 입력해주세요.')
            return
        }

        try {
            const success = await login(id, password);
            console.log('Login result:', success);
            
            if (success) {
                console.log('로그인 성공, 홈으로 이동');
                navigate('/', { replace: true });
            } else {
                console.log('로그인 실패');
                alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    }

    // 로딩 중이면 로딩 표시
    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className='text-gray-600'>로딩 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>로그인</h1>
                    <p className='text-gray-600'>계정에 로그인하세요</p>
                    {/* 디버깅 정보 */}
                    {/* {process.env.NODE_ENV === 'development' && (
                        <div style={{ fontSize: '10px', color: 'red', marginTop: '10px' }}>
                            DEBUG: isAuth={isAuthenticated ? 'true' : 'false'} | loading={loading ? 'true' : 'false'}
                        </div>
                    )} */}
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="id" className='block text-sm font-medium text-gray-700 mb-2'>
                            아이디
                        </label>
                        <input 
                            type="text" 
                            id="id" 
                            value={id} 
                            onChange={(e) => setId(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                            placeholder='아이디를 입력하세요'
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className='block text-sm font-medium text-gray-700 mb-2'>
                            비밀번호
                        </label>
                        <input 
                            type="password" 
                            id="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                            placeholder='비밀번호를 입력하세요'
                            disabled={loading}
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none'
                    >
                        {loading ? '로그인 중...' : '로그인'}
                    </button>
                </form>

                <div className='mt-8 pt-6 border-t border-gray-200'>
                    <p className='text-center text-gray-600 mb-4'>
                        계정이 없으신가요?
                    </p>
                    <button 
                        onClick={() => navigate('/signup')} 
                        disabled={loading}
                        className='w-full bg-white hover:bg-gray-50 disabled:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 disabled:border-gray-200 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:transform-none'
                    >
                        회원가입
                    </button>
                </div>

                <div className='mt-6 text-center'>
                    <a href='#' className='text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200'>
                        비밀번호를 잊으셨나요?
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login