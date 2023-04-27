import { Fragment } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { AuthState, useAuth } from '@/utils/firebaseFunctions'
import { User } from '@/utils/types'
import { toast } from 'react-toastify'

const navigation = [
  { name: 'Dashboard', href: '#', current: false },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

export default function Navbar() {

	const auth: AuthState = useAuth();

  const signInFunction = async () => {
    const res: User | boolean = await auth.signInWithGoogle();
    if (typeof res == "boolean") {
      if (res) {
        // Authenticated by Google but no acount
        toast.info('Please sign up first!', {
          position: "top-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
          });
        } else {
          // Unauthenticated due to not completing or failing authentication
          toast.error('Authentication error: Please complete authentication!', {
            position: "top-left",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
        }
    }
  }

	// https://tailwindui.com/components/application-ui/navigation/navbars
  return (
    <Disclosure as="nav" className="bg-transparent" role="navigation">
      {({ open }: { open: boolean }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 text-orange-900">
            <div className="relative flex h-16 items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-black">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-between">
                <div className="flex flex-shrink-0 items-center font-bold text-2xl">
				          <Link href="/">
                  CUBBY
                  {/* <img
                    className="block h-8 w-auto lg:hidden"
                    src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                    alt="Your Company"
                  /> */}

				        </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
					{/* TODO: Add page navigations */}
                  {auth.isAuthenticated ? 
                  (<>
                  <Link href="#">
                      <div className="hover:bg-orange-100 rounded-md px-3 py-2 text-sm font-medium">
                        Home
                        </div>
                        </Link>
                      <Link href="#">
                      <div className="hover:bg-orange-100 rounded-md px-3 py-2 text-sm font-medium">
                        Communities
                        </div>
                        </Link>
                        <Link href="#">
                      <div className="hover:bg-orange-100 rounded-md px-3 py-2 text-sm font-medium">
                        Chats
                        </div>
                        </Link>
                  </>) : null}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

				{/* Profile dropdown */}
				{auth.isAuthenticated ? 
					    (<Menu as="div" className="relative ml-3">
									<div>
									  <Menu.Button className="flex rounded-full bg-gray-800 text-sm">
										<span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 overflow-hidden">
                    <img
										  className="h-full w-full rounded-full object-cover"
										  src="https://www.budgetbytes.com/wp-content/uploads/2023/01/Air-Fryer-Chicken-Wings-plate.jpg"
										  alt=""
										/>
                    </div>
									  </Menu.Button>
									</div>
									<Transition
									  as={Fragment}
									  enter="transition ease-out duration-100"
									  enterFrom="transform opacity-0 scale-95"
									  enterTo="transform opacity-100 scale-100"
									  leave="transition ease-in duration-75"
									  leaveFrom="transform opacity-100 scale-100"
									  leaveTo="transform opacity-0 scale-95"
									>
									  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
										<Menu.Item>
										  <div className="block px-4 py-2 text-sm text-gray-700">
										  <Link href="/profile">Your Profile</Link>
										  </div>
										</Menu.Item>
										<Menu.Item>
											<div className="block px-4 py-2 text-sm text-gray-700">
											  <button type="button" onClick={auth.signOut}>Sign Out</button>
										  </div>
										</Menu.Item>
									  </Menu.Items>
									</Transition>
								  </Menu>)
								  :
								  (
								  <div className="hidden sm:flex flex-row w-full">
								  <div 
                  onClick={signInFunction}
                  className="hover:bg-orange-100 rounded-md px-3 py-2 text-sm font-medium cursor-pointer">
									Sign in
									</div>
								  <div className="hover:bg-orange-100 rounded-md px-3 py-2 text-sm font-medium cursor-pointer">
									Sign up
									</div>
								  </div>
									)}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden text-black">
            <div className="divide-y divide-slate-500">

				{/* TODO: Add page navigation */}
                {
                  auth.isAuthenticated ?
                  (<div className="space-y-1 px-2 pb-3 pt-2">

                  <button type="button" className='hover:bg-orange-100 block rounded-md px-3 py-2 text-base font-medium'>
                  <Link href="#">Home</Link>
                </button>
                  <button type="button" className='hover:bg-orange-100 block rounded-md px-3 py-2 text-base font-medium'>
                  <Link href="#">Communities</Link>
                </button>
                <button type="button" className='hover:bg-orange-100 block rounded-md px-3 py-2 text-base font-medium'>
                  <Link href="#">Chats</Link>
                </button>
                  </div>) : (
                    <div className="space-y-1 px-2 pb-3 pt-2">
                      <button
                      onClick={signInFunction}
                      type="button"
                      className='hover:bg-orange-100 block rounded-md px-3 py-2 text-base font-medium'>
                        Sign in
                      </button>
                      <button type="button" className='hover:bg-orange-100 block rounded-md px-3 py-2 text-base font-medium'>
                        <Link href="#">Sign up</Link>
                      </button>
                    </div>)
                }
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  )
}