// router.ts
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from './Layout';
import { Home, MarkdownEditor, Post, PostList, Portfolio, NotFound, ErrorPage, Login, Signup, AdminRoute, ForgotPassword, ResetPassword, QuizSystem } from './components/index'

export const router = createBrowserRouter(
  createRoutesFromElements(
      <Route element={<Layout />} errorElement={<ErrorPage />}>
        <Route path="/" element={<Home />} />
        <Route path="/posts/edit" element={<AdminRoute><MarkdownEditor mode="create" /></AdminRoute>} />
        <Route path="/posts/:id/edit" element={<AdminRoute><MarkdownEditor mode="edit" /></AdminRoute>} />
        <Route path="/posts" element={<PostList />} />
        <Route path="/posts/:id" element={<Post />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/quiz" element={<QuizSystem />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/error" element={<ErrorPage />} />
      </Route>
  )
);
