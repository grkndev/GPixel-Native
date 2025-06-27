import Ring from '@/components/Ring'
import TabView from '@/components/TabView'
import { API_BASE_URL } from '@/constants/Api'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  const [pixels, setPixels] = useState<string[]>([])

  // const getStatus = async () => {
  //   const status = await fetch(`${API_BASE_URL}/status`).catch(err => {
  //     console.log(err)
  //   })
  //   const data = await status?.json()
  //   console.log(data)
  // }

  const getPixels = async () => {
    const pixels = await fetch(`${API_BASE_URL}/current`)
    const data = await pixels.json()
    setPixels(data.led_colors)
  }

  useEffect(() => {
    getPixels()
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-zinc-950 justify-between items-center p-4'>
      <View className='flex-1 gap-10 w-full'>
        <View className='w-full items-center'>
          <Ring pixels={pixels} />
        </View>
        <TabView onUpdate={getPixels} />
      </View>
    </SafeAreaView>
  )
}