import {
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {FlashList} from '@shopify/flash-list';
import {Post as data} from './Data';
import PostItem from './Components/PostItem';
import {LikedStyles} from '../../StyleSheet/LikedStyles';
import {useTheme} from '../../util/ThemeContext';
import FilterModal from './Components/filter';
import {useNavigation} from '@react-navigation/native';
import { ChevronLeft, ChevronDown } from 'lucide-react-native';

const Filter = [
  {id: 'sort', label: 'Mới nhất đến cũ nhất'},
  {id: 'date', label: 'Tất cả các ngày'},
  {id: 'content', label: 'Tất cả loại nội dung'},
];

export const LikedScreen = () => {
  const [selected, setSelected] = useState<any[]>([]);
  const {theme} = useTheme();
  const styles = LikedStyles(theme);

  // Filter states
  const [filterType, setFilterType] = useState<'date' | 'sort' | 'content'>(
    'date',
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [selectedContents, setSelectedContents] = useState<string[]>([]);
  const navigation = useNavigation();

  const handleFilterSelect = (filter: string) => {
    switch (filterType) {
      case 'date':
        setSelectedDate(filter);
        break;
      case 'sort':
        setSortOrder(filter);
        break;
      case 'content':
        setSelectedContents(filter.split(','));
        break;
    }
  };

  const onHandleSelect = useCallback(
    (item: any) => {
      const isSelected = selected.some(prev => prev.postID === item.postID);
      if (isSelected) {
        const filter = selected.filter(prev => prev.postID !== item.postID);
        setSelected(filter);
      } else {
        setSelected(prev => [...prev, item]);
      }
    },
    [selected],
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft color={styles.iconBack.tintColor}/>
        </TouchableOpacity>
        <Text style={styles.title}>Lượt thích</Text>
        <TouchableOpacity onPress={() => setSelected([])}>
          <Text style={styles.cancel}>Hủy</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.horiContainer}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          {Filter.map(item => (
            <TouchableOpacity
              onPress={() => {
                setFilterType(item.id as 'date' | 'sort' | 'content');
                setIsModalVisible(true);
              }}
              style={styles.filterContainer}
              key={item.id}>
              <Text style={styles.textFilter}>{item.label}</Text>
              <ChevronDown color={styles.iconBack.tintColor}/>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FilterModal
        visible={isModalVisible}
        type={filterType}
        onClose={() => setIsModalVisible(false)}
        onSelectFilter={handleFilterSelect}
        selectedFilter={
          filterType === 'date'
            ? selectedDate
            : filterType === 'sort'
            ? sortOrder
            : ''
        }
        multiSelect={filterType === 'content'}
        selectedItems={filterType === 'content' ? selectedContents : []}
        onApply={items => {
          if (filterType === 'content') {
            setSelectedContents(items);
          }
        }}
      />

      <View style={styles.container}>
        <FlashList
          data={data}
          numColumns={3}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => {
            const isSelected = selected.some(
              prev => prev.postID === item.postID,
            );
            return (
              <PostItem
                data={item}
                onHandle={() => onHandleSelect(item)}
                isSelect={isSelected}
              />
            );
          }}
          extraData={selected}
        />
      </View>

      {selected.length > 0 && (
        <TouchableOpacity style={styles.horiContainer}>
          <Text style={styles.unlike}>Bỏ thích ({selected.length})</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};
