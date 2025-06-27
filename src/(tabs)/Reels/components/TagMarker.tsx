import { Text, TouchableOpacity } from "react-native";

const TagMarker = ({
  tag,
  onPress,
}: {
  tag: {
    userId: string;
    handleName: string;
    positionX: number;
    positionY: number;
  };
  onPress: (userId: string) => void;
}) => {
  return (
    <TouchableOpacity
      style={{
        position: 'absolute',
        left: `${tag.positionX * 100}%`,
        top: `${tag.positionY * 100}%`,
        transform: [{translateX: -20}, {translateY: -20}],
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
      }}
      onPress={() => onPress(tag.userId)}>
      <Text style={{color: '#fff', fontSize: 12}}>@{tag.handleName}</Text>
    </TouchableOpacity>
  );
};

export default TagMarker;