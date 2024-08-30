import { useDroppable } from "@mgcrea/react-native-dnd";
import { Text } from 'react-native'

import Animated from "react-native-reanimated";

export const DroppableComponent = ({ id, data, disabled }) => {
  const { setNodeRef, setNodeLayout, activeId } = useDroppable({
    id,
    data,
  });

  return (
    <Animated.View ref={setNodeRef} onLayout={setNodeLayout}>
      <Text>DROPS</Text>
    </Animated.View>
  );
};