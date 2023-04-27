export default function MatchInterface() {

	const questions = [1, 2, 3, 4, 5, 6, 7, 8];
	const obj = {
		imageUrl: "https://www.restlesschipotle.com/wp-content/uploads/2022/08/Crispy-Oven-Baked-Chicken-Wings-feat2-500x500.jpg",
		similarity_matched: 0.231,

	}

	function joinGroup() {

	}

	return (
		<div className="w-full flex flex-row md:px-10 mb-2 xl:mb-4">
			<div className="hidden md:flex md:flex-col md:basis-1/2">
				<div className="w-7/12 mx-auto">
					<div className="overflow-hidden rounded-full mb-4">
						<img
						className="h-full w-full object-cover object-center"
						src={obj.imageUrl}/>
					</div>
					<div className="flex flex-row justify-center">
						<button type="button" className="p-2 bg-orange-950 text-white text-center text-xl"
						onClick={joinGroup}>JOIN GROUP</button>
					</div>
				</div>
			</div>
			<div className="basis-full md:basis-1/2 px-6">
				<div className="w-full lg:w-11/12 xl:w-7/12 border-2 border-black text-orange-950 p-3 flex flex-col mx-auto">
					<div className="text-xl xl:text-3xl w-full text-center mb-3">
						Overview Cubs
					</div>
					<div className="h-20 w-20 overflow-hidden rounded-full mb-3 mx-auto md:hidden">
						<img
						className="h-full w-full object-cover object-center"
						src={obj.imageUrl}/>
					</div>
					<div className="text-xl xl:text-4xl w-full text-center mb-3">
						<span className="text-4xl xl:text-6xl">{obj.similarity_matched * 100.}%</span> match
					</div>
					<div className="text-xl w-full text-center mb-3">
						matching distribution
					</div>
					<div className="text-md xl:text-lg w-full text-center flex flex-row flex-wrap lg:flex-col lg:flex-nowrap justify-center mb-3 md:mb-0">
						{
							questions.map((item: any, i: number) => {
								return (
								<>
									<div className="mr-4 min-[423px]:flex hidden lg:mx-auto"> Question {i + 1}: 15%</div>
									<div className="mr-4 flex min-[423px]:hidden"> Q{i + 1}: 15%</div>
								</>
								)
							}) 
						}
					</div>
					<div className="flex md:hidden text-md text-center justify-center">
						<button type="button" className="px-3 py-1 bg-orange-950 text-white rounded-md">JOIN GROUP</button>
					</div>
				</div>
			</div>
		</div>
	)
}