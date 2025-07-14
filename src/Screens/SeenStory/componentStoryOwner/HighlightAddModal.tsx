import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, TextInput } from 'react-native'
import React, { forwardRef, useState } from 'react'
import { Modalize } from 'react-native-modalize'
import { Colors } from '../../../../assets/color/Colors'
import { useTheme } from '../../../util/ThemeContext'

interface HighlightAddModalProps {
  onAdd: (name: string) => void;
  onBack: () => void;
  imageSource?: string | { uri: string };
}

const HighlightAddModal = forwardRef<Modalize, HighlightAddModalProps>(({ onAdd, onBack, imageSource }, ref) => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const [highlightName, setHighlightName] = useState('');

  const handleAdd = () => {
    if (highlightName.trim()) {
      onAdd(highlightName);
      setHighlightName('');
      (ref as any).current?.close();
    }
  };

  return (
    <Modalize
      ref={ref}
      modalStyle={[styles.modalContent, { backgroundColor: color.background }]}
      handleStyle={styles.handleStyle}
      handlePosition="inside"
      panGestureEnabled={true}
      adjustToContentHeight={true}
      scrollViewProps={{
        showsVerticalScrollIndicator: false,
        nestedScrollEnabled: true,
      }}
    >
      <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', position: 'relative', backgroundColor: color.background}}>
        <TouchableOpacity onPress={onBack} style={{position: 'absolute', width: 30, height: 30,justifyContent: 'center', alignItems: 'center', zIndex: 1}}>
            <Image source={require('../../../../assets/icon/left.png')} style={{resizeMode: 'contain', width: '70%', height: '70%'}}/>
        </TouchableOpacity>
        <Text style={[styles.modalTitle, {color: color.text}]}>Thêm tin nổi bật</Text>
      </View>
      
      <View style={styles.imageContainer}>
        {imageSource ? (
            <Image 
                source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} 
                style={styles.circleImage} 
            />
        ) : (
            <View style={styles.circleImage} />
        )}
      </View>
      
      <TextInput
        style={[styles.input, { borderColor: color.border, borderWidth: 1, color: color.text }]}
        placeholder="Tin nổi bật"
        placeholderTextColor={color.secondary}
        value={highlightName}
        onChangeText={setHighlightName}
      />
      
      <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
        <Text style={styles.addButtonText}>Thêm</Text>
      </TouchableOpacity>
    </Modalize>
  );
});

export default HighlightAddModal;

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
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  circleImage: {
    width: 60,
    height: 60,
    borderRadius: 40,
    backgroundColor: '#ddd'
  },
  input: {
    height: 50,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
    borderRadius: 8,
  },
  addButton: {
    height: 50,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});