WaalWeelde Dashboard
====================

A dashboard app aimed at assisting a group of stakeholders in collectively managing river floodplains. This prototype is meant to demo the technical possibilities of contemporary web/spatial technologies and inspire the stakeholders to think of ways in which these technologies can augment their decision making process and workflow.

Developed as part of the NWO_ project SDI4URD_ for the VerDuS_ project  `Urban Regions in The Delta Oost`_ .

.. _NWO: http://www.nwo.nl

.. _Urban Regions in the Delta Oost: http://deltaoost.verdus.nl/voorpagina.asp?id=11

.. _VerDuS: http://www.verdus.nl/voorpagina.asp

.. _SDI4URD: http://www.nwo.nl/en/research-and-results/research-projects/21/2300177021.html

The application consists of a viewer and a dashboard. The **viewer** is kindly provided by Geocat_  and is preloaded with base datasets as requested by the stakeholders. The **dashboard** is built with jQuery and OpenLayers. Maps are styled with AtlasStyler_ and served by Geoserver. 

.. _Geocat: http://www.geocat.nl

.. _AtlasStyler: http://en.geopublishing.org/AtlasStyler

The dashboard seeks to move away from traditional geographical information viewers where numerous data layers are simply stacked on top of each other thereby drowning non-geographical information specialists in data deluge. The dashboard is a first step towards an information (rather than data) driven workflow that fits the stakeholder's information needs better than a generic view of base datasets. The sole purpose of this particular prototype is to elicit dicussion amongst the researchers and stakeholders. It will probably be burried soon in favor of an improved version. 

Usage
=====

The app lives here_. 

.. _here: http://waalweelde.ndkv.nl

Click and drag the map panes to move them around. Grab the lower-right edge to resize. 

**Legenda** - show the map's legend

**Op Slot** - Locks panning/zooming with other maps. Locked maps zoom and pan synchronously making comparison, in theory, easier. I put this functionality forth as an alternative to overlaying area-filling layers where the top layer completely covers the bottom one and renders it invisible. Comparing both datasets is then achieved by either switching one of the layers on/off or adjusting the transparency. None of these enjoy my fancy hence the lock functionality.

**Voeg kaart toe..** - Add a new map window from the dropdown list. There are three types of maps for each year: vegetation type (Vegetatiestructuur), roughness (Ruwheid) and biomass production in tons per year per hectare (Biomassa). Roughness has implications for the water flow: if the area is too rough there's a higher probability of flooding. 

**Voeg widget toe..** - Add a widget window. The piecharts show the total area of each 'Vegetatiestructuur' land use type, the bar chart shows the total amount of produced biomass while the info widget show detailed information about the location on any of the maps. 


