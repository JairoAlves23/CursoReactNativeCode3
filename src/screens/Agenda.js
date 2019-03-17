import React, { Component } from 'react'
import 
{ 
    StyleSheet, 
    Text, 
    View, 
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform,
    AsyncStorage
} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/assets/imgs/today.jpg'
import commonStyles from '../commonStyles'
import Tasks from '../components/Tasks'
import Icon from 'react-native-vector-icons/FontAwesome'
import ActionButton from 'react-native-action-button'
import AddTask from './AddTask' 


export default class Agenda extends Component {
  
  state = {
      tasks: [],
     visibleTasks: [],
     showDoneTasks: true,
     showAddTask: false,
}

addTask = task => {
    const tasks = [...this.state.tasks]
    tasks.push({
        id: Math.random(),
        desc: task.desc,
        estimateAt: task.date,
        doneAt: null
    })

    this.setState({ tasks, showAddTask: false }, this.filterTasks)
}

deleteTask =  id => {
   const tasks = this.state.tasks.filter(task => task.id !== id)
   this.setState({ tasks }, this.filterTasks)
}

//Função para filtrar as tarefas verificando as tarefas não feitas 
//*const pending = task => task.doneAt === null* para uso da função filter visibleTasks = this.state.tasks.filter(pending)

filterTasks = () => {
    let visibleTasks = null
    if(this.state.showDoneTasks) {
        visibleTasks = [...this.state.tasks]
    } else {
        const pending = task => task.doneAt === null
        visibleTasks = this.state.tasks.filter(pending)
    }
    this.setState ({ visibleTasks })
    AsyncStorage.setItem('tasks',JSON.stringify(this.state.tasks))
}


//Mudar o atributo do estado toda vez que for alterado o estado no toogletask
toggleFilter = () => {
    this.setState({ showDoneTasks: !this.state.showDoneTasks }, this.filterTasks)
}

toggleTask = id => {
    const tasks = this.state.tasks.map(task =>{
        if (task.id === id) {
            task = {...task}
            task.doneAt = task.doneAt ? null : new Date()
        }
        return task
    })
    this.setState({ tasks }, this.filterTasks) 
}

componentDidMount = async () => {
    const data = await AsyncStorage.getItem('tasks')
    const tasks = JSON.parse(data) || []
    this.setState({ tasks }, this.filterTasks)
}
  
  render() {
    return (
        <View style={styles.container}>
        <AddTask isVisible={this.setState.showAddTask}
            onSave={this.addTask}
            onCancel={()=>{this.setState({ showAddTask:false })}} />
        <ImageBackground source={todayImage} style={styles.backgroud}>
            <View style={styles.iconBar}>
                <TouchableOpacity onPress={this.toggleFilter}>
                    <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                    size={20} color={ commonStyles.colors.secondary } />
                </TouchableOpacity>

            </View>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Hoje</Text>
                <Text style={styles.subtitle}>{moment().locale('pt-br').format('ddd, D [de] MMMM [de] YYYY')}</Text>
            </View>
        </ImageBackground>
             <View style={styles.tasksContainer}>
                <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`}
                renderItem={({ item }) => <Tasks {...item} 
                toggleTask={this.toggleTask} 
                onDelete={this.onDelete}/>} 
                ></FlatList>
             </View>
             <ActionButton buttonColor={commonStyles.colors.today}
             onPress={()=>{this.setState({ showAddTask })}} ></ActionButton>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
    },
    backgroud: {
        flex:3,
    },
    titleBar: {
        flex:1,
        justifyContent: 'flex-end',
    },
    title: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.seconday,
        fontSize: 50,
        marginLeft: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontFamily: commonStyles.fontFamily,
        color: commonStyles.colors.seconday,
        fontSize: 20,
        marginLeft: 20,
        marginBottom: 30,
    },
    tasksContainer: {
        flex: 7,
    },
    iconBar: {
        marginTop: Platform.OS === 'ios' ? 30 : 10,
        marginHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    }
})