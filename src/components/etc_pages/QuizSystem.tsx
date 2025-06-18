import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Clock, Plus, Play, CheckCircle, XCircle, Trophy, Users, BookOpen } from 'lucide-react';
import axios from 'axios';
import { API_URL } from '../../config/api';

// API 서비스 함수들

const api = {
    // 퀴즈 관련 API
    getQuizzesByCategory: async () => {
        const response = await axios.get(`${API_URL}/quiz/by-category`, {
            withCredentials: true
        });
        if (response.status !== 200) throw new Error('Failed to fetch quizzes');
        return response.data;
    },
    
    getRandomQuiz: async () => {
        const response = await axios.get(`${API_URL}/quiz/random`, {
            withCredentials: true
        });
        if (response.status !== 200) throw new Error('Failed to fetch random quiz');
        return response.data;
    },

    getQuizForPlay: async (id: number) => {
        const response = await axios.get(`${API_URL}/quiz/${id}/play`, {
            withCredentials: true
        });
        if (response.status !== 200) throw new Error('Failed to fetch quiz');
        return response.data;
    },
    
    createQuiz: async (quizData: {
        question: string;
        answer: string;
        timeLimit: number;
        category: string;
        difficulty: string;
    }) => {
        const response = await axios.post(`${API_URL}/quiz`, quizData, {
            withCredentials: true
        });
        if (response.status !== 201) throw new Error('Failed to create quiz');
        return response.data;
    },
    
    submitAnswer: async (answerData: { quizId: number; userAnswer: string; timeTaken: number }) => {
        const response = await axios.post(`${API_URL}/quiz/submit`, answerData, {
            withCredentials: true
        });
        if (response.status !== 200) throw new Error('Failed to submit answer');
        return response.data;
    },

    // 통계 관련 API
    getUserStats: async () => {
        const response = await axios.get(`${API_URL}/stats/me`, {
            withCredentials: true
        });
        if (response.status !== 200) throw new Error('Failed to fetch user stats');
        return response.data;
    },
    
    // 인증 관련 API
    getAuthStatus: async () => {
        const response = await axios.get(`${API_URL}/auth/status`, {
            withCredentials: true
        });
        if (response.status !== 200) throw new Error('Failed to check auth status');
        return response.data;
    }
};

// 퀴즈 데이터 타입 정의
interface Quiz {
    id: number;
    question: string;
    answer?: string;
    timeLimit: number;
    category: string;
    createdBy: string;
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: string;
}

interface QuizResult {
    isCorrect: boolean;
    userAnswer: string;
    correctAnswer: string;
    timeTaken: number;
}

interface UserStats {
    totalPlayed: number;
    correctAnswers: number;
    currentStreak: number;
}

// 메인 퀴즈 컴포넌트
const QuizSystem = () => {
    const [currentView, setCurrentView] = useState<'main' | 'play' | 'create' | 'results'>('main');
    const [quizzesByCategory, setQuizzesByCategory] = useState<Record<string, Quiz[]>>({});
    const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [userStats, setUserStats] = useState<UserStats>({
        totalPlayed: 0,
        correctAnswers: 0,
        currentStreak: 0
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // 인증 상태 확인
    useEffect(() => {
        checkAuthStatus();
    }, []);

    // 퀴즈 데이터 로드
    useEffect(() => {
        loadQuizzes();
    }, []);

    // 사용자 통계 로드 (인증된 경우에만)
    useEffect(() => {
        if (isAuthenticated) {
            loadUserStats();
        }
    }, [isAuthenticated]);

    const checkAuthStatus = async () => {
        try {
            const response = await api.getAuthStatus();
            setIsAuthenticated(response.authenticated);
        } catch (error) {
            console.log('Not authenticated');
            setIsAuthenticated(false);
        }
    };

    const loadQuizzes = async () => {
        try {
            setLoading(true);
            const data = await api.getQuizzesByCategory();
            setQuizzesByCategory(data);
            setError(null);
        } catch (error) {
            console.error('Failed to load quizzes:', error);
            setError('퀴즈를 불러오는데 실패했습니다');
        } finally {
            setLoading(false);
        }
    };

    const loadUserStats = async () => {
        try {
            const response = await api.getUserStats();
            setUserStats(response.stats);
        } catch (error) {
            console.error('Failed to load user stats:', error);
        }
    };

    // 타이머 로직
    useEffect(() => {
        let currentTime = timeLeft;
        
        const updateTimer = () => {
            const timerElement = document.getElementById('quiz-timer-text');
            if (timerElement) {
                timerElement.textContent = `${currentTime}초`;
                
                const timerContainer = document.getElementById('quiz-timer');
                if (timerContainer) {
                    timerContainer.className = `inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold ${
                        currentTime <= 5 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`;
                }
            }
            
            if (currentTime <= 0) {
                setIsTimerActive(false);
                if (currentQuiz && !quizResult) {
                    const inputValue = inputRef.current?.value || '';
                    handleTimeUp(inputValue);
                }
                return;
            }
            
            currentTime--;
            timerRef.current = setTimeout(updateTimer, 1000);
        };
        
        if (isTimerActive && currentTime > 0) {
            updateTimer();
        }

        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, [isTimerActive, currentQuiz, quizResult]);

    const startQuiz = async (quiz?: Quiz) => {
        try {
            let selectedQuiz = quiz;
            
            if (!selectedQuiz) {
                // 랜덤 퀴즈 가져오기
                selectedQuiz = await api.getRandomQuiz();
            } else if (quiz) {
                // 특정 퀴즈의 플레이용 데이터 가져오기 (정답 숨김)
                selectedQuiz = await api.getQuizForPlay(quiz.id);
            }
            
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            
            setCurrentQuiz(selectedQuiz ?? null);
            setTimeLeft(selectedQuiz ? selectedQuiz.timeLimit : 0);
            setUserAnswer('');
            setQuizResult(null);
            setIsTimerActive(true);
            setCurrentView('play');
            
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.value = '';
                    inputRef.current.focus();
                }
            }, 100);
        } catch (error) {
            console.error('Failed to start quiz:', error);
            setError('퀴즈를 시작하는데 실패했습니다');
        }
    };

    const submitAnswer = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentQuiz || !isTimerActive) return;

        const actualAnswer = inputRef.current?.value || '';
        setIsTimerActive(false);
        
        const timeTaken = currentQuiz.timeLimit - timeLeft;

        try {
            const response = await api.submitAnswer({
                quizId: currentQuiz.id,
                userAnswer: actualAnswer.trim(),
                timeTaken: timeTaken
            });

            const result: QuizResult = {
                isCorrect: response.result.isCorrect,
                userAnswer: response.result.userAnswer,
                correctAnswer: response.result.correctAnswer,
                timeTaken: response.result.timeTaken
            };

            setQuizResult(result);
            
            // 통계 업데이트 (인증된 사용자만)
            if (isAuthenticated) {
                loadUserStats();
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
            setError('답안 제출에 실패했습니다');
        }
    };

    const handleTimeUp = async (answer: string) => {
        if (!currentQuiz) return;
        
        try {
            const response = await api.submitAnswer({
                quizId: currentQuiz.id,
                userAnswer: answer || '(시간 초과)',
                timeTaken: currentQuiz.timeLimit
            });

            const result: QuizResult = {
                isCorrect: false,
                userAnswer: answer || '(시간 초과)',
                correctAnswer: response.result.correctAnswer,
                timeTaken: currentQuiz.timeLimit
            };

            setQuizResult(result);
            
            if (isAuthenticated) {
                loadUserStats();
            }
        } catch (error) {
            console.error('Failed to submit answer:', error);
        }
    };

    const addNewQuiz = async (newQuiz: {
        question: string;
        answer: string;
        timeLimit: number;
        category: string;
        difficulty: string;
    }) => {
        try {
            await api.createQuiz(newQuiz);
            // 퀴즈 목록 새로고침
            await loadQuizzes();
            return true;
        } catch (error) {
            console.error('Failed to create quiz:', error);
            setError('퀴즈 생성에 실패했습니다');
            return false;
        }
    };

    const resetGame = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        
        setCurrentView('main');
        setCurrentQuiz(null);
        setUserAnswer('');
        setQuizResult(null);
        setIsTimerActive(false);
    };

    // 로딩 화면
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">퀴즈를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 오류 화면
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-center bg-white p-8 rounded-xl shadow-lg">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 mb-2">오류 발생</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => {
                            setError(null);
                            loadQuizzes();
                        }}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    // 메인 화면
    const MainView = () => (
        <div className="space-y-6">
            {/* 헤더 */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                    <Trophy className="text-yellow-500" />
                    퀴즈 챌린지
                </h1>
                <p className="text-gray-600">단답형 퀴즈로 실력을 테스트해보세요!</p>
            </div>

            {/* 사용자 통계 */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Users className="text-blue-500" />
                    {isAuthenticated ? '내 통계' : '전체 통계'}
                </h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{userStats.totalPlayed}</div>
                        <div className="text-sm text-gray-600">총 문제</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            {userStats.totalPlayed > 0 ? Math.round((userStats.correctAnswers / userStats.totalPlayed) * 100) : 0}%
                        </div>
                        <div className="text-sm text-gray-600">정답률</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{userStats.currentStreak}</div>
                        <div className="text-sm text-gray-600">연속 정답</div>
                    </div>
                </div>
                {!isAuthenticated && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                        로그인하면 개인 통계를 확인할 수 있습니다
                    </p>
                )}
            </div>

            {/* 액션 버튼 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => setCurrentView('create')}
                    disabled={!isAuthenticated}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                    <Plus className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold text-lg">문제 만들기</div>
                    <div className="text-sm opacity-90">
                        {isAuthenticated ? '새로운 퀴즈를 등록하세요' : '로그인이 필요합니다'}
                    </div>
                </button>

                <button
                    onClick={() => startQuiz()}
                    disabled={Object.keys(quizzesByCategory).length === 0}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white p-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                    <Play className="w-8 h-8 mx-auto mb-2" />
                    <div className="font-semibold text-lg">랜덤 퀴즈</div>
                    <div className="text-sm opacity-90">무작위 문제에 도전하세요</div>
                </button>
            </div>

            {/* 카테고리별 퀴즈 목록 */}
            <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <BookOpen className="text-blue-500" />
                    카테고리별 퀴즈
                </h2>
                <div className="space-y-6">
                    {Object.entries(quizzesByCategory).map(([category, categoryQuizzes]) => (
                        <div key={category} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
                                <h3 className="text-lg font-semibold flex items-center justify-between">
                                    <span>{category}</span>
                                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                                        {categoryQuizzes.length}개 문제
                                    </span>
                                </h3>
                            </div>
                            <div className="p-4 space-y-3">
                                {categoryQuizzes.map((quiz: Quiz) => (
                                    <div key={quiz.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-medium text-gray-800 flex-1 pr-4">{quiz.question}</h4>
                                            <button
                                                onClick={() => startQuiz(quiz)}
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap cursor-pointer"
                                            >
                                                도전하기
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {quiz.timeLimit}초
                                            </span>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                quiz.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                                quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                'bg-red-100 text-red-700'
                                            }`}>
                                                {quiz.difficulty === 'easy' ? '쉬움' : quiz.difficulty === 'medium' ? '보통' : '어려움'}
                                            </span>
                                            <span className="ml-auto">by {quiz.createdBy}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // 퀴즈 플레이 화면
    const PlayView = () => (
        <div className="max-w-lg mx-auto">
            {!quizResult ? (
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* 타이머 */}
                    <div className="text-center mb-8">
                        <div 
                            id="quiz-timer"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-lg font-bold bg-blue-100 text-blue-600"
                        >
                            <Clock className="w-5 h-5" />
                            <span id="quiz-timer-text">{timeLeft}초</span>
                        </div>
                    </div>

                    {/* 문제 */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">{currentQuiz?.question}</h2>
                        <div className="flex justify-center gap-2 text-sm text-gray-500">
                            <span className="bg-gray-100 px-2 py-1 rounded">{currentQuiz?.category}</span>
                            <span className={`px-2 py-1 rounded ${
                                currentQuiz?.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                                currentQuiz?.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-red-100 text-red-700'
                            }`}>
                                {currentQuiz?.difficulty === 'easy' ? '쉬움' : currentQuiz?.difficulty === 'medium' ? '보통' : '어려움'}
                            </span>
                        </div>
                    </div>

                    {/* 답안 입력 */}
                    <form onSubmit={submitAnswer} className="space-y-4">
                        <input
                            ref={inputRef}
                            type="text"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium"
                            placeholder="답을 입력하세요"
                            disabled={!isTimerActive}
                            autoComplete="off"
                        />

                        <button
                            type="submit"
                            disabled={!isTimerActive}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:cursor-not-allowed cursor-pointer"
                        >
                            답안 제출
                        </button>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                    {/* 결과 아이콘 */}
                    <div className="mb-6">
                        {quizResult.isCorrect ? (
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                        ) : (
                            <XCircle className="w-20 h-20 text-red-500 mx-auto" />
                        )}
                    </div>

                    {/* 결과 텍스트 */}
                    <h2 className={`text-3xl font-bold mb-4 ${quizResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        {quizResult.isCorrect ? '정답!' : '틀렸습니다'}
                    </h2>

                    {/* 답안 비교 */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                        <div>
                            <span className="font-medium text-gray-700">내 답안: </span>
                            <span className={quizResult.isCorrect ? 'text-green-600' : 'text-red-600'}>
                                {quizResult.userAnswer}
                            </span>
                        </div>
                        {!quizResult.isCorrect && (
                            <div>
                                <span className="font-medium text-gray-700">정답: </span>
                                <span className="text-green-600">{quizResult.correctAnswer}</span>
                            </div>
                        )}
                        <div className="text-sm text-gray-500">
                            소요 시간: {quizResult.timeTaken}초
                        </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="space-y-3">
                        <button
                            onClick={() => startQuiz()}
                            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer"
                        >
                            다음 문제
                        </button>
                        <button
                            onClick={resetGame}
                            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                        >
                            메인으로
                        </button>
                    </div>
                </div>
            )}
        </div>
    );

    // 문제 생성 화면
    const CreateView = () => {
        const [newQuiz, setNewQuiz] = useState({
            question: '',
            answer: '',
            timeLimit: 10,
            category: '',
            difficulty: 'medium' as 'easy' | 'medium' | 'hard'
        });

        const handleSubmit = async () => {
            if (!newQuiz.question.trim() || !newQuiz.answer.trim() || !newQuiz.category.trim()) {
                alert('모든 필드를 입력해주세요.');
                return;
            }

            const success = await addNewQuiz(newQuiz);
            if (success) {
                alert('문제가 성공적으로 등록되었습니다!');
                setCurrentView('main');
                setNewQuiz({
                    question: '',
                    answer: '',
                    timeLimit: 10,
                    category: '',
                    difficulty: 'medium'
                });
            }
        };

        return (
            <div className="max-w-lg mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">새 문제 만들기</h2>
                        <p className="text-gray-600">다른 사용자들이 도전할 문제를 만들어보세요</p>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                문제
                            </label>
                            <textarea
                                value={newQuiz.question}
                                onChange={(e) => setNewQuiz(prev => ({ ...prev, question: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                placeholder="문제를 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                정답
                            </label>
                            <input
                                type="text"
                                value={newQuiz.answer}
                                onChange={(e) => setNewQuiz(prev => ({ ...prev, answer: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="정답을 입력하세요"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                카테고리
                            </label>
                            <input
                                type="text"
                                value={newQuiz.category}
                                onChange={(e) => setNewQuiz(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="예: 수학, 역사, 과학 등"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    제한 시간 (초)
                                </label>
                                <select
                                    value={newQuiz.timeLimit}
                                    onChange={(e) => setNewQuiz(prev => ({ ...prev, timeLimit: Number(e.target.value) }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value={5}>5초</option>
                                    <option value={10}>10초</option>
                                    <option value={15}>15초</option>
                                    <option value={30}>30초</option>
                                    <option value={60}>60초</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    난이도
                                </label>
                                <select
                                    value={newQuiz.difficulty}
                                    onChange={(e) => setNewQuiz(prev => ({ ...prev, difficulty: e.target.value as 'easy' | 'medium' | 'hard' }))}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="easy">쉬움</option>
                                    <option value="medium">보통</option>
                                    <option value="hard">어려움</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={handleSubmit}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 cursor-pointer"
                            >
                                문제 등록하기
                            </button>
                            <button
                                type="button"
                                onClick={() => setCurrentView('main')}
                                className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-all duration-200 cursor-pointer"
                            >
                                취소
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-4xl mx-auto py-8">
                {currentView === 'main' && <MainView />}
                {currentView === 'play' && <PlayView />}
                {currentView === 'create' && <CreateView />}
            </div>
        </div>
    );
};

export default QuizSystem;