import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from './AuthContext'

const Login = () => {
    const [id, setId] = useState('')
    const [password, setPassword] = useState('')
    let navigate = useNavigate()
    const { login } = useAuth()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (id === '' || password === '') {
            alert('아이디와 비밀번호를 입력해주세요.')
            return
        }

        const success = await login(id, password);
        if (!success) {
            alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
            return
        }

        // 로그인 API 호출
        console.log('로그인 API 호출:', { id, password })
        axios.post('http://localhost:8080/api/login', {
            id,
            password
        }, {
            withCredentials: true,
            headers: { "Content-Type": "application/json" }
        })
            .then(response => {
                console.log('로그인 성공:', response.data)
                // 로그인 성공 후 처리 (예: 토큰 저장, 리다이렉트 등)
                navigate('/')
            })
            .catch(error => {
                console.error('로그인 실패:', error)
                alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.')
            })
    }
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="id">아이디</label>
                    <input type="text" id="id" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">비밀번호</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div><button type='submit'>로그인</button></div>
            </form>
            <div>
                <button onClick={() => navigate('/signup')}>회원가입</button>
            </div>
        </div>
    )
}

export default Login