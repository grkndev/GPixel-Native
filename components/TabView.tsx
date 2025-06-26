import { hexToRgb } from '@/libs/utils';
import React, { Suspense, use, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import ColorPickerComponent from './ColorPicker';

const presetsPromise = fetch('http://192.168.1.7/available_presets')
  .then(res => res.json());
export default function TabView({ onUpdate }: { onUpdate: () => void }) {
  const [isScrollable, setIsScrollable] = useState(true)
  const data = use(presetsPromise)

  return (
    <Suspense fallback={<Text className='text-black text-center text-lg font-bold'>Loading...</Text>}>
      <PagerView style={styles.pagerView} initialPage={0} overdrag={false} scrollEnabled={isScrollable}>
        <View key="1" className='p-4 w-full gap-4'>
          <Text className='text-white text-center text-lg font-bold'>Color Picker</Text>
          <ColorPickerComponent onChange={(value) => {
            setIsScrollable(!value)
          }} onComplete={(color) => {
            fetch(`http://192.168.1.7/setcolor`, {
              method: "POST",
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(
                Array.from({ length: 12 }).map(() => `${hexToRgb(color.hex)?.r},${hexToRgb(color.hex)?.g},${hexToRgb(color.hex)?.b}`)
              )
            })
              .then(res => res.json())
              .then(data => {
                // console.log(data)
                onUpdate()
              })
              .catch(err => {
                // console.log(err)
              })
          }} />
        </View>
        <View key="2">
          <Text className='text-white text-center text-lg font-bold'>Presets</Text>
          <FlatList
            data={data.presets}
            renderItem={({ item }) => {
              return <TouchableOpacity className='w-full items-center justify-center p-4 rounded-lg bg-zinc-900' onPress={() => {
                fetch(`http://192.168.1.7/preset`, { method: "POST", body: JSON.stringify({ preset: item.name }) })
                  .then(res => res.json())
                  .then(data => {
                    onUpdate()
                  })
                  .catch(err => {
                    // console.log(err)
                  })

              }}>
                <Text className='text-white text-center'>{item.name}</Text>
              </TouchableOpacity>
            }}
            keyExtractor={(item) => item.name.toString()}
            contentContainerStyle={{ gap: 10 }}
          />

        </View>
      </PagerView>
    </Suspense>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});