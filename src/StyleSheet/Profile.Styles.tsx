import {Dimensions, StyleSheet} from 'react-native';
import {Colors} from '../../assets/color/Colors';

const width = Colors.dimensions.width;
const numColumns = 3;
const tileSize = width / numColumns;
const itemSize = width / 3;

export const Styles = {
  tileSize: tileSize,
  itemSize: itemSize,
  styles: StyleSheet.create({
    headerContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: 'white',
    },
    content: {
      flex: 1,
      paddingHorizontal: 5,
    },
    tabLabel: {
      flex: 1,
      aspectRatio: 1,
      padding: 1,
    },
    imageContainer: {
      flex: 1,
      overflow: 'hidden',
    },
    tabLabelImage: {
      width: '100%',
      height: '100%',
    },
    container: {
      flex: 1,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    profileInfo: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginTop: 10,
    },
    bioContainer: {
      paddingHorizontal: 16,
      marginTop: 15,
    },
    postsContainer: {
      flex: 1,
    },

    usernameContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    username: {
      fontSize: 16,
      fontWeight: '600',
    },
    headerRight: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 15,
    },
    iconButton: {
      padding: 5,
    },

    // Avatar section
    avatarContainer: {
      position: 'relative',
    },
    avatar: {
      width: 86,
      height: 86,
      borderRadius: 43,
    },
    addStoryButton: {
      position: 'absolute',
      right: -4,
      bottom: -4,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: '#0095F6',
      justifyContent: 'center',
      alignItems: 'center',
    },
    addStoryIcon: {
      color: 'white',
      fontSize: 18,
      fontWeight: '600',
    },

    // Stats section
    statsContainer: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginLeft: 20,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 16,
      fontWeight: '600',
    },
    statLabel: {
      fontSize: 13,
    },

    // Bio section
    displayName: {
      fontSize: 14,
      fontWeight: '600',
    },
    modeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 5,
      backgroundColor: '#F2F2F2',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    modeText: {
      fontSize: 13,
    },
    bioText: {
      fontSize: 14,
      marginTop: 5,
    },
    website: {
      fontSize: 14,
      marginTop: 5,
    },

    // Action buttons
    actionButtons: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginTop: 15,
      gap: 8,
    },
    editButton: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 8,
      alignItems: 'center',
    },
    shareButton: {
      flex: 1,
      paddingVertical: 7,
      borderRadius: 8,
      alignItems: 'center',
    },
    optionButton: {
      width: 35,
      paddingVertical: 7,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
    },

    // Highlights section
    highlightsContainer: {
      marginVertical: 10,
    },
    highlightItem: {
      alignItems: 'center',
      marginVertical: 10,
      marginRight: 15,
    },
    highlightImageContainer: {
      padding: 1,
      borderRadius: 35,
      borderWidth: 1,
      borderColor: '#DBDBDB',
    },
    highlightImage: {
      width: 64,
      height: 64,
      borderRadius: 32,
    },
    highlightText: {
      fontSize: 12,
      marginTop: 4,
    },

    // Tab bar
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
      justifyContent: 'center',
    },
    gridItem: {
      padding: 1,
      width: Dimensions.get('window').width / 3,
      aspectRatio: 1,
    },
    gridImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
    },
    reelOverlay: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 4,
      padding: 4,
    },
    tagOverlay: {
      position: 'absolute',
      top: 8,
      right: 8,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 4,
      padding: 4,
    },
    tabBar: {
      flexDirection: 'row',
      height: 50,
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    tab: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 10,
    },
    activeTab: {
      borderBottomWidth: 2,
    },
    highlightTitle: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
  }),
};
