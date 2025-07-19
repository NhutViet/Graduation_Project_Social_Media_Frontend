import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Colors} from '../../assets/color/Colors';
import {useTheme} from '../util/ThemeContext';
import Post from '../(tabs)/Post';
import {Search} from '../(tabs)/Search';
import ProfileNavigation from '../(tabs)/Profile/ProfileNavigation';
import Reels from '../(tabs)/Reels';
import {Home} from '../(tabs)/Home';
import {useRef, useState} from 'react';
import {useTabLoading} from '../../services/TabLoadingContext';
import {
  Home as HomeIcon,
  Search as SearchIcon,
  PlusSquare,
  PlaySquare,
  UserCircle2,
} from 'lucide-react-native';

const Tab = createBottomTabNavigator();

const TabIcon = ({
  IconComponent,
  focused,
  tintColor,
  loading,
}: {
  IconComponent: React.ElementType;
  focused: boolean;
  tintColor: string;
  loading?: boolean;
}) => (
  <View style={styles.iconWrapper}>
    {loading ? (
      <ActivityIndicator size="small" color={Colors.primary} />
    ) : (
      <IconComponent size={22} color={focused ? tintColor : `${tintColor}99`} />
    )}
  </View>
);

const BottomTabs = ({onTabChange}: {onTabChange?: (index: number) => void}) => {
  const {theme} = useTheme();
  const color = Colors[theme];
  const [tabIndex, setTabIndex] = useState(0);
  const {loadingTabs, setTabLoading} = useTabLoading();
  const homeRef = useRef<{reload: () => void}>(null);
  const reelsRef = useRef<{reload: () => void}>(null);
  const searchRef = useRef<{resetToInitial: () => void}>(null);

  const isReelsTab = tabIndex === 3;
  const barBackground = isReelsTab ? '#000000' : color.background;
  const iconTint = isReelsTab ? '#888888' : color.text;

  const handleTabChange = (newIndex: number) => {
    const previousIndex = tabIndex;
    setTabIndex(newIndex);
    onTabChange?.(newIndex);

    // Reset search screen when navigating away from search tab (index 1)
    if (previousIndex === 1 && newIndex !== 1) {
      searchRef.current?.resetToInitial();
    }
  };

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: barBackground,
          borderTopWidth: 0,
          height: 60,
          shadowColor: 'gray',
          shadowOpacity: 0.3,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
      screenListeners={{
        state: e => {
          const index = e.data.state.index;
          handleTabChange(index);
        },
      }}>
      <Tab.Screen
        name="Home"
        children={() => <Home ref={homeRef} />}
        listeners={{
          tabPress: async () => {
            setTabLoading('Home', true);
            try {
              await homeRef.current?.reload();
            } finally {
              setTabLoading('Home', false);
            }
          },
        }}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              IconComponent={HomeIcon}
              focused={focused}
              tintColor={iconTint}
              loading={loadingTabs['Home']}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        children={() => <Search ref={searchRef} />}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              IconComponent={SearchIcon}
              focused={focused}
              tintColor={iconTint}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={Post}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              IconComponent={PlusSquare}
              focused={focused}
              tintColor={iconTint}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Reels"
        children={() => <Reels ref={reelsRef} />}
        listeners={{
          tabPress: async () => {
            setTabLoading('Reels', true);
            try {
              await reelsRef.current?.reload();
            } finally {
              setTabLoading('Reels', false);
            }
          },
        }}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              IconComponent={PlaySquare}
              focused={focused}
              tintColor={iconTint}
              loading={loadingTabs['Reels']}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={ProfileNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <TabIcon
              IconComponent={UserCircle2}
              focused={focused}
              tintColor={iconTint}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BottomTabs;
