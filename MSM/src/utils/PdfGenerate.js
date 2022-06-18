import jsPDF from "jspdf";


function createHeaders(keys) {
    var result = [];
    for (var i = 0; i < keys.length; i += 1) {
        result.push({
            id: keys[i],
            name: keys[i],
            prompt: keys[i],
            width: 75,
            align: "center",
            padding: 3,
        });
    }
    return result;
}

export const TimeColumbPDF = () => {

    let TimeRow = ['Parameter']

    for (let i = 0; i < 24; i++) {
        let n
        i < 10 ? n = `0${i}` : n = i
        TimeRow.push(`${n}:00`)
    }

    return TimeRow
}

export const NameColumbPDF = (Model) => {

    const Label = Object.keys(Model)
    Label.pop()
    Label.pop()
    Label.pop()

    Label.unshift("Time")
    console.log(Label);
    return Label
}



export const GeneratePDFC3 = (headerArray, DataArray, info) => {

    // console.log(info.Info1);

    var headers = createHeaders(headerArray)

    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "l", unit: "px" })
    doc.setFontSize(20)
    doc.text("Extruder Operating Sheet(82mm)", 10, 20, {});
    doc.setFontSize(15)

    doc.text("Job No:", 10, 60, {});
    doc.text(info.Info1, 55, 60, {});

    doc.text("Grade:", 140, 60, {});
    doc.text(info.Info5, 180, 60, {});

    doc.text("Color:", 240, 60, {});
    doc.text(info.Info4, 275, 60, {});

    doc.text("Start Date:", 10, 90, {});
    doc.text(info.Info2, 70, 90, {});

    doc.text("End Date:", 210, 90, {});
    doc.text(info.Info3, 270, 90, {});
    doc.table(5, 120, DataArray, headers, { autoSize: true, fontSize: 9, padding: 3 });
    doc.save("Extruder Operating Sheet(82mm).pdf")
}




export const GeneratePDFG2 = (headerArray, DataArray, info) => {

    var headers = createHeaders(headerArray)

    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "l", unit: "px", verticalOffset:40 })
    doc.text("MILL OPERATING SHEET", 10, 20, {});
    doc.setFontSize(15)

    doc.text("Job No:", 10, 60, {});
    doc.text(info.Info1, 55, 60, {});

    doc.text("Grade:", 140, 60, {});
    doc.text(info.Info5, 180, 60, {});

    doc.text("Color:", 240, 60, {});
    doc.text(info.Info4, 275, 60, {});

    doc.text("Start Date:", 10, 90, {});
    doc.text(info.Info2, 70, 90, {});

    doc.text("End Date:", 210, 90, {});
    doc.text(info.Info3, 270, 90, {});

    doc.table(5, 120, DataArray, headers, { autoSize: false, fontSize: 9, padding: 3 });
    doc.save("MILL OPERATING SHEET.pdf")
}

