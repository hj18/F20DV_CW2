function main(){
    var platform = document.getElementById("dest").value;
    var year = document.getElementById("year-select").value;

    d3.csv("https://raw.githubusercontent.com/hj18/F20DV_CW2/main/vgsales.csv", function(d) {
        return {
            Platform: d.Platform,  
            Year: d.Year
        };
    })
    .then(function(data) {
        var filteredData = data.filter(function(d) {
            return (
                d.Platform == platform &&
                (year === "" || d.Year == year) &&
                d.Year >= "2005" &&
                d.Year < "2022"
            );
        });

        var filteredDataNameYear = filteredData.map(function(d) {
            return {
                Platform: d.Platform,
                Year: d.Year
            };
        });
        console.log(filteredDataNameYear);
    });
}

document.getElementById("dest").addEventListener("change", main);
  