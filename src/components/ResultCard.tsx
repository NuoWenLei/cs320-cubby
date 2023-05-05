import { Group } from "@/utils/types";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";

interface ResultCardProp {
	interestGroup: Group;
	user_id: string; // For checking if user is already in group
	elem_id: number;
	opened_id: number;
	set_opened_id: (arg: number) => void;
  join_group: (group_id: string | undefined, user_id: string) => Promise<boolean>;
}

export default function ResultCard(
	{ interestGroup, user_id, elem_id, opened_id, set_opened_id, join_group } : ResultCardProp
) {

  const [joined, setJoined] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const requestJoin = async () => {
    setLoading(true);
    const res = await join_group(interestGroup.id, user_id);
    setJoined(res);
    if (res) {
      toast.success(`You have joined the group ${interestGroup.name}!`,
      {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
    } else {
      toast.error(`Unable to join the group ${interestGroup.name}, please try again later!`,
      {
				position: "bottom-left",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "colored",
			});
    }
    setLoading(false);
  }

	// auth
	return (
		<>
		<div className={
      "h-40 w-52 xl:h-72 xl:w-96 m-4 flex flex-col overflow-hidden rounded-xl cursor-pointer px-4 xl:py-4 xl:px-8 bg-[url('/community.png')] bg-cover bg-center " + (((elem_id % 4) > 1) ? " justify-end" : " justify-start")}
    onClick={() => set_opened_id(elem_id)}>
			<div className={"text-xl xl:text-4xl w-full mt-4 text-white italic font-bold " + (((elem_id % 2) == 0) ? " text-start" : " text-end")}>
				{interestGroup.name}
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="div"
                    className="flex flex-row"
                  >
                    <div className="overflow-hidden rounded-lg h-32 w-32">
                      <img src="/community.png" className="h-full w-full object-cover object-center"/>
                    </div>
                    <div className="flex flex-col ml-6 text-3xl font-medium leading-6 text-black pt-4">
                      <div className="mb-4">{interestGroup.name}</div>
                      <div className="text-base ml-1">
                      Members: {(interestGroup.member_ids ? interestGroup.member_ids.length : 0) + (joined ? 1 : 0)}</div>
                    </div>
                  </Dialog.Title>
                  <div className="mt-2 flex flex-col text-black">
                    <div className="text-xl mb-2 font-semibold ml-2">
                      Mission
                    </div>
                    <p className="text-sm overflow-y-scroll flex flex-wrap h-80 rounded-lg bg-gray-100 p-4">
					{interestGroup.interest_group_info?.mission ? interestGroup.interest_group_info.mission : "None"}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-row justify-center">
                  {
                    (interestGroup.member_ids == undefined) || (interestGroup.member_ids.includes(user_id)) || joined ?
                    <button
                    disabled
                    type="button"
                    className="opacity-60 inline-flex justify-center rounded-md border border-transparent bg-orange-900 px-4 py-2 text-lg font-medium text-white hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Joined
                  </button> :
                    <button
                      type="button"
                      disabled={loading}
                      className="inline-flex disabled:opacity-60 justify-center rounded-md border border-transparent bg-orange-900 px-4 py-2 text-lg font-medium text-white hover:bg-orange-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={requestJoin}
                    >
                      Join
                    </button>
                  }
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
		</>)
		
}