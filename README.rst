WaalWeelde Dashboard
====================

A dashboard app aimed at assisting groups of stakeholders in managing the floodplains of rivers. This prototype is meant to demo the technical possibilities and inspire the stakeholders to think of ways to augment their decision process and workflow with spatial/web technologies. 

Developed as part of the NWO_ project SDI4URD_ for the VerDuS_ project  `Urban Regions in The Delta Oost`_ .

.. _NWO: http://www.nwo.nl

.. _Urban Regions in the Delta Oost: http://deltaoost.verdus.nl/voorpagina.asp?id=11

.. _VerDuS: http://www.verdus.nl/voorpagina.asp

.. _SDI4URD: http://www.nwo.nl/en/research-and-results/research-projects/21/2300177021.html

The application consists of a viewer and a dashboard. The **viewer** is kindly provided by Geocat_  and is preloaded with datasets requested by the stakeholders. The **dashboard** is built with jQuery and OpenLayers. Maps are styled with AtlasStyler_ and served by Geoserver. 

.. _Geocat: http://www.geocat.nl

.. _AtlasStyler: http://en.geopublishing.org/AtlasStyler

.. The dashboard seeks to move away from traditional geographical information viewers where numerous data layers are stacked to the roof thereby drowning potential non-geographical information specialists. The dashboard is a first step towards an information, rather than data, driven workflow that fits the stakeholder's information needs better than a generic view of base datasetsi.

Usage
=====

The app lives here_. 

.. _here: http://waalweelde.ndkv.nl

Click and drag the map panes to move them around. Grab the lower-right edge to resize. 

**Legenda** - show the map's legend

**Op Slot** - Locks panning/zooming with other maps. Meant as an alternative to overlaying area filling layers where the top completely covers the bottom one 
nd renders it invisible.

**Voeg kaart toe..** - Add a new map window from the dropdown list. There are three types of maps for each year: vegetation type (Vegetatiestructuur), roughness (Ruwheid) and biomass production in tons per year per hectare (Biomassa). Roughness has implications for the water flow: if the area is too rough there's a higher probability of flooding. 

**Voeg widget toe..** - Add a widget window. The piecharts show the total area of each 'Vegetatiestructuur' land use type, the bar chart shows the total amount of produced biomass while the info widgets shows detailed information about the location on any of the maps. 


