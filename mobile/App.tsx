import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform, Text, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

// Update this to your local IP address (e.g., 172.20.10.12) which we found for you!
const WEB_APP_URL = 'http://172.20.10.12:5173';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F1218" />
      <View style={styles.webviewWrapper}>
        <WebView 
          source={{ uri: WEB_APP_URL }}
          style={styles.webview}
          allowsBackForwardNavigationGestures={true}
          pullToRefreshEnabled={true}
          startInLoadingState={true}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          renderError={(errorName, errorCode, errorDesc) => (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Connection Failed</Text>
              <Text style={styles.errorSubtext}>{errorDesc}</Text>
              <Text style={styles.errorSubtext}>Ensure your PC and Phone are on the same WiFi</Text>
              <Text style={styles.errorSubtext}>URL: {WEB_APP_URL}</Text>
            </View>
          )}
          renderLoading={() => (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FFB800" />
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F1218', // Matches our web app background
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webviewWrapper: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#0F1218',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F1218',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0F1218',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF4B4B',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  errorSubtext: {
    color: '#9BA3AF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
  }
});
