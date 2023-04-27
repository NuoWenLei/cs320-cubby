import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export interface MatchbarProps {
	index: number;
	setIndex: (arg: number) => void;
	items: number[]
}

export default function Matchbar(
	{index, setIndex, items} : MatchbarProps
) {
	function indexLeft() {
		if (index > 0) {
			setIndex(index - 1)
		}
	}

	function indexRight() {
		if (index < (items.length - 1)) {
			setIndex(index + 1)
		}
	}
	return (
		<div className="flex flex-row w-full justify-center text-black">
			<div className="basis-1/12 flex flex-col justify-center">
				<ArrowBackIosIcon fontSize="large" className="ml-auto cursor-pointer"
				onClick={indexLeft}
				/>
			</div>
			<div className="basis-10/12 overflow-x-scroll">
			<div className="flex flex-row w-full text-orange-950 m-5">
					{
						items.map((item: number) => {
							return (
								<div
								onClick={() => {setIndex(1)}}
								className={(index == 1 ? "border-orange-950 " : "border-transparent ") + "border-2 w-18 md:w-32 shrink-0 flex flex-col mr-6 md:mr-12 py-2 cursor-pointer"}>
									<div className="mx-auto text-center text-xl md:text-2xl">
										<div className="h-12 w-12 md:h-20 md:w-20 rounded-full overflow-hidden mb-2 md:mb-4">
											<img src="https://www.foodnetwork.com/content/dam/images/food/fullset/2019/2/19/1/FN_Air-Fryer-Chicken-Wings-H_s4x3.jpg"
											className="h-full w-full object-cover object-center"
											/>
										</div>
										83%
									</div>
								</div>
							)
						})
					}
				</div>
			</div>
			<div className="basis-1/12 flex flex-col justify-center">
				<ArrowForwardIosIcon fontSize="large" className="mr-auto cursor-pointer"
				onClick={indexRight}/>
			</div>
		</div>
	)
}