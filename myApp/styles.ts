import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  container: { 
   flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 👈 key for left/right split
    backgroundColor: '#CCC',
    borderRadius: 10,
    width: '100%', // 👈 fill parent width
    height: 50,
    paddingHorizontal: 10, // space inside left/right edges
    marginVertical: 2,
  }
});