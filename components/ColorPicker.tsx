import { View } from "react-native";
import ColorPicker, { HueSlider, Panel1 } from 'reanimated-color-picker';

export default function ColorPickerComponent() {
    return (
        <View className="w-full items-center justify-center">
            <ColorPicker style={{ width: '70%', gap:16 }} value='red' >
                <Panel1 />
                <HueSlider />
            </ColorPicker>
        </View>
    )
}