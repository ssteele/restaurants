#!/bin/bash

zips=()
# zips+=('78753')
# zips+=('78758')
# zips+=('78754')
# zips+=('78710')
# zips+=('78752')
# zips+=('78757')
# zips+=('78723')
# zips+=('78756')
# zips+=('78751')
# zips+=('78727')
# zips+=('78731')
# zips+=('78759')
# zips+=('78728')
# zips+=('78724')
# zips+=('78722')
# zips+=('78764')
# zips+=('73301')
# zips+=('73344')
# zips+=('78711')
# zips+=('78774')
# zips+=('78720')
# zips+=('78760')
# zips+=('78708')
# zips+=('78769')
# zips+=('78718')
# zips+=('78762')
# zips+=('78765')
# zips+=('78755')
# zips+=('78761')
# zips+=('78709')
# zips+=('78779')
# zips+=('78778')
# zips+=('78783')
# zips+=('78772')
# zips+=('78773')
# zips+=('78651')
# zips+=('78660')
# zips+=('78705')
# zips+=('78712')
# zips+=('78691')
# zips+=('78721')
# zips+=('78703')
# zips+=('78702')
# zips+=('78701')
# zips+=('78763')
# zips+=('78714')
# zips+=('78713')
# zips+=('78766')
# zips+=('78768')
# zips+=('78767')
# zips+=('78715')
# zips+=('78799')
# zips+=('78750')
# zips+=('78729')
# zips+=('78725')
# zips+=('78730')
# zips+=('78653')
# zips+=('78742')
# zips+=('78746')
# zips+=('78741')
# zips+=('78704')
# zips+=('78681')
# zips+=('78726')
# zips+=('78665')
# zips+=('78664')
# zips+=('78717')
# zips+=('78716')
# zips+=('78733')
# zips+=('78735')
# zips+=('78613')
# zips+=('78630')
# zips+=('78719')
# zips+=('78744')
# zips+=('78745')
# zips+=('78732')
# zips+=('78634')
# zips+=('78617')
# zips+=('78749')
# zips+=('78734')
# zips+=('78748')
# zips+=('78736')
# zips+=('78747')
# zips+=('78739')
# zips+=('78645')
# zips+=('78646')
# zips+=('78738')
# zips+=('78641')
# zips+=('78627')
# zips+=('78626')

for zip in "${zips[@]}"; do
    echo ${zip}
    wget -O ${zip}.json "http://api.geonames.org/findNearbyPostalCodesJSON?postalcode=${zip}&country=US&radius=30&maxRows=500&username=ssteele" &> /dev/null
    sleep 10
done
