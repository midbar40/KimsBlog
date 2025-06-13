import { useState } from 'react'
import Terminal, { TerminalOutput, TerminalInput, ColorMode } from 'react-terminal-ui'
import { useNavigate, NavigateFunction } from 'react-router-dom'

type Line = { type: 'input' | 'output', text: string };


const Home = () => {
  let navigate: NavigateFunction = useNavigate()
  const [lines, setLines] = useState<Line[]>([
    {
      type: 'output',
      text: `Kim's Blog에 오신 것을 환영합니다! \n다음과 같은 명령어를 사용하실 수 있습니다.\nhelp, hello, about, clear, cd posts, cd edit, cd portfolio`
    },
  ]);

  const handleInput = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();

    // cd 명령어
    if (trimmedInput.startsWith('cd ')) {
      const path = trimmedInput.slice(3); // 'cd ' 다음 문자열만 추출
      console.log(path)
      switch (path) {
        // 이유는 모르겠지만 home만 안들어온다..path 문제도, router문제도 아닌데
        case 'posts':
          navigate('/posts')
          break
        case 'edit':
          navigate('/posts/edit')
          break
        case 'portfolio':
          navigate('/portfolio')
          break
        default:
          setLines(prev => [
            ...prev,
            { type: 'input', text: input },
            { type: 'output', text: `Unknown cd path: "${path}"` }
          ]);
          return;
      }
    }

    // 일반 명령어 처리
    let response: string;
    switch (trimmedInput) {
      case 'help':
        response = '이용가능한 명령어 입니다 - help, hello, about, clear, cd home, cd posts, cd edit'
        break
      case 'hello':
        response = '안녕하세요😊.'
        break
      case 'about':
        response = "KimsBlog에 오신 것을 환영합니다. 명령어나 상단 Navbar를 통해 각 페이지로 이동 할 수 있습니다."
        break
      case 'clear':
        setLines([])
        return
      default:
        response = `Unknown command: "${input}"`
    }
    setLines(prev => [
      ...prev,
      { type: 'input', text: input },
      { type: 'output', text: response }
    ]);
  }

  return (
    <div style={{ height: '75vh' }}>
      <Terminal
        name="Kim's Blog"
        colorMode={ColorMode.Dark}
        onInput={handleInput}
      >
        {lines.map((line, idx) =>
          line.type === 'input'
            ? <TerminalInput key={`input-${idx}`}>{line.text}</TerminalInput>
            : <TerminalOutput key={`output-${idx}`}>{line.text}</TerminalOutput>
        )}    </Terminal>
    </div>
  )
}

export default Home
