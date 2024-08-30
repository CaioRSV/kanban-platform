import { useDraggable } from "@mgcrea/react-native-dnd";
import { Text } from 'react-native'
import Animated from "react-native-reanimated";

export const DraggableComponent = ({ id, data, disabled }) => {
  const { offset, setNodeRef, activeId, setNodeLayout } = useDraggable({
    id,
    data,
    disabled,
  });

  return (
    <Animated.View ref={setNodeRef} onLayout={setNodeLayout}>
      <Text>DRAGS</Text>
    </Animated.View>
  );
};