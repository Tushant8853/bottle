import React from 'react';
import {StyleSheet, Text, View } from 'react-native';

const Camera = () => {
  return (
    <View style={styles.container}>
      <Text>
        Camera is working 
      </Text>
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