// router.ts
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import Layout from './Layout';
import Home from './components/Home';
import MarkdownEditor from './components/MarkdownEditor';
import Post from './components/Post';
import PostList from './components/PostList';

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/posts/edit" element={<MarkdownEditor mode="create" />} />
      <Route path="/posts/:id/edit" element={<MarkdownEditor mode="edit" />} />
      <Route path="/posts" element={<PostList />} />
      <Route path="/posts/:id" element={<Post />} />
    </Route>
  )
);
