import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import Home from '@components/Home'
import MarkdownEditor from '@components/MarkdownEditor';
import Post from '@components/Post';
import PostList from '@components/PostList';

function App() {

  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />}/>
          <Route path='/posts/edit' element={<MarkdownEditor />}/>
          <Route path='/posts' element={<PostList />}/>
          <Route path='/posts/:id' element={<Post />}/>
        </Route>
      </Routes>
  )
}

export default App
