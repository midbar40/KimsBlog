import { Routes, Route, useParams } from 'react-router-dom';
import Layout from './Layout'
import Home from '@components/Home'
import MarkdownEditor from '@components/MarkdownEditor';
import Post from '@components/Post';
import PostList from '@components/PostList';

function App() {
  const { id } = useParams();
  const postId = id ? parseInt(id, 10) : undefined;
  console.log('appPostId', postId, id)
  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />}/>
          <Route path='/posts/edit' element={<MarkdownEditor mode="create"/>}/>
          <Route path='/posts/:id/edit' element={<MarkdownEditor mode="edit" postId={postId}/>}/>
          <Route path='/posts' element={<PostList />}/>
          <Route path='/posts/:id' element={<Post />}/>
        </Route>
      </Routes>
  )
}

export default App
