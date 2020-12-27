import React, {useState, useEffect} from 'react';
import { StatusBar, Animated, Text, Image, View, StyleSheet, Dimensions, FlatList, TouchableOpacity, Button } from 'react-native';

const {width, height} = Dimensions.get('screen');

// https://www.flaticon.com/packs/retro-wave
// inspiration: https://dribbble.com/shots/11164698-Onboarding-screens-animation
// https://twitter.com/mironcatalin/status/1321180191935373312

const bgs = ['#A5BBFF', '#DDBEFE', '#FF63ED', '#B98EFF', '#333'];


const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']
const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado']
const dayOfWeek = (day, month, year) => days[new Date(year, month, day).getDay()]

const Indicator = ({scrollX, holidays}) => {


    return <View style={{position:'absolute', bottom:100, flexDirection:'row'}}>
        
        {holidays.map((_, i) => {

            const inputRange = [(i -1) * width, i * width, (i + 1) * width ];             

            const scale = scrollX.interpolate({
                inputRange,
                outputRange: [0.8, 1.4, 0.8],
                extrapolate: 'clamp'
            });
            const opacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.6, 0.9, 0.6],
                extrapolate: 'clamp'
            });

            return (
                <Animated.View
                    key={`indicator-${i}`}
                    style={{
                        height:10,
                        width:10,
                        borderRadius:5,
                        backgroundColor:'#fff',
                        margin:5,
                        opacity,
                        transform: [{
                            scale,
                        }]
                    }}>
                </Animated.View>
            )
        })}
          
        
    </View>
}

const Backdrop = ({scrollX}) => {

    const backgroundColor = scrollX.interpolate({
        inputRange: bgs.map((_, i) => i * width),
        outputRange: bgs.map((bg) => bg )
    })
    
    return (
        <Animated.View
            style={[
                StyleSheet.absoluteFillObject,
                { backgroundColor: backgroundColor }
            ]}>
            
        </Animated.View>
    )
}


export default function App() {
    
    const scrollX = React.useRef(new Animated.Value(0)).current;

    const [holidays, setHolidays] = useState({});
    const [year, setYear] = useState(new Date().getFullYear());
    
    const setNext = (holidays) => {
        const now = new Date()
        const today = {
          day: now.getDate(),
          month: now.getMonth() + 1
        };
        
        console.log(today);
        // change < for >
        let holiday = holidays.filter(h => h.mes === today.month && h.dia > today.day ||  h.mes < today.month );
        if (!holiday){
          holiday = holidays[0];
        }
        setHolidays(holiday);
    }
  
    useEffect(() => {
        
        async function fetchMyAPI() {
            let response = await fetch(`https://nolaborables.com.ar/api/v2/feriados/${year}`)
            response = await response.json()
            //setHolidays(response)
            setNext(response)
        }
        fetchMyAPI()
    }, []);
    
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Backdrop scrollX={scrollX} />
            
            <Animated.FlatList 
                data={holidays}
                keyExtractor={item => item.id}
                contentContainerStyle={{
                    paddingBottom:100
                }}
                horizontal
                scrollEventThrottle={32}
                onScroll={Animated.event(
                    [{ nativeEvent: {contentOffset: { x:scrollX }} }],
                    { useNativeDriver: false }
                )}
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                renderItem={({item}) => {
                    return (
                        <View style={{
                            width, 
                            justifyContent:'center', 
                            alignItems:'center', 
                            padding:20
                        }}>
                            <View style={{flex:.8, justifyContent:'center'}}>
                                <Text 
                                    style={{
                                        color: '#FFF',
                                        fontWeight: '800', 
                                        fontSize: 50,  
                                        marginBottom:10,
                                        width: width-50, 
                                        textAlign: 'center'
                                    }}>
                                        {`${months[item.mes-1]}`} 
                                </Text>
                                <Text 
                                    style={{
                                        color: '#FFF',
                                        fontWeight: '800', 
                                        fontSize: 50,  
                                        marginBottom:10,
                                        width: width-50, 
                                        textAlign: 'center'
                                    }}>                                        
                                        {`${dayOfWeek(item.dia, item.mes-1, year)} ${item.dia}`}
                                </Text>
                            </View>
                            <View style={{flex:.3}}>

                                <Text 
                                    style={{
                                        color: '#FFF',
                                        fontWeight: '800', 
                                        fontSize: 28,  
                                        marginBottom:10,
                                        
                                    }}>
                                        {item.motivo}
                                </Text>
                                <Text
                                    style={{
                                        color: '#FFF',
                                        fontWeight: '800', 
                                        fontSize: 20,  
                                        marginBottom:10,
                                        
                                    }}>
                                    {`Feriado ${item.tipo}`}
                                </Text>
                            </View>
                        </View>
                    );
                }}
                >
                    
            </Animated.FlatList>
            <View
                style={{
                  justifyContent:'center',
                  flexDirection:'row'
                }}
            >
                <Indicator scrollX={scrollX} holidays={holidays} />
            </View>
        </View>
  ); 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});