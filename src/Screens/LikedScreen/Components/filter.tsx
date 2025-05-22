import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
} from 'react-native';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {ChevronRight} from 'lucide-react-native';

interface FilterModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSelectFilter?: (filter: string) => void;
  selectedFilter?: string;
  type?: 'date' | 'sort' | 'content';
  multiSelect?: boolean;
  selectedItems?: string[];
  onApply?: (items: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible = false,
  onClose = () => {},
  onSelectFilter = () => {},
  selectedFilter = '',
  type = 'date',
  multiSelect = false,
  selectedItems = [],
  onApply,
}) => {
  const {theme} = useTheme();
  const colors = Colors[theme];
  const slideAnim = React.useMemo(() => new Animated.Value(0), []);

  const filterOptions = React.useMemo(() => {
    switch (type) {
      case 'date':
        return [
          {id: 'all', label: 'All dates'},
          {id: 'week', label: 'Past week'},
          {id: 'month', label: 'Past month'},
          {id: 'year', label: 'Past year'},
          {id: 'range', label: 'Date range'},
        ];
      case 'sort':
        return [
          {id: 'newest', label: 'Newest to oldest'},
          {id: 'oldest', label: 'Oldest to newest'},
        ];
      case 'content':
        return [
          {id: 'posts', label: 'Posts'},
          {id: 'reels', label: 'Reels'},
          {id: 'threads', label: 'Threads'},
        ];
      default:
        return [];
    }
  }, [type]);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 10,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 30,
        friction: 15,
      }).start();
    }
  }, [visible, slideAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  const handleSelect = (id: string) => {
    if (multiSelect) {
      const newSelected = selectedItems.includes(id)
        ? selectedItems.filter(item => item !== id)
        : [...selectedItems, id];
      onSelectFilter(newSelected.join(','));
    } else {
      onSelectFilter(id);
      if (type !== 'content') {
        onClose();
      }
    }
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onClose}>
        <Animated.View
          style={[
            styles.modalContent,
            type === 'content' ? {paddingBottom: 70} : {},
            {
              backgroundColor: colors.background,
              transform: [{translateY}],
            },
          ]}>
          <TouchableOpacity activeOpacity={1}>
            <View style={styles.modalHeader}>
              <View style={styles.handleBar} />
              <Text style={[styles.modalTitle, {color: colors.text}]}>
                {type === 'date'
                  ? 'Filter by date'
                  : type === 'sort'
                  ? 'Sort by'
                  : 'Filter by content type'}
              </Text>
              {type === 'content' && (
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={() => onSelectFilter('')}>
                  <Text style={[styles.clearText, {color: colors.primary}]}>
                    Clear
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {filterOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[styles.filterOption]}
                onPress={() => handleSelect(option.id)}>
                <Text style={[styles.filterText, {color: colors.text}]}>
                  {option.label}
                </Text>
                {option.id === 'threads' ? (
                  <ChevronRight size={20} color={colors.text} />
                ) : multiSelect ? (
                  <View
                    style={[
                      styles.radioButton,
                      selectedItems.includes(option.id) && {
                        backgroundColor: colors.primary,
                        borderColor: colors.primary,
                      },
                    ]}>
                    {selectedItems.includes(option.id) && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </View>
                ) : (
                  <View
                    style={[
                      styles.radioButton,
                      selectedFilter === option.id && {
                        borderColor: colors.primary,
                      },
                    ]}>
                    {selectedFilter === option.id && (
                      <View
                        style={[
                          styles.radioButtonInner,
                          {backgroundColor: colors.primary},
                        ]}
                      />
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}

            {type === 'content' && (
              <TouchableOpacity
                style={[styles.applyButton, {backgroundColor: colors.primary}]}
                onPress={() => {
                  onApply?.(selectedItems);
                  onClose();
                }}>
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 150,
  },
  modalHeader: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: '#DEDEDE',
    borderRadius: 2,
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  filterText: {
    fontSize: 16,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DEDEDE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  clearButton: {
    position: 'absolute',
    top: 33,
    right: 20,
  },

  checkmark: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  applyButton: {
    marginHorizontal: 20,
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  clearText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default FilterModal;
