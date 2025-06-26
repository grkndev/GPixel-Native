import ColorPicker from '@/components/ColorPicker'
import Ring from '@/components/Ring'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function index() {
  const [pixels, setPixels] = useState<string[]>([])
  const getPixels = async () => {
    const pixels = await fetch('http://192.168.1.7/current')
    const data = await pixels.json()
    console.log(data.led_colors)
    setPixels(data.led_colors)
  }

  useEffect(() => {
    getPixels()
  }, [])

  return (
    <SafeAreaView className='flex-1 bg-zinc-950 justify-center items-center p-4'>
      <View className='flex items-center justify-between flex-col bg-green-500 w-full h-full'>
        <Ring pixels={pixels} />
        <ColorPicker />
      </View>
    </SafeAreaView>
  )
}