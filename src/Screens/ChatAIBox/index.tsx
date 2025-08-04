import React, {useEffect, useRef, useState} from 'react';
import {View, FlatList, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ChatHeader from './Components/ChatHeader';
import ChatInput from './Components/ChatInput';
import {useTheme} from '../../../src/util/ThemeContext';
import {Colors} from '@assets/color/Colors';
import {AppDispatch, RootState} from '@services/store';
import {askAI, getHistoryChatAI} from '@services/ChatAIRedux/ChatAISlide';
import {useHeadAlert} from '../../../components/Global/HeadAlertProvider';
import {Sparkles} from 'lucide-react-native';
import LoadTyping from './Components/LoadTyping';

type FlatItem = {prompt?: string; answer?: string};

export const ChatAIBox = () => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const dispatch = useDispatch<AppDispatch>();
  const {showAlert} = useHeadAlert();

  const {history, isLoading} = useSelector((state: RootState) => state.chatAI);

  const [page, setPage] = useState(history.pagination.currentPage);
  const prevPageRef = useRef(page);
  const prevLenRef = useRef(history.data.length);

  const [flatHistory, setFlatHistory] = useState<FlatItem[]>(() =>
    history.data.flatMap(item => [
      {answer: item.answer},
      {prompt: item.prompt},
    ]),
  );

  useEffect(() => {
    dispatch(getHistoryChatAI({page, limit: history.pagination.limit}));
  }, [page]);

  useEffect(() => {
    const prevPage = prevPageRef.current;
    const currPage = page;
    const prevLen = prevLenRef.current;
    const currLen = history.data.length;
    if (currPage === 1 && prevLen === 0 && currLen > 0) {
      const all = history.data.flatMap(item => [
        {answer: item.answer},
        {prompt: item.prompt},
      ]);
      setFlatHistory(all);
    } else if (currPage > prevPage) {
      const added = history.data.slice(prevLen);
      const toAppend = added.flatMap(item => [
        {answer: item.answer},
        {prompt: item.prompt},
      ]);
      setFlatHistory(old => [...old, ...toAppend]);
    }

    prevPageRef.current = currPage;
    prevLenRef.current = currLen;
  }, [history.data]);

  const handleSend = async (prompt: string) => {
    setFlatHistory(old => [{prompt}, ...old]);

    try {
      const action = await dispatch(askAI({prompt}));
      if (askAI.fulfilled.match(action)) {
        setFlatHistory(old => [{answer: action.payload.answer}, ...old]);
      }
    } catch {
      showAlert('Lỗi', 'Không thể trả lời câu hỏi.');
    }
  };

  const handleLoadMore = () => {
    if (history.pagination.hasNextPage && !isLoading) {
      setPage(prev => prev + 1);
    }
  };

  const renderItem = ({item}: {item: FlatItem}) =>
    item.prompt !== undefined ? (
      <View
        style={[
          styles.bubble,
          styles.promptBubble,
          {backgroundColor: color.primary},
        ]}>
        <Text style={[styles.text, {color: color.white}]}>{item.prompt}</Text>
      </View>
    ) : (
      <View style={styles.bubbleContainer}>
        <View
          style={[styles.avatarContainer, {backgroundColor: color.primary}]}>
          <Sparkles size={18} color={color.background} strokeWidth={2.5} />
        </View>
        <View
          style={[
            styles.bubble,
            styles.answerBubble,
            {backgroundColor: color.card},
          ]}>
          <Text style={[styles.text, {color: color.text}]}>{item.answer}</Text>
        </View>
      </View>
    );

  return (
    <View style={[styles.container, {backgroundColor: color.background}]}>
      <ChatHeader />

      <FlatList
        data={flatHistory}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderItem}
        inverted
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        contentContainerStyle={{paddingBottom: 10}}
        ListHeaderComponent={
          isLoading ? (
            <View style={styles.bubbleContainer}>
              <LoadTyping Icon={Sparkles} />
            </View>
          ) : null
        }
      />

      <ChatInput onSend={handleSend} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  bubble: {
    padding: 10,
    borderRadius: 8,
    maxWidth: '100%',
    marginHorizontal: 8,
  },
  bubbleContainer: {
    flexDirection: 'row',
    maxWidth: '80%',
    marginVertical: 8,
    alignItems: 'flex-end',
    marginHorizontal: 8,
  },
  promptBubble: {
    alignSelf: 'flex-end',
  },
  answerBubble: {
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
  },
  avatarContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
