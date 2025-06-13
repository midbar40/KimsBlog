import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

        // 공란 체크 먼저
        if (!email || !password || !confirmPassword || !nickname) {
            alert('모든 필드를 입력해주세요.');
            return;
        }

        // 비밀번호 확인
        if (password !== confirmPassword) {
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
            .post('http://localhost:8080/api/signup', { email, password, nickname },
                {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                })
            .then((response) => {
                console.log('회원가입 성공:', response.data);
                alert('회원가입이 완료되었습니다.');
                navigate('/');
            })
            .catch((error) => {
                console.error('회원가입 실패:', error);
                alert('회원가입에 실패했습니다. 다시 시도해주세요.');
            });
    };

    return (
        <div className='lg:w-[55%] w-full m-auto mt-5'>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}
                className="flex flex-col gap-4">
                <div>
                    <label htmlFor="email">이메일</label>
                    <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">비밀번호 확인</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="nickname">닉네임</label>
                    <input
                        type="text"
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />
                </div>
                <div>
                    <button type="submit">회원가입</button>
                </div>
            </form>
            <div>
                <button onClick={() => navigate('/login')}>로그인</button>
            </div>
        </div>
    );
}

export default Signup;
