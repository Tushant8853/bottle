import React from 'react';
import {StyleSheet, Text, View ,Button} from 'react-native';
import * as Sentry from '@sentry/react-native';

const Camera = () => {
  return (
    <View style={styles.container}>
      <Text>
        Camera is working 
      </Text>
      <Button title='Try!' onPress={ () => { Sentry.captureException(new Error('First error')) }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Camera;