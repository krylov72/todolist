import React, { useState } from 'react';
import { TodoList } from './Todolist';
import './App.css';


export type TasksType = {
    id: number,
    title: string,
    isDone: boolean
}

export type FiltersValueType = 'all' | 'active' | 'completed' | 'firstThree'

function App() {
    const [tasks,setTasks] = useState<TasksType[]>([
        {id: 1, title: 'Task 1', isDone: false},
        {id: 2, title: 'Task 2', isDone: true},
        {id: 3, title: 'Task 3', isDone: true},
        {id: 4, title: 'Task 4', isDone: true},
    ])

    const deleteAllTasks = () => {
        filteredTasks = []
        setTasks(filteredTasks)
    }
    

    const removeTask = (taskId:number) => {
        let deletedTasks = tasks.filter(t=>t.id !== taskId)
        setTasks(deletedTasks)
    }

    const [filter,setFilter] = useState<FiltersValueType>('all');
    let filteredTasks = tasks;
    if (filter === 'completed') {
        filteredTasks = tasks.filter(t=>t.isDone === true)
    } else if (filter === "active") {
        filteredTasks = tasks.filter(t=>t.isDone === false)
    } else if (filter === 'firstThree') {
        filteredTasks = tasks.filter(t=>t.id === 1 || t.id === 2 || t.id === 3)
    }
    

    const changeFilter = (value:FiltersValueType) => {
        setFilter(value)
    }
    return (
        <div className="App">
            <TodoList title={"What is your todo list?"} tasks={filteredTasks} removeTask={removeTask} changeFilter={changeFilter} deleteAllTasks={deleteAllTasks}/>
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