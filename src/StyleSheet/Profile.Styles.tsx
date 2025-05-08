import {Dimensions, StyleSheet} from 'react-native';
import {Colors as theme} from '../../assets/color/Colors';

const width = theme.dimensions.width;
const numColumns = 3;
const tileSize = width / numColumns;
const itemSize = width / 3;

export const Styles = {
  tileSize: tileSize,
  itemSize: itemSize,
  styles: StyleSheet.create({
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
      marginTop: 10,
    },

    // Header components
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
      paddingHorizontal: 16,
      marginTop: 15,
    },
    highlightItem: {
      alignItems: 'center',
      marginRight: 15,
    },
    highlightImageContainer: {
      padding: 2,
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
    tabBar: {
      flexDirection: 'row',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderColor: '#DBDBDB',
      marginTop: 15,
    },
    tabButton: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    activeTab: {
      borderBottomWidth: 1,
    },

    // Grid layout
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
  }),
};
