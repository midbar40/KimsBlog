import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface User {
    email: string;
    nickname: string;
    role: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => void;
    checkAuthStatus: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

// axios 기본 설정
axios.defaults.withCredentials = true;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    // axios 인터셉터 설정 (응답 에러 핸들링)
    useEffect(() => {
        const responseInterceptor = axios.interceptors.response.use(
            (response) => response,
            (error) => {
                // 401 에러 시 자동으로 로그아웃 처리
                if (error.response?.status === 401) {
                    console.log('401 error detected, clearing auth state');
                    setIsAuthenticated(false);
                    setUser(null);
                }
                return Promise.reject(error);
            }
        );

        // 요청 인터셉터 추가 (디버깅용)
        const requestInterceptor = axios.interceptors.request.use(
            (config) => {
                console.log('🚀 Request:', {
                    url: config.url,
                    method: config.method,
                    withCredentials: config.withCredentials,
                    headers: config.headers
                });


                return config;
            },
            (error) => Promise.reject(error)
        );

        return () => {
            axios.interceptors.response.eject(responseInterceptor);
            axios.interceptors.request.eject(requestInterceptor);
        };
    }, []);

    // 인증 상태 확인 함수
    const checkAuthStatus = async (retryCount = 0) => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/status', {
                withCredentials: true,
                timeout: 10000,
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache',
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Auth status response:', {
                status: response.status,
                data: response.data,
                responseHeaders: response.headers,
                requestUrl: response.config.url
            });



            if (response.data.authenticated === true && response.data.user) {
                console.log('✅ Setting authenticated: true, user:', response.data.user);
                setIsAuthenticated(true);
                setUser(response.data.user);
            } else {
                console.log('❌ Setting authenticated: false, response:', response.data);
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error('❌ Auth status check failed:', error);



            // 네트워크 에러이고 재시도 횟수가 3회 미만인 경우 재시도
            if (axios.isAxiosError(error) &&
                (error.code === 'NETWORK_ERROR' || error.code === 'ECONNABORTED') &&
                retryCount < 2) {
                console.log(`🔄 Retrying auth check in 1 second... (${retryCount + 1}/3)`);
                setTimeout(() => {
                    checkAuthStatus(retryCount + 1);
                }, 1000);
                return;
            }

            if (axios.isAxiosError(error)) {
                console.error('Error response:', error.response?.data);
                console.error('Error status:', error.response?.status);
                console.error('Error code:', error.code);
                console.error('Error config:', error.config);

                // 세션이 있는데 401 에러인 경우 세션 불일치 문제일 수 있음
                if (error.response?.status === 401 && document.cookie.includes('JSESSIONID')) {
                    console.warn('⚠️ Session mismatch detected - JSESSIONID exists but auth failed');
                    console.warn('Current URL:', window.location.href);
                    console.warn('Request URL:', error.config?.url);
                }
            }

            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setLoading(false);
            setInitialized(true);
        }
    };

    // 초기 마운트 시 인증 상태 확인
    useEffect(() => {
        console.log('🚀 AuthProvider mounted, initializing auth...');
        console.log('Current URL:', window.location.href);
        // debugCookies();
        checkAuthStatus();
    }, []); // 컴포넌트 마운트 시에만 실행


    // 로그인
    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            console.log('🔐 Attempting login with:', email);
            setLoading(true);

            const response = await axios.post('http://localhost:8080/api/login', {
                email,
                password
            }, {
                withCredentials: true,
                timeout: 10000
            });

            console.log('✅ Login response:', response.status, response.data);

            if (response.status === 200 && response.data.user) {
                console.log('✅ Setting user from login response:', response.data.user);
                setIsAuthenticated(true);
                setUser(response.data.user);
                return true;
            } else {
                console.log('❓ Login response invalid, rechecking auth status...');
                await checkAuthStatus();
                return false;
            }
        } catch (error) {
            console.error('❌ Login failed:', error);
            if (axios.isAxiosError(error)) {
                console.error('Login error response:', error.response?.data);
            }
            setIsAuthenticated(false);
            setUser(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // 로그아웃
    const logout = async () => {
        try {
            console.log('🚪 Attempting logout...');
            setLoading(true);

            await axios.post('http://localhost:8080/api/logout', {}, {
                withCredentials: true,
                timeout: 5000
            });
            console.log('✅ Logout API call successful');
        } catch (error) {
            console.error('❌ Logout failed:', error);
        } finally {
            console.log('🧹 Clearing auth state');
            setIsAuthenticated(false);
            setUser(null);
            setLoading(false);


        }
    };

    // 상태 변경 로깅
    useEffect(() => {
        console.log('🔄 AuthContext state changed:', {
            isAuthenticated,
            user: user ? `${user.nickname} (${user.email})` : null,
            loading,
            initialized,
            pathname: window.location.pathname,
            href: window.location.href
        });
    }, [isAuthenticated, user, loading, initialized]);

    const value: AuthContextType = {
        isAuthenticated,
        user,
        login,
        logout,
        checkAuthStatus,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};