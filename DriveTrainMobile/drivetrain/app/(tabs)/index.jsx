import { View, Text, StyleSheet, ImageBackground } from 'react-native'
import React from 'react'

import logoImage from "@/assets/images/drivetrainLogo.png"

const index = () => {
  return (
    <View style = {styles.container}>
      <ImageBackground
      source={logoImage}
      resizeMode='cover'
      style={styles.image}
      >
      <Text style = {styles.text}>DriveTrain: The Drive Safe app</Text>
      </ImageBackground>
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: 'column',
  },
  image:{
    width:'100%', 
    height: '100%',
    flex:1, 
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  text:{
    color: 'white',
    fontSize: 42,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
})