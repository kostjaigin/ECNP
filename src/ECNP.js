import React, { Component } from "react";

export default class ECNP extends Component{
    constructor(props) {
        super(props)
        let array = []
        for (var i = 0; i < props.arraySize; i++) {
            array[i] = []
            for (var j = 0; j < props.arraySize; j++) {
                array[i][j] = {value:"_",
                                x:i,
                                y:j
                                }
            }
        }
        this.state = {
            alphabet: "abcdefghijklmnopqrstuvwxyz",
            alphabetCounter: 1,
            array: array,
            droneArray: [{x:0,y:0,jobs:[],preferences:[], currentJob:{name:'a', x:5, y: 1, deadLine:16}},{x:0,y:props.arraySize-1,jobs:[],preferences:[]},{x:props.arraySize-1,y:0,jobs:[], preferences:[]},{x:props.arraySize-1,y:props.arraySize-1,jobs:[], preferences:[]},],
            jobArray:[{name:'a', x:5, y: 1, deadLine:16}],
            time:0
        }
        // this.randomiseResources = this.randomiseResources.bind(this)
        
        this.updateArray = this.updateArray.bind(this)
        this.getBids = this.getBids.bind(this)
        this.getBidshelper = this.getBidsHelper.bind(this)
        this.initPreferences = this.initPreferences.bind(this)
    }
    componentDidMount(){
        this.updateArray()
        this.initPreferences()
        console.log(this.state.droneArray)
    }
    componentDidUpdate(){
        
    }
    updateArray (){
        let array = this.state.array
        for (var i = 0; i < this.props.arraySize; i++) {
            array[i] = []
            for (var j = 0; j < this.props.arraySize; j++) {
                array[i][j] = {value:"_",
                                x:i,
                                y:j
                                }
            }
        }
        for (let drone of this.state.droneArray){
            array[drone.x][drone.y].value = "D"
        }for (let job of this.state.jobArray){
            array[job.x][job.y].value = job.name
        }
        this.setState({
            array:array
        })
    }
    // randomiseResources() {
    //     let array = this.state.array
    //     array.map(row => {
    //         return row.map(element=>{
    //             let rando = Math.random()
    //             let threshold = this.props.resourceSpawnThreshold
    //             if (rando < threshold)
    //                 element.value = "a"
    //             else if (rando < threshold*2)
    //                 element.value = "b"
    //             else if (rando < threshold*3)
    //                 element.value = "c"
    //             else element.value = "_"
    //             return element
    //         })
    //     })
    //     this.setArray(array)
    // }  
    // askDrone(resourceString, droneNr) {
    //     let array = this.state.array
    //     let checkResource = string => string===resourceString
    //     let checkCost = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)
    //     let drone = this.state.droneArray[droneNr]
    //     array.map(row => {
    //         row.map( element => {
    //             if(checkResource(element.value)){
    //                 let cost = (drone.currentX && drone.currentY) ? 
    //                                 checkCost(drone.currentX,drone.currentY,element.x,element.y):
    //                                 checkCost(drone.x,drone.y,element.x,element.y)
    //                 if(drone[resourceString] !== undefined 
    //                 && cost > drone[resourceString]){console.log('do')} 
    //                 //do nothing ^
    //                 else{
    //                     console.log(cost)
    //                     drone[resourceString] = cost
    //                     drone.couldBeX = element.x
    //                     drone.couldBeY = element.y
    //                 }
    //             }

    //         })
    //     })

        
    // }
    checkCost = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)
    getBidsHelper(jobString, droneNr) {
        console.log(jobString)
        let array = this.state.array
        let checkJob = string => string===jobString
        //let checkCost = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)
        let drone = this.state.droneArray[droneNr]
        array.map(row => {
            
            row.map( element => {
                console.log(element.value, jobString)
                if(checkJob(element.value)){
                    let cost = (drone.jobs[drone.jobs.length-1]) ?                       
                        this.checkCost(drone.jobs[drone.jobs.length-1].x,drone.jobs[drone.jobs.length-1].y,element.x,element.y)+drone.jobs[drone.jobs.length-1].cost:
                        this.checkCost(drone.x,drone.y,element.x,element.y)
                    
                    drone.jobs.push({x:element.x,y:element.y,name:element.value,cost:cost})
                    console.log(drone.jobs)
                    console.log('RR')
                }

            })
        })
        let droneArray = this.state.droneArray
        droneArray[droneNr] = drone
        console.log(droneArray)
        console.log(droneArray[droneNr])
        this.setState({
            droneArray: droneArray
        })
        console.log(drone)
    }
    getBids(droneNr){
        console.log(this.state.jobArray)
        this.initPreferences()
       this.state.droneArray[droneNr].preferences.map((e) => {
           this.getBidsHelper(e, droneNr)
       })             
    }
    initPreferences(){
        let preferences = this.state.jobArray.map(e => e.name)
        let droneArray = this.state.droneArray

        for(let i in droneArray){
            console.log(i)
            droneArray[i].preferences = preferences
        }
        this.setState({
            droneArray: droneArray
        })
        

        // let droneArray = this.state.droneArray
        // droneArray.map(drone =>{
        //     let i = 0
        //     let array = this.state.jobArray.map(job=>{
        //         drone.jobs[i++] = job
        //     })
        // })
        // this.setState({
        //     droneArray: droneArray
        // })
    }
    updatePreferences(){
        //TODO
    }
    addOrUpdateJob(x,y, update) {
        let arrayJobs = this.state.jobArray
        if(!update){
            arrayJobs.push({name: this.state.alphabet[this.state.alphabetCounter],x:x,y:y})
            this.setState({
                alphabetCounter:this.state.alphabetCounter+1,
                jobArray:arrayJobs
            })  
        }
        
        let array = this.state.array
        for (let job of arrayJobs){
            array[job.x][job.y].value = job.name
        }
        this.setState({
            array:array
        })
    }
    moveDrones() {
        console.log('!')
        let droneArray = this.state.droneArray
        droneArray.map(e =>{
            console.log(e)
            if(e.currentJob){
                if(e.x>e.currentJob.x)
                    e.x-=1//console.log({...e,x:e.x-1 })
                else if(e.x<e.currentJob.x)
                    e.x+=1//console.log({...e,x:e.x+1 })
                else if(e.y>e.currentJob.y)
                    e.y-=1
                else if(e.y<e.currentJob.y)
                    e.y+=1 
                if(e.x === e.currentJob.x && e.y === e.currentJob.y){
                    e.currentJob = undefined
                }
                
                   
            
            }
            console.log(droneArray)
            
        })
        this.setState({
            droneArray: droneArray
        })
        this.updateArray()
    }
    acceptAndRemoveJob(resourceName,droneNr){
        let jobArray = this.state.jobArray
        let droneArray = this.state.droneArray
        let jobArray2 = []
        //console.log(jobArray )
        // console.log(jobArray)
        // jobArray.map(e => console.log((e.name !== name )+ ' ' + e +' JEEEZ'))
        jobArray.map(e => {
            if(e.name !== resourceName)
                jobArray2.push(e)
            else
                droneArray[droneNr].currentJob = e
        })
        // jobArray.filter(e => e.name !== resourceName)
        // console.log(jobArray)
        this.setState({
            jobArray: jobArray2
        })
        this.updateArray()
    }


    render() {
        const array = this.state.array
        return <div>
                    <button onClick={this.randomiseResources}>
                        Random Resources

                    </button>
                    
                    <button onClick={() => this.moveDrones()}>
                        Move Drones

                    </button>
                                        
                    <button onClick={() => this.getBids(1)}>
                        Ask Drone 1

                    </button>
                    <button onClick={() => this.acceptAndRemoveJob('b', 2)}>
                        Drone 2 Accept and remove b

                    </button>
                    {array.map(row => 
                                <div>{row.map(element =>
                                    
                                    <span onClick={() => this.addOrUpdateJob(element.x,element.y,false)}>| {element.value}</span>)
                        }</div>)
                }</div>
    }

}