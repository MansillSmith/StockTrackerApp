import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import { PortfolioEntry } from './components/PortfolioEntry';
import { Portfolio } from './components/Portfolio';

import { SQLiteProvider } from 'expo-sqlite';
// import { useMigrations } from 'expo-sqlite/migrations';

// temp
// import androidIcon from './assets/android-icon-foreground.png';

export default function App() {
  return (
    <View style={styles.container}>
      <SQLiteProvider
        databaseName="db.db"
        assetSource={{ assetId: require('./assets/db.db') }}
      >
        <Portfolio></Portfolio>
      </SQLiteProvider>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f00',
    alignItems: 'center',
    justifyContent: 'center'
  },
});
