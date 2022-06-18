import moment from 'moment';


export const DataSortRT = (response) => {

    if (response.success !== false) {
        const data = response.data

        let DataReturn = data.map(obj => {
            let cobj = []
            let ar0 = moment(obj.fields.last_changed).utc(true).format('MM/DD/YY HH:mm:ss')

            cobj = {
                'DateTime': ar0,
                'Label': obj.fields.parameter,
                'value': obj.fields.value,
            }
            return cobj
        })
        // console.log(data);
        return DataReturn
    }
    else {
        console.log('Data Request Error');
    }
}

export const DataSortST = (response) => {

    if (response.success !== false) {
        const data = response.Data

        let DataReturn = data.map(obj => {
            let cobj = []
            let ar0 = moment(obj.fields.LastChange).utc(true).format('MM/DD/YY HH:mm:ss')

            cobj = {
                'time': ar0,
                'Parameter': obj.fields.DisplayLabel,
                'Line': obj.fields.Line,
                'key': obj.fields.Label,
                'label': obj.fields.Label,
                'LowThreshold' : obj.fields.LowThreshold,
                'LowThreshold_active' : obj.fields.LowThreshold_active,
                'HighThreshold' : obj.fields.HighThreshold,
                'HighThreshold_active' : obj.fields.HighThreshold_active,
                'Label' : obj.fields.Label

            }
            return cobj
        })
        // console.log(data);
        return DataReturn
    }
    else {
        console.log('Data Request Error');
    }
}


export const DataMapping = (Datamodel, RawData) => {

    const name = Object.keys(Datamodel)
    
    // console.log(name);
    let ReturnValue = Datamodel
    name.forEach(element => {
        try {
            let DataFound = RawData.find(({ Label }) => Label === element)
            ReturnValue[element].PV = DataFound.Value
            ReturnValue[element].SV = DataFound.SV
        }
        catch {
            console.log('None');
        }

        // ReturnValue['Time'].PV = DataFound.time

    });

    return ReturnValue
}

export const GraphDataFind = (SelectedLabel, RawData) => {

    let FoundDataArray = []

    SelectedLabel.forEach(element => {
        try{
            let obj = {}
            let FoundData = RawData.find(({ Label }) => Label === element)
            obj['Label'] = FoundData.Label
            obj['time'] = FoundData.time
            obj['Value'] = parseFloat(FoundData.Value)

            var CurrentTime = new Date()
            var LabelTime = new Date(obj['time'])
            var NewLabelTime = LabelTime.getTime() + 30000

            if( CurrentTime.getTime() < NewLabelTime ){
                //console.log('NewData');
                FoundDataArray.push(obj)
            }
            else{
                //console.log('OldData');
            }

        }

        catch{
            console.log(('Data Not Found'));
        }
    })

    //console.log(FoundDataArray);
    
    return FoundDataArray
}



