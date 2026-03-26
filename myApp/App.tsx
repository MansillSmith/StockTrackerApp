import { StyleSheet, Pressable, Text, View} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SQLiteProvider } from 'expo-sqlite';
import { Portfolios } from './components/Portfolios';
import { PortfolioAccounts } from './components/PortfolioAccounts';
import { RootStackParamList } from "./types";
import { globalStyles } from './styles';
import { ActionButtons } from './components/ActionButtons';
import { ShareAccounts } from './components/ShareAccounts';
// import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  // const [portfolioModalVisible, setPortfolioModalVisible] = useState(false);
  
  // useEffect(() => {
  //   console.log("modal:", portfolioModalVisible);
  // }, [portfolioModalVisible]);

  return (
       <SQLiteProvider
          databaseName="db.db"
          assetSource={{ assetId: require('./assets/db.db') }}
        >
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Portfolios" component={Portfolios}/>
            <Stack.Screen name="PortfolioAccounts" component={PortfolioAccounts} options={{title: "Accounts"}}/>
            <Stack.Screen name="ShareAccounts" component={ShareAccounts}/>
          </Stack.Navigator>     
        </NavigationContainer>
      </SQLiteProvider>
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
