import {StyleSheet} from 'react-native';
import Sizes from '../../constants/Sizes';

export const CommonStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: '5%',
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 10,
    height: 40,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  screenTitle: {
    maxWidth: '75%',
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: Sizes.font.header,
    lineHeight: Sizes.font.header + 5,
  },
  // section styles
  section: {
    flexDirection: 'column',
    width: '100%',
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  sectionHeaderRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
  },
  sectionHeader: {
    backgroundColor: 'transparent',
  },
  sectionText: {marginBottom: 5},
  // link
  linkContainer: {
    marginVertical: 5,
  },
  linkText: {
    color: '#0084ff',
    textDecorationLine: 'underline',
    textDecorationColor: '#555',
  },
  // thumbnail
  thumbnail: {
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    zIndex: 10,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  saveBtn: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    marginTop: 10,
    marginRight: 10,
  },
  // search
  search: {
    flex: 1,
    marginTop: 5,
    width: '100%',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: Sizes.font.text,
    marginLeft: 10,
    backgroundColor: 'transparent',
  },
  // actions
  actionBtnContainer: {
    position: 'absolute',
    bottom: 0,
    width: '95%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingVertical: '5%',
  },
  // errors
  errorContainer: {
    width: '100%',
    padding: 10,
    alignSelf: 'center',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  errorText: {
    color: '#dd0000',
    fontSize: 14,
    textAlign: 'center',
  },
});
