import React, { useState, useRef, useEffect } from 'react';
import { SafeAreaView, View, TextInput, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FlashList } from '@shopify/flash-list';
import MessageBoxStyles from '../../../StyleSheet/MessageBoxStyles';
import { useTheme } from '../../../util/ThemeContext';
import { Colors } from '../../../../assets/color/Colors';

// Highlight component (as in MessageBox)
const HighlightedText = ({ text, highlight, normalColor, grayColor }: { text: string; highlight: string; normalColor: string; grayColor: string; }) => {
  if (!highlight.trim()) return <Text style={{ color: grayColor }}>{text}</Text>;
  const keywords = highlight.toLowerCase().split(' ').filter(w => w);
  const pattern = new RegExp(`(${keywords.join('|')})`, 'gi');
  const splits = text.split(pattern);
  return (
    <Text>
      {splits.map((part, i) => {
        const isMatch = keywords.includes(part.toLowerCase());
        return (
          <Text key={i} style={{ color: isMatch ? normalColor : grayColor, fontWeight: isMatch ? '600' : 'normal' }}>
            {part}
          </Text>
        );
      })}
    </Text>
  );
};

export const SearchMessages = () => {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const userId: number = route.params?.userId ?? 1;

  const { theme } = useTheme();
  const color = Colors[theme];
  const styles = MessageBoxStyles(theme);

  // Retrieve the user once
  // const user = getUserById(String(userId));

  const [query, setQuery] = useState('');
  // const [results, setResults] = useState<MsgType[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // useEffect(() => {
  //   if (!query.trim()) {
  //     setResults([]);
  //     return;
  //   }
  //   setLoading(true);
  //   const timeout = setTimeout(() => {
  //     const all = user?.messages ?? [];
  //     const filtered = all.filter(m =>
  //       m.text.toLowerCase().includes(query.toLowerCase())
  //     );
  //     setResults(filtered);
  //     setLoading(false);
  //   }, 300);
  //   return () => clearTimeout(timeout);
  // }, [query, user]);

  return (
    <SafeAreaView style={styles.container}>
      {/* header above search bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, backgroundColor: color.background, }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 24, height: 24, marginRight: 16 }}>
          <Image source={require('../../../../assets/icon/left.png')} style={{ width: '100%', height: '100%', tintColor: color.text, resizeMode: 'contain' }} />
        </TouchableOpacity>
        <Text style={{ flex: 1, textAlign: 'center', fontSize: 16, fontWeight: '600', color: color.text }}>Tìm kiếm tin nhắn</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* search bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBlock}>
          <TextInput
            ref={inputRef}
            placeholder="Tìm kiếm tin nhắn"
            placeholderTextColor={color.text}
            style={[styles.searchInput, { flex: 1 }]}
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>

      {/* result count header */}
      {/* {!loading && results.length > 0 && (
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsHeaderText}>
            {results.length} kết quả{results.length !== 1 ? 's' : ''} tìm thấy
          </Text>
        </View>
      )} */}

      {/* results list */}
      {/* <View style={styles.searchResultContent}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Đang tìm kiếm...</Text>
          </View>
        ) : (
          <FlashList
            data={results}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.searchResultItem}>
                {user?.img && (
                  <Image source={{ uri: user.img }} style={styles.searchResultAvatar} />
                )}
                <View style={styles.searchResultContent}>
                  {user?.name && (
                    <Text style={styles.searchResultName}>{user.name}</Text>
                  )}
                  <HighlightedText
                    text={item.text}
                    highlight={query}
                    normalColor={color.text}
                    grayColor={color.textSecondary}
                  />
                  <Text style={styles.searchResultTimestamp}>{item.timestamp}</Text>
                </View>
              </View>
            )}
            estimatedItemSize={60}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View> */}
    </SafeAreaView>
  );
};