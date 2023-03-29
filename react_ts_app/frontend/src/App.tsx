import React, { useState, useEffect } from 'react';
import './App.css';

type Todo = {
  inputValue: string;
  content: string;
  genre: string;
  id: number;
  checked: boolean;
};

type ModalProps = {
  todo: Todo | null;
  onCancel: () => void;
  onUpdate: (id: number, inputValue: string, content: string) => void;
};


const Modal: React.FC<ModalProps> = ({ todo, onClose, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo ? todo.inputValue : '');
  const [editedContent, setEditedContent] = useState(todo ? todo.content : '');

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleSave = () => {
    if (todo) {
      onUpdate(todo.id, editedTitle, editedContent);
    }
    setEditMode(false);
  };

  if (!todo) return null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalContent" onClick={(e) => e.stopPropagation()}>
        {editMode ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="inputText"
            />
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="inputText"
            />
          </>
        ) : (
          <>
            <p>{todo.inputValue}</p>
            <h3>内容：</h3>
            <p>{todo.content}</p>
          </>
        )}
        {editMode ? (
          <button onClick={handleSave} className="editButton">
            保存
          </button>
        ) : (
          <button onClick={handleEdit} className="editButton">
            編集
          </button>
        )}
        <button onClick={onClose} className="closeButton">
          閉じる
        </button>
      </div>
    </div>
  );
};

function App() {
  const [inputValue, setInputValue] = useState("");
  const [contentValue, setContentValue] = useState("");
  const [genreValue, setGenreValue] = useState("仕事");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContentValue(e.target.value);
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGenreValue(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const newTodo = {
      inputValue: inputValue,
      content: contentValue,
      genre: genreValue,
    };
  
    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
  
      const createdTodo = await response.json();
      setTodos([createdTodo, ...todos]);
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  
    setInputValue('');
    setContentValue('');
  };
  

  const handleClick = (id: number) => {
    setSelectedTodo(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedTodo(null);
    setShowModal(false);
  };

  const handleUpdate = async (id: number, newTitle: string, newContent: string) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update todo');
      }
  
      const updatedTodo = await response.json();
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, inputValue: updatedTodo.title, content: updatedTodo.content };
        } else {
          return todo;
        }
      });
      setTodos(updatedTodos);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };
  

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }
  
      const newTodos = todos.filter((todo) => todo.id !== id);
      setTodos(newTodos);
      if (selectedTodo === id) {
        setSelectedTodo(null);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };
  

  const selectedTodoContent = selectedTodo !== null ? todos.find((todo) => todo.id === selectedTodo) : null;


  // Todoリストを取得する関数
  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:3001/todos');
      const todos = await response.json();
      setTodos(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

   // コンポーネントがマウントされたときにTodoリストを取得
   useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="App">
      <div>
        <h2>Todoリスト with Typescript</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="タイトル"
            onChange={(e) => handleTitleChange(e)}
            className="inputText"
            value={inputValue}
          />
          <input
            type="text"
            placeholder="内容"
            onChange={(e) => handleContentChange(e)}
            className="inputText"
            value={contentValue}
          />
          <select value={genreValue} onChange={(e) => handleGenreChange(e)} className="genreSelect">
            <option value="仕事">仕事</option>
            <option value="プライベート">プライベート</option>
            <option value="趣味">趣味</option>
            <option value="家族">家族</option>
            <option value="市役所手続き">市役所手続き</option>
          </select>
          <input type="submit" value="作成" className="submitButton" />
        </form>
        <ul className="todoList">
          {todos.map((todo) => (
            <li key={todo.id} onClick={() => handleClick(todo.id)} className="todoItem">
              <span className="todoTitle">{todo.inputValue}</span>
              <span className="todoGenre">{todo.genre}</span>
              <button onClick={() => handleDelete(todo.id)} className="deletebutton">
                消
              </button>
            </li>
          ))}
        </ul>
        {showModal && <Modal todo={selectedTodoContent} onClose={handleCloseModal} onUpdate={handleUpdate} />}
      </div>
    </div>
  );
}

export default App;

