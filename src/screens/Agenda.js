import React, { Component } from 'react'
import 
{ 
    StyleSheet, 
    Text, 
    View, 
    ImageBackground,
    FlatList,
    TouchableOpacity,
    Platform  
} from 'react-native'
import moment from 'moment'
import 'moment/locale/pt-br'
import todayImage from '../../assets/assets/imgs/today.jpg'
import commonStyles from '../commonStyles'
import Tasks from '../components/Tasks'
import Icon from 'react-native-vector-icons/FontAwesome'

export default class Agenda extends Component {
  
  state = {
      tasks: [
        { id: Math.random(), desc: 'Limpar a casa', estimateAt: new Date(), doneAt: new Date()},
        { id: Math.random(), desc: 'Fazer curso de Angular', estimateAt: new Date(), doneAt: null},
        { id: Math.random(), desc: 'Limpar a casa', estimateAt: new Date(), doneAt: new Date()},
        { id: Math.random(), desc: 'Fazer curso de Angular', estimateAt: new Date(), doneAt: null},
        { id: Math.random(), desc: 'Limpar a casa', estimateAt: new Date(), doneAt: new Date()},
        { id: Math.random(), desc: 'Fazer curso de Angular', estimateAt: new Date(), doneAt: null},
        { id: Math.random(), desc: 'Limpar a casa', estimateAt: new Date(), doneAt: new Date()},
        { id: Math.random(), desc: 'Fazer curso de Angular', estimateAt: new Date(), doneAt: null},
        { id: Math.random(), desc: 'Limpar a casa', estimateAt: new Date(), doneAt: new Date()},
        { id: Math.random(), desc: 'Fazer curso de Angular', estimateAt: new Date(), doneAt: null},
  ],
     visibleTasks: [],
     showDoneTasks: true,
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

componentDidMount = () => {
    this.filterTasks()
}
  
  render() {
    return (
        <View style={styles.container}>
        <ImageBackground source={todayImage} style={styles.backgroud}>
            <View style={styles.iconBar}>
                <TouchableOpacity onPress={this.toggleFilter}>
                    <Icon name={this.state.showDoneTasks ? 'eye' : 'eye-slash'}
                    size={20} color={ commonStyles.colors.secondary } />
                </TouchableOpacity>

            </View>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Hoje</Text>
                <Text style={styles.subtitle}>{moment().locale('pt-br').format('ddd, D[de] MMMM')}</Text>
            </View>
        </ImageBackground>
             <View style={styles.tasksContainer}>
                <FlatList data={this.state.visibleTasks} keyExtractor={item => `${item.id}`}
                renderItem={({ item }) => <Tasks {...item} toggleTask={this.toggleTask} />} 
                ></FlatList>
             </View>
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