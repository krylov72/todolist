import React, { useState } from 'react';
import { TodoList } from './Todolist';
import './App.css';
import { v1 } from 'uuid';


export type TasksType = {
    id: string,
    title: string,
    isDone: boolean
}

export type FiltersValueType = 'all' | 'active' | 'completed' | 'firstThree'

function App() {
    const [tasks,setTasks] = useState<TasksType[]>([
        {id: v1(), title: 'Task 1', isDone: false},
        {id: v1(), title: 'Task 2', isDone: true},
        {id: v1(), title: 'Task 3', isDone: true},
        {id: v1(), title: 'Task 4', isDone: true},
    ])
    
    const addTask = (title:string) => {
        const newTask = {
            id: v1(),
            title,
            isDone:false
        }
        setTasks([newTask,...tasks])
    }

    const deleteAllTasks = () => {
        let deletedTasks = tasks
        deletedTasks = []
        setTasks(deletedTasks)
    }
    

    const removeTask = (taskId:string) => {
        let deletedTasks = tasks.filter(t=>t.id !== taskId)
        setTasks(deletedTasks)
    }

   
    return (
        <div className="App">
            <TodoList title={"What is your todo list?"} tasks={tasks} removeTask={removeTask}  deleteAllTasks={deleteAllTasks} addTask={addTask}/>
        </div>
    );
}

export default App;


//Hi guys!
//1. Let's create a 'DELETE ALL TASKS' button, and place it above the filter buttons
//Clicking the button removes all tasks
//2. Let's create a fourth filter button-if you click it, the first three tasks will be displayed
//3. Relocate everything associated with  filters to the Todolist.tsx component. Make it work
//