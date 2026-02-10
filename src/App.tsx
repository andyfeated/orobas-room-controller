import { Cctv, DoorOpen, Fan, HouseWifi, Lightbulb, PowerIcon, RefreshCwIcon } from 'lucide-react'
import './App.css'
import { useState } from 'react'
import axios, { type AxiosResponse } from 'axios'

// i aint refactoring allat xD 
function App() {
  const [lightsStatus, setLightStatus] = useState({ active: false, status: 'off' })
  const [fanStatus, setFanStatus] = useState({ active: false, status: 'off' })
  const [doorStatus] = useState({ active: false, status: 'off' })
  const [loadingStates, setLoadingStates] = useState({
    statuses: false,
    fan: false,
    lights: false,
    door: false,
  })

  const getLightsStatus = async (): Promise<AxiosResponse<any> | null> => {
    try {
      console.log('Getting Lights status');
      const res = await axios.get('/api/esp1/status');
      return res;
    } catch (err) {
      return null
    }
  }

  const getFanStatus = async (): Promise<AxiosResponse<any> | null> => {
    try {
      console.log('Getting Fan status')
      const res = await axios.get('/api/esp2/status');
      return res;
    } catch (err) {
      return null
    }
  }

  const toggleLightsStatus = async (): Promise<AxiosResponse<any> | null> => {
    try {
      console.log('Toggling Lights status')
      const res = await axios.get('/api/esp1/toggle');
      return res;
    } catch (err) {
      return null
    }
  }

  const toggleFanStatus = async (): Promise<AxiosResponse<any> | null> => {
    try {
      console.log('Toggling Fan status')
      const res = await axios.get('/api/esp2/toggle');
      return res;
    } catch (err) {
      return null
    }
  }

  const handleClickFetchStatuses = async () => {
    setLoadingStates({
      ...loadingStates,
      statuses: true
    })
    const lightsData = await getLightsStatus() as any;
    const fanData = await getFanStatus() as any;

    if (lightsData?.data?.status) {
      setLightStatus({ active: true, status: lightsData?.data?.status })
    } else {
      setLightStatus({ active: false, status: "unknown" })
    }

    if (fanData?.data?.status) {
      setFanStatus({ active: true, status: fanData?.data?.status })
    } else {
      setFanStatus({ active: false, status: "unknown" })
    }

    setLoadingStates({
      ...loadingStates,
      statuses: false
    })
  }

  const handleToggleLights = async () => {
    setLoadingStates({
      ...loadingStates,
      lights: true
    })

    const lightsData = await toggleLightsStatus()
    if (lightsData?.data?.status) {
      setLightStatus({ active: true, status: lightsData?.data?.status })
    } else {
      setLightStatus({ active: false, status: "unknown" })
    }
    // await new Promise(res => setTimeout(res, 1000))

    setLoadingStates({
      ...loadingStates,
      lights: false
    })
  }

  const handleToggleFan = async () => {
    setLoadingStates({
      ...loadingStates,
      fan: true
    })

    const fanData = await toggleFanStatus()
    if (fanData?.data?.status) {
      setFanStatus({ active: true, status: fanData?.data?.status })
    } else {
      setFanStatus({ active: false, status: "unknown" })
    }
    // await new Promise(res => setTimeout(res, 1000))

    setLoadingStates({
      ...loadingStates,
      fan: false
    })
  }

  return (
    <div className='p-6'>
      <div className='flex text-2xl font-semibold'>
        <HouseWifi className='mt-1 mr-1 text-[#9a9a9a]' />
        <span>Orobas</span>
      </div>

      <div className='mt-8'>
        <div className='flex flex-col md:flex-row gap-8 mb-5'>
          <div className='min-w-[380px] md:min-w-5xl h-80 bg-[#1a1a1a] p-3 rounded-md shadow-[inset_5px_5px_15px_rgba(0,0,0,0.4)]'>
            <div className='flex'>
              <p className='font-semibold mt-2.5 mb-2.5'>Room Control</p>
              <button
                className={`p-1.5 h-6 mt-2 ml-3 rounded transition-all 
                  ${loadingStates.statuses
                    ? 'cursor-not-allowed bg-[#2a2a2a] text-gray-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_4px_rgba(255,255,255,0.1),0_4px_8px_rgba(0,0,0,0.4)]'
                    : 'cursor-pointer bg-[#1a1a1a] text-gray-500 hover:bg-[#2a2a2a] shadow-[0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]'}`
                }
                onClick={handleClickFetchStatuses}
              >
                <RefreshCwIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className='mt-3 flex border-b border-gray-600 pb-5'>
              <div className="w-13 p-3.5 bg-[#0f0f0f] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.05)]">
                <Fan className={`${fanStatus.status === 'on' ? 'text-white transition-transform animate-spin' : 'text-[#9a9a9a]'}`} />
              </div>

              <div className='justify-between flex w-full'>
                <div className='ml-3 mt-1.5'>
                  <div className='font-semibold text-sm mb-1'>Fan</div>
                  <div className='text-xs'>{fanStatus?.status}</div>
                </div>

                <div className='flex'>
                  <div className='flex mr-2'>
                    <div className={`mt-5 mr-1.5 w-1.5 h-1.5  rounded-full ${fanStatus.active ? 'bg-gray-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-[#9a9a9a]'}`}></div>
                    <div className={`text-sm mt-3 font-bold ${fanStatus.active ? '' : 'text-[#9a9a9a]'}`}>
                      {fanStatus.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleFan}
                    disabled={!fanStatus?.active || loadingStates.fan}
                    className={
                      `p-3.5 h-10 mt-1 rounded transition-all 
                      ${!fanStatus?.active || loadingStates.fan ? 'cursor-not-allowed' : 'cursor-pointer'}
                      ${fanStatus?.status === 'on'
                        ? 'bg-[#2a2a2a] text-gray-200'
                        : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#2a2a2a] shadow-[0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]'}`
                    }
                  >
                    <PowerIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className='mt-5 flex border-b border-gray-600 pb-5'>
              <div className="w-13 p-3.5 bg-[#0f0f0f] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.05)]">
                <Lightbulb className={`${lightsStatus.status === 'on' ? 'text-white' : 'text-[#9a9a9a]'}`} />
              </div>

              <div className='justify-between flex w-full'>
                <div className='ml-3 mt-1.5'>
                  <div className='font-semibold text-sm mb-1'>Lights</div>
                  <div className='text-xs'>{lightsStatus?.status}</div>
                </div>

                <div className='flex'>
                  <div className='flex mr-2'>
                    <div className={`mt-5 mr-1.5 w-1.5 h-1.5  rounded-full ${lightsStatus.active ? 'bg-gray-300 shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'bg-[#9a9a9a]'}`}></div>
                    <div className={`text-sm mt-3 font-bold ${lightsStatus.active ? '' : 'text-[#9a9a9a]'}`}>
                      {lightsStatus.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <button
                    onClick={handleToggleLights}
                    disabled={!lightsStatus.active || loadingStates.lights}
                    className={
                      `p-3.5 h-10 mt-1 rounded transition-all 
                      ${!lightsStatus?.active || loadingStates.lights ? 'cursor-not-allowed' : 'cursor-pointer'}
                      ${lightsStatus?.status === 'on'
                        ? 'bg-[#2a2a2a] text-gray-200'
                        : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#2a2a2a] shadow-[0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]'}`
                    }
                  >
                    <PowerIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            <div className='mt-5 flex border-gray-600 pb-5'>
              <div className="w-13 p-3.5 bg-[#0f0f0f] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.05)]">
                <DoorOpen className='text-[#9a9a9a]' />
              </div>

              <div className='justify-between flex w-full'>
                <div className='ml-3 mt-1.5'>
                  <div className='font-semibold text-sm mb-1'>Door</div>
                  <div className='text-xs'>unkown</div>
                </div>

                <div className='flex'>
                  <div className='flex mr-2'>
                    <div className="mt-5 mr-1.5 w-1.5 h-1.5 bg-[#9a9a9a] rounded-full"></div>
                    <div className='text-sm mt-3 font-bold text-[#9a9a9a]'>Inactive</div>
                  </div>

                  <button
                    disabled={!doorStatus?.active}
                    className={
                      `p-3.5 h-10 mt-1 rounded transition-all 
                      ${doorStatus?.active ? 'cursor-pointer' : 'cursor-not-allowed'}
                      ${doorStatus.status === 'on'
                        ? 'bg-[#2a2a2a] text-gray-200'
                        : 'bg-[#1a1a1a] text-gray-500 hover:bg-[#2a2a2a] shadow-[0_2px_4px_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)]'
                      }
                      `
                    }
                  >
                    <PowerIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* right */}
          <div className='min-w-[200px] md:min-w-xl h-100 bg-[#1a1a1a] p-3 rounded-md shadow-[inset_5px_5px_15px_rgba(0,0,0,0.3)]'>
            <div className='flex'>
              <div className="w-13 p-3.5 bg-[#0f0f0f] rounded shadow-[inset_0_2px_4px_rgba(0,0,0,0.5),0_1px_2px_rgba(255,255,255,0.05)]">
                <Cctv className='text-[#9a9a9a]' />
              </div>

              <p className='font-semibold content-center ml-2'>Security Camera</p>
            </div>

            <div className='flex justify-center items-center rounded-lg mt-2 w-full h-70 bg-black'>
              <p className=''>To implement</p>
            </div>

            <div className='flex justify-between'>
              <div className='text-sm mt-3 font-medium'>
                Status:
              </div>

              <div className='flex'>
                <div className="mt-5 mr-1.5 w-1.5 h-1.5 bg-gray-300 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.4)]"></div>
                <div className='text-sm mt-3 font-bold'>Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom */}
        <div></div>
      </div>
    </div>
  )
}

export default App
