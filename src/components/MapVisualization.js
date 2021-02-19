import mapboxgl from 'mapbox-gl'
import React, { Component } from 'react';
import ReactDOM from 'react-dom'

export default class MapVisualization extends Component {

    // set to 2017 initially despite play preview or you get a bug when using the type dropdown
    m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], 2000]
    m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']], 2000]
    m_filterType = ['!=', ['string', ['get', 'type']], 'placeholder']

    m_initiated = false
    map = null

    app = null
    tooltipContainer
    popup
    self = null
    grump = null
    m_colors = {
        "Coal": "#91908d",
        "Storage": "#4e80e5",
        "Solar": "#a18600",
        "Hydro": "#43cfef",
        "Wind": "#00a98e",
        "Biomass": "#A7B734",
        "Waste": "#6b4b06",
        "Solar2": "#ea545c",
        "Gas": "#cc9b7a"
    }

    state = {

        currentYear: this.props.activeYear,
        rawtypes: this.props.types,
        zoomlevel: 0
    }


    init() {
        if (!this.m_initiated) {
            mapboxgl.accessToken = "pk.eyJ1IjoiZGF2ZW0xMTIyMzMiLCJhIjoiY2tsYnU0cjZiMHU2MjJ1cDI1cnRicXU4byJ9.hTkSY8W2vyxK0o0tezD5Mg"
            this.map = new mapboxgl.Map({
                container: "map",
                style: "mapbox://styles/mapbox/streets-v11",
                zoom: [4],
                center: [140.7751, -38.2744]
            })

           
            // const filterType = ['!=', ['string', ['get', 'technology']], 'Battery (Discharging)'];
            var coalData = this.props.coalData;//geojson.parse(data, {Point: ['latitude','longitude']})
            var solarData = this.props.solarData;
            var currentData = this.props.currentData;
            //  console.log(geojsondata)
            this.map.on('load', () => {

                this.map.addSource('powerplantSource_Coal', {
                    type: 'geojson',
                    data: coalData,
                    cluster: false
                })

                this.map.addSource('powerplantSource_Solar', {
                    type: 'geojson',
                    data: solarData,
                    cluster: false,
                    clusterMaxZoom:6,
                    clusterRadius: 50
                
                })

                this.map.addSource('currentFacilities', {
                    type: 'geojson',
                    data: currentData
                })
              
                this.map.addLayer({
                    id: 'unclusters_solar',
                    type: 'circle',
                    source: 'powerplantSource_Solar',
                    paint: {
                        
                        'circle-color': [
                            "rgb",
                            255,
                           ["get","gValue"],
                            62

                        ], //"#ffc83e",
                        'circle-opacity': 0.5,
                        'circle-stroke-color': "#ffc83e",
                        'circle-stroke-opacity': 1,
                        'circle-stroke-width': 0.5,
                        'circle-radius':  {
                            property: 'capacity',
                    //  //      type: 'exponential',
                    //        base: 2,
                            stops: [
                                [{zoom: 3, value: 1}, 1],
                                [{zoom: 3, value: 18}, 10],
                                [{zoom: 4.5, value: 1}, 3],
                                [{zoom: 4.5, value: 18}, 15],
                                [{zoom: 7, value: 1}, 5],
                                [{zoom: 7, value: 18}, 20],
                                [{zoom: 10, value: 1}, 10],
                                [{zoom: 10, value: 18}, 25]
                       
                            ]
                        }
                        
                    },

                    'filter': ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType, ['!', ['has', 'point_count']]]
                });
                this.map.addLayer({
                    id: 'allpowerplants',
                    type: 'circle',
                    source:"currentFacilities",
                    paint: {
                    'circle-radius': {
                        property: 'capacity',
                      //  type: 'exponential',
                      //  base: 2,
                        stops: [
                        [{zoom: 3, value: 1}, 1],
                        [{zoom: 3, value: 1000}, 6],
                        [{zoom: 4.5, value: 1}, 3],
                        [{zoom: 4.5, value: 1000}, 18],
                        [{zoom: 7, value: 1}, 18],
                        [{zoom: 7, value: 1000}, 42],
                        [{zoom: 10, value: 1}, 12],
                        [{zoom: 10, value: 1000}, 54]
                        ]
                    },
                    'circle-color': [
                        'match',
                        ['get', 'type'],
                        "Coal", "#ced1cc",
                        "Storage", "#4e80e5",
                        "Solar", "#ffc83e",
                        "Hydro", "#43cfef",
                        "Wind", "#00a98e",
                        "Biomass", "#A7B734",
                        "Solar2", "#ea545c",
                        "Gas", "#cc9b7a",
                        "Waste", "#6b4b06",
                        /* other */ '#ccc'
                    ],
                    'circle-opacity': 0.3,
                    'circle-stroke-color':  [
                        'match',
                        ['get', 'type'],
                        "Coal", "#ced1cc",
                        "Storage", "#4e80e5",
                        "Solar", "#ffc83e",
                        "Hydro", "#43cfef",
                        "Wind", "#00a98e",
                        "Biomass", "#A7B734",
                        "Solar2", "#ea545c",
                        "Gas", "#cc9b7a",
                        "Waste", "#6b4b06",
                         /*other,*/  '#ccc' 
                    ],
                        'circle-stroke-opacity': 1,
                        'circle-stroke-width': 0.5,
                    },
                    'filter': ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType]
                });

                this.map.addLayer({
                    id: 'unclusters_coal',
                    type: 'circle',
                    source: 'powerplantSource_Coal',
                    paint: {
                        'circle-radius': {
                            property: 'capacity',
                            type: 'exponential',
                            base: 2,
                            stops: [
                                [{zoom: 2, value: 1}, 1],
                                [{zoom: 2, value: 2500}, 6],
                                [{zoom: 4.5, value: 1}, 3],
                                [{zoom: 4.5, value: 2500}, 20],
                                [{zoom: 8, value: 1}, 6],
                                [{zoom: 8, value: 2500}, 32],
                                [{zoom: 12, value: 1}, 9],
                                [{zoom: 12, value: 2500}, 56],
                                [{zoom: 15, value: 1}, 12],
                                [{zoom: 15, value: 2500}, 60]
                                ]
                        },
                        'circle-color':  "#404040",
                        'circle-opacity': 0.3,
                        'circle-stroke-color': "#404040",
                        'circle-stroke-opacity': 1,
                        'circle-stroke-width': 0.5
                    },
                    'filter': ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType, ['!', ['has', 'point_count']]]
               //     'filter': ['!', ['has', 'point_count']]
                });
                this.map.addLayer({
                    id: 'clusters_solar',
                    type: 'circle',
                    source: 'powerplantSource_Solar',
                    filter: ["all", [ 'has', 'point_count'],  this.m_filterStartYear, this.m_filterEndYear, this.m_filterType ],
                    
                    paint: {
                       
                        'circle-color': "#ffc83e",
                        'circle-radius': [
                            'step',
                            ['get', 'point_count'],
                            2,
                            50,
                            20,
                            100,
                            50
                        ]
                    }
                });

            })
            var self = this

            const tooltip = new mapboxgl.Marker(this.tooltipContainer, {
                offset: [-140, 0]
            }).setLngLat([0, 0]).addTo(this.map);

            this.map.on('mouseenter', 'unclusters_coal', function (e) {
                // Change the cursor style as a UI indicator.
                //    console.log("enter: " + e.features[0].properties.site)
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mousemove', 'unclusters_coal', function (e) {
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mouseleave', 'unclusters_coal', function (e) {

                self.map.getCanvas().style.cursor = '';
                self.drawPopup(false)
            });

            this.map.on('mouseenter', 'unclusters_coal', function (e) {
                // Change the cursor style as a UI indicator.
                //    console.log("enter: " + e.features[0].properties.site)
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mousemove', 'unclusters_coal', function (e) {
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mouseleave', 'unclusters_solar', function (e) {

                self.map.getCanvas().style.cursor = '';
                self.drawPopup(false)
            });

            this.map.on('mouseenter', 'unclusters_solar', function (e) {
                // Change the cursor style as a UI indicator.
                //    console.log("enter: " + e.features[0].properties.site)
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mousemove', 'unclusters_solar', function (e) {
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mouseleave', 'unclusters_solar', function (e) {

                self.map.getCanvas().style.cursor = '';
                self.drawPopup(false)
            });

            this.map.on('mouseenter', 'allpowerplants', function (e) {
                // Change the cursor style as a UI indicator.
                //    console.log("enter: " + e.features[0].properties.site)
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mousemove', 'allpowerplants', function (e) {
                tooltip.setLngLat(e.lngLat);
                self.grump = e.features[0]
                self.map.getCanvas().style.cursor = 'pointer';
                self.drawPopup(true)

            })

            this.map.on('mouseleave', 'allpowerplants', function (e) {

                self.map.getCanvas().style.cursor = '';
                self.drawPopup(false)
            });

            this.map.on('zoomend', function(e){
                self.setState({
                    zoomlevel: self.map.getZoom()
                })
            })
            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = 'pointer';
            this.m_initiated = true;
            this.setState({
                zoomlevel: this.map.getZoom()
            })
        }

    }

    setTooltip(show, color, name, capacity, open, decom, type2) {

        if (show) {

            ReactDOM.render(
                React.createElement(
                    PopupContent, {
                    color, name, capacity, open, decom, type2
                }
                ),
                this.tooltipContainer
            )
        } else {

            ReactDOM.unmountComponentAtNode(this.tooltipContainer)
        }
    }

    componentDidUpdate(prevState) {

        //   console.log(this.props.filter)
        if (this.props.activeYear !== this.state.currentYear) {
            this.setState({
                currentYear: this.props.activeYear

            })
            this.m_filterStartYear = ['<=', ['number', ['get', 'yearStart']], this.props.activeYear]
            this.m_filterEndYear = ['>=', ['number', ['get', 'yearEnd']], this.props.activeYear]
            this.updateFilters()
        }
        if (this.props.types !== this.state.rawtypes) {
            this.m_filterType = ["any"]
            //create the filter syntax fromthe actionFilter provided
            for (var i = 0; i < this.props.types.length; i++) {
                if (this.props.types[i].active)
                    this.m_filterType.push(["==", ["get", "type"], this.props.types[i].type])
            }

            this.setState({

                rawtypes: this.props.types
            })
            this.updateFilters()
        }

        this.init()
    }
    componentDidMount() {
        this.tooltipContainer = document.createElement('div');
        this.init()
    }
    drawPopup(show) {

        var o = this.grump
        var name = o.properties.site;
        var capacity = o.properties.capacity;
        var open = o.properties.yearOpen;
        var decom = o.properties.yearEnd;
        var plantColor = this.m_colors[o.properties.type];
        var type2 = o.properties.type2;
        var type = o.properties.type;
        this.setTooltip(show, plantColor, name, capacity, open, type==="Solar" ? 9999 : decom, type=== "Solar" ? type : type2)

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears over the copy being pointed to.
        //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        //      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        // }

        // Populate the popup and set its coordinates
        // based on the feature found.
        //  this.popup.setLngLat(coordinates)
        //      .setHTML(<PopupContent color={plantColor} name={name} capacity={this.roundToOne(capacity)} lowCarbon={lowCarbon} operator={operator} open={open} fuel={this.getFuel(type, fuelDetail)} chp={chp} />)
        //      .addTo(this.map);
    }

    setFilterType(filtertype) {
        if (this.map.isStyleLoaded()) {
            this.m_filterType = ["all", ["==", ["get", "type"], filtertype]]
            this.updateFilters()
        }
    }

    updateFilters() {
        if (this.map.isStyleLoaded()) {
            // map.setFilter('powerplants', ['all', filterOperator, filterType, filterStartYear, filterEndYear, filterSite, filterCapacity]);
            this.map.setFilter('unclusters_coal', ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType, ['!', ['has', 'point_count']]] )
           
            this.map.setFilter('unclusters_solar', ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType, ['!', ['has', 'point_count']]])
            this.map.setFilter('clusters_solar', ['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType,['has','point_count']])
            this.map.setFilter('allpowerplants',['all', this.m_filterStartYear, this.m_filterEndYear, this.m_filterType])
        }
    }

    getFuel = (type, fuelDetail) => {
        if (fuelDetail === "-") {
            return type
        } else if (type === "Wind" || type === "Hydro") {
            return fuelDetail
        } else {
            return type + ", " + fuelDetail
        }
    }

    roundToOne = (capacity) => {
        return +(Math.round(capacity + "e+1") + "e-1");
    }

    render() {
        return (
            <div>
                {this.props.debug===true ? <div className="Debug">Debug: zoom level: {this.state.zoomlevel} </div> : "" }
            <div style={{ height: this.props.height }} ref={el => this.mapContainer = el} className="mapContainer topDistance" id="map" />
            </div>
        )
    }

}
const PopupContent = ({ color, name, capacity, open, decom, type2 }) => (

    <div className={`colour-key popupDiv`}>
        <h3 className="popupHeading" style={{ color: color }}> {name}</h3>
        <div className="popupInfo" style={{ 'backgroundColor': color }} >
            <p><span className="label-title">Capacity: </span>{capacity}<span className="units">  MW</span></p>
            {type2 !== "" ? <p><span className="label-title">Type: </span>{type2}</p> : ""}
            {open !== undefined ? <p><span className="label-title">Year opened: </span>  {open} </p> : ""}
             {decom !== 9999 ?<p><span className="label-title"> Decomission: </span> {decom} </p> : ""}
           
        </div>
    </div>
)

