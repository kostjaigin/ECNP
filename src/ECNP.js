import React, { Component } from "react";

export default class ECNP extends Component{
    constructor(props) {
        super(props)
        let array = []
        for (var i = 0; i < props.arraySize; i++) {
            array[i] = []
            for (var j = 0; j < props.arraySize; j++) {
                array[i][j] = {value:0,
                                x:i,
                                y:j
                                }
            }
        }
        this.state = {
            array: array,
            droneArray: [{x:0,y:0},{x:0,y:props.arraySize-1},{x:props.arraySize-1,y:0},{x:props.arraySize-1,y:props.arraySize-1},]
        }
        this.randomiseResources = this.randomiseResources.bind(this)
        this.setArray = this.setArray.bind(this)
    }
    setArray = array =>{
        for (let drone of this.state.droneArray){
            array[drone.x][drone.y].value = "D"
        }
        this.setState({
            array:array
        })
    }
    randomiseResources() {
        let array = this.state.array
        array.map(row => {
            return row.map(element=>{
                let rando = Math.random()
                let threshold = this.props.resourceSpawnThreshold
                if (rando < threshold)
                    element.value = "a"
                else if (rando < threshold*2)
                    element.value = "b"
                else if (rando < threshold*3)
                    element.value = "c"
                else element.value = "_"
                return element
            })
        })
        this.setArray(array)
    }
    askDrone(resourceString, droneNr) {
        let array = this.state.array
        let checkResource = string => string===resourceString
        let checkCost = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)
        let drone = this.state.droneArray[droneNr]
        array.map(row => {
            row.map( element => {
                if(checkResource(element.value)){
                    let cost = (drone.currentX && drone.currentY) ? 
                                    checkCost(drone.currentX,drone.currentY,element.x,element.y):
                                    checkCost(drone.x,drone.y,element.x,element.y)
                    if(drone[resourceString] !== undefined 
                    && cost > drone[resourceString]){console.log('do')} 
                    //do nothing ^
                    else{
                        console.log(cost)
                        drone[resourceString] = cost
                        drone.couldBeX = element.x
                        drone.couldBeY = element.y
                    }
                }

            })
        })

        
    }





    render() {
        const array = this.state.array
        return <div>
                    <button onClick={this.randomiseResources}>
                        Random Resources

                    </button>
                    <button onClick={() => this.askDrone('a', 1)}>
                        Ask Drone 1

                    </button>
                    {array.map(row => 
                                <div>{row.map(element =>
                                    <span>| {element.value}</span>)
                        }</div>)
                }</div>
    }

}