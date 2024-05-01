import { FilterValuesType, TaskType } from "./App";
import { Button } from "./Button";

export type PropsType = {
	title: string
	tasks: Array<TaskType>
	removeTask: (id:number) => void
	changeFilter: (value:FilterValuesType) => void
}

export const Todolist = ({ title, tasks,removeTask, changeFilter }: PropsType) => {

	return (
		<div>
			<h3>{title}</h3>
			<div>
				<input />
				<button>+</button>
			</div>
			{
				tasks.length === 0
					? <p>Тасок нет</p>
					: <ul>
						{
							tasks.map((t) => {
								return <li>
									<input type="checkbox" checked={t.isDone} />
									<span>{t.title}</span>
									<button onClick={() => {removeTask(t.id)}}>x</button>
								</li>
							})
						}
					</ul>
			}
			<div>
				 <button onClick={() => {changeFilter('all')}}>All</button>
				 <button onClick={() => {changeFilter('completed')}}>Completed</button>
				 <button onClick={() => {changeFilter('active')}}>Active</button>
			</div>
		</div>
	)
}
