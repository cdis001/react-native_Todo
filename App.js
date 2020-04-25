import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
  ScrollView,
  AsyncStorage,
} from 'react-native'
import { AppLoading } from 'expo'

import ToDo from './ToDo'

const { height, width } = Dimensions.get('window')

const App = () => {
  const [newToDo, setNewToDo] = useState('')
  const [loadedToDos, setLoadedToDos] = useState(false)
  const [toDos, setToDos] = useState({})

  useEffect(() => {
    _loadToDos()
  }, [])

  const _loadToDos = async () => {
    try {
      // const toDos = await AsyncStorage.clear()
      const toDos = await AsyncStorage.getItem('toDos')
      const parsedToDos = JSON.parse(toDos)
      const loadedToDos = parsedToDos || {}
      setLoadedToDos(true)
      setToDos(loadedToDos)
    } catch (e) {
      console.log(e)
    }
  }

  const _addToDo = () => {
    if (newToDo !== '') {
      setNewToDo('')
      const ID = Math.random().toString()
      const newToDoObject = {
        ...toDos,
        [ID]: {
          id: ID,
          isCompleted: false,
          text: newToDo,
          createdAt: Date.now(),
        },
      }

      setToDos(newToDoObject)

      _saveToDos(toDos)
    }
  }

  const _deleteToDo = (id) => {
    const temp = { ...toDos }
    delete temp[id]
    setToDos(temp)

    _saveToDos(toDos)
  }

  const _onCheckedToDo = (id) => {
    const temp = { ...toDos }
    const newToDo = temp[id]
    newToDo.isCompleted = !newToDo.isCompleted

    setToDos(temp)

    _saveToDos(toDos)
  }

  const _updateToDo = (id, text) => {
    const temp = { ...toDos }
    const updateToDo = temp[id]
    updateToDo.text = text

    setToDos(temp)
  }

  const _saveToDos = (newToDos) => {
    AsyncStorage.setItem('toDos', JSON.stringify(newToDos))
  }
  if (!loadedToDos) {
    return <AppLoading />
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Text style={styles.title}>To Do List</Text>
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder={'New To Do'}
          value={newToDo}
          onChangeText={(text) => setNewToDo(text)}
          placeholderTextColor={'#999'}
          returnKeyType={'done'}
          autoCorrect={false}
          onSubmitEditing={() => _addToDo()}
          underlineColorAndroid={'transparent'}
        />
        <ScrollView contentContainerStyle={styles.todos}>
          {Object.values(toDos)
            .reverse()
            .map((toDo) => (
              <ToDo
                key={toDo.id}
                deleteToDo={_deleteToDo}
                uncompleteToDo={_onCheckedToDo}
                completeToDo={_onCheckedToDo}
                updateToDo={_updateToDo}
                {...toDo}
              />
            ))}
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#99D8CF',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 30,
    marginTop: 60,
    fontWeight: '300',
    marginBottom: 30,
  },
  card: {
    backgroundColor: 'white',
    flex: 1,
    width: width - 25,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: 'rgb(50, 50, 50)',
        shadowOpacity: 0.5,
        shadowRadius: 5,
        shadowOffset: {
          height: -1,
          width: 0,
        },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  input: {
    padding: 20,
    borderBottomColor: '#bbb',
    borderBottomWidth: 1,
    fontSize: 25,
  },
  todos: {
    alignItems: 'center',
  },
})

export default App
