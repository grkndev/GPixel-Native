import { API_BASE_URL } from '@/constants/Api';
import { hexToRgb } from '@/libs/utils';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PagerView from 'react-native-pager-view';
import ColorPickerComponent from './ColorPicker';

export default function TabView({ onUpdate }: { onUpdate: () => void }) {
  const [isScrollable, setIsScrollable] = useState(true);
  const [presets, setPresets] = useState<{ name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getPresets = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/available_presets`);
        if (!response.ok) throw new Error('Failed to fetch presets');
        const data = await response.json();
        setPresets(data.presets);
      } catch (error: any) {
        Alert.alert('Error', error.message || 'An unknown error occurred while fetching presets.');
      } finally {
        setLoading(false);
      }
    };
    getPresets();
  }, []);

  const handleSetColor = (color: any) => {
    fetch(`${API_BASE_URL}/setcolor`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(
        Array.from({ length: 12 }).map(() => `${hexToRgb(color.hex)?.r},${hexToRgb(color.hex)?.g},${hexToRgb(color.hex)?.b}`)
      )
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to set color");
        return res.json();
      })
      .then(() => {
        onUpdate();
      })
      .catch((err: any) => {
        Alert.alert('Error', err.message || 'An unknown error occurred.');
      });
  };

  const handleSetPreset = (presetName: string) => {
    fetch(`${API_BASE_URL}/preset`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ preset: presetName })
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to set preset");
        return res.json();
      })
      .then(() => {
        onUpdate();
      })
      .catch((err: any) => {
        Alert.alert('Error', err.message || 'An unknown error occurred.');
      });
  };

  if (loading) {
    return <Text className='text-white text-center text-lg font-bold'>Loading...</Text>;
  }

  return (
    <PagerView style={styles.pagerView} initialPage={0} overdrag={false} scrollEnabled={isScrollable}>
      <View key="1" className='p-4 w-full gap-4'>
        <Text className='text-white text-center text-lg font-bold'>Color Picker</Text>
        <ColorPickerComponent
          onChange={(value) => setIsScrollable(!value)}
          onComplete={handleSetColor}
        />
      </View>
      <View key="2" className='p-4 w-full gap-4'>
        <Text className='text-white text-center text-lg font-bold'>Presets</Text>
        <FlatList
          data={presets}
          renderItem={({ item }) => (
            <TouchableOpacity
              className='w-full items-center justify-center p-4 rounded-lg bg-zinc-900'
              onPress={() => handleSetPreset(item.name)}
            >
              <Text className='text-white text-center'>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.name}
          contentContainerStyle={{ gap: 10 }}
        />
      </View>
    </PagerView>
  );
};

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});