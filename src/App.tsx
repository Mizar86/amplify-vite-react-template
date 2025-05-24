import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import { useAuthenticator } from "@aws-amplify/ui-react";
import SiriWave from "react-siriwave";

const client = generateClient<Schema>();

function App() {
  const { user, signOut } = useAuthenticator();
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }, []);

  function createTodo() {
    client.models.Todo.create({ content: window.prompt("Todo content") });
  }
 
  function deleteTodo(id: string) {
    client.models.Todo.delete({ id })
  }

  return (
    <main>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
        <SiriWave
          style="ios9"
          width={window.innerWidth}
          height={window.innerHeight}
          amplitude={0.2}
          speed={0.05}
          color="#ffffff"
          cover={true}
          autostart={true}
          pixelDepth={0.02}
          lerpSpeed={0.01}
          curveDefinition={[
            { attenuation: -2, lineWidth: 1, opacity: 0.3 },
            { attenuation: -6, lineWidth: 1, opacity: 0.4 },
            { attenuation: 4, lineWidth: 1, opacity: 0.6 },
            { attenuation: 2, lineWidth: 1, opacity: 0.3 },
            { attenuation: 1, lineWidth: 1.5, opacity: 0.1 }
          ]}
        />
      </div>
      
      <h1>{user?.signInDetails?.loginId}'s todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li onClick={() => deleteTodo(todo.id)} key={todo.id}>{todo.content}</li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
      <button onClick={signOut}>Sign out</button>
    </main>
  );
}

export default App;
