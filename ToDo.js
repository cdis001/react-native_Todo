import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
} from 'react-native'
import PropTypes from 'prop-types'

const { width, height } = Dimensions.get('window')

const ToDo = ({
  deleteToDo,
  onCheckedToDo,
  completeToDo,
  updateToDo,
  id,
  isCompleted,
  text,
  createdAt,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [toDoValue, setToDoValue] = useState('')

  useEffect(() => {
    setToDoValue(text)
  }, [])

  propTypes = {
    text: PropTypes.string.isRequired,
    isCompleted: PropTypes.bool.isRequired,
    deleteToDo: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    completeToDo: PropTypes.func.isRequired,
    onCheckedToDo: PropTypes.func.isRequired,
    updateToDo: PropTypes.func.isRequired,
  }

  const _toggleComplete = (event) => {
    event.stopPropagation()
    onCheckedToDo(id)
  }
  const _startEditing = (event) => {
    event.stopPropagation()
    setIsEditing(true)
  }
  const _finishEditing = (event) => {
    event.stopPropagation()
    updateToDo(id, toDoValue)
    setIsEditing(false)
  }
  const _controllInput = (text) => {
    setToDoValue(text)
  }

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <TouchableOpacity onPress={_toggleComplete}>
          <View
            style={[
              styles.circle,
              isCompleted ? styles.completedCircle : styles.uncompletedCircle,
            ]}
          />
        </TouchableOpacity>
        {isEditing ? (
          <TextInput
            style={[
              styles.text,
              styles.input,
              isCompleted ? styles.completedText : styles.uncompletedText,
            ]}
            value={toDoValue}
            multiline={true}
            onChangeText={_controllInput}
            returnKeyType={'done'}
            onBlur={_finishEditing}
            underlineColorAndroid={'transparent'}
          />
        ) : (
          <Text
            style={[
              styles.text,
              isCompleted ? styles.completedText : styles.uncompletedText,
            ]}
          >
            {text}
          </Text>
        )}
      </View>
      {isEditing ? (
        <View style={styles.actions}>
          <TouchableOpacity onPressOut={_finishEditing}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>✅</Text>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.actions}>
          <TouchableOpacity onPressOut={_startEditing}>
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>✏️</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPressOut={(event) => {
              event.stopPropagation
              deleteToDo(id)
            }}
          >
            <View style={styles.actionContainer}>
              <Text style={styles.actionText}>❌</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: width - 50,
    borderBottomColor: '#bbb',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    marginRight: 20,
    marginLeft: 10,
  },
  completedCircle: {
    borderColor: '#bbb',
  },
  uncompletedCircle: {
    borderColor: '#73E1A1',
  },
  text: {
    fontWeight: '600',
    fontSize: 20,
    marginVertical: 20,
  },
  completedText: {
    color: '#bbb',
    textDecorationLine: 'line-through',
  },
  uncompletedText: {
    color: '#353535',
  },
  column: {
    flexDirection: 'row',
    alignItems: 'center',
    width: width / 2,
  },
  actions: {
    flexDirection: 'row',
  },
  actionContainer: {
    marginVertical: 20,
    marginHorizontal: 10,
  },
  input: {
    paddingTop: 0,
    width: width / 2,
  },
})

export default ToDo
