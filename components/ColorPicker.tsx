import { View } from "react-native";
import ColorPicker, { ColorFormatsObject, HueSlider, Panel1 } from 'reanimated-color-picker';

export default function ColorPickerComponent({
    onChange,
    onComplete
}: {
    onChange: (value: boolean) => void,
    onComplete: (color: ColorFormatsObject) => void
}) {
    return (
        <View className="w-full items-center justify-center">
            <ColorPicker style={{ width: '100%', gap: 16 }} value='red' onChangeJS={(color) => {
                onChange(true)
            }} onCompleteJS={(color) => {
                onChange(false)
                onComplete(color)
            }} >
                <Panel1 />
                <HueSlider />
            </ColorPicker>
        </View>
    )
}