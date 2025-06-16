import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        if (!email.trim()) {
            setMessage('이메일을 입력해주세요.')
            setIsSuccess(false)
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const response = await fetch('http://localhost:8080/api/password/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            })

            const data = await response.json()

            if (response.ok && data.success) {
                setMessage(data.message)
                setIsSuccess(true)
                setEmail('')
            } else {
                setMessage(data.message || '요청 처리 중 오류가 발생했습니다.')
                setIsSuccess(false)
            }
        } catch (error) {
            console.error('Forgot password error:', error)
            setMessage('네트워크 오류가 발생했습니다.')
            setIsSuccess(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>비밀번호 찾기</h1>
                    <p className='text-gray-600'>
                        가입하신 이메일 주소를 입력하시면<br />
                        비밀번호 재설정 링크를 보내드립니다.
                    </p>
                </div>

                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${
                        isSuccess 
                            ? 'bg-green-50 border border-green-200 text-green-800' 
                            : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                        <p className='text-sm font-medium'>{message}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                            이메일 주소
                        </label>
                        <input 
                            type="email" 
                            id="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                            placeholder='이메일을 입력하세요'
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type='submit' 
                        disabled={loading}
                        className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none cursor-pointer'
                    >
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                전송 중...
                            </div>
                        ) : (
                            '비밀번호 재설정 링크 전송'
                        )}
                    </button>
                </form>

                <div className='mt-8 pt-6 border-t border-gray-200 text-center space-y-4'>
                    <button 
                        onClick={() => navigate('/login')} 
                        className='text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium cursor-pointer'
                    >
                        로그인으로 돌아가기
                    </button>
                    
                    <div>
                        <span className='text-gray-600 text-sm'>계정이 없으신가요? </span>
                        <button 
                            onClick={() => navigate('/signup')} 
                            className='text-blue-600 hover:text-blue-800 transition-colors duration-200 font-medium text-sm cursor-pointer'
                        >
                            회원가입
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword