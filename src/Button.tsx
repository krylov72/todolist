export type ButtonPropsType = {
	title: string
	onClick?: Function
}

export const Button = ({title}: ButtonPropsType) => {
	return (
		<button>{title}</button>
	)
}
