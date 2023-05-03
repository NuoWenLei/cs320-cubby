import { useState } from "react";
import SearchIcon from '@mui/icons-material/Search';

interface SearchbarProp {
	searchFunc: (q: string) => Promise<void>
}

export default function Searchbar(
	{ searchFunc } : SearchbarProp
) {
	const [inputState, setInputState] = useState<string>("");
	return (
		<div className="w-full h-full flex flex-row bg-white rounded-full border-2 border-orange-900 text-xl overflow-hidden">
			<SearchIcon className="mx-3 my-auto"/>
			<div className="w-full h-full p-2 justify-left ">
			<input 
			className=" border-none outline-none overflow-x-scroll w-full"
			placeholder="Search for communities"
			value={inputState}
			onChange={(e) => setInputState(e.currentTarget.value)}
			onKeyUp={(e) => {
				if (e.key == "Enter") {
					searchFunc(inputState)
				}
			}}
			/>
			</div>
			<button className="ml-auto my-auto h-full w-1/3 xl:w-1/6 bg-orange-900 text-white ">Search</button>
		</div>
	)
}