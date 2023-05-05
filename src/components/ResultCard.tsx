import { Group } from "@/utils/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

interface ResultCardProp {
	interestGroup: Group;
	user_id: string; // For checking if user is already in group
	elem_id: number;
	opened_id: number;
	set_opened_id: (arg: number) => void
}

export default function ResultCard(
	{ interestGroup, user_id, elem_id, opened_id, set_opened_id } : ResultCardProp
) {

	// auth
	return (
		<>
		<div className="h-72 w-80 m-4 bg-transparent border-2 border-orange-900 flex flex-col overflow-hidden rounded-lg">
			<div className="text-4xl w-full text-center mt-4">
				{interestGroup.name}
			</div>
			<div className="text-lg w-full text-center">
				Number of members: {interestGroup.member_ids ? interestGroup.member_ids.length : 0}
			</div>
			<div className="h-2/5 w-full flex flex-wrap overflow-hidden justify-center text-center p-2">
				Mission: <br /> {interestGroup.interest_group_info?.mission ? interestGroup.interest_group_info.mission : "None"}
			</div>
			<span className="h-1/6 underline text-center cursor-pointer ml-auto mr-4"
			onClick={() => set_opened_id(elem_id)}>
				Expand
			</span>
			<div className="flex flex-row w-full h-1/4 justify-center">
				{
					(interestGroup.member_ids == undefined) || (interestGroup.member_ids.includes(user_id)) ?
					<button type="button" disabled className="bg-orange-900 opacity-60 text-white w-full">JOINED</button> :
					<button type="button" className="bg-orange-900 text-white w-full">JOIN</button>
				}
				
			</div>
		</div>
		<Transition appear show={elem_id == opened_id} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => set_opened_id(-1)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-orange-50 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-orange-900"
                  >
                    {interestGroup.name} Mission:
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-orange-900 overflow-y-scroll flex flex-wrap h-80">
					{interestGroup.interest_group_info?.mission ? interestGroup.interest_group_info.mission : "None"}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-orange-900 px-4 py-2 text-sm font-medium text-white hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={() => set_opened_id(-1)}
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
		</>)
		
}