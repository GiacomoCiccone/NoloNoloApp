<template>
  <div>
    <div id="dashboard">
      <div>
        <h1
          style="font-size: calc(30px + 0.4vw); text-align: center; margin: 0"
        >
          Dashboard
        </h1>
      </div>
      
      <div style="height: 1px; background-color: #ccc; margin: 3rem 0 0 0" />

      <br />

      <div style="display:flex; gap: 1rem; align-items: center; justify-content: space-evenly; flex-wrap: wrap;">
        <div class="info">
        <div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="font-size: 1.5rem; font-weight: 600;">Noleggi </p>
        <img width=40 style="margin-left: 1rem;" src="https://img.icons8.com/external-outline-juicy-fish/60/000000/external-car-side-hustles-outline-outline-juicy-fish.png"/>
        </div> <span style="font-size: 3rem;">{{rents.length}}</span></div>
        <div class="info"><div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="font-size: 1.5rem; font-weight: 600;">Utenti </p>
        <img width=40 style="margin-left: 1rem;" src="https://img.icons8.com/external-kiranshastry-solid-kiranshastry/64/000000/external-user-interface-kiranshastry-solid-kiranshastry-1.png"/>
        </div> <span style="font-size: 3rem;">{{users.length}}</span></div>
        <div class="info"><div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="font-size: 1.5rem; font-weight: 600;">Luoghi di ritiro </p>
        <img width=40 style="margin-left: 1rem;" src="https://img.icons8.com/external-icongeek26-glyph-icongeek26/64/000000/external-place-medical-icongeek26-glyph-icongeek26.png"/>
        </div> <span style="font-size: 3rem;">{{places.length}}</span></div>
        <div class="info"><div style="display: flex; justify-content: space-between; align-items: center;">
        <p style="font-size: 1.5rem; font-weight: 600;">Auto </p>
        <img width=40 style="margin-left: 1rem;" src="https://img.icons8.com/glyph-neue/64/000000/carpool.png"/>
        </div> <span style="font-size: 3rem;">{{cars.length}}</span></div>
    
      </div>
      <div id="chartsContainer">
        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Clienti per fatturato</h2>
          <br />
          <canvas id="users-chart-fatturato"></canvas>
        </div>

        <div class="doughnutChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Clienti per noleggi</h2>
          <br />
          <canvas id="users-chart-noleggi"></canvas>
        </div>

        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Luoghi di ritiro per fatturato</h2>
          <br />
          <canvas id="place-chart-fatturato"></canvas>
        </div>

        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Luoghi di ritiro per noleggi</h2>
          <br />
          <canvas id="place-chart-noleggio"></canvas>
        </div>

        <div class="doughnutChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Luoghi di ritiro per oggetti</h2>
          <br />
          <canvas id="place-chart-oggetto"></canvas>
        </div>
        
        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Macchine per fatturato</h2>
          <br />
          <canvas id="cars-chart-fatturato"></canvas>
        </div>
        
        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Macchine per noleggi</h2>
          <br />
          <canvas id="cars-chart-noleggio"></canvas>
        </div>
        
        <div class="doughnutChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Macchine per condizioni</h2>
          <br />
          <canvas id="cars-chart-condizioni"></canvas>
        </div>

        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Noleggi per fatturato</h2>
          <br />
          <canvas id="rents-chart-fatturato"></canvas>
        </div>

        <div class="barChartContainer">
          <h2 style="font-size: calc(15px + 0.2vw)">Noleggi per data</h2>
          <br />
          <canvas id="rents-chart-data"></canvas>
        </div>

      </div>
      <br />
      <div></div>
    </div>

    <Footer />
  </div>

  
</template>

<script>
import axios from "axios";
import Chart from "chart.js/auto";
import Footer from './Footer.vue';

export default {
  name: "Dashboard",
  components: {Footer: Footer},
  data() {
    return {
      rents: [],
      users: [],
      cars: [],
      places: [],
      error: [],
    };
  },

  watch: {
    rents: function () {
      if(this.rents.length>0){
        let mapFatturato = new Map();
        //let mapNumeroNoleggi = new Map();
        mapFatturato.set("0-200", 0);
        mapFatturato.set("200-400", 0);
        mapFatturato.set("400-600", 0);
        mapFatturato.set("600-800", 0);
        mapFatturato.set("800-1000", 0);
        mapFatturato.set("1000+", 0);
      
        this.rents.forEach((rent) => {

          let fatturato=rent.price;
          
          if (fatturato <= 200)
            mapFatturato.set("0-200", mapFatturato.get("0-200") + 1);
          else if (fatturato > 200 && fatturato <= 400)
            mapFatturato.set("200-400", mapFatturato.get("200-400") + 1);
          else if (fatturato > 400 && fatturato <= 600)
            mapFatturato.set("400-600", mapFatturato.get("400-600") + 1);
          else if (fatturato > 600 && fatturato <= 800)
            mapFatturato.set("600-800", mapFatturato.get("600-800") + 1);
          else if (fatturato > 800 && fatturato <= 1000)
            mapFatturato.set("800-1000", mapFatturato.get("800-1000") + 1);
          else mapFatturato.set("1000+", mapFatturato.get("1000+") + 1);
        });

        let iteratorRents=Array.from(mapFatturato.values());

        //week
        let today = new Date();
        let day;
        let stringDay;
        let week=[];
        let mapDateRent=new Map();


        for(let n=0;n<7;n++){
          day = new Date(today.getFullYear(),today.getMonth(), today.getDate()-(6-n));
          week[n]=day.toLocaleDateString("it-IT");
          mapDateRent.set(week[n],0);
        }

        this.rents.forEach((rent)=> {
          //var subDate = rent.createdAt.split('T')[0];
          day = new Date(rent.createdAt);
          stringDay=day.toLocaleDateString("it-IT");
          //console.log(stringDay);
          if(mapDateRent.has(stringDay)){
            mapDateRent.set(stringDay,mapDateRent.get(stringDay)+1)
          }
        });

        let iteratorDataRents=Array.from(mapDateRent.values());


        let ctx1 = document.getElementById("rents-chart-fatturato");
        new Chart(ctx1, {
          type: "bar",
          data: {
            labels: ["0-200 €", "200-400 €", "400-600 €", "600-800 €", "800-1000 €" ,"1000+ €"],
            datasets: [
              {
                label: "Noleggi / Fatturato",
                data: iteratorRents,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderWidth: 1,
              },
            ],
          },
        });

        let ctx2 = document.getElementById("rents-chart-data");
        new Chart(ctx2, {
          type: "line",
          data: {
            labels: week,
            datasets: [
              {
                label: "Noleggi / Data",
                data: iteratorDataRents,
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderWidth: 1,
              },
            ],
          },
        });

      }
      

    },

    users: function () {
      if (this.users.length > 0 && this.rents.length > 0) {
        let mapFatturato = new Map();
        let mapNumeroNoleggi = new Map();
        mapFatturato.set("0-100", 0);
        mapFatturato.set("100-300", 0);
        mapFatturato.set("300-500", 0);
        mapFatturato.set("500+", 0);

        mapNumeroNoleggi.set("0", 0);
        mapNumeroNoleggi.set("1-2", 0);
        mapNumeroNoleggi.set("3-4", 0);
        mapNumeroNoleggi.set("5-6", 0);
        mapNumeroNoleggi.set("7-8", 0);
        mapNumeroNoleggi.set("9-10+", 0);
        this.users.forEach((user) => {
          let fatturato = 0;
          let noleggi = 0;
          this.rents.forEach((rent) => {
            if (user._id === rent.customer._id) {
              fatturato += rent.price;
              noleggi++;
            }
          });

          if (fatturato <= 100)
            mapFatturato.set("0-100", mapFatturato.get("0-100") + 1);
          else if (fatturato > 100 && fatturato <= 300)
            mapFatturato.set("100-300", mapFatturato.get("100-300") + 1);
          else if (fatturato > 300 && fatturato <= 500)
            mapFatturato.set("300-500", mapFatturato.get("300-500") + 1);
          else mapFatturato.set("500+", mapFatturato.get("500+") + 1);

          if (noleggi === 0)
            mapNumeroNoleggi.set("0", mapNumeroNoleggi.get("0") + 1);
          else if (noleggi === 1 || noleggi === 2)
            mapNumeroNoleggi.set("1-2", mapNumeroNoleggi.get("1-2") + 1);
          else if (noleggi === 3 || noleggi === 4)
            mapNumeroNoleggi.set("3-4", mapNumeroNoleggi.get("3-4") + 1);
          else if (noleggi === 5 || noleggi === 6)
            mapNumeroNoleggi.set("5-6", mapNumeroNoleggi.get("5-6") + 1);
          else if (noleggi === 7 || noleggi === 8)
            mapNumeroNoleggi.set("7-8", mapNumeroNoleggi.get("7-8") + 1);
          else mapNumeroNoleggi.set("9-10+", mapNumeroNoleggi.get("9-10+") + 1);
        });

        let ctx1 = document.getElementById("users-chart-fatturato");
        new Chart(ctx1, {
          type: "bar",
          data: {
            labels: ["0-100 €", "100-300 €", "300-500 €", "500+ €"],
            datasets: [
              {
                label: "Utenti / Fatturato",
                data: [
                  mapFatturato.get("0-100"),
                  mapFatturato.get("100-300"),
                  mapFatturato.get("300-500"),
                  mapFatturato.get("500+"),
                ],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                ],
                borderWidth: 1,
              },
            ],
          },
        });

        let ctx2 = document.getElementById("users-chart-noleggi");
        new Chart(ctx2, {
          type: "doughnut",
          data: {
            labels: ["0", "1-2", "3-4", "5-6", "7-8", "9-10+"],
            datasets: [
              {
                data: [
                  mapNumeroNoleggi.get("0"),
                  mapNumeroNoleggi.get("1-2"),
                  mapNumeroNoleggi.get("3-4"),
                  mapNumeroNoleggi.get("5-6"),
                  mapNumeroNoleggi.get("7-8"),
                  mapNumeroNoleggi.get("9-10+"),
                ],
                backgroundColor: [
                  "rgba(255, 99, 132, 0.2)",
                  "rgba(54, 162, 235, 0.2)",
                  "rgba(255, 206, 86, 0.2)",
                  "rgba(75, 192, 192, 0.2)",
                  "rgba(153, 102, 255, 0.2)",
                  "rgba(0, 99, 132, 0.2)",
                ],
                borderWidth: 1,
              },
            ],
          },
        });
      }
    },

    places: function () {
      
      if (
        this.rents.length > 0 &&
        this.cars.length > 0 &&
        this.places.length > 0
      ) {
        let mapPlaceFatturato = new Map();
        let mapPlaceNoleggi = new Map();
        let mapPlaceOggetti = new Map();
        let mapColors = new Map();
        
        this.places.forEach((place) => {
          var r = Math.floor(Math.random() * 255);
          var g = Math.floor(Math.random() * 255);
          var b = Math.floor(Math.random() * 255);
          mapColors.set(place._id, "rgba(" + r + "," + g + "," + b + "," + 0.4 +")")
        });

        

        //function
        this.places.forEach((place)=>{

        let fatturato=0;
        let numNoleggi=0;
        let numOggetti=0;

          // noleggi e prezzo
          this.rents.forEach((rent)=>{
            if(rent.rentObj.car.place===place._id){
              fatturato += rent.price;
              numNoleggi++;
              
            }
          });

          //oggetti
          this.cars.forEach(car => {
            if (car.place._id === place._id) numOggetti++;
          })

          mapPlaceFatturato.set(place._id, fatturato);
          mapPlaceNoleggi.set(place._id, numNoleggi);
          mapPlaceOggetti.set(place._id, numOggetti);
        });
        
        //label x
        let iteratorPlaces = [];
        let i = 0;
        this.places.forEach((place) => {
          iteratorPlaces[i] = place.point;
          i++;
        });

        //data y
        let iteratorDataFatturato=[];
        i=0;
        this.places.forEach((place) => {
          iteratorDataFatturato[i] = mapPlaceFatturato.get(place._id);
          i++;
        });

        let iteratorDataNoleggi=[];
        i=0;
        this.places.forEach((place) => {
          iteratorDataNoleggi[i] = mapPlaceNoleggi.get(place._id);
          i++;
        });

        let iteratorDataOggetti=[];
        i=0;
        this.places.forEach((place) => {
          iteratorDataOggetti[i] = mapPlaceOggetti.get(place._id);
          i++;
        });

         //data y
        let iteratorColors=[];
        i=0;
        this.places.forEach((place) => {
          iteratorColors[i] = mapColors.get(place._id);
          i++;
        });

        let ctx1 = document.getElementById("place-chart-fatturato");
        new Chart(ctx1, {
          type: "bar",
          data: {
            labels: iteratorPlaces,
            datasets: [
              {
                label: "Luogo / Fatturato",
                data: iteratorDataFatturato,
                backgroundColor: iteratorColors,
                borderWidth: 1,
              },
            ],
          },
          options: { 
            scales: {
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
            },
          },
        
        })

        let ctx2 = document.getElementById("place-chart-noleggio");
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: iteratorPlaces,
            datasets: [
              {
                label: "Luogo / Noleggi",
                data: iteratorDataNoleggi,
                backgroundColor: iteratorColors,
                borderWidth: 1,
              },
            ],
          },
          options: { 
            scales: {
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
            },
          },
        
        })

        let ctx3 = document.getElementById("place-chart-oggetto");
        new Chart(ctx3, {
          type: "pie",
          data: {
            labels: iteratorPlaces,
            datasets: [
              {
                data: iteratorDataOggetti,
                backgroundColor: iteratorColors,
                borderWidth: 1,
              },
            ],
          },
        
        })



      }

    },

    cars: function () {
      if (
        this.rents.length > 0 &&
        this.cars.length > 0
      ){
        let mapCarFatturato = new Map();
        let mapCarNoleggi = new Map();
        let mapCarCondizioni = new Map();

        let mapColors = new Map();

        this.cars.forEach((car) => {
          var r = Math.floor(Math.random() * 255);
          var g = Math.floor(Math.random() * 255);
          var b = Math.floor(Math.random() * 255);
          mapColors.set(car._id, "rgba(" + r + "," + g + "," + b + "," + 0.4 +")")
        });

        this.cars.forEach((car)=>{

        let fatturato=0;
        let numNoleggi=0;

          // noleggi e prezzo
          this.rents.forEach((rent)=>{
            if(rent.rentObj.car._id===car._id){
              fatturato += rent.price;
              numNoleggi++;
              
            }
          });
          if(mapCarFatturato.has(car.model))
            mapCarFatturato.set(car.model, mapCarFatturato.get(car.model)+fatturato);
          else
            mapCarFatturato.set(car.model,fatturato)  
          
          if(mapCarNoleggi.has(car.model))
            mapCarNoleggi.set(car.model, mapCarNoleggi.get(car.model) +numNoleggi);
          else
            mapCarNoleggi.set(car.model, numNoleggi);
          
          if(mapCarCondizioni.has(car.condition))
            mapCarCondizioni.set(car.condition, mapCarCondizioni.get(car.condition) +1 );
          else
            mapCarCondizioni.set(car.condition, 1 );
          
        });


        //label x
        let iteratorCars = [];
        let i = 0;
        this.cars.forEach((car) => {
          if(iteratorCars.indexOf(car.model)=== -1){
            iteratorCars[i] = car.model;
            i++;
          }
        });      

        //data y
        let iteratorDataFatturato=[];
        
        for(i=0;i<iteratorCars.length;i++){
          iteratorDataFatturato[i] = mapCarFatturato.get(iteratorCars[i]);
        }

        let iteratorDataNoleggi=[];
        
        for(i=0;i<iteratorCars.length;i++){
          iteratorDataNoleggi[i] = mapCarNoleggi.get(iteratorCars[i]);
        }

        let iteratorDataCondizioni=[];  
        i=0;
        for(const entry of mapCarCondizioni.entries()){
          iteratorDataCondizioni[i]=entry[1];
          i++;
        }

        let iteratorColors=[];
        i=0;
        this.cars.forEach((car) => {
          iteratorColors[i] = mapColors.get(car._id);
          i++;
        });

        let ctx1 = document.getElementById("cars-chart-fatturato");
        new Chart(ctx1, {
          type: "bar",
          data: {
            labels: iteratorCars,
            datasets: [
              {
                label: "Macchina / Fatturato",
                data: iteratorDataFatturato,
                backgroundColor: iteratorColors,
                borderWidth: 1,
              },
            ],
          },
          options: { 
            scales: {
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
            },
          },
        
        })

        let ctx2 = document.getElementById("cars-chart-noleggio");
        new Chart(ctx2, {
          type: "bar",
          data: {
            labels: iteratorCars,
            datasets: [
              {
                label: "Macchina / Noleggi",
                data: iteratorDataNoleggi,
                backgroundColor: iteratorColors,
                borderWidth: 1,
              },
            ],
          },
          options: { 
            scales: {
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 90,
                },
              },
            },
          },
        
        })

        let ctx3 = document.getElementById("cars-chart-condizioni");
        new Chart(ctx3, {
          type: "pie",
          data: {
            labels: ['perfect','good','weak'],
            datasets: [
              {
                data: iteratorDataCondizioni,
                backgroundColor: iteratorColors,
                borderWidth: 1,
              },
            ],
          },
        
        })
      }
    },

    
  },

  async mounted() {
    if (!window.localStorage.getItem("authTokenManager"))
      this.$router.push({ path: "/login" });
    else {
      //fetch rents

      try {
        const token = window.localStorage.getItem("authTokenManager");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:8000/api/rents",
          config
        );
        this.rents = data.data;
        //console.log(this.rents)
      } catch (error) {
        this.error.push(error)
      }

      //fetch cars
      try {
        const token = window.localStorage.getItem("authTokenManager");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:8000/api/cars",
          config
        );
        this.cars = data.data;
        //console.log(this.cars)
      } catch (error) {
        this.error.push(error)
      }

      //fetch place

      try {
        const token = window.localStorage.getItem("authTokenManager");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:8000/api/pickups",
          config
        );
        
        this.places = data.data;
        //console.log(this.places)
      } catch (error) {
        this.error.push(error)
      }


      //fetch users
      try {
        const token = window.localStorage.getItem("authTokenManager");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const { data } = await axios.get(
          "http://localhost:8000/api/users",
          config
        );
        this.users = data.data;
        //console.log(this.users)
      } catch (error) {
        this.error.push(error)
      }
    }

  },

};
</script>
