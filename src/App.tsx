import { Routes, Route } from 'react-router-dom';
import Layout from './Layout'
import Home from '@components/Home'
import MarkdownEditor from '@components/MarkdownEditor';

function App() {

  return (
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<Home />}/>
          <Route path='/edit' element={<MarkdownEditor />}/>
        </Route>
      </Routes>
  )
}

export default App
