import {Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';
import User from './User';

const SearchUser: React.FC = React.memo(() => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {users, isLoading} = useSelector((state: RootState) => state.search);

  const dataU = (users as any)?.items || [];

  const renderItem = React.useCallback(({item}: {item: any}) => (
    <User
      name={item.username}
      image={item.profilePic}
      handle={item.handleName}
    />
  ), []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: color.background,
        }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: '500',
            color: color.textSecondary,
          }}>
          Đang tải...
        </Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1, backgroundColor: color.background}}>
      {dataU.length > 0 ? (
        <FlashList
          data={dataU}
          renderItem={renderItem}
          keyExtractor={item => item._id || item.username}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews/>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '500',
              color: color.textSecondary,
            }}>
            Không có kết quả phù hợp.
          </Text>
        </View>
      )}
    </View>
  );
});

export default SearchUser;
