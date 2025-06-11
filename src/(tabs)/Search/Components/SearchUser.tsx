import {Text, View} from 'react-native';
import React from 'react';
import {useTheme} from '../../../util/ThemeContext';
import {Colors} from '../../../../assets/color/Colors';
import {FlashList} from '@shopify/flash-list';
import User from '../../Home/components/Story';
import {useSelector} from 'react-redux';
import {RootState} from '../../../../services/store';

const SearchUser = (props: any) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const {users, isLoading} = useSelector((state: RootState) => state.search);

  const dataU = (users as any)?.items || [];

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
          renderItem={({item}: any) => {
            return (
              <User
                name={item.username}
                image={item.profilePic}
                status={item.status}
                isStory={false}
              />
            );
          }}
          estimatedItemSize={200}
          showsVerticalScrollIndicator={false}
        />
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
};

export default SearchUser;
