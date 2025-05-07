import React, {useState} from 'react';
import {TextInput, TextInputProps, LayoutChangeEvent} from 'react-native';

export const AutoGrowingInput: React.FC<TextInputProps> = props => {
  const [height, setHeight] = useState(40);

  return (
    <TextInput
      {...props}
      multiline
      scrollEnabled={false}
      onContentSizeChange={e => {
        // adjust height to content size but never go below initial
        const newHeight = e.nativeEvent.contentSize.height;
        setHeight(Math.max(40, newHeight));
        // call any passed-in handler too
        props.onContentSizeChange?.(e);
      }}
      style={[
        props.style,
        { height },          // drive height
        { textAlignVertical: 'top' }, // ensure multiline aligns at top
      ]}
    />
  );
};

export default AutoGrowingInput;