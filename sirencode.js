const fs = require("fs")
const axios = require("axios")

function siren(company, array) {
    const arrays = company.map(element => {
        return element.CompanyName
    })
    array(arrays)
}

function array(arrayData) {
    let number = 0
    let obj = { table: [] }
    var json = ''
    setInterval(function () {
        axios.get(`https://api.insee.fr/entreprises/sirene/V3/siret?q=denominationUniteLegale:"${arrayData[number]}"`, {
            headers: {
                Authorization: "Bearer 7f29e47b-5a14-3d18-a49c-4fd5ba9b2d0b"
            }
        })
            .then(data => {
                var array = { siren: data.data.etablissements[0].siren, companyName: arrayData[number] }
                obj.table.push(array)
                json = JSON.stringify(obj)
                fs.writeFile('myjsonfile.json', json, 'utf8', () => console.log("test"));
                console.log(obj)
                number++
                if (arrayData.length - 1 === number) {
                    clearInterval()
                }
            })
            .catch(err => {
                obj.table.push(arrayData[number])
                json = JSON.stringify(obj)
                fs.writeFile('myjsonfile.json', json, 'utf8', () => console.log("test"));
                console.log(obj)
                number++

            }


            )
    }, 3000)

}

fs.readFile('convertcsv (1).json', (err, data) => {
    if (err) throw err;
    const companyData = JSON.parse(data)
    siren(companyData, array)
})

