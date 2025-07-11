import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { Colors } from '../assets/color/Colors';
import { useTheme } from '../src/util/ThemeContext';
import { ScreenContainer } from 'react-native-screens';

const GAP = Colors.spacing.xs;
const SMALL = (Colors.dimensions.width - GAP * 3) / 3;
const BIG = SMALL * 2 + GAP;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const { width: screenWidth } = Dimensions.get('window');

export const SearchSkeletonGrid: React.FC<{
  itemCount?: number;
  columns?: number;
  itemWidth: number;
  itemHeight: number;
  spacing?: number;
}> = ({
  itemCount = 9,
  columns = 3,
  itemWidth,
  itemHeight,
  spacing = Colors.spacing.xs,
}) => {
  const { theme } = useTheme();
  const currentTheme = Colors[theme];
  
  const placeholders = Array.from({ length: itemCount });

  return (
    <SkeletonPlaceholder
      backgroundColor={currentTheme.gray}
      highlightColor={currentTheme.backgroundSecondary}
      speed={1200}
    >
      <SkeletonPlaceholder.Item style={styles.grid}>
        {placeholders.map((_, i) => (
          <SkeletonPlaceholder.Item
            key={i}
            width={itemWidth}
            height={itemHeight}
            marginRight={i % columns === columns - 1 ? 0 : spacing}
            marginBottom={spacing}
            borderRadius={Colors.radius.xs}
          />
        ))}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const SkeletonExploreSection: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = Colors[theme];
  
  return (
    <SkeletonPlaceholder
      backgroundColor={currentTheme.gray}
      highlightColor={currentTheme.backgroundSecondary}
      speed={1200}
    >
      <SkeletonPlaceholder.Item>
        {/* Render 3 rows */}
        {[0, 1, 2].map((rowIndex) => {
          const isReversed = rowIndex % 2 === 0;
          
          return (
            <SkeletonPlaceholder.Item
              key={rowIndex}
              flexDirection={isReversed ? 'row-reverse' : 'row'}
              width="100%"
              paddingHorizontal={GAP / 2}
              marginBottom={GAP}
            >
              {/* Big cell */}
              <SkeletonPlaceholder.Item
                width={SMALL}
                height={BIG}
                marginLeft={isReversed ? GAP : 0}
                marginRight={isReversed ? 0 : GAP}
                borderRadius={Colors.radius.xs}
              />
              
              {/* Small cells container */}
              <SkeletonPlaceholder.Item
                width={BIG}
                flexDirection="row"
                flexWrap="wrap"
              >
                {/* Top row small cells */}
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  marginRight={GAP}
                  marginBottom={GAP}
                  borderRadius={Colors.radius.xs}
                />
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  marginBottom={GAP}
                  borderRadius={Colors.radius.xs}
                />
                
                {/* Bottom row small cells */}
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  marginRight={GAP}
                  borderRadius={Colors.radius.xs}
                />
                <SkeletonPlaceholder.Item
                  width={SMALL}
                  height={SMALL}
                  borderRadius={Colors.radius.xs}
                />
              </SkeletonPlaceholder.Item>
            </SkeletonPlaceholder.Item>
          );
        })}
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const ProfileSkeleton: React.FC = () => {
  const { theme } = useTheme();
  const currentTheme = Colors[theme];
  
  return (
    <SkeletonPlaceholder
      backgroundColor={currentTheme.gray}
      highlightColor={currentTheme.backgroundSecondary}
      speed={1200}
    >
      <SkeletonPlaceholder.Item style={styles.screenContainer}>
        {/* Header: single bar */}
        <SkeletonPlaceholder.Item padding={Colors.spacing.m}>
          <SkeletonPlaceholder.Item 
            width="100%" 
            height={20} 
            borderRadius={Colors.radius.xs} 
          />
        </SkeletonPlaceholder.Item>

        {/* User Info */}
        <SkeletonPlaceholder.Item>
          <SkeletonPlaceholder.Item 
            flexDirection="row" 
            padding={Colors.spacing.m} 
            alignItems="center"
          >
            <SkeletonPlaceholder.Item 
              width={80} 
              height={80} 
              borderRadius={Colors.radius.round} 
            />
            <SkeletonPlaceholder.Item 
              flex={1} 
              flexDirection="row" 
              justifyContent="space-around" 
              marginLeft={Colors.spacing.l}
            >
              <SkeletonPlaceholder.Item 
                width={40} 
                height={20} 
                borderRadius={Colors.radius.xs} 
              />
              <SkeletonPlaceholder.Item 
                width={40} 
                height={20} 
                borderRadius={Colors.radius.xs} 
              />
              <SkeletonPlaceholder.Item 
                width={40} 
                height={20} 
                borderRadius={Colors.radius.xs} 
              />
            </SkeletonPlaceholder.Item>
          </SkeletonPlaceholder.Item>
          
          {/* Text lines: username + bio */}
          <SkeletonPlaceholder.Item 
            height={20} 
            marginHorizontal={Colors.spacing.m} 
            borderRadius={Colors.radius.xs} 
            marginBottom={Colors.spacing.xs} 
          />
          <SkeletonPlaceholder.Item 
            height={14} 
            marginHorizontal={Colors.spacing.m} 
            borderRadius={Colors.radius.xs} 
            marginBottom={Colors.spacing.xs} 
          />
          <SkeletonPlaceholder.Item 
            width="60%" 
            height={14} 
            marginHorizontal={Colors.spacing.m} 
            borderRadius={Colors.radius.xs} 
            marginBottom={Colors.spacing.m} 
          />
        </SkeletonPlaceholder.Item>

        {/* Action Buttons: two spaced bars */}
        <SkeletonPlaceholder.Item 
          flexDirection="row" 
          paddingHorizontal={Colors.spacing.m} 
          marginBottom={Colors.spacing.m}
        >
          <SkeletonPlaceholder.Item 
            flex={1} 
            height={36} 
            borderRadius={Colors.radius.s} 
            marginRight={Colors.spacing.xs} 
          />
          <SkeletonPlaceholder.Item 
            flex={1} 
            height={36} 
            borderRadius={Colors.radius.s} 
          />
        </SkeletonPlaceholder.Item>

        {/* Highlight Stories */}
        <SkeletonPlaceholder.Item 
          flexDirection="row" 
          paddingHorizontal={Colors.spacing.l} 
          marginBottom={Colors.spacing.m}
        >
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonPlaceholder.Item
              key={i}
              width={70}
              height={70}
              borderRadius={Colors.radius.round}
              marginRight={Colors.spacing.l}
            />
          ))}
        </SkeletonPlaceholder.Item>

        {/* Tabs Bar Skeleton */}
        <SkeletonPlaceholder.Item 
          flexDirection="row" 
          justifyContent="space-around" 
          marginBottom={Colors.spacing.m}
        >
          <SkeletonPlaceholder.Item 
            width={SMALL} 
            height={30} 
            borderRadius={Colors.radius.xs} 
          />
          <SkeletonPlaceholder.Item 
            width={SMALL} 
            height={30} 
            borderRadius={Colors.radius.xs} 
          />
          <SkeletonPlaceholder.Item 
            width={SMALL} 
            height={30} 
            borderRadius={Colors.radius.xs} 
          />
        </SkeletonPlaceholder.Item>

        {/* Tab Content Grid: 2 rows x 3 columns */}
        <SkeletonPlaceholder.Item paddingHorizontal={Colors.spacing.xs}>
          <SearchSkeletonGrid 
            itemCount={6} 
            columns={3} 
            itemWidth={SMALL} 
            itemHeight={SMALL} 
            spacing={Colors.spacing.xs} 
          />
        </SkeletonPlaceholder.Item>
      </SkeletonPlaceholder.Item>
    </SkeletonPlaceholder>
  );
};

export const NotificationSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  const { theme } = useTheme();
  const currentTheme = Colors[theme];
  const placeholders = Array.from({ length: count });

  return (
    <SkeletonPlaceholder
      backgroundColor={currentTheme.gray}
      highlightColor={currentTheme.backgroundSecondary}
      speed={1200}
    >
      <>
        {placeholders.map((_, i) => (
          <SkeletonPlaceholder.Item
            key={i}
            flexDirection="row"
            alignItems="center"
            padding={GAP}
            marginBottom={GAP}
          >
            {/* Avatar circle */}
            <SkeletonPlaceholder.Item
              width={50}
              height={50}
              borderRadius={25}
              marginBottom={20}
            />

            {/* Notification box */}
            <SkeletonPlaceholder.Item
              width={screenWidth - 50 - GAP * 3}
              height={70}
              borderRadius={Colors.radius.s}
              marginLeft={GAP}
            />
          </SkeletonPlaceholder.Item>
        ))}
      </>
    </SkeletonPlaceholder>
  );
};

const styles = StyleSheet.create({
  screenContainer: { 
    minHeight: SCREEN_HEIGHT 
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: GAP / 2,
    width: '100%',
  },
  smallGrid: {
    width: BIG,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: GAP / 2,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  marginRight: {
    marginRight: GAP,
  },
  marginLeft: {
    marginLeft: GAP,
  },
});
