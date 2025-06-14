import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom"
import YouTubePlayer from "./YouTubePlayer";
import { useAuth } from '@components/AuthContext';

// Menu items.
const items = [
  {
    index: 1,
    title: "Home",
    url: "/",
    requireAuth: false,
    adminOnly: false,
  },
  {
    index: 2,
    title: "PostList",
    url: "/posts",
    requireAuth: false,
    adminOnly: false,
  },
  {
    index: 3,
    title: "Posting",
    url: "posts/edit",
    requireAuth: true,
    adminOnly: true,
  },
  {
    index: 5,
    title: "Portfolio",
    url: "/portfolio",
    requireAuth: false,
    adminOnly: false,
  },
]

const Navbar = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();
  let navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      console.log(`현재 로그인한 사용자: ${user.nickname} (${user.email})`);
    }
  }, [isAuthenticated, user]);


  const handleLogout = async () => {
    try {
      // AuthContext의 logout 함수 사용
      await logout();
      console.log('로그아웃 성공');
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  const handleLoginClick = () => {
    navigate('/login');
  }

  if (loading) {
    return <span className="hidden">Loading...</span>; // 로딩 상태 처리
  }


  return (
    <>
      <div className="flex gap-4 sm:gap-6 md:gap-10 justify-center flex-wrap text-sm sm:text-base">
        {items
          .filter(item => {
            // 인증이 필요한 경우 로그인 체크
            if (item.requireAuth && !isAuthenticated) return false;
            // 관리자 전용인 경우 관리자 체크
            if (item.adminOnly && user?.role !== 'ADMIN') return false;
            return true;
          }).map((item) => (
            <div key={item.title} className="mb-5">
              <NavLink
                to={item.url}
                end
                className={({ isActive }) =>
                  `cursor-pointer transition-colors duration-200 ${isActive ? "text-black font-semibold" : "text-gray-400"
                  }`
                }
              >
                {item.title}
              </NavLink>
            </div>
          ))}

        {/* 인증 상태에 따른 버튼 표시 */}
        <YouTubePlayer />
        <div className="mb-5">
          {isAuthenticated ? (
            <div className="flex gap-4 items-center">
              <button
                onClick={handleLogout}
                className="cursor-pointer transition-colors duration-200 text-gray-400 hover:text-black hover:font-semibold bg-transparent border-none p-0 text-sm sm:text-base font-inherit"
              >
                Logout
              </button>
              <span className="text-sm text-gray-600 ml-20">
                안녕하세요, {user?.nickname}님
              </span>
            </div>
          ) : (
            <button
              onClick={handleLoginClick}
              className="cursor-pointer transition-colors duration-200 text-gray-400 hover:text-black hover:font-semibold bg-transparent border-none p-0 text-sm sm:text-base font-inherit"
            >
              Login
            </button>
          )}
        </div>

      </div>
    </>
  );
};

export default Navbar