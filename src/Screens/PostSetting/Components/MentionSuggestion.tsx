import {Portal} from 'react-native-portalize';
import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {UserProfile} from '@services/relationRedux/relationTypes';

interface MentionSuggestionProps {
  visible: boolean;
  query: string;
  followers: UserProfile[];
  onSelect: (handleName: string) => void;
  backgroundColor: string;
  positionY?: number;
}

const MentionSuggestion = ({
  visible,
  query,
  followers,
  onSelect,
  backgroundColor,
  positionY = 200,
}: MentionSuggestionProps) => {
  if (!visible) return null;

  const filtered = followers.filter(f =>
    f.handleName.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Portal>
      <View style={[styles.container, {top: positionY, backgroundColor}]}>
        <FlatList
          data={filtered}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => onSelect(item.handleName)}
              style={styles.item}>
              <Image source={{uri: item.profilePic}} style={styles.avatar} />
              <View style={styles.textContainer}>
                <Text style={styles.username}>{item.username}</Text>
                <Text style={styles.handle}>@{item.handleName}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </Portal>
  );
};

export default MentionSuggestion;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: '5%',
    width: '80%',
    maxHeight: 200,
    borderRadius: 10,
    padding: 8,
    zIndex: 9999,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    marginLeft: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#000',
  },
  handle: {
    color: '#777',
  },
});
