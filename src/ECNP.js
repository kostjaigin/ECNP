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
            alphabet: "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz",
            alphabetCounter: 0,
            droneCounter:0,
            array: array,
            droneArray: [{isMoving:false,x:0,y:0,jobs:[],preferences:[]},{isMoving:false,x:0,y:props.arraySize-1,jobs:[],preferences:[]},{isMoving:false,x:props.arraySize-1,y:0,jobs:[], preferences:[]},{isMoving:false,x:props.arraySize-1,y:props.arraySize-1,jobs:[], preferences:[]},],
            jobArray:[],
            time:0,
            deadline:20,
            deadlinesMissed:0
        }
        // this.randomiseResources = this.randomiseResources.bind(this)
        
        this.updateArray = this.updateArray.bind(this)
        this.getBids = this.getBids.bind(this)
        this.getBidshelper = this.getBidsHelper.bind(this)
        this.initPreferences = this.initPreferences.bind(this)
        this.compareFunction = this.compareFunction.bind(this)
        this.handleDeadlineChange = this.handleDeadlineChange.bind(this)
        this.tick = this.tick.bind(this)
    }
    componentDidMount(){
        this.updateArray()
        this.updatePreferences()
        this.getBids()
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
    async getBidsHelper(jobString, droneNr) {
        //console.log(jobString)
        let array = this.state.array
        let checkJob = string => string===jobString
        //let checkCost = (x1, y1, x2, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2)
        let drone = this.state.droneArray[droneNr]
        //drone.jobs = []
        array.map(row => {
            
            row.map( element => {
                //console.log(element.value, jobString)
                if(checkJob(element.value)){
                    let cost = (drone.jobs[drone.jobs.length-1]) ?                       
                        this.checkCost(drone.jobs[drone.jobs.length-1].x,drone.jobs[drone.jobs.length-1].y,element.x,element.y)+drone.jobs[drone.jobs.length-1].cost:
                        this.checkCost(drone.x,drone.y,element.x,element.y)
                    
                    drone.jobs.push({x:element.x,y:element.y,name:element.value,cost:cost})
                    console.log('Drone with Number ' + droneNr + ' prebids ' + cost + ' on Job: ' + element.value)
                }

            })
        })
        let droneArray = this.state.droneArray
        droneArray[droneNr] = drone
        // console.log(droneArray)
        // console.log(droneArray[droneNr])
        await this.setState({
            droneArray: droneArray
        })
        //console.log(drone)
    }
    async getBids(){
        // console.log(this.state.jobArray)
        console.log('getting Bids.....')
        
        for(let i = 0;i<this.state.droneArray.length;i++){
            let droneArray = this.state.droneArray
            droneArray[i].jobs = []
            await this.setState({
                droneArray:droneArray
            })
            this.state.droneArray[i].preferences.map((e) => {
                this.getBidsHelper(e.name, i)
            }) 
        }
    }
    initPreferences(){
        let preferences = this.state.jobArray.map(e => e.name)
        let droneArray = this.state.droneArray
        for(let i in droneArray){
            droneArray[i].preferences = preferences
        }
        this.setState({
            droneArray: droneArray
        })
    }
    async updatePreferences(){
        let droneArray = this.state.droneArray 
        for(let i = 0; i < droneArray.length; i++){
            let jobArray = this.state.jobArray.map(e => e)
            //console.log(jobArray)
            await jobArray.sort(this.compareFunction)
            
            //console.log(jobArray)
            // console.log(droneArray)
            //console.log(this.state.droneCounter)
            droneArray[this.state.droneCounter].preferences = jobArray 
            await this.setState({
                droneCounter: this.state.droneCounter+1,
                droneArray:droneArray
            })
            
        }
        await this.setState({
            droneCounter:0
        })
    }
    compareFunction(t1, t2){
        //console.log(this.state.droneCounter)
        let drone = this.state.droneArray[this.state.droneCounter]
        
        //console.log(t1.x +'_ ' +  t1.y + '_ '+ drone.x + '_ '+ drone.y)
        let priority1 = this.checkCost(drone.x, drone.y, t1.x, t1.y)+t1.deadline;
        let priority2 = this.checkCost(drone.x, drone.y, t2.x, t2.y)+t2.deadline;
        //console.log(priority1 + '  ' + priority2)
        if (priority1>priority2) return 1
        if (priority2>priority1) return -1
        else return 0
    }
    addOrUpdateJob(x,y, update) {
        let arrayJobs = this.state.jobArray
        if(!update){
            arrayJobs.push({name: this.state.alphabet[this.state.alphabetCounter],x:x,y:y,deadline:this.state.deadline+this.state.time})
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
        this.updatePreferences()
    }
    async moveDrones() {
        let droneArray = this.state.droneArray
        droneArray.map(e =>{
            if(e.currentJob){
                e.isMoving=true
                if(e.x>e.currentJob.x)
                    e.x-=1
                else if(e.x<e.currentJob.x)
                    e.x+=1
                else if(e.y>e.currentJob.y)
                    e.y-=1
                else if(e.y<e.currentJob.y)
                    e.y+=1 
                if(e.x === e.currentJob.x && e.y === e.currentJob.y){
                    e.currentJob = undefined
                    e.isMoving = false
                }
            }           
        })
        await this.setState(prevState =>({
            droneArray: droneArray,
            time: prevState.time +1
        }))

    }
    acceptAndRemoveJob(resourceName,droneNr){
        let jobArray = this.state.jobArray
        let droneArray = this.state.droneArray
        let jobArray2 = []
        //console.log(jobArray )
        // console.log(jobArray)
        // jobArray.map(e => console.log((e.name !== name )+ ' ' + e +' JEEEZ'))
        jobArray.map(e => {
            if(e.name !== resourceName ||  !droneArray[droneNr])
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
    handleDeadlineChange(event){
        this.setState({deadline:event.target.value})
    }
    async tick(){
        await this.updatePreferences()
        await this.getBids()
        let removeArray = []
        for(let i=0; i<this.state.jobArray.length;i++){
            let thing =  await this.getBestBid(this.state.jobArray[i].name)
            let bestBid = thing[1]
            let droneNr = thing[0]
            let evaluation = this.state.jobArray[i].deadline - (this.state.time + bestBid)
            let unmovingDrones = this.state.droneArray.filter(e => e.isMoving === false).length
            // console.log(this.state.droneArray[1].isMoving)
            // console.log(unmovingDrones)
            if(evaluation === 0){
                if(removeArray.length<unmovingDrones){
                    removeArray.push({droneNr: droneNr, name: this.state.jobArray[i].name })
                    console.log('Definitive Bid DroneNr: ' + droneNr + ' JobName ' + this.state.jobArray[i].name)
                    console.log('Definitive Accept DroneNr: ' + droneNr + ' JobName: ' + this.state.jobArray[i].name)
                    console.log('Definitive Reject to all other Drones')}
            }

            else if (evaluation < 0){
                if(removeArray.length<unmovingDrones){
                    removeArray.push({droneNr: droneNr, name: this.state.jobArray[i].name })
                    console.log('DEADLINE MISSED')
                    console.log('Definitive Accept DroneNr: ' + droneNr + ' JobName: ' + this.state.jobArray[i].name)
                    console.log('Definitive Reject to all other Drones')}
                    this.setState({
                        deadlinesMissed: this.state.deadlinesMissed+1
                    })

            }
            else{
                if (this.state.jobArray[i].preAcceptedDrone === undefined ||(this.state.jobArray[i].preAcceptedDrone !== droneNr) ){
                    console.log('Pre Accept DroneNr: ' + droneNr + ' JobName: ' + this.state.jobArray[i].name)
                    console.log('Pre Reject to all other Drones')
                    let jobArray = this.state.jobArray
                    jobArray[i].preAcceptedDrone = droneNr
                    await this.setState({
                        jobArray: jobArray
                    })
                    //this.state.jobArray[i].preAcceptedDrone \\save drone TODO
                }
                
            }
            // console.log(this.state.droneArray)
        }
        
        for(let e of removeArray){
            this.acceptAndRemoveJob(e.name, e.droneNr)
        }
        this.moveDrones()  
        this.updateArray()      
    }
    getBestBid(resourceName){
        //this.getBids()
        let bestBid = Infinity
        let droneNr
        let droneArray = this.state.droneArray.map(e => e)
        let bid = Infinity
        for(let i=0; i<droneArray.length;i++){
            // console.log(droneArray.length)
            //let value = this.state.droneArray[i].jobs.filter((e)=> e.name === resourceName)
            let drone = droneArray[i]
            for(let j=0; j<drone.jobs.length;j++){
                // console.log(drone.jobs.length)
                // console.log(drone.jobs[j].name + resourceName)
                if(drone.jobs[j].name === resourceName && !drone.ismoving){
                    // console.log('Drone' + i)
                    bid = drone.jobs[j].cost
                }
            }
            if( bid < bestBid){
                // console.log(bid + 'DD')
                bestBid = bid
                droneNr = i
            }
        } 
        return [droneNr, bestBid]  
    }
    render() {
        const array = this.state.array
        const time = this.state.time
        const deadline = this.state.deadline
        const deadlinesMissed = this.state.deadlinesMissed
        return <div>
                    
                    <button onClick={() => this.tick()}>One Tick</button>                     
                    <button onClick={() => this.getBids(1)}>Ask Drone 1</button>
                    <button onClick={() => this.acceptAndRemoveJob('b', 2)}>Drone 2 Accept and remove b </button>   
                    <button onClick={() => this.getBestBid('a')}>best Bid on a</button>
                    <div><label>
                        Choose Deadline {deadline}
                        <input type="range" id="start" name="volume" min="20" max="100" value={this.state.deadline} onChange={this.handleDeadlineChange}></input>
                        </label>
                    </div>
                    <p>Round {time}</p>                                  
                    {array.map(row => 
                                <div>{row.map(element =>
                                    
                                    <span onClick={() => this.addOrUpdateJob(element.x,element.y,false)}>| {element.value}</span>)
                        }</div>)
                }
                <p>Deadlines Missed: {deadlinesMissed}</p>
                </div>
    }

}