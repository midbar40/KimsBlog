import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [tokenValid, setTokenValid] = useState<boolean | null>(null)
    const [tokenLoading, setTokenLoading] = useState(true)
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get('token')

    // 컴포넌트 마운트 시 토큰 유효성 검사
    useEffect(() => {
        if (!token) {
            setTokenValid(false)
            setTokenLoading(false)
            setMessage('유효하지 않은 링크입니다.')
            return
        }

        validateToken()
    }, [token])

    const validateToken = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/password/validate-token?token=${encodeURIComponent(token!)}`)
            const data = await response.json()

            if (response.ok && data.valid) {
                setTokenValid(true)
                setMessage('')
            } else {
                setTokenValid(false)
                setMessage(data.message || '유효하지 않거나 만료된 링크입니다.')
            }
        } catch (error) {
            console.error('Token validation error:', error)
            setTokenValid(false)
            setMessage('토큰 검증 중 오류가 발생했습니다.')
        } finally {
            setTokenLoading(false)
        }
    }

    const validatePassword = (password: string) => {
        // 비밀번호 유효성 검사: 영문+숫자+특수문자 포함, 8~20자
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/
        return passwordRegex.test(password)
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setMessage('모든 필드를 입력해주세요.')
            setIsSuccess(false)
            return
        }

        if (newPassword !== confirmPassword) {
            setMessage('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.')
            setIsSuccess(false)
            return
        }

        if (!validatePassword(newPassword)) {
            setMessage('비밀번호는 8~20자이며, 영문, 숫자, 특수문자를 포함해야 합니다.')
            setIsSuccess(false)
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const response = await fetch('http://localhost:8080/api/password/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token: token,
                    newPassword: newPassword,
                    confirmPassword: confirmPassword
                }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setMessage(data.message)
                setIsSuccess(true)
                setNewPassword('')
                setConfirmPassword('')
                
                // 3초 후 로그인 페이지로 이동
                setTimeout(() => {
                    navigate('/login')
                }, 3000)
            } else {
                setMessage(data.message || '비밀번호 변경 중 오류가 발생했습니다.')
                setIsSuccess(false)
            }
        } catch (error) {
            console.error('Reset password error:', error)
            setMessage('네트워크 오류가 발생했습니다.')
            setIsSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    // 토큰 검증 로딩 중
    if (tokenLoading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center'>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className='text-gray-600'>토큰을 확인하고 있습니다...</p>
                </div>
            </div>
        )
    }

    // 토큰이 유효하지 않은 경우
    if (tokenValid === false) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
                <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center'>
                    <div className='mb-6'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <span className='text-2xl'>❌</span>
                        </div>
                        <h1 className='text-2xl font-bold text-gray-800 mb-2'>링크가 유효하지 않습니다</h1>
                        <p className='text-gray-600 mb-6'>{message}</p>
                    </div>
                    
                    <div className='space-y-3'>
                        <button 
                            onClick={() => navigate('/forgot-password')} 
                            className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
                        >
                            새 링크 요청하기
                        </button>
                        
                        <button 
                            onClick={() => navigate('/login')} 
                            className='w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]'
                        >
                            로그인으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <span className='text-2xl'>🔒</span>
                    </div>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>비밀번호 재설정</h1>
                    <p className='text-gray-600'>
                        새로운 비밀번호를 입력해주세요
                    </p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        isSuccess 
                            ? 'bg-green-50 border border-green-200 text-green-800' 
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        <p className='text-sm font-medium'>{message}</p>
                        {isSuccess && (
                            <p className='text-xs mt-2 text-green-600'>
                                3초 후 로그인 페이지로 이동합니다...
                            </p>
                        )}
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="newPassword" className='block text-sm font-medium text-gray-700 mb-2'>
                            새 비밀번호
                        </label>
                        <input 
                            type="password" 
                            id="newPassword" 
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                            placeholder='새 비밀번호를 입력하세요'
                            disabled={loading}
                            required
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                            8~20자, 영문/숫자/특수문자 조합
                        </p>
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className='block text-sm font-medium text-gray-700 mb-2'>
                            비밀번호 확인
                        </label>
                        <input 
                            type="password" 
                            id="confirmPassword" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition-all duration-200 outline-none ${
                                confirmPassword && newPassword !== confirmPassword
                                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                    : confirmPassword && newPassword === confirmPassword && newPassword
                                    ? 'border-green-500 focus:ring-green-500 bg-green-50'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder='새 비밀번호를 다시 입력하세요'
                            disabled={loading}
                            required
                        />
                        {confirmPassword && newPassword !== confirmPassword && (
                            <p className='text-xs text-red-500 mt-1 flex items-center gap-1'>
                                <span>⚠️</span>
                                비밀번호가 일치하지 않습니다
                            </p>
                        )}
                        {confirmPassword && newPassword === confirmPassword && newPassword && (
                            <p className='text-xs text-green-500 mt-1 flex items-center gap-1'>
                                <span>✅</span>
                                비밀번호가 일치합니다
                            </p>
                        )}
                    </div>

                    <button 
                        type='submit' 
                        disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
                        className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none cursor-pointer'
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                변경 중...
                            </div>
                        ) : (
                            '비밀번호 변경'
                        )}
                    </button>
                </form>

                <div className='mt-8 pt-6 border-t border-gray-200 text-center'>
                    <button 
                        onClick={() => navigate('/login')} 
                        className='text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium'
                    >
                        로그인으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ResetPassword