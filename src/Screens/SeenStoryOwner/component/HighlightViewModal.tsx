import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, FlatList } from 'react-native'
import React, { forwardRef, useRef } from 'react'
import { Modalize } from 'react-native-modalize'
import { Colors } from '../../../../assets/color/Colors'
import { useTheme } from '../../../util/ThemeContext'

interface HighlightViewModalProps {
  data: HighlightItem[];
  onAddNew: () => void;
}

type HighlightItem = {
  id: string;
  name: string;
  isNew?: boolean;
  isAdded: boolean;
  imageURL: string;
};

const HighlightViewModal = forwardRef<Modalize, HighlightViewModalProps>(({ data, onAddNew }, ref) => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const height = Dimensions.get('window').height * 0.39;

  const renderHighlight = ({ item }: { item: HighlightItem }) => (
    <TouchableOpacity style={styles.highlightItem} disabled={item.isAdded}>
      <View>
        <Image source={{ uri: item.imageURL }} style={styles.circleExisting} />
        {item.isAdded && (
          <View style={styles.overlay}>
            <Image source={require('../../../../assets/icon/check.png')} style={styles.checkMark} />
          </View>
        )}
      </View>
      <Text style={{ fontSize: 16, color: color.text }}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderList = () => (
    <FlatList
      data={[{ id: "0", name: "New", isAdded: false, isNew: true, imageURL: '' }, ...data]}
      renderItem={({ item }) =>
        item.isNew ? (
          <TouchableOpacity style={styles.highlightItem} onPress={onAddNew}>
            <View style={[styles.circlePlus, { borderColor: color.gray }]}>
              <Text style={{ fontSize: 24, color: color.text }}>+</Text>
            </View>
            <Text style={{ fontSize: 16, color: color.text }}>{item.name}</Text>
          </TouchableOpacity>
        ) : (
          renderHighlight({ item })
        )
      }
      keyExtractor={(item) => item.id}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ marginBottom: 20 }}
    />
  );

  return (
    <Modalize
      ref={ref}
      modalStyle={[styles.modalContent, { backgroundColor: color.background }]}
      handleStyle={styles.handleStyle}
      handlePosition="inside"
      panGestureEnabled={true}
      modalHeight={height}
      adjustToContentHeight={false}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        nestedScrollEnabled: true,
      }}
    >
      <Text style={[styles.modalTitle, { color: color.text }]}>Add to highlights</Text>
      <View style={{ width: '100%', borderColor: color.border, borderWidth: 1, marginVertical: 20 }} />
      {renderList()}
      <View style={{ width: '100%', borderColor: color.border, borderWidth: 1, marginVertical: 20 }} />
      <TouchableOpacity style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }} onPress={() => (ref as any).current?.close()}>
        <Text style={{ fontSize: 18, color: color.text }}>Cancel</Text>
      </TouchableOpacity>
    </Modalize>
  );
});

export default HighlightViewModal;

const styles = StyleSheet.create({
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  handleStyle: {
    backgroundColor: "#ccc",
    width: 40,
    height: 5,
    borderRadius: 2.5,
    alignSelf: "center",
    marginTop: 10,
  },
  modalTitle: {
    width: '100%',
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  highlightItem: {
    flexDirection: "column",
    alignItems: "center",
    marginRight: 20,
  },
  circlePlus: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  circleExisting: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  checkMark: {
    width: '70%',
    height: '70%',
    tintColor: '#fff'
  },
});