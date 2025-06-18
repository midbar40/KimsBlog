import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config/api';

// 입력값 타입 정의
type FormData = {
    email: string;
    password: string;
    nickname: string;
};

// 유효성 검사 함수
const validateForm = (formData: FormData) => {
    const { email, password, nickname } = formData;
    const errors: { [key: string]: string } = {};

    // 이메일 형식 체크
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = '올바른 이메일 형식이 아닙니다.';
    }

    // 비밀번호: 영문+숫자+특수문자 포함, 8~20자
    if (
        !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/.test(
            password
        )
    ) {
        errors.password =
            '비밀번호는 8~20자이며, 영문, 숫자, 특수문자를 포함해야 합니다.';
    }

    // 닉네임: 2~20자, 한글/영문/숫자만
    if (!/^[a-zA-Z0-9가-힣]{2,20}$/.test(nickname)) {
        errors.nickname =
            '닉네임은 2~20자, 특수문자 없이 한글/영문/숫자만 가능합니다.';
    }

    return errors;
};

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('회원가입 폼 제출:', { email, password, nickname });
        // 공란 체크 먼저
        if (!email || !password || !confirmPassword || !nickname) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
            // 실시간 검증으로 이미 체크되므로 이 부분은 제거하거나 유지 가능
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 유효성 검사
        const errors = validateForm({ email, password, nickname });
        if (Object.keys(errors).length > 0) {
            alert(Object.values(errors).join('\n'));
            return;
        }

        // 서버 요청
        axios
            .post(`${API_URL}/signup`, { email, password, nickname },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                })
            .then((response) => {
                console.log('회원가입 성공:', response.data);
                alert('회원가입이 완료되었습니다.');
                navigate('/login');
            })
            .catch((error) => {
                console.error('회원가입 실패:', error);
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
            <div className='w-full max-w-md bg-white rounded-2xl shadow-xl p-8'>
                <div className='text-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-800 mb-2'>회원가입</h1>
                    <p className='text-gray-600'>새 계정을 만들어주세요</p>
                </div>

                <form onSubmit={handleSubmit} className='space-y-6'>
                    <div>
                        <label htmlFor="email" className='block text-sm font-medium text-gray-700 mb-2'>
                            이메일
                        </label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                            placeholder='이메일을 입력하세요'
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
                                confirmPassword && password !== confirmPassword
                                    ? 'border-red-500 focus:ring-red-500 bg-red-50'
                                    : confirmPassword && password === confirmPassword
                                    ? 'border-green-500 focus:ring-green-500 bg-green-50'
                                    : 'border-gray-300 focus:ring-blue-500'
                            }`}
                            placeholder='비밀번호를 다시 입력하세요'
                        />
                        {confirmPassword && password !== confirmPassword && (
                            <p className='text-xs text-red-500 mt-1 flex items-center gap-1'>
                                <span>⚠️</span>
                                비밀번호가 일치하지 않습니다
                            </p>
                        )}
                        {confirmPassword && password === confirmPassword && (
                            <p className='text-xs text-green-500 mt-1 flex items-center gap-1'>
                                <span>✅</span>
                                비밀번호가 일치합니다
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="nickname" className='block text-sm font-medium text-gray-700 mb-2'>
                            닉네임
                        </label>
                        <input
                            type="text"
                            id="nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 outline-none'
                            placeholder='닉네임을 입력하세요'
                        />
                        <p className='text-xs text-gray-500 mt-1'>
                            2~20자, 한글/영문/숫자만 가능
                        </p>
                    </div>

                    <button 
                        type="submit"
                        className='w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl cursor-pointer'
                    >
                        회원가입
                    </button>
                </form>

                <div className='mt-8 pt-6 border-t border-gray-200'>
                    <p className='text-center text-gray-600 mb-4'>
                        이미 계정이 있으신가요?
                    </p>
                    <button 
                        onClick={() => navigate('/login')}
                        className='w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer'
                    >
                        로그인
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Signup;