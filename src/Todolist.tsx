import React from 'react';
import {FiltersValueType, TasksType} from "./App";

type TodoListPropsType = {
    id?: number,
    title: string,
    tasks: TasksType[]
    removeTask:(taskId:number)=> void
    changeFilter:(value:FiltersValueType) => void
    deleteAllTasks:() => void
} 

export const TodoList = ({
                             id,
                             title,
                             tasks,
                             removeTask,
                             changeFilter,
                             deleteAllTasks
                         }: TodoListPropsType) => {
    return (
        <div>
            <h3>{title}</h3>
            <div>
                <input/>
                <button>+</button>
            </div>
            {tasks.length === 0 ?
                (<p>No tasks</p>) :
                (<ul>
                    {tasks.map((t) =>
                        <li key={t.id}>
                            <input type="checkbox" checked={t.isDone}/>
                            <span>{t.title}</span>
                            <button onClick={() =>{removeTask(t.id)}}>x</button>
                        </li>
                    )}
                </ul>)
            }
            <button onClick={() => {deleteAllTasks()}} style={{marginLeft:25, marginBottom:20}}>Remove All Tasks</button>
            <div>
                <button onClick={() => {changeFilter('all')}}>All</button>
                <button onClick={() => {changeFilter('active')}}>Active</button>
                <button onClick={() => {changeFilter('completed')}}>Completed</button>
                <button onClick={() => {changeFilter('firstThree')}}>First Three</button>
            </div>
        </div>
    );
};

