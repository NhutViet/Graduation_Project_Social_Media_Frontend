import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
  SafeAreaView,
  Keyboard,
} from 'react-native';
import { Search, X, ChevronUp, ChevronDown } from 'lucide-react-native';
import { useTheme } from '../src/util/ThemeContext';
import { Colors } from '../assets/color/Colors';
import { Message } from '../services/messageRedux/messageType';

interface MessageSearchModalProps {
  visible: boolean;
  onClose: () => void;
  messages: Message[];
  onMessageSelect: (messageId: string, index: number) => void;
}

interface SearchResult {
  message: Message;
  originalIndex: number;
  highlightedContent: string;
}

const MessageSearchModal: React.FC<MessageSearchModalProps> = memo(({
  visible,
  onClose,
  messages,
  onMessageSelect,
}) => {
  const { theme } = useTheme();
  const color = Colors[theme];
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const searchInputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery('');
      setSearchResults([]);
      setCurrentResultIndex(0);
    }
  }, [visible]);

  const highlightSearchTerm = useCallback((text: string, searchTerm: string): string => {
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '**$1**'); // Use ** for highlighting marker
  }, []);

  const performSearch = useCallback((query: string) => {
    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    messages.forEach((message, index) => {
      if (message.content && message.content.toLowerCase().includes(lowercaseQuery)) {
        const highlightedContent = highlightSearchTerm(message.content, query);
        results.push({
          message,
          originalIndex: index,
          highlightedContent,
        });
      }
    });

    setSearchResults(results.reverse()); // Reverse to show newest first
    setCurrentResultIndex(0);
  }, [messages, highlightSearchTerm]);

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery.trim());
    } else {
      setSearchResults([]);
      setCurrentResultIndex(0);
    }
  }, [searchQuery, performSearch]);

  const renderHighlightedText = useCallback((text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
      <Text style={[styles.messageContent, { color: color.text }]}>
        {parts.map((part, index) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={index} style={styles.highlightedText}>
                {part.slice(2, -2)}
              </Text>
            );
          }
          return part;
        })}
      </Text>
    );
  }, [color.text]);

  const navigateToResult = useCallback((direction: 'up' | 'down') => {
    if (searchResults.length === 0) return;

    let newIndex;
    if (direction === 'up') {
      newIndex = currentResultIndex > 0 ? currentResultIndex - 1 : searchResults.length - 1;
    } else {
      newIndex = currentResultIndex < searchResults.length - 1 ? currentResultIndex + 1 : 0;
    }

    setCurrentResultIndex(newIndex);
    const result = searchResults[newIndex];
    onMessageSelect(result.message._id, result.originalIndex);
  }, [searchResults, currentResultIndex, onMessageSelect]);

  const handleResultPress = useCallback((result: SearchResult, index: number) => {
    setCurrentResultIndex(index);
    onMessageSelect(result.message._id, result.originalIndex);
    onClose();
  }, [onMessageSelect, onClose]);

  const formatMessageTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('vi-VN', {
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } else {
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      });
    }
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleNavigateUp = useCallback(() => {
    navigateToResult('up');
  }, [navigateToResult]);

  const handleNavigateDown = useCallback(() => {
    navigateToResult('down');
  }, [navigateToResult]);

  const renderSearchResult = useCallback(({ item, index }: { item: SearchResult; index: number }) => (
    <TouchableOpacity
      style={[
        styles.resultItem,
        {
          backgroundColor: index === currentResultIndex ? color.primary + '20' : 'transparent',
          borderBottomColor: color.border,
        },
      ]}
      onPress={() => handleResultPress(item, index)}>
      <View style={styles.resultContent}>
        <View style={styles.messageHeader}>
          <Text style={[styles.senderName, { color: color.textSecondary }]}>
            {item.message.sender.handleName}
          </Text>
          <Text style={[styles.messageTime, { color: color.textSecondary }]}>
            {formatMessageTime(item.message.createdAt)}
          </Text>
        </View>
        {renderHighlightedText(item.highlightedContent)}
      </View>
    </TouchableOpacity>
  ), [currentResultIndex, color.primary, color.border, color.textSecondary, handleResultPress, formatMessageTime, renderHighlightedText]);

  const keyExtractor = useCallback((item: SearchResult, index: number) => `${item.message._id}-${index}`, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <SafeAreaView style={[styles.container, { backgroundColor: color.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: color.border }]}>
          <View style={styles.searchContainer}>
            <View style={[styles.searchInputContainer, { backgroundColor: color.backgroundSecondary }]}>
              <Search size={20} color={color.textSecondary} />
              <TextInput
                ref={searchInputRef}
                style={[styles.searchInput, { color: color.text }]}
                placeholder="Tìm kiếm tin nhắn..."
                placeholderTextColor={color.textSecondary}
                value={searchQuery}
                onChangeText={setSearchQuery}
                returnKeyType="search"
                onSubmitEditing={() => Keyboard.dismiss()}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={handleClearSearch}>
                  <X size={20} color={color.textSecondary} />
                </TouchableOpacity>
              )}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={[styles.cancelText, { color: color.primary }]}>Hủy</Text>
            </TouchableOpacity>
          </View>

          {/* Search Navigation */}
          {searchResults.length > 0 && (
            <View style={styles.navigationContainer}>
              <Text style={[styles.resultCount, { color: color.textSecondary }]}>
                {currentResultIndex + 1} / {searchResults.length}
              </Text>
              <View style={styles.navigationButtons}>
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: color.backgroundSecondary }]}
                  onPress={handleNavigateUp}
                  disabled={searchResults.length <= 1}>
                  <ChevronUp size={20} color={searchResults.length <= 1 ? color.textSecondary : color.text} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: color.backgroundSecondary }]}
                  onPress={handleNavigateDown}
                  disabled={searchResults.length <= 1}>
                  <ChevronDown size={20} color={searchResults.length <= 1 ? color.textSecondary : color.text} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Search Results */}
        <View style={styles.content}>
          {searchQuery.trim() === '' ? (
            <View style={styles.emptyState}>
              <Search size={48} color={color.textSecondary} />
              <Text style={[styles.emptyStateText, { color: color.textSecondary }]}>
                Nhập từ khóa để tìm kiếm tin nhắn
              </Text>
            </View>
          ) : searchResults.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyStateText, { color: color.textSecondary }]}>
                Không tìm thấy tin nhắn nào
              </Text>
            </View>
          ) : (
            <FlatList
              data={searchResults}
              renderItem={renderSearchResult}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
});

MessageSearchModal.displayName = 'MessageSearchModal';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 4,
  },
  cancelButton: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  resultCount: {
    fontSize: 14,
  },
  navigationButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 16,
  },
  resultsList: {
    paddingVertical: 8,
  },
  resultItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  resultContent: {
    gap: 4,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  senderName: {
    fontSize: 14,
    fontWeight: '600',
  },
  messageTime: {
    fontSize: 12,
  },
  messageContent: {
    fontSize: 15,
    lineHeight: 20,
  },
  highlightedText: {
    backgroundColor: '#FFD700',
    color: '#000',
    fontWeight: '600',
  },
});

export default MessageSearchModal;