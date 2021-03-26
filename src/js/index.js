let app = new Vue ({
    el: '#app',
    data: {
        resurss: "492931dd-0012-46d7-b415-76fe0ec7c216",
        limits: 500,
        loading: false,
        error:"",
        chartmax:100,
        chartmin:0,
        mekletpec:"",
        meklejamavertiba:"",
        selected_col:null,
        atrada: 0,
        intervals: 100,
        masivs:{},
        chartData: [],

        ieteiktie:[
            {nos:"COVID-19 izmeklējumi, apstiprinātie gadījumi un iznākumi",id:"d499d2f0-b1ea-4ba2-9600-2c701b03bd4a"},
            {nos:"Covid19_vakcinacija",id:"51725018-49f3-40d1-9280-2b13219e026f"},
            {nos:"Latvijas Nacionālās bibliotēkas digitalizēto karšu metadati ar saitēm uz karšu datnēm",id:"ae86e8ed-e17a-467d-a555-5ef0ff83e86c"},
            {nos:"Izglītojamo skaits sadalījumā pa vispārējās izglītības programmām uz 01.05.2020",id:"f0a7eb39-a979-48d2-b9aa-2053b9bb21cb"},
            {nos:"Valsts informācijas sistēmas, informācijas resursi un starpiestāžu IKT pakalpojumi",id:"8c4a8d3f-1a9e-402c-94a7-e0806a7a7a27"},
            {nos:"Ar informācijas un komunikācijas tehnoloģijas (IKT) jomu saistītās programmās Latvijā studējošie laika posmā no 2009.-2019.gadam",id:"3af4e814-d1eb-4222-8cf1-bda6f56280d8"},
            {nos:"Visi dzimtsarakstu nodaļās reģistrētie civilstāvokļa akti",id:"0317bef0-e972-4e2f-9701-d05ee3945411"}
        ]

    },
    methods: {
        ieladetnoapi:function () {
            var self = this;
            this.masivs = {};
            this.loading = true;
            $.ajax({
                url: "https://data.gov.lv/dati/api/3/action/datastore_search",
                type: "GET",
                dataType: 'json',
                data: {
                    resource_id: self.resurss,
                    limit: self.limits,
                    q: (self.meklejamavertiba != "")? self.meklejamavertiba:'',
                    sort:"_id desc"
                },
                success: function (data) {
                    self.chartData =[];
                    self.selected_col = null;
                    self.masivs = data.result;
                    self.atrada = data.result.total;
                    self.loading = false;
                    self.error= "";
                },
                error: function (error) {
                    self.loading = false;
                    self.error= error.statusText;
                    //alert(JSON.stringify(error));
                }
            });
        },
        noforme: function(vertiba,formats){

            if(formats == "timestamp"){
                return new Date(vertiba).toLocaleDateString("lv-LV",{ year: 'numeric', month: 'long', day: 'numeric' });
            }else if(formats == "timestampchart"){
                return new Date(vertiba).toLocaleDateString("lv-LV",{ year: 'numeric', month: 'numeric', day: 'numeric' });
            }else{
                return vertiba;
            }
        },
        make_chart: function(ids){
            let arr = [];
            let obj = this.masivs.records;
            let lauks = "";
            let self = this;
            this.chartmax = 0;
            this.chartmin = 0;
            for (e in this.masivs.fields){

                if (this.masivs.fields[e].type === "timestamp")  lauks = this.masivs.fields[e].id;
            }
            Object.keys(obj).forEach(function(key) {
                let vertiba = parseInt(obj[key][ids]);
                if(!isNaN(vertiba)){
                    if(vertiba > self.chartmax) self.chartmax = parseInt(vertiba);
                    if(vertiba < self.chartmin) self.chartmin = parseInt(vertiba);
                    arr.push({ name: (lauks != "")? self.noforme(obj[key][lauks],"timestampchart"):"#"+key, pv: parseInt(vertiba)});
                }
            });
           // this.intervals = self.chartmax/7;
            this.chartData = arr.reverse();

            //make_chart
            // /chartData
        }
    },
    created()
    {
        let uri = window.location.search.substring(1);
        let params = new URLSearchParams(uri);
        if(params.get("resurss")){
            this.resurss = params.get("resurss");
        }
        this.ieladetnoapi();
    },
})