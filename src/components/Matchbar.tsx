export interface MatchbarProps {
	index: number;
	setIndex: (arg: number) => void;
	items: any[]
}

export default function Matchbar(
	{index, setIndex, items} : MatchbarProps
) {
	return (<div className="w-full overflow-x-scroll">
		{
			items.map((item: any) => {
				return (
					<div>
						
					</div>
				)
			})
		}
	</div>)
}