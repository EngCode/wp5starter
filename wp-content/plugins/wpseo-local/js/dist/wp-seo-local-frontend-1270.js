(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

// ==ClosureCompiler==
// @compilation_level ADVANCED_OPTIMIZATIONS
// @externs_url http://closure-compiler.googlecode.com/svn/trunk/contrib/externs/maps/google_maps_api_v3_3.js
// ==/ClosureCompiler==

/**
 * @name MarkerClusterer for Google Maps v3
 * @version version 1.0.1
 * @author Luke Mahe
 * @fileoverview
 * The library creates and manages per-zoom-level clusters for large amounts of
 * markers.
 * <br/>
 * This is a v3 implementation of the
 * <a href="http://gmaps-utility-library-dev.googlecode.com/svn/tags/markerclusterer/"
 * >v2 MarkerClusterer</a>.
 */

/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * A Marker Clusterer that clusters markers.
 *
 * @param {google.maps.Map} map The Google map to attach to.
 * @param {Array.<google.maps.Marker>=} opt_markers Optional markers to add to
 *   the cluster.
 * @param {Object=} opt_options support the following options:
 *     'gridSize': (number) The grid size of a cluster in pixels.
 *     'maxZoom': (number) The maximum zoom level that a marker can be part of a
 *                cluster.
 *     'zoomOnClick': (boolean) Whether the default behaviour of clicking on a
 *                    cluster is to zoom into it.
 *     'imagePath': (string) The base URL where the images representing
 *                  clusters will be found. The full URL will be:
 *                  {imagePath}[1-5].{imageExtension}
 *                  Default: '../images/m'.
 *     'imageExtension': (string) The suffix for images URL representing
 *                       clusters will be found. See _imagePath_ for details.
 *                       Default: 'png'.
 *     'averageCenter': (boolean) Whether the center of each cluster should be
 *                      the average of all markers in the cluster.
 *     'minimumClusterSize': (number) The minimum number of markers to be in a
 *                           cluster before the markers are hidden and a count
 *                           is shown.
 *     'styles': (object) An object that has style properties:
 *       'url': (string) The image url.
 *       'height': (number) The image height.
 *       'width': (number) The image width.
 *       'anchor': (Array) The anchor position of the label text.
 *       'textColor': (string) The text color.
 *       'textSize': (number) The text size.
 *       'backgroundPosition': (string) The position of the backgound x, y.
 * @constructor
 * @extends google.maps.OverlayView
 */
function MarkerClusterer(map, opt_markers, opt_options) {
    // MarkerClusterer implements google.maps.OverlayView interface. We use the
    // extend function to extend MarkerClusterer with google.maps.OverlayView
    // because it might not always be available when the code is defined so we
    // look for it at the last possible moment. If it doesn't exist now then
    // there is no point going ahead :)
    this.extend(MarkerClusterer, google.maps.OverlayView);
    this.map_ = map;

    /**
     * @type {Array.<google.maps.Marker>}
     * @private
     */
    this.markers_ = [];

    /**
     *  @type {Array.<Cluster>}
     */
    this.clusters_ = [];

    this.sizes = [53, 56, 66, 78, 90];

    /**
     * @private
     */
    this.styles_ = [];

    /**
     * @type {boolean}
     * @private
     */
    this.ready_ = false;

    var options = opt_options || {};

    /**
     * @type {number}
     * @private
     */
    this.gridSize_ = options['gridSize'] || 60;

    /**
     * @private
     */
    this.minClusterSize_ = options['minimumClusterSize'] || 2;

    /**
     * @type {?number}
     * @private
     */
    this.maxZoom_ = options['maxZoom'] || null;

    this.styles_ = options['styles'] || [];

    /**
     * @type {string}
     * @private
     */
    this.imagePath_ = options['imagePath'] || this.MARKER_CLUSTER_IMAGE_PATH_;

    /**
     * @type {string}
     * @private
     */
    this.imageExtension_ = options['imageExtension'] || this.MARKER_CLUSTER_IMAGE_EXTENSION_;

    /**
     * @type {boolean}
     * @private
     */
    this.zoomOnClick_ = true;

    if (options['zoomOnClick'] != undefined) {
        this.zoomOnClick_ = options['zoomOnClick'];
    }

    /**
     * @type {boolean}
     * @private
     */
    this.averageCenter_ = false;

    if (options['averageCenter'] != undefined) {
        this.averageCenter_ = options['averageCenter'];
    }

    this.setupStyles_();

    this.setMap(map);

    /**
     * @type {number}
     * @private
     */
    this.prevZoom_ = this.map_.getZoom();

    // Add the map event listeners
    var that = this;
    google.maps.event.addListener(this.map_, 'zoom_changed', function () {
        // Determines map type and prevent illegal zoom levels
        var zoom = that.map_.getZoom();
        var minZoom = that.map_.minZoom || 0;
        var maxZoom = Math.min(that.map_.maxZoom || 100, that.map_.mapTypes[that.map_.getMapTypeId()].maxZoom);
        zoom = Math.min(Math.max(zoom, minZoom), maxZoom);

        if (that.prevZoom_ != zoom) {
            that.prevZoom_ = zoom;
            that.resetViewport();
        }
    });

    google.maps.event.addListener(this.map_, 'idle', function () {
        that.redraw();
    });

    // Finally, add the markers
    if (opt_markers && (opt_markers.length || Object.keys(opt_markers).length)) {
        this.addMarkers(opt_markers, false);
    }
}

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_PATH_ = '../images/m';

/**
 * The marker cluster image path.
 *
 * @type {string}
 * @private
 */
MarkerClusterer.prototype.MARKER_CLUSTER_IMAGE_EXTENSION_ = 'png';

/**
 * Extends a objects prototype by anothers.
 *
 * @param {Object} obj1 The object to be extended.
 * @param {Object} obj2 The object to extend with.
 * @return {Object} The new extended object.
 * @ignore
 */
MarkerClusterer.prototype.extend = function (obj1, obj2) {
    return function (object) {
        for (var property in object.prototype) {
            this.prototype[property] = object.prototype[property];
        }
        return this;
    }.apply(obj1, [obj2]);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.onAdd = function () {
    this.setReady_(true);
};

/**
 * Implementaion of the interface method.
 * @ignore
 */
MarkerClusterer.prototype.draw = function () {};

/**
 * Sets up the styles object.
 *
 * @private
 */
MarkerClusterer.prototype.setupStyles_ = function () {
    if (this.styles_.length) {
        return;
    }

    for (var i = 0, size; size = this.sizes[i]; i++) {
        this.styles_.push({
            url: this.imagePath_ + (i + 1) + '.' + this.imageExtension_,
            height: size,
            width: size
        });
    }
};

/**
 *  Fit the map to the bounds of the markers in the clusterer.
 */
MarkerClusterer.prototype.fitMapToMarkers = function () {
    var markers = this.getMarkers();
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, marker; marker = markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }

    this.map_.fitBounds(bounds);
};

/**
 *  Sets the styles.
 *
 *  @param {Object} styles The style to set.
 */
MarkerClusterer.prototype.setStyles = function (styles) {
    this.styles_ = styles;
};

/**
 *  Gets the styles.
 *
 *  @return {Object} The styles object.
 */
MarkerClusterer.prototype.getStyles = function () {
    return this.styles_;
};

/**
 * Whether zoom on click is set.
 *
 * @return {boolean} True if zoomOnClick_ is set.
 */
MarkerClusterer.prototype.isZoomOnClick = function () {
    return this.zoomOnClick_;
};

/**
 * Whether average center is set.
 *
 * @return {boolean} True if averageCenter_ is set.
 */
MarkerClusterer.prototype.isAverageCenter = function () {
    return this.averageCenter_;
};

/**
 *  Returns the array of markers in the clusterer.
 *
 *  @return {Array.<google.maps.Marker>} The markers.
 */
MarkerClusterer.prototype.getMarkers = function () {
    return this.markers_;
};

/**
 *  Returns the number of markers in the clusterer
 *
 *  @return {Number} The number of markers.
 */
MarkerClusterer.prototype.getTotalMarkers = function () {
    return this.markers_.length;
};

/**
 *  Sets the max zoom for the clusterer.
 *
 *  @param {number} maxZoom The max zoom level.
 */
MarkerClusterer.prototype.setMaxZoom = function (maxZoom) {
    this.maxZoom_ = maxZoom;
};

/**
 *  Gets the max zoom for the clusterer.
 *
 *  @return {number} The max zoom level.
 */
MarkerClusterer.prototype.getMaxZoom = function () {
    return this.maxZoom_;
};

/**
 *  The function for calculating the cluster icon image.
 *
 *  @param {Array.<google.maps.Marker>} markers The markers in the clusterer.
 *  @param {number} numStyles The number of styles available.
 *  @return {Object} A object properties: 'text' (string) and 'index' (number).
 *  @private
 */
MarkerClusterer.prototype.calculator_ = function (markers, numStyles) {
    var index = 0;
    var count = markers.length;
    var dv = count;
    while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
    }

    index = Math.min(index, numStyles);
    return {
        text: count,
        index: index
    };
};

/**
 * Set the calculator function.
 *
 * @param {function(Array, number)} calculator The function to set as the
 *     calculator. The function should return a object properties:
 *     'text' (string) and 'index' (number).
 *
 */
MarkerClusterer.prototype.setCalculator = function (calculator) {
    this.calculator_ = calculator;
};

/**
 * Get the calculator function.
 *
 * @return {function(Array, number)} the calculator function.
 */
MarkerClusterer.prototype.getCalculator = function () {
    return this.calculator_;
};

/**
 * Add an array of markers to the clusterer.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarkers = function (markers, opt_nodraw) {
    if (markers.length) {
        for (var i = 0, marker; marker = markers[i]; i++) {
            this.pushMarkerTo_(marker);
        }
    } else if (Object.keys(markers).length) {
        for (var marker in markers) {
            this.pushMarkerTo_(markers[marker]);
        }
    }
    if (!opt_nodraw) {
        this.redraw();
    }
};

/**
 * Pushes a marker to the clusterer.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.pushMarkerTo_ = function (marker) {
    marker.isAdded = false;
    if (marker['draggable']) {
        // If the marker is draggable add a listener so we update the clusters on
        // the drag end.
        var that = this;
        google.maps.event.addListener(marker, 'dragend', function () {
            marker.isAdded = false;
            that.repaint();
        });
    }
    this.markers_.push(marker);
};

/**
 * Adds a marker to the clusterer and redraws if needed.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @param {boolean=} opt_nodraw Whether to redraw the clusters.
 */
MarkerClusterer.prototype.addMarker = function (marker, opt_nodraw) {
    this.pushMarkerTo_(marker);
    if (!opt_nodraw) {
        this.redraw();
    }
};

/**
 * Removes a marker and returns true if removed, false if not
 *
 * @param {google.maps.Marker} marker The marker to remove
 * @return {boolean} Whether the marker was removed or not
 * @private
 */
MarkerClusterer.prototype.removeMarker_ = function (marker) {
    var index = -1;
    if (this.markers_.indexOf) {
        index = this.markers_.indexOf(marker);
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                index = i;
                break;
            }
        }
    }

    if (index == -1) {
        // Marker is not in our list of markers.
        return false;
    }

    marker.setMap(null);

    this.markers_.splice(index, 1);

    return true;
};

/**
 * Remove a marker from the cluster.
 *
 * @param {google.maps.Marker} marker The marker to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 * @return {boolean} True if the marker was removed.
 */
MarkerClusterer.prototype.removeMarker = function (marker, opt_nodraw) {
    var removed = this.removeMarker_(marker);

    if (!opt_nodraw && removed) {
        this.resetViewport();
        this.redraw();
        return true;
    } else {
        return false;
    }
};

/**
 * Removes an array of markers from the cluster.
 *
 * @param {Array.<google.maps.Marker>} markers The markers to remove.
 * @param {boolean=} opt_nodraw Optional boolean to force no redraw.
 */
MarkerClusterer.prototype.removeMarkers = function (markers, opt_nodraw) {
    // create a local copy of markers if required
    // (removeMarker_ modifies the getMarkers() array in place)
    var markersCopy = markers === this.getMarkers() ? markers.slice() : markers;
    var removed = false;

    for (var i = 0, marker; marker = markersCopy[i]; i++) {
        var r = this.removeMarker_(marker);
        removed = removed || r;
    }

    if (!opt_nodraw && removed) {
        this.resetViewport();
        this.redraw();
        return true;
    }
};

/**
 * Sets the clusterer's ready state.
 *
 * @param {boolean} ready The state.
 * @private
 */
MarkerClusterer.prototype.setReady_ = function (ready) {
    if (!this.ready_) {
        this.ready_ = ready;
        this.createClusters_();
    }
};

/**
 * Returns the number of clusters in the clusterer.
 *
 * @return {number} The number of clusters.
 */
MarkerClusterer.prototype.getTotalClusters = function () {
    return this.clusters_.length;
};

/**
 * Returns the google map that the clusterer is associated with.
 *
 * @return {google.maps.Map} The map.
 */
MarkerClusterer.prototype.getMap = function () {
    return this.map_;
};

/**
 * Sets the google map that the clusterer is associated with.
 *
 * @param {google.maps.Map} map The map.
 */
MarkerClusterer.prototype.setMap = function (map) {
    this.map_ = map;
};

/**
 * Returns the size of the grid.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getGridSize = function () {
    return this.gridSize_;
};

/**
 * Sets the size of the grid.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setGridSize = function (size) {
    this.gridSize_ = size;
};

/**
 * Returns the min cluster size.
 *
 * @return {number} The grid size.
 */
MarkerClusterer.prototype.getMinClusterSize = function () {
    return this.minClusterSize_;
};

/**
 * Sets the min cluster size.
 *
 * @param {number} size The grid size.
 */
MarkerClusterer.prototype.setMinClusterSize = function (size) {
    this.minClusterSize_ = size;
};

/**
 * Extends a bounds object by the grid size.
 *
 * @param {google.maps.LatLngBounds} bounds The bounds to extend.
 * @return {google.maps.LatLngBounds} The extended bounds.
 */
MarkerClusterer.prototype.getExtendedBounds = function (bounds) {
    var projection = this.getProjection();

    // Turn the bounds into latlng.
    var tr = new google.maps.LatLng(bounds.getNorthEast().lat(), bounds.getNorthEast().lng());
    var bl = new google.maps.LatLng(bounds.getSouthWest().lat(), bounds.getSouthWest().lng());

    // Convert the points to pixels and the extend out by the grid size.
    var trPix = projection.fromLatLngToDivPixel(tr);
    trPix.x += this.gridSize_;
    trPix.y -= this.gridSize_;

    var blPix = projection.fromLatLngToDivPixel(bl);
    blPix.x -= this.gridSize_;
    blPix.y += this.gridSize_;

    // Convert the pixel points back to LatLng
    var ne = projection.fromDivPixelToLatLng(trPix);
    var sw = projection.fromDivPixelToLatLng(blPix);

    // Extend the bounds to contain the new bounds.
    bounds.extend(ne);
    bounds.extend(sw);

    return bounds;
};

/**
 * Determins if a marker is contained in a bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @param {google.maps.LatLngBounds} bounds The bounds to check against.
 * @return {boolean} True if the marker is in the bounds.
 * @private
 */
MarkerClusterer.prototype.isMarkerInBounds_ = function (marker, bounds) {
    return bounds.contains(marker.getPosition());
};

/**
 * Clears all clusters and markers from the clusterer.
 */
MarkerClusterer.prototype.clearMarkers = function () {
    this.resetViewport(true);

    // Set the markers a empty array.
    this.markers_ = [];
};

/**
 * Clears all existing clusters and recreates them.
 * @param {boolean} opt_hide To also hide the marker.
 */
MarkerClusterer.prototype.resetViewport = function (opt_hide) {
    // Remove all the clusters
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        cluster.remove();
    }

    // Reset the markers to not be added and to be invisible.
    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        marker.isAdded = false;
        if (opt_hide) {
            marker.setMap(null);
        }
    }

    this.clusters_ = [];
};

/**
 *
 */
MarkerClusterer.prototype.repaint = function () {
    var oldClusters = this.clusters_.slice();
    this.clusters_.length = 0;
    this.resetViewport();
    this.redraw();

    // Remove the old clusters.
    // Do it in a timeout so the other clusters have been drawn first.
    window.setTimeout(function () {
        for (var i = 0, cluster; cluster = oldClusters[i]; i++) {
            cluster.remove();
        }
    }, 0);
};

/**
 * Redraws the clusters.
 */
MarkerClusterer.prototype.redraw = function () {
    this.createClusters_();
};

/**
 * Calculates the distance between two latlng locations in km.
 * @see http://www.movable-type.co.uk/scripts/latlong.html
 *
 * @param {google.maps.LatLng} p1 The first lat lng point.
 * @param {google.maps.LatLng} p2 The second lat lng point.
 * @return {number} The distance between the two points in km.
 * @private
 */
MarkerClusterer.prototype.distanceBetweenPoints_ = function (p1, p2) {
    if (!p1 || !p2) {
        return 0;
    }

    var R = 6371; // Radius of the Earth in km
    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
};

/**
 * Add a marker to a cluster, or creates a new cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @private
 */
MarkerClusterer.prototype.addToClosestCluster_ = function (marker) {
    var distance = 40000; // Some large number
    var clusterToAddTo = null;
    var pos = marker.getPosition();
    for (var i = 0, cluster; cluster = this.clusters_[i]; i++) {
        var center = cluster.getCenter();
        if (center) {
            var d = this.distanceBetweenPoints_(center, marker.getPosition());
            if (d < distance) {
                distance = d;
                clusterToAddTo = cluster;
            }
        }
    }

    if (clusterToAddTo && clusterToAddTo.isMarkerInClusterBounds(marker)) {
        clusterToAddTo.addMarker(marker);
    } else {
        var cluster = new Cluster(this);
        cluster.addMarker(marker);
        this.clusters_.push(cluster);
    }
};

/**
 * Creates the clusters.
 *
 * @private
 */
MarkerClusterer.prototype.createClusters_ = function () {
    if (!this.ready_) {
        return;
    }

    // Get our current map view bounds.
    // Create a new bounds object so we don't affect the map.
    var mapBounds = new google.maps.LatLngBounds(this.map_.getBounds().getSouthWest(), this.map_.getBounds().getNorthEast());
    var bounds = this.getExtendedBounds(mapBounds);

    for (var i = 0, marker; marker = this.markers_[i]; i++) {
        if (!marker.isAdded && this.isMarkerInBounds_(marker, bounds)) {
            this.addToClosestCluster_(marker);
        }
    }
};

/**
 * A cluster that contains markers.
 *
 * @param {MarkerClusterer} markerClusterer The markerclusterer that this
 *     cluster is associated with.
 * @constructor
 * @ignore
 */
function Cluster(markerClusterer) {
    this.markerClusterer_ = markerClusterer;
    this.map_ = markerClusterer.getMap();
    this.gridSize_ = markerClusterer.getGridSize();
    this.minClusterSize_ = markerClusterer.getMinClusterSize();
    this.averageCenter_ = markerClusterer.isAverageCenter();
    this.center_ = null;
    this.markers_ = [];
    this.bounds_ = null;
    this.clusterIcon_ = new ClusterIcon(this, markerClusterer.getStyles(), markerClusterer.getGridSize());
}

/**
 * Determins if a marker is already added to the cluster.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker is already added.
 */
Cluster.prototype.isMarkerAlreadyAdded = function (marker) {
    if (this.markers_.indexOf) {
        return this.markers_.indexOf(marker) != -1;
    } else {
        for (var i = 0, m; m = this.markers_[i]; i++) {
            if (m == marker) {
                return true;
            }
        }
    }
    return false;
};

/**
 * Add a marker the cluster.
 *
 * @param {google.maps.Marker} marker The marker to add.
 * @return {boolean} True if the marker was added.
 */
Cluster.prototype.addMarker = function (marker) {
    if (this.isMarkerAlreadyAdded(marker)) {
        return false;
    }

    if (!this.center_) {
        this.center_ = marker.getPosition();
        this.calculateBounds_();
    } else {
        if (this.averageCenter_) {
            var l = this.markers_.length + 1;
            var lat = (this.center_.lat() * (l - 1) + marker.getPosition().lat()) / l;
            var lng = (this.center_.lng() * (l - 1) + marker.getPosition().lng()) / l;
            this.center_ = new google.maps.LatLng(lat, lng);
            this.calculateBounds_();
        }
    }

    marker.isAdded = true;
    this.markers_.push(marker);

    var len = this.markers_.length;
    if (len < this.minClusterSize_ && marker.getMap() != this.map_) {
        // Min cluster size not reached so show the marker.
        marker.setMap(this.map_);
    }

    if (len == this.minClusterSize_) {
        // Hide the markers that were showing.
        for (var i = 0; i < len; i++) {
            this.markers_[i].setMap(null);
        }
    }

    if (len >= this.minClusterSize_) {
        marker.setMap(null);
    }

    this.updateIcon();
    return true;
};

/**
 * Returns the marker clusterer that the cluster is associated with.
 *
 * @return {MarkerClusterer} The associated marker clusterer.
 */
Cluster.prototype.getMarkerClusterer = function () {
    return this.markerClusterer_;
};

/**
 * Returns the bounds of the cluster.
 *
 * @return {google.maps.LatLngBounds} the cluster bounds.
 */
Cluster.prototype.getBounds = function () {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    var markers = this.getMarkers();
    for (var i = 0, marker; marker = markers[i]; i++) {
        bounds.extend(marker.getPosition());
    }
    return bounds;
};

/**
 * Removes the cluster
 */
Cluster.prototype.remove = function () {
    this.clusterIcon_.remove();
    this.markers_.length = 0;
    delete this.markers_;
};

/**
 * Returns the number of markers in the cluster.
 *
 * @return {number} The number of markers in the cluster.
 */
Cluster.prototype.getSize = function () {
    return this.markers_.length;
};

/**
 * Returns a list of the markers in the cluster.
 *
 * @return {Array.<google.maps.Marker>} The markers in the cluster.
 */
Cluster.prototype.getMarkers = function () {
    return this.markers_;
};

/**
 * Returns the center of the cluster.
 *
 * @return {google.maps.LatLng} The cluster center.
 */
Cluster.prototype.getCenter = function () {
    return this.center_;
};

/**
 * Calculated the extended bounds of the cluster with the grid.
 *
 * @private
 */
Cluster.prototype.calculateBounds_ = function () {
    var bounds = new google.maps.LatLngBounds(this.center_, this.center_);
    this.bounds_ = this.markerClusterer_.getExtendedBounds(bounds);
};

/**
 * Determines if a marker lies in the clusters bounds.
 *
 * @param {google.maps.Marker} marker The marker to check.
 * @return {boolean} True if the marker lies in the bounds.
 */
Cluster.prototype.isMarkerInClusterBounds = function (marker) {
    return this.bounds_.contains(marker.getPosition());
};

/**
 * Returns the map that the cluster is associated with.
 *
 * @return {google.maps.Map} The map.
 */
Cluster.prototype.getMap = function () {
    return this.map_;
};

/**
 * Updates the cluster icon
 */
Cluster.prototype.updateIcon = function () {
    var zoom = this.map_.getZoom();
    var mz = this.markerClusterer_.getMaxZoom();

    if (mz && zoom > mz) {
        // The zoom is greater than our max zoom so show all the markers in cluster.
        for (var i = 0, marker; marker = this.markers_[i]; i++) {
            marker.setMap(this.map_);
        }
        return;
    }

    if (this.markers_.length < this.minClusterSize_) {
        // Min cluster size not yet reached.
        this.clusterIcon_.hide();
        return;
    }

    var numStyles = this.markerClusterer_.getStyles().length;
    var sums = this.markerClusterer_.getCalculator()(this.markers_, numStyles);
    this.clusterIcon_.setCenter(this.center_);
    this.clusterIcon_.setSums(sums);
    this.clusterIcon_.show();
};

/**
 * A cluster icon
 *
 * @param {Cluster} cluster The cluster to be associated with.
 * @param {Object} styles An object that has style properties:
 *     'url': (string) The image url.
 *     'height': (number) The image height.
 *     'width': (number) The image width.
 *     'anchor': (Array) The anchor position of the label text.
 *     'textColor': (string) The text color.
 *     'textSize': (number) The text size.
 *     'backgroundPosition: (string) The background postition x, y.
 * @param {number=} opt_padding Optional padding to apply to the cluster icon.
 * @constructor
 * @extends google.maps.OverlayView
 * @ignore
 */
function ClusterIcon(cluster, styles, opt_padding) {
    cluster.getMarkerClusterer().extend(ClusterIcon, google.maps.OverlayView);

    this.styles_ = styles;
    this.padding_ = opt_padding || 0;
    this.cluster_ = cluster;
    this.center_ = null;
    this.map_ = cluster.getMap();
    this.div_ = null;
    this.sums_ = null;
    this.visible_ = false;

    this.setMap(this.map_);
}

/**
 * Triggers the clusterclick event and zoom's if the option is set.
 */
ClusterIcon.prototype.triggerClusterClick = function () {
    var markerClusterer = this.cluster_.getMarkerClusterer();

    // Trigger the clusterclick event.
    google.maps.event.trigger(markerClusterer.map_, 'clusterclick', this.cluster_);

    if (markerClusterer.isZoomOnClick()) {
        // Zoom into the cluster.
        this.map_.fitBounds(this.cluster_.getBounds());
    }
};

/**
 * Adding the cluster icon to the dom.
 * @ignore
 */
ClusterIcon.prototype.onAdd = function () {
    this.div_ = document.createElement('DIV');
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.innerHTML = this.sums_.text;
    }

    var panes = this.getPanes();
    panes.overlayMouseTarget.appendChild(this.div_);

    var that = this;
    google.maps.event.addDomListener(this.div_, 'click', function () {
        that.triggerClusterClick();
    });
};

/**
 * Returns the position to place the div dending on the latlng.
 *
 * @param {google.maps.LatLng} latlng The position in latlng.
 * @return {google.maps.Point} The position in pixels.
 * @private
 */
ClusterIcon.prototype.getPosFromLatLng_ = function (latlng) {
    var pos = this.getProjection().fromLatLngToDivPixel(latlng);
    pos.x -= parseInt(this.width_ / 2, 10);
    pos.y -= parseInt(this.height_ / 2, 10);
    return pos;
};

/**
 * Draw the icon.
 * @ignore
 */
ClusterIcon.prototype.draw = function () {
    if (this.visible_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.top = pos.y + 'px';
        this.div_.style.left = pos.x + 'px';
    }
};

/**
 * Hide the icon.
 */
ClusterIcon.prototype.hide = function () {
    if (this.div_) {
        this.div_.style.display = 'none';
    }
    this.visible_ = false;
};

/**
 * Position and show the icon.
 */
ClusterIcon.prototype.show = function () {
    if (this.div_) {
        var pos = this.getPosFromLatLng_(this.center_);
        this.div_.style.cssText = this.createCss(pos);
        this.div_.style.display = '';
    }
    this.visible_ = true;
};

/**
 * Remove the icon from the map
 */
ClusterIcon.prototype.remove = function () {
    this.setMap(null);
};

/**
 * Implementation of the onRemove interface.
 * @ignore
 */
ClusterIcon.prototype.onRemove = function () {
    if (this.div_ && this.div_.parentNode) {
        this.hide();
        this.div_.parentNode.removeChild(this.div_);
        this.div_ = null;
    }
};

/**
 * Set the sums of the icon.
 *
 * @param {Object} sums The sums containing:
 *   'text': (string) The text to display in the icon.
 *   'index': (number) The style index of the icon.
 */
ClusterIcon.prototype.setSums = function (sums) {
    this.sums_ = sums;
    this.text_ = sums.text;
    this.index_ = sums.index;
    if (this.div_) {
        this.div_.innerHTML = sums.text;
    }

    this.useStyle();
};

/**
 * Sets the icon to the the styles.
 */
ClusterIcon.prototype.useStyle = function () {
    var index = Math.max(0, this.sums_.index - 1);
    index = Math.min(this.styles_.length - 1, index);
    var style = this.styles_[index];
    this.url_ = style['url'];
    this.height_ = style['height'];
    this.width_ = style['width'];
    this.textColor_ = style['textColor'];
    this.anchor_ = style['anchor'];
    this.textSize_ = style['textSize'];
    this.backgroundPosition_ = style['backgroundPosition'];
};

/**
 * Sets the center of the icon.
 *
 * @param {google.maps.LatLng} center The latlng to set as the center.
 */
ClusterIcon.prototype.setCenter = function (center) {
    this.center_ = center;
};

/**
 * Create the css text based on the position of the icon.
 *
 * @param {google.maps.Point} pos The position.
 * @return {string} The css style text.
 */
ClusterIcon.prototype.createCss = function (pos) {
    var style = [];
    style.push('background-image:url(' + this.url_ + ');');
    var backgroundPosition = this.backgroundPosition_ ? this.backgroundPosition_ : '0 0';
    style.push('background-position:' + backgroundPosition + ';');

    if (typeof this.anchor_ === 'object') {
        if (typeof this.anchor_[0] === 'number' && this.anchor_[0] > 0 && this.anchor_[0] < this.height_) {
            style.push('height:' + (this.height_ - this.anchor_[0]) + 'px; padding-top:' + this.anchor_[0] + 'px;');
        } else {
            style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px;');
        }
        if (typeof this.anchor_[1] === 'number' && this.anchor_[1] > 0 && this.anchor_[1] < this.width_) {
            style.push('width:' + (this.width_ - this.anchor_[1]) + 'px; padding-left:' + this.anchor_[1] + 'px;');
        } else {
            style.push('width:' + this.width_ + 'px; text-align:center;');
        }
    } else {
        style.push('height:' + this.height_ + 'px; line-height:' + this.height_ + 'px; width:' + this.width_ + 'px; text-align:center;');
    }

    var txtColor = this.textColor_ ? this.textColor_ : 'black';
    var txtSize = this.textSize_ ? this.textSize_ : 11;

    style.push('cursor:pointer; top:' + pos.y + 'px; left:' + pos.x + 'px; color:' + txtColor + '; position:absolute; font-size:' + txtSize + 'px; font-family:Arial,sans-serif; font-weight:bold');
    return style.join('');
};

// Export Symbols for Closure
// If you are not going to compile with closure then you can remove the
// code below.
window['MarkerClusterer'] = MarkerClusterer;
MarkerClusterer.prototype['addMarker'] = MarkerClusterer.prototype.addMarker;
MarkerClusterer.prototype['addMarkers'] = MarkerClusterer.prototype.addMarkers;
MarkerClusterer.prototype['clearMarkers'] = MarkerClusterer.prototype.clearMarkers;
MarkerClusterer.prototype['fitMapToMarkers'] = MarkerClusterer.prototype.fitMapToMarkers;
MarkerClusterer.prototype['getCalculator'] = MarkerClusterer.prototype.getCalculator;
MarkerClusterer.prototype['getGridSize'] = MarkerClusterer.prototype.getGridSize;
MarkerClusterer.prototype['getExtendedBounds'] = MarkerClusterer.prototype.getExtendedBounds;
MarkerClusterer.prototype['getMap'] = MarkerClusterer.prototype.getMap;
MarkerClusterer.prototype['getMarkers'] = MarkerClusterer.prototype.getMarkers;
MarkerClusterer.prototype['getMaxZoom'] = MarkerClusterer.prototype.getMaxZoom;
MarkerClusterer.prototype['getStyles'] = MarkerClusterer.prototype.getStyles;
MarkerClusterer.prototype['getTotalClusters'] = MarkerClusterer.prototype.getTotalClusters;
MarkerClusterer.prototype['getTotalMarkers'] = MarkerClusterer.prototype.getTotalMarkers;
MarkerClusterer.prototype['redraw'] = MarkerClusterer.prototype.redraw;
MarkerClusterer.prototype['removeMarker'] = MarkerClusterer.prototype.removeMarker;
MarkerClusterer.prototype['removeMarkers'] = MarkerClusterer.prototype.removeMarkers;
MarkerClusterer.prototype['resetViewport'] = MarkerClusterer.prototype.resetViewport;
MarkerClusterer.prototype['repaint'] = MarkerClusterer.prototype.repaint;
MarkerClusterer.prototype['setCalculator'] = MarkerClusterer.prototype.setCalculator;
MarkerClusterer.prototype['setGridSize'] = MarkerClusterer.prototype.setGridSize;
MarkerClusterer.prototype['setMaxZoom'] = MarkerClusterer.prototype.setMaxZoom;
MarkerClusterer.prototype['onAdd'] = MarkerClusterer.prototype.onAdd;
MarkerClusterer.prototype['draw'] = MarkerClusterer.prototype.draw;

Cluster.prototype['getCenter'] = Cluster.prototype.getCenter;
Cluster.prototype['getSize'] = Cluster.prototype.getSize;
Cluster.prototype['getMarkers'] = Cluster.prototype.getMarkers;

ClusterIcon.prototype['onAdd'] = ClusterIcon.prototype.onAdd;
ClusterIcon.prototype['draw'] = ClusterIcon.prototype.draw;
ClusterIcon.prototype['onRemove'] = ClusterIcon.prototype.onRemove;

Object.keys = Object.keys || function (o) {
    var result = [];
    for (var name in o) {
        if (o.hasOwnProperty(name)) result.push(name);
    }
    return result;
};

},{}],2:[function(require,module,exports){
'use strict';

var wpseo_directions = [];
var wpseo_maps = [];
var markers = new Object();

var wpseo_directions = [];
var wpseo_maps = [];
var markers = new Object();

window.wpseo_show_map = function wpseo_show_map(location_data, counter, center_lat, center_long, zoom, map_style, scrollable, draggable, default_show_infowindow, is_admin, marker_clustering) {
    var bounds = new google.maps.LatLngBounds();
    var center = new google.maps.LatLng(center_lat, center_long);
    var mobileBreakpoint = 480;
    markers[counter] = [];

    var wpseo_map_options = {
        zoom: zoom,
        minZoom: 1,
        mapTypeControl: true,
        zoomControl: scrollable,
        streetViewControl: true,
        mapTypeId: google.maps.MapTypeId[map_style.toUpperCase()],
        scrollwheel: scrollable && window.innerWidth > mobileBreakpoint
    };

    // gestureHandling should only be set on devices that support touch.
    if (checkForTouch()) {
        wpseo_map_options.gestureHandling = draggable ? 'auto' : 'none';
    } else {
        wpseo_map_options.draggable = draggable;
    }

    // Set center
    if (zoom == -1) {
        for (var i = 0; i < location_data.length; i++) {
            var latLong = new google.maps.LatLng(location_data[i]["lat"], location_data[i]["long"]);
            bounds.extend(latLong);
        }

        center = bounds.getCenter();
    }
    wpseo_map_options.center = center;

    try {
        var map = new google.maps.Map(document.getElementById("map_canvas" + (counter != 0 ? '_' + counter : '')), wpseo_map_options);
    } catch (error) {
        return;
    }

    if (zoom === -1) {
        map.fitBounds(bounds);
    }

    // Set markers + info
    var infoWindow = new google.maps.InfoWindow({
        content: infoWindowHTML
    });

    for (var i = 0; i < location_data.length; i++) {
        // Create info window HTML
        var infoWindowHTML = getInfoBubbleText(location_data[i]["name"], location_data[i]["address"], location_data[i]["url"], location_data[i]["self_url"]);

        var latLong = new google.maps.LatLng(location_data[i]["lat"], location_data[i]["long"]);
        var icon = location_data[i]["custom_marker"];
        var categories = location_data[i]["categories"];

        markers[counter][i] = new google.maps.Marker({
            position: latLong,
            center: center,
            map: map,
            map_id: counter,
            html: infoWindowHTML,
            draggable: Boolean(is_admin),
            icon: typeof icon !== 'undefined' && icon || '',
            categories: typeof categories !== 'undefined' && categories || ''
        });
    }
    for (var i = 0; i < markers[counter].length; i++) {
        var marker = markers[counter][i];

        google.maps.event.addListener(marker, "click", function () {
            infoWindow.setContent(this.html);
            infoWindow.open(map, this);
        });

        google.maps.event.addListener(infoWindow, 'closeclick', function () {
            map.setCenter(this.getPosition());
        });

        google.maps.event.addListener(marker, 'dragend', function (event) {
            // If on a single location page in a multiple location setup.
            if (document.getElementById('wpseo_coordinates_lat') && document.getElementById('wpseo_coordinates_long')) {
                document.getElementById('wpseo_coordinates_lat').value = event.latLng.lat();
                document.getElementById('wpseo_coordinates_long').value = event.latLng.lng();
            }

            // If on the Yoast Local SEO settings page, using a single location.
            if (document.getElementById('location_coords_lat') && document.getElementById('location_coords_long')) {
                document.getElementById('location_coords_lat').value = event.latLng.lat();
                document.getElementById('location_coords_long').value = event.latLng.lng();
            }
        });
    }

    // If marker clustering is set, use it.
    if (marker_clustering) {
        new MarkerClusterer(map, markers[counter], { imagePath: wpseo_local_data.marker_cluster_image_path });
    }

    // If there is only one marker and the infowindow should be shown, make it so.
    if (markers[counter].length == 1 && default_show_infowindow) {
        infoWindow.setContent(markers[counter][0].html);
        infoWindow.open(map, marker);
    }

    return map;
};

window.checkForTouch = function () {
    return !!(navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i));
};

window.wpseo_get_directions = function (map, location_data, counter, show_route) {
    var directionsDisplay = '';

    if (show_route && location_data.length >= 1) {
        directionsDisplay = new google.maps.DirectionsRenderer();
        directionsDisplay.setMap(map);
        directionsDisplay.setPanel(document.getElementById("directions" + (counter != 0 ? '_' + counter : '')));
    }

    return directionsDisplay;
};

window.getInfoBubbleText = function (business_name, business_city_address, business_url, self_url) {
    var infoWindowHTML = '<div class="wpseo-info-window-wrapper">';

    var showSelfLink = false;
    if (self_url != undefined && wpseo_local_data.has_multiple_locations != '' && self_url != window.location.href) showSelfLink = true;

    if (showSelfLink) infoWindowHTML += '<a href="' + self_url + '">';
    infoWindowHTML += '<strong>' + business_name + '</strong>';
    if (showSelfLink) infoWindowHTML += '</a>';
    infoWindowHTML += '<br>';
    infoWindowHTML += business_city_address;

    infoWindowHTML += '</div>';

    return infoWindowHTML;
};

window.wpseo_calculate_route = function (map, dirDisplay, coords_lat, coords_long, counter) {
    if (document.getElementById('wpseo-sl-coords-lat') != null) coords_lat = document.getElementById('wpseo-sl-coords-lat').value;
    if (document.getElementById('wpseo-sl-coords-long') != null) coords_long = document.getElementById('wpseo-sl-coords-long').value;

    var start = document.getElementById("origin" + (counter != 0 ? "_" + counter : "")).value + ' ' + wpseo_local_data.default_country;
    var unit_system = google.maps.UnitSystem.METRIC;
    if (wpseo_local_data.unit_system == 'IMPERIAL') unit_system = google.maps.UnitSystem.IMPERIAL;

    // Clear all markers from the map, only show A and B
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    // Change button to link to Google Maps. iPhones and Android phones will automatically open them in Maps app, when available.
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        var url = 'https://maps.google.com/maps?saddr=' + escape(start) + '&daddr=' + coords_lat + ',' + coords_long;
        window.open(url, '_blank');

        return false;
    } else {
        var latlng = new google.maps.LatLng(coords_lat, coords_long);

        var request = {
            origin: start,
            destination: latlng,
            provideRouteAlternatives: true,
            optimizeWaypoints: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            unitSystem: unit_system
        };

        var directionsService = new google.maps.DirectionsService();

        directionsService.route(request, function (response, status2) {
            if (status2 == google.maps.DirectionsStatus.OK) {
                dirDisplay.setDirections(response);
            } else if (status2 == google.maps.DirectionsStatus.ZERO_RESULTS) {
                var noroute = document.getElementById('wpseo-noroute');
                noroute.setAttribute('style', 'clear: both; display: block;');
            }
        });
    }
};

window.wpseo_sl_show_route = function (obj, coords_lat, coords_long) {
    $ = jQuery;

    // Create hidden inputs to pass through the lat/long coordinates for which is needed for calculating the route.
    $('.wpseo-sl-coords').remove();
    var inputs = '<input type="hidden" class="wpseo-sl-coords" id="wpseo-sl-coords-lat" value="' + coords_lat + '">';
    inputs += '<input type="hidden" class="wpseo-sl-coords" id="wpseo-sl-coords-long" value="' + coords_long + '">';

    $('#wpseo-directions-form').append(inputs).submit();
    $('#wpseo-directions-wrapper').slideUp(function () {
        $(this).insertAfter($(obj).parents('.wpseo-result')).slideDown();
    });
};

window.filterMarkers = function (category, map_id) {
    for (i = 0; i < markers[map_id].length; i++) {
        marker = markers[map_id][i];

        // If is same category or category not picked
        if (marker.categories.hasOwnProperty(category) || category.length === 0) {
            marker.setVisible(true);
        }
        // Categories don't match
        else {
                marker.setVisible(false);
            }
    }
};

},{}]},{},[1,2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJqcy9zcmMvdmVuZG9yL21hcmtlcmNsdXN0ZXIuanMiLCJqcy9zcmMvd3Atc2VvLWxvY2FsLWZyb250ZW5kLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7OztBQWFBOzs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW1DQSxTQUFTLGVBQVQsQ0FBeUIsR0FBekIsRUFBOEIsV0FBOUIsRUFBMkMsV0FBM0MsRUFBd0Q7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQUssTUFBTCxDQUFZLGVBQVosRUFBNkIsT0FBTyxJQUFQLENBQVksV0FBekM7QUFDQSxTQUFLLElBQUwsR0FBWSxHQUFaOztBQUVBOzs7O0FBSUEsU0FBSyxRQUFMLEdBQWdCLEVBQWhCOztBQUVBOzs7QUFHQSxTQUFLLFNBQUwsR0FBaUIsRUFBakI7O0FBRUEsU0FBSyxLQUFMLEdBQWEsQ0FBQyxFQUFELEVBQUssRUFBTCxFQUFTLEVBQVQsRUFBYSxFQUFiLEVBQWlCLEVBQWpCLENBQWI7O0FBRUE7OztBQUdBLFNBQUssT0FBTCxHQUFlLEVBQWY7O0FBRUE7Ozs7QUFJQSxTQUFLLE1BQUwsR0FBYyxLQUFkOztBQUVBLFFBQUksVUFBVSxlQUFlLEVBQTdCOztBQUVBOzs7O0FBSUEsU0FBSyxTQUFMLEdBQWlCLFFBQVEsVUFBUixLQUF1QixFQUF4Qzs7QUFFQTs7O0FBR0EsU0FBSyxlQUFMLEdBQXVCLFFBQVEsb0JBQVIsS0FBaUMsQ0FBeEQ7O0FBR0E7Ozs7QUFJQSxTQUFLLFFBQUwsR0FBZ0IsUUFBUSxTQUFSLEtBQXNCLElBQXRDOztBQUVBLFNBQUssT0FBTCxHQUFlLFFBQVEsUUFBUixLQUFxQixFQUFwQzs7QUFFQTs7OztBQUlBLFNBQUssVUFBTCxHQUFrQixRQUFRLFdBQVIs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QzlDLFNBQUssSUFBSSxDQUFULEVBQVksSUFBSSxRQUFRLE1BQVIsRUFBZ0IsTUFBaEMsRUFBd0MsR0FBeEMsRUFBNkM7QUFDekMsaUJBQVMsUUFBUSxNQUFSLEVBQWdCLENBQWhCLENBQVQ7O0FBRUE7QUFDQSxZQUFJLE9BQU8sVUFBUCxDQUFrQixjQUFsQixDQUFpQyxRQUFqQyxLQUE4QyxTQUFTLE1BQVQsS0FBb0IsQ0FBdEUsRUFBeUU7QUFDckUsbUJBQU8sVUFBUCxDQUFrQixJQUFsQjtBQUNIO0FBQ0Q7QUFIQSxhQUlLO0FBQ0QsdUJBQU8sVUFBUCxDQUFrQixLQUFsQjtBQUNIO0FBQ0o7QUFDSixDQWJEIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLy8gPT1DbG9zdXJlQ29tcGlsZXI9PVxuLy8gQGNvbXBpbGF0aW9uX2xldmVsIEFEVkFOQ0VEX09QVElNSVpBVElPTlNcbi8vIEBleHRlcm5zX3VybCBodHRwOi8vY2xvc3VyZS1jb21waWxlci5nb29nbGVjb2RlLmNvbS9zdm4vdHJ1bmsvY29udHJpYi9leHRlcm5zL21hcHMvZ29vZ2xlX21hcHNfYXBpX3YzXzMuanNcbi8vID09L0Nsb3N1cmVDb21waWxlcj09XG5cbi8qKlxuICogQG5hbWUgTWFya2VyQ2x1c3RlcmVyIGZvciBHb29nbGUgTWFwcyB2M1xuICogQHZlcnNpb24gdmVyc2lvbiAxLjAuMVxuICogQGF1dGhvciBMdWtlIE1haGVcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIFRoZSBsaWJyYXJ5IGNyZWF0ZXMgYW5kIG1hbmFnZXMgcGVyLXpvb20tbGV2ZWwgY2x1c3RlcnMgZm9yIGxhcmdlIGFtb3VudHMgb2ZcbiAqIG1hcmtlcnMuXG4gKiA8YnIvPlxuICogVGhpcyBpcyBhIHYzIGltcGxlbWVudGF0aW9uIG9mIHRoZVxuICogPGEgaHJlZj1cImh0dHA6Ly9nbWFwcy11dGlsaXR5LWxpYnJhcnktZGV2Lmdvb2dsZWNvZGUuY29tL3N2bi90YWdzL21hcmtlcmNsdXN0ZXJlci9cIlxuICogPnYyIE1hcmtlckNsdXN0ZXJlcjwvYT4uXG4gKi9cblxuLyoqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XG4gKlxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuXG4vKipcbiAqIEEgTWFya2VyIENsdXN0ZXJlciB0aGF0IGNsdXN0ZXJzIG1hcmtlcnMuXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5NYXB9IG1hcCBUaGUgR29vZ2xlIG1hcCB0byBhdHRhY2ggdG8uXG4gKiBAcGFyYW0ge0FycmF5Ljxnb29nbGUubWFwcy5NYXJrZXI+PX0gb3B0X21hcmtlcnMgT3B0aW9uYWwgbWFya2VycyB0byBhZGQgdG9cbiAqICAgdGhlIGNsdXN0ZXIuXG4gKiBAcGFyYW0ge09iamVjdD19IG9wdF9vcHRpb25zIHN1cHBvcnQgdGhlIGZvbGxvd2luZyBvcHRpb25zOlxuICogICAgICdncmlkU2l6ZSc6IChudW1iZXIpIFRoZSBncmlkIHNpemUgb2YgYSBjbHVzdGVyIGluIHBpeGVscy5cbiAqICAgICAnbWF4Wm9vbSc6IChudW1iZXIpIFRoZSBtYXhpbXVtIHpvb20gbGV2ZWwgdGhhdCBhIG1hcmtlciBjYW4gYmUgcGFydCBvZiBhXG4gKiAgICAgICAgICAgICAgICBjbHVzdGVyLlxuICogICAgICd6b29tT25DbGljayc6IChib29sZWFuKSBXaGV0aGVyIHRoZSBkZWZhdWx0IGJlaGF2aW91ciBvZiBjbGlja2luZyBvbiBhXG4gKiAgICAgICAgICAgICAgICAgICAgY2x1c3RlciBpcyB0byB6b29tIGludG8gaXQuXG4gKiAgICAgJ2ltYWdlUGF0aCc6IChzdHJpbmcpIFRoZSBiYXNlIFVSTCB3aGVyZSB0aGUgaW1hZ2VzIHJlcHJlc2VudGluZ1xuICogICAgICAgICAgICAgICAgICBjbHVzdGVycyB3aWxsIGJlIGZvdW5kLiBUaGUgZnVsbCBVUkwgd2lsbCBiZTpcbiAqICAgICAgICAgICAgICAgICAge2ltYWdlUGF0aH1bMS01XS57aW1hZ2VFeHRlbnNpb259XG4gKiAgICAgICAgICAgICAgICAgIERlZmF1bHQ6ICcuLi9pbWFnZXMvbScuXG4gKiAgICAgJ2ltYWdlRXh0ZW5zaW9uJzogKHN0cmluZykgVGhlIHN1ZmZpeCBmb3IgaW1hZ2VzIFVSTCByZXByZXNlbnRpbmdcbiAqICAgICAgICAgICAgICAgICAgICAgICBjbHVzdGVycyB3aWxsIGJlIGZvdW5kLiBTZWUgX2ltYWdlUGF0aF8gZm9yIGRldGFpbHMuXG4gKiAgICAgICAgICAgICAgICAgICAgICAgRGVmYXVsdDogJ3BuZycuXG4gKiAgICAgJ2F2ZXJhZ2VDZW50ZXInOiAoYm9vbGVhbikgV2hldGhlciB0aGUgY2VudGVyIG9mIGVhY2ggY2x1c3RlciBzaG91bGQgYmVcbiAqICAgICAgICAgICAgICAgICAgICAgIHRoZSBhdmVyYWdlIG9mIGFsbCBtYXJrZXJzIGluIHRoZSBjbHVzdGVyLlxuICogICAgICdtaW5pbXVtQ2x1c3RlclNpemUnOiAobnVtYmVyKSBUaGUgbWluaW11bSBudW1iZXIgb2YgbWFya2VycyB0byBiZSBpbiBhXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsdXN0ZXIgYmVmb3JlIHRoZSBtYXJrZXJzIGFyZSBoaWRkZW4gYW5kIGEgY291bnRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgaXMgc2hvd24uXG4gKiAgICAgJ3N0eWxlcyc6IChvYmplY3QpIEFuIG9iamVjdCB0aGF0IGhhcyBzdHlsZSBwcm9wZXJ0aWVzOlxuICogICAgICAgJ3VybCc6IChzdHJpbmcpIFRoZSBpbWFnZSB1cmwuXG4gKiAgICAgICAnaGVpZ2h0JzogKG51bWJlcikgVGhlIGltYWdlIGhlaWdodC5cbiAqICAgICAgICd3aWR0aCc6IChudW1iZXIpIFRoZSBpbWFnZSB3aWR0aC5cbiAqICAgICAgICdhbmNob3InOiAoQXJyYXkpIFRoZSBhbmNob3IgcG9zaXRpb24gb2YgdGhlIGxhYmVsIHRleHQuXG4gKiAgICAgICAndGV4dENvbG9yJzogKHN0cmluZykgVGhlIHRleHQgY29sb3IuXG4gKiAgICAgICAndGV4dFNpemUnOiAobnVtYmVyKSBUaGUgdGV4dCBzaXplLlxuICogICAgICAgJ2JhY2tncm91bmRQb3NpdGlvbic6IChzdHJpbmcpIFRoZSBwb3NpdGlvbiBvZiB0aGUgYmFja2dvdW5kIHgsIHkuXG4gKiBAY29uc3RydWN0b3JcbiAqIEBleHRlbmRzIGdvb2dsZS5tYXBzLk92ZXJsYXlWaWV3XG4gKi9cbmZ1bmN0aW9uIE1hcmtlckNsdXN0ZXJlcihtYXAsIG9wdF9tYXJrZXJzLCBvcHRfb3B0aW9ucykge1xuICAgIC8vIE1hcmtlckNsdXN0ZXJlciBpbXBsZW1lbnRzIGdvb2dsZS5tYXBzLk92ZXJsYXlWaWV3IGludGVyZmFjZS4gV2UgdXNlIHRoZVxuICAgIC8vIGV4dGVuZCBmdW5jdGlvbiB0byBleHRlbmQgTWFya2VyQ2x1c3RlcmVyIHdpdGggZ29vZ2xlLm1hcHMuT3ZlcmxheVZpZXdcbiAgICAvLyBiZWNhdXNlIGl0IG1pZ2h0IG5vdCBhbHdheXMgYmUgYXZhaWxhYmxlIHdoZW4gdGhlIGNvZGUgaXMgZGVmaW5lZCBzbyB3ZVxuICAgIC8vIGxvb2sgZm9yIGl0IGF0IHRoZSBsYXN0IHBvc3NpYmxlIG1vbWVudC4gSWYgaXQgZG9lc24ndCBleGlzdCBub3cgdGhlblxuICAgIC8vIHRoZXJlIGlzIG5vIHBvaW50IGdvaW5nIGFoZWFkIDopXG4gICAgdGhpcy5leHRlbmQoTWFya2VyQ2x1c3RlcmVyLCBnb29nbGUubWFwcy5PdmVybGF5Vmlldyk7XG4gICAgdGhpcy5tYXBfID0gbWFwO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge0FycmF5Ljxnb29nbGUubWFwcy5NYXJrZXI+fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5tYXJrZXJzXyA9IFtdO1xuXG4gICAgLyoqXG4gICAgICogIEB0eXBlIHtBcnJheS48Q2x1c3Rlcj59XG4gICAgICovXG4gICAgdGhpcy5jbHVzdGVyc18gPSBbXTtcblxuICAgIHRoaXMuc2l6ZXMgPSBbNTMsIDU2LCA2NiwgNzgsIDkwXTtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5zdHlsZXNfID0gW107XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMucmVhZHlfID0gZmFsc2U7XG5cbiAgICB2YXIgb3B0aW9ucyA9IG9wdF9vcHRpb25zIHx8IHt9O1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuZ3JpZFNpemVfID0gb3B0aW9uc1snZ3JpZFNpemUnXSB8fCA2MDtcblxuICAgIC8qKlxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5taW5DbHVzdGVyU2l6ZV8gPSBvcHRpb25zWydtaW5pbXVtQ2x1c3RlclNpemUnXSB8fCAyO1xuXG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7P251bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMubWF4Wm9vbV8gPSBvcHRpb25zWydtYXhab29tJ10gfHwgbnVsbDtcblxuICAgIHRoaXMuc3R5bGVzXyA9IG9wdGlvbnNbJ3N0eWxlcyddIHx8IFtdO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuaW1hZ2VQYXRoXyA9IG9wdGlvbnNbJ2ltYWdlUGF0aCddIHx8XG4gICAgICAgIHRoaXMuTUFSS0VSX0NMVVNURVJfSU1BR0VfUEFUSF87XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5pbWFnZUV4dGVuc2lvbl8gPSBvcHRpb25zWydpbWFnZUV4dGVuc2lvbiddIHx8XG4gICAgICAgIHRoaXMuTUFSS0VSX0NMVVNURVJfSU1BR0VfRVhURU5TSU9OXztcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy56b29tT25DbGlja18gPSB0cnVlO1xuXG4gICAgaWYgKG9wdGlvbnNbJ3pvb21PbkNsaWNrJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuem9vbU9uQ2xpY2tfID0gb3B0aW9uc1snem9vbU9uQ2xpY2snXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuYXZlcmFnZUNlbnRlcl8gPSBmYWxzZTtcblxuICAgIGlmIChvcHRpb25zWydhdmVyYWdlQ2VudGVyJ10gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuYXZlcmFnZUNlbnRlcl8gPSBvcHRpb25zWydhdmVyYWdlQ2VudGVyJ107XG4gICAgfVxuXG4gICAgdGhpcy5zZXR1cFN0eWxlc18oKTtcblxuICAgIHRoaXMuc2V0TWFwKG1hcCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5wcmV2Wm9vbV8gPSB0aGlzLm1hcF8uZ2V0Wm9vbSgpO1xuXG4gICAgLy8gQWRkIHRoZSBtYXAgZXZlbnQgbGlzdGVuZXJzXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKHRoaXMubWFwXywgJ3pvb21fY2hhbmdlZCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyBEZXRlcm1pbmVzIG1hcCB0eXBlIGFuZCBwcmV2ZW50IGlsbGVnYWwgem9vbSBsZXZlbHNcbiAgICAgICAgdmFyIHpvb20gPSB0aGF0Lm1hcF8uZ2V0Wm9vbSgpO1xuICAgICAgICB2YXIgbWluWm9vbSA9IHRoYXQubWFwXy5taW5ab29tIHx8IDA7XG4gICAgICAgIHZhciBtYXhab29tID0gTWF0aC5taW4odGhhdC5tYXBfLm1heFpvb20gfHwgMTAwLFxuICAgICAgICAgICAgdGhhdC5tYXBfLm1hcFR5cGVzW3RoYXQubWFwXy5nZXRNYXBUeXBlSWQoKV0ubWF4Wm9vbSk7XG4gICAgICAgIHpvb20gPSBNYXRoLm1pbihNYXRoLm1heCh6b29tLG1pblpvb20pLG1heFpvb20pO1xuXG4gICAgICAgIGlmICh0aGF0LnByZXZab29tXyAhPSB6b29tKSB7XG4gICAgICAgICAgICB0aGF0LnByZXZab29tXyA9IHpvb207XG4gICAgICAgICAgICB0aGF0LnJlc2V0Vmlld3BvcnQoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIodGhpcy5tYXBfLCAnaWRsZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnJlZHJhdygpO1xuICAgIH0pO1xuXG4gICAgLy8gRmluYWxseSwgYWRkIHRoZSBtYXJrZXJzXG4gICAgaWYgKG9wdF9tYXJrZXJzICYmIChvcHRfbWFya2Vycy5sZW5ndGggfHwgT2JqZWN0LmtleXMob3B0X21hcmtlcnMpLmxlbmd0aCkpIHtcbiAgICAgICAgdGhpcy5hZGRNYXJrZXJzKG9wdF9tYXJrZXJzLCBmYWxzZSk7XG4gICAgfVxufVxuXG5cbi8qKlxuICogVGhlIG1hcmtlciBjbHVzdGVyIGltYWdlIHBhdGguXG4gKlxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuTUFSS0VSX0NMVVNURVJfSU1BR0VfUEFUSF8gPSAnLi4vaW1hZ2VzL20nO1xuXG5cbi8qKlxuICogVGhlIG1hcmtlciBjbHVzdGVyIGltYWdlIHBhdGguXG4gKlxuICogQHR5cGUge3N0cmluZ31cbiAqIEBwcml2YXRlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuTUFSS0VSX0NMVVNURVJfSU1BR0VfRVhURU5TSU9OXyA9ICdwbmcnO1xuXG5cbi8qKlxuICogRXh0ZW5kcyBhIG9iamVjdHMgcHJvdG90eXBlIGJ5IGFub3RoZXJzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmoxIFRoZSBvYmplY3QgdG8gYmUgZXh0ZW5kZWQuXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqMiBUaGUgb2JqZWN0IHRvIGV4dGVuZCB3aXRoLlxuICogQHJldHVybiB7T2JqZWN0fSBUaGUgbmV3IGV4dGVuZGVkIG9iamVjdC5cbiAqIEBpZ25vcmVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5leHRlbmQgPSBmdW5jdGlvbihvYmoxLCBvYmoyKSB7XG4gICAgcmV0dXJuIChmdW5jdGlvbihvYmplY3QpIHtcbiAgICAgICAgZm9yICh2YXIgcHJvcGVydHkgaW4gb2JqZWN0LnByb3RvdHlwZSkge1xuICAgICAgICAgICAgdGhpcy5wcm90b3R5cGVbcHJvcGVydHldID0gb2JqZWN0LnByb3RvdHlwZVtwcm9wZXJ0eV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSkuYXBwbHkob2JqMSwgW29iajJdKTtcbn07XG5cblxuLyoqXG4gKiBJbXBsZW1lbnRhaW9uIG9mIHRoZSBpbnRlcmZhY2UgbWV0aG9kLlxuICogQGlnbm9yZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLm9uQWRkID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRSZWFkeV8odHJ1ZSk7XG59O1xuXG4vKipcbiAqIEltcGxlbWVudGFpb24gb2YgdGhlIGludGVyZmFjZSBtZXRob2QuXG4gKiBAaWdub3JlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge307XG5cbi8qKlxuICogU2V0cyB1cCB0aGUgc3R5bGVzIG9iamVjdC5cbiAqXG4gKiBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldHVwU3R5bGVzXyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnN0eWxlc18ubGVuZ3RoKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMCwgc2l6ZTsgc2l6ZSA9IHRoaXMuc2l6ZXNbaV07IGkrKykge1xuICAgICAgICB0aGlzLnN0eWxlc18ucHVzaCh7XG4gICAgICAgICAgICB1cmw6IHRoaXMuaW1hZ2VQYXRoXyArIChpICsgMSkgKyAnLicgKyB0aGlzLmltYWdlRXh0ZW5zaW9uXyxcbiAgICAgICAgICAgIGhlaWdodDogc2l6ZSxcbiAgICAgICAgICAgIHdpZHRoOiBzaXplXG4gICAgICAgIH0pO1xuICAgIH1cbn07XG5cbi8qKlxuICogIEZpdCB0aGUgbWFwIHRvIHRoZSBib3VuZHMgb2YgdGhlIG1hcmtlcnMgaW4gdGhlIGNsdXN0ZXJlci5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5maXRNYXBUb01hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWFya2VycyA9IHRoaXMuZ2V0TWFya2VycygpO1xuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIG1hcmtlcjsgbWFya2VyID0gbWFya2Vyc1tpXTsgaSsrKSB7XG4gICAgICAgIGJvdW5kcy5leHRlbmQobWFya2VyLmdldFBvc2l0aW9uKCkpO1xuICAgIH1cblxuICAgIHRoaXMubWFwXy5maXRCb3VuZHMoYm91bmRzKTtcbn07XG5cblxuLyoqXG4gKiAgU2V0cyB0aGUgc3R5bGVzLlxuICpcbiAqICBAcGFyYW0ge09iamVjdH0gc3R5bGVzIFRoZSBzdHlsZSB0byBzZXQuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuc2V0U3R5bGVzID0gZnVuY3Rpb24oc3R5bGVzKSB7XG4gICAgdGhpcy5zdHlsZXNfID0gc3R5bGVzO1xufTtcblxuXG4vKipcbiAqICBHZXRzIHRoZSBzdHlsZXMuXG4gKlxuICogIEByZXR1cm4ge09iamVjdH0gVGhlIHN0eWxlcyBvYmplY3QuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0U3R5bGVzID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVzXztcbn07XG5cblxuLyoqXG4gKiBXaGV0aGVyIHpvb20gb24gY2xpY2sgaXMgc2V0LlxuICpcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgem9vbU9uQ2xpY2tfIGlzIHNldC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5pc1pvb21PbkNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuem9vbU9uQ2xpY2tfO1xufTtcblxuLyoqXG4gKiBXaGV0aGVyIGF2ZXJhZ2UgY2VudGVyIGlzIHNldC5cbiAqXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIGF2ZXJhZ2VDZW50ZXJfIGlzIHNldC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5pc0F2ZXJhZ2VDZW50ZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5hdmVyYWdlQ2VudGVyXztcbn07XG5cblxuLyoqXG4gKiAgUmV0dXJucyB0aGUgYXJyYXkgb2YgbWFya2VycyBpbiB0aGUgY2x1c3RlcmVyLlxuICpcbiAqICBAcmV0dXJuIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gVGhlIG1hcmtlcnMuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0TWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnNfO1xufTtcblxuXG4vKipcbiAqICBSZXR1cm5zIHRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgY2x1c3RlcmVyXG4gKlxuICogIEByZXR1cm4ge051bWJlcn0gVGhlIG51bWJlciBvZiBtYXJrZXJzLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldFRvdGFsTWFya2VycyA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnNfLmxlbmd0aDtcbn07XG5cblxuLyoqXG4gKiAgU2V0cyB0aGUgbWF4IHpvb20gZm9yIHRoZSBjbHVzdGVyZXIuXG4gKlxuICogIEBwYXJhbSB7bnVtYmVyfSBtYXhab29tIFRoZSBtYXggem9vbSBsZXZlbC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5zZXRNYXhab29tID0gZnVuY3Rpb24obWF4Wm9vbSkge1xuICAgIHRoaXMubWF4Wm9vbV8gPSBtYXhab29tO1xufTtcblxuXG4vKipcbiAqICBHZXRzIHRoZSBtYXggem9vbSBmb3IgdGhlIGNsdXN0ZXJlci5cbiAqXG4gKiAgQHJldHVybiB7bnVtYmVyfSBUaGUgbWF4IHpvb20gbGV2ZWwuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0TWF4Wm9vbSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1heFpvb21fO1xufTtcblxuXG4vKipcbiAqICBUaGUgZnVuY3Rpb24gZm9yIGNhbGN1bGF0aW5nIHRoZSBjbHVzdGVyIGljb24gaW1hZ2UuXG4gKlxuICogIEBwYXJhbSB7QXJyYXkuPGdvb2dsZS5tYXBzLk1hcmtlcj59IG1hcmtlcnMgVGhlIG1hcmtlcnMgaW4gdGhlIGNsdXN0ZXJlci5cbiAqICBAcGFyYW0ge251bWJlcn0gbnVtU3R5bGVzIFRoZSBudW1iZXIgb2Ygc3R5bGVzIGF2YWlsYWJsZS5cbiAqICBAcmV0dXJuIHtPYmplY3R9IEEgb2JqZWN0IHByb3BlcnRpZXM6ICd0ZXh0JyAoc3RyaW5nKSBhbmQgJ2luZGV4JyAobnVtYmVyKS5cbiAqICBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmNhbGN1bGF0b3JfID0gZnVuY3Rpb24obWFya2VycywgbnVtU3R5bGVzKSB7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgY291bnQgPSBtYXJrZXJzLmxlbmd0aDtcbiAgICB2YXIgZHYgPSBjb3VudDtcbiAgICB3aGlsZSAoZHYgIT09IDApIHtcbiAgICAgICAgZHYgPSBwYXJzZUludChkdiAvIDEwLCAxMCk7XG4gICAgICAgIGluZGV4Kys7XG4gICAgfVxuXG4gICAgaW5kZXggPSBNYXRoLm1pbihpbmRleCwgbnVtU3R5bGVzKTtcbiAgICByZXR1cm4ge1xuICAgICAgICB0ZXh0OiBjb3VudCxcbiAgICAgICAgaW5kZXg6IGluZGV4XG4gICAgfTtcbn07XG5cblxuLyoqXG4gKiBTZXQgdGhlIGNhbGN1bGF0b3IgZnVuY3Rpb24uXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihBcnJheSwgbnVtYmVyKX0gY2FsY3VsYXRvciBUaGUgZnVuY3Rpb24gdG8gc2V0IGFzIHRoZVxuICogICAgIGNhbGN1bGF0b3IuIFRoZSBmdW5jdGlvbiBzaG91bGQgcmV0dXJuIGEgb2JqZWN0IHByb3BlcnRpZXM6XG4gKiAgICAgJ3RleHQnIChzdHJpbmcpIGFuZCAnaW5kZXgnIChudW1iZXIpLlxuICpcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5zZXRDYWxjdWxhdG9yID0gZnVuY3Rpb24oY2FsY3VsYXRvcikge1xuICAgIHRoaXMuY2FsY3VsYXRvcl8gPSBjYWxjdWxhdG9yO1xufTtcblxuXG4vKipcbiAqIEdldCB0aGUgY2FsY3VsYXRvciBmdW5jdGlvbi5cbiAqXG4gKiBAcmV0dXJuIHtmdW5jdGlvbihBcnJheSwgbnVtYmVyKX0gdGhlIGNhbGN1bGF0b3IgZnVuY3Rpb24uXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0Q2FsY3VsYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNhbGN1bGF0b3JfO1xufTtcblxuXG4vKipcbiAqIEFkZCBhbiBhcnJheSBvZiBtYXJrZXJzIHRvIHRoZSBjbHVzdGVyZXIuXG4gKlxuICogQHBhcmFtIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gbWFya2VycyBUaGUgbWFya2VycyB0byBhZGQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfbm9kcmF3IFdoZXRoZXIgdG8gcmVkcmF3IHRoZSBjbHVzdGVycy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5hZGRNYXJrZXJzID0gZnVuY3Rpb24obWFya2Vycywgb3B0X25vZHJhdykge1xuICAgIGlmIChtYXJrZXJzLmxlbmd0aCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbWFya2VyOyBtYXJrZXIgPSBtYXJrZXJzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucHVzaE1hcmtlclRvXyhtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmIChPYmplY3Qua2V5cyhtYXJrZXJzKS5sZW5ndGgpIHtcbiAgICAgICAgZm9yICh2YXIgbWFya2VyIGluIG1hcmtlcnMpIHtcbiAgICAgICAgICAgIHRoaXMucHVzaE1hcmtlclRvXyhtYXJrZXJzW21hcmtlcl0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmICghb3B0X25vZHJhdykge1xuICAgICAgICB0aGlzLnJlZHJhdygpO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBQdXNoZXMgYSBtYXJrZXIgdG8gdGhlIGNsdXN0ZXJlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gYWRkLlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5wdXNoTWFya2VyVG9fID0gZnVuY3Rpb24obWFya2VyKSB7XG4gICAgbWFya2VyLmlzQWRkZWQgPSBmYWxzZTtcbiAgICBpZiAobWFya2VyWydkcmFnZ2FibGUnXSkge1xuICAgICAgICAvLyBJZiB0aGUgbWFya2VyIGlzIGRyYWdnYWJsZSBhZGQgYSBsaXN0ZW5lciBzbyB3ZSB1cGRhdGUgdGhlIGNsdXN0ZXJzIG9uXG4gICAgICAgIC8vIHRoZSBkcmFnIGVuZC5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdkcmFnZW5kJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBtYXJrZXIuaXNBZGRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgdGhhdC5yZXBhaW50KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB0aGlzLm1hcmtlcnNfLnB1c2gobWFya2VyKTtcbn07XG5cblxuLyoqXG4gKiBBZGRzIGEgbWFya2VyIHRvIHRoZSBjbHVzdGVyZXIgYW5kIHJlZHJhd3MgaWYgbmVlZGVkLlxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuTWFya2VyfSBtYXJrZXIgVGhlIG1hcmtlciB0byBhZGQuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfbm9kcmF3IFdoZXRoZXIgdG8gcmVkcmF3IHRoZSBjbHVzdGVycy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5hZGRNYXJrZXIgPSBmdW5jdGlvbihtYXJrZXIsIG9wdF9ub2RyYXcpIHtcbiAgICB0aGlzLnB1c2hNYXJrZXJUb18obWFya2VyKTtcbiAgICBpZiAoIW9wdF9ub2RyYXcpIHtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhIG1hcmtlciBhbmQgcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdFxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuTWFya2VyfSBtYXJrZXIgVGhlIG1hcmtlciB0byByZW1vdmVcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFdoZXRoZXIgdGhlIG1hcmtlciB3YXMgcmVtb3ZlZCBvciBub3RcbiAqIEBwcml2YXRlXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVtb3ZlTWFya2VyXyA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgIHZhciBpbmRleCA9IC0xO1xuICAgIGlmICh0aGlzLm1hcmtlcnNfLmluZGV4T2YpIHtcbiAgICAgICAgaW5kZXggPSB0aGlzLm1hcmtlcnNfLmluZGV4T2YobWFya2VyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbTsgbSA9IHRoaXMubWFya2Vyc19baV07IGkrKykge1xuICAgICAgICAgICAgaWYgKG0gPT0gbWFya2VyKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgIC8vIE1hcmtlciBpcyBub3QgaW4gb3VyIGxpc3Qgb2YgbWFya2Vycy5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG5cbiAgICB0aGlzLm1hcmtlcnNfLnNwbGljZShpbmRleCwgMSk7XG5cbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBSZW1vdmUgYSBtYXJrZXIgZnJvbSB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gcmVtb3ZlLlxuICogQHBhcmFtIHtib29sZWFuPX0gb3B0X25vZHJhdyBPcHRpb25hbCBib29sZWFuIHRvIGZvcmNlIG5vIHJlZHJhdy5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG1hcmtlciB3YXMgcmVtb3ZlZC5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZW1vdmVNYXJrZXIgPSBmdW5jdGlvbihtYXJrZXIsIG9wdF9ub2RyYXcpIHtcbiAgICB2YXIgcmVtb3ZlZCA9IHRoaXMucmVtb3ZlTWFya2VyXyhtYXJrZXIpO1xuXG4gICAgaWYgKCFvcHRfbm9kcmF3ICYmIHJlbW92ZWQpIHtcbiAgICAgICAgdGhpcy5yZXNldFZpZXdwb3J0KCk7XG4gICAgICAgIHRoaXMucmVkcmF3KCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlcyBhbiBhcnJheSBvZiBtYXJrZXJzIGZyb20gdGhlIGNsdXN0ZXIuXG4gKlxuICogQHBhcmFtIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gbWFya2VycyBUaGUgbWFya2VycyB0byByZW1vdmUuXG4gKiBAcGFyYW0ge2Jvb2xlYW49fSBvcHRfbm9kcmF3IE9wdGlvbmFsIGJvb2xlYW4gdG8gZm9yY2Ugbm8gcmVkcmF3LlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnJlbW92ZU1hcmtlcnMgPSBmdW5jdGlvbihtYXJrZXJzLCBvcHRfbm9kcmF3KSB7XG4gICAgLy8gY3JlYXRlIGEgbG9jYWwgY29weSBvZiBtYXJrZXJzIGlmIHJlcXVpcmVkXG4gICAgLy8gKHJlbW92ZU1hcmtlcl8gbW9kaWZpZXMgdGhlIGdldE1hcmtlcnMoKSBhcnJheSBpbiBwbGFjZSlcbiAgICB2YXIgbWFya2Vyc0NvcHkgPSBtYXJrZXJzID09PSB0aGlzLmdldE1hcmtlcnMoKSA/IG1hcmtlcnMuc2xpY2UoKSA6IG1hcmtlcnM7XG4gICAgdmFyIHJlbW92ZWQgPSBmYWxzZTtcblxuICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IG1hcmtlciA9IG1hcmtlcnNDb3B5W2ldOyBpKyspIHtcbiAgICAgICAgdmFyIHIgPSB0aGlzLnJlbW92ZU1hcmtlcl8obWFya2VyKTtcbiAgICAgICAgcmVtb3ZlZCA9IHJlbW92ZWQgfHwgcjtcbiAgICB9XG5cbiAgICBpZiAoIW9wdF9ub2RyYXcgJiYgcmVtb3ZlZCkge1xuICAgICAgICB0aGlzLnJlc2V0Vmlld3BvcnQoKTtcbiAgICAgICAgdGhpcy5yZWRyYXcoKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIFNldHMgdGhlIGNsdXN0ZXJlcidzIHJlYWR5IHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gcmVhZHkgVGhlIHN0YXRlLlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5zZXRSZWFkeV8gPSBmdW5jdGlvbihyZWFkeSkge1xuICAgIGlmICghdGhpcy5yZWFkeV8pIHtcbiAgICAgICAgdGhpcy5yZWFkeV8gPSByZWFkeTtcbiAgICAgICAgdGhpcy5jcmVhdGVDbHVzdGVyc18oKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGNsdXN0ZXJzIGluIHRoZSBjbHVzdGVyZXIuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNsdXN0ZXJzLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldFRvdGFsQ2x1c3RlcnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5jbHVzdGVyc18ubGVuZ3RoO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIGdvb2dsZSBtYXAgdGhhdCB0aGUgY2x1c3RlcmVyIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBAcmV0dXJuIHtnb29nbGUubWFwcy5NYXB9IFRoZSBtYXAuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0TWFwID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwXztcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBnb29nbGUgbWFwIHRoYXQgdGhlIGNsdXN0ZXJlciBpcyBhc3NvY2lhdGVkIHdpdGguXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5NYXB9IG1hcCBUaGUgbWFwLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldE1hcCA9IGZ1bmN0aW9uKG1hcCkge1xuICAgIHRoaXMubWFwXyA9IG1hcDtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzaXplIG9mIHRoZSBncmlkLlxuICpcbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGdyaWQgc2l6ZS5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRHcmlkU2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmdyaWRTaXplXztcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBzaXplIG9mIHRoZSBncmlkLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIFRoZSBncmlkIHNpemUuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuc2V0R3JpZFNpemUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdGhpcy5ncmlkU2l6ZV8gPSBzaXplO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1pbiBjbHVzdGVyIHNpemUuXG4gKlxuICogQHJldHVybiB7bnVtYmVyfSBUaGUgZ3JpZCBzaXplLlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldE1pbkNsdXN0ZXJTaXplID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWluQ2x1c3RlclNpemVfO1xufTtcblxuLyoqXG4gKiBTZXRzIHRoZSBtaW4gY2x1c3RlciBzaXplLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBzaXplIFRoZSBncmlkIHNpemUuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuc2V0TWluQ2x1c3RlclNpemUgPSBmdW5jdGlvbihzaXplKSB7XG4gICAgdGhpcy5taW5DbHVzdGVyU2l6ZV8gPSBzaXplO1xufTtcblxuXG4vKipcbiAqIEV4dGVuZHMgYSBib3VuZHMgb2JqZWN0IGJ5IHRoZSBncmlkIHNpemUuXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmdCb3VuZHN9IGJvdW5kcyBUaGUgYm91bmRzIHRvIGV4dGVuZC5cbiAqIEByZXR1cm4ge2dvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc30gVGhlIGV4dGVuZGVkIGJvdW5kcy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRFeHRlbmRlZEJvdW5kcyA9IGZ1bmN0aW9uKGJvdW5kcykge1xuICAgIHZhciBwcm9qZWN0aW9uID0gdGhpcy5nZXRQcm9qZWN0aW9uKCk7XG5cbiAgICAvLyBUdXJuIHRoZSBib3VuZHMgaW50byBsYXRsbmcuXG4gICAgdmFyIHRyID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhib3VuZHMuZ2V0Tm9ydGhFYXN0KCkubGF0KCksXG4gICAgICAgIGJvdW5kcy5nZXROb3J0aEVhc3QoKS5sbmcoKSk7XG4gICAgdmFyIGJsID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhib3VuZHMuZ2V0U291dGhXZXN0KCkubGF0KCksXG4gICAgICAgIGJvdW5kcy5nZXRTb3V0aFdlc3QoKS5sbmcoKSk7XG5cbiAgICAvLyBDb252ZXJ0IHRoZSBwb2ludHMgdG8gcGl4ZWxzIGFuZCB0aGUgZXh0ZW5kIG91dCBieSB0aGUgZ3JpZCBzaXplLlxuICAgIHZhciB0clBpeCA9IHByb2plY3Rpb24uZnJvbUxhdExuZ1RvRGl2UGl4ZWwodHIpO1xuICAgIHRyUGl4LnggKz0gdGhpcy5ncmlkU2l6ZV87XG4gICAgdHJQaXgueSAtPSB0aGlzLmdyaWRTaXplXztcblxuICAgIHZhciBibFBpeCA9IHByb2plY3Rpb24uZnJvbUxhdExuZ1RvRGl2UGl4ZWwoYmwpO1xuICAgIGJsUGl4LnggLT0gdGhpcy5ncmlkU2l6ZV87XG4gICAgYmxQaXgueSArPSB0aGlzLmdyaWRTaXplXztcblxuICAgIC8vIENvbnZlcnQgdGhlIHBpeGVsIHBvaW50cyBiYWNrIHRvIExhdExuZ1xuICAgIHZhciBuZSA9IHByb2plY3Rpb24uZnJvbURpdlBpeGVsVG9MYXRMbmcodHJQaXgpO1xuICAgIHZhciBzdyA9IHByb2plY3Rpb24uZnJvbURpdlBpeGVsVG9MYXRMbmcoYmxQaXgpO1xuXG4gICAgLy8gRXh0ZW5kIHRoZSBib3VuZHMgdG8gY29udGFpbiB0aGUgbmV3IGJvdW5kcy5cbiAgICBib3VuZHMuZXh0ZW5kKG5lKTtcbiAgICBib3VuZHMuZXh0ZW5kKHN3KTtcblxuICAgIHJldHVybiBib3VuZHM7XG59O1xuXG5cbi8qKlxuICogRGV0ZXJtaW5zIGlmIGEgbWFya2VyIGlzIGNvbnRhaW5lZCBpbiBhIGJvdW5kcy5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gY2hlY2suXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLkxhdExuZ0JvdW5kc30gYm91bmRzIFRoZSBib3VuZHMgdG8gY2hlY2sgYWdhaW5zdC5cbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgdGhlIG1hcmtlciBpcyBpbiB0aGUgYm91bmRzLlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5pc01hcmtlckluQm91bmRzXyA9IGZ1bmN0aW9uKG1hcmtlciwgYm91bmRzKSB7XG4gICAgcmV0dXJuIGJvdW5kcy5jb250YWlucyhtYXJrZXIuZ2V0UG9zaXRpb24oKSk7XG59O1xuXG5cbi8qKlxuICogQ2xlYXJzIGFsbCBjbHVzdGVycyBhbmQgbWFya2VycyBmcm9tIHRoZSBjbHVzdGVyZXIuXG4gKi9cbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuY2xlYXJNYXJrZXJzID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5yZXNldFZpZXdwb3J0KHRydWUpO1xuXG4gICAgLy8gU2V0IHRoZSBtYXJrZXJzIGEgZW1wdHkgYXJyYXkuXG4gICAgdGhpcy5tYXJrZXJzXyA9IFtdO1xufTtcblxuXG4vKipcbiAqIENsZWFycyBhbGwgZXhpc3RpbmcgY2x1c3RlcnMgYW5kIHJlY3JlYXRlcyB0aGVtLlxuICogQHBhcmFtIHtib29sZWFufSBvcHRfaGlkZSBUbyBhbHNvIGhpZGUgdGhlIG1hcmtlci5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZXNldFZpZXdwb3J0ID0gZnVuY3Rpb24ob3B0X2hpZGUpIHtcbiAgICAvLyBSZW1vdmUgYWxsIHRoZSBjbHVzdGVyc1xuICAgIGZvciAodmFyIGkgPSAwLCBjbHVzdGVyOyBjbHVzdGVyID0gdGhpcy5jbHVzdGVyc19baV07IGkrKykge1xuICAgICAgICBjbHVzdGVyLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIC8vIFJlc2V0IHRoZSBtYXJrZXJzIHRvIG5vdCBiZSBhZGRlZCBhbmQgdG8gYmUgaW52aXNpYmxlLlxuICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IG1hcmtlciA9IHRoaXMubWFya2Vyc19baV07IGkrKykge1xuICAgICAgICBtYXJrZXIuaXNBZGRlZCA9IGZhbHNlO1xuICAgICAgICBpZiAob3B0X2hpZGUpIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRNYXAobnVsbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNsdXN0ZXJzXyA9IFtdO1xufTtcblxuLyoqXG4gKlxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnJlcGFpbnQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgb2xkQ2x1c3RlcnMgPSB0aGlzLmNsdXN0ZXJzXy5zbGljZSgpO1xuICAgIHRoaXMuY2x1c3RlcnNfLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5yZXNldFZpZXdwb3J0KCk7XG4gICAgdGhpcy5yZWRyYXcoKTtcblxuICAgIC8vIFJlbW92ZSB0aGUgb2xkIGNsdXN0ZXJzLlxuICAgIC8vIERvIGl0IGluIGEgdGltZW91dCBzbyB0aGUgb3RoZXIgY2x1c3RlcnMgaGF2ZSBiZWVuIGRyYXduIGZpcnN0LlxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgY2x1c3RlcjsgY2x1c3RlciA9IG9sZENsdXN0ZXJzW2ldOyBpKyspIHtcbiAgICAgICAgICAgIGNsdXN0ZXIucmVtb3ZlKCk7XG4gICAgICAgIH1cbiAgICB9LCAwKTtcbn07XG5cblxuLyoqXG4gKiBSZWRyYXdzIHRoZSBjbHVzdGVycy5cbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZWRyYXcgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmNyZWF0ZUNsdXN0ZXJzXygpO1xufTtcblxuXG4vKipcbiAqIENhbGN1bGF0ZXMgdGhlIGRpc3RhbmNlIGJldHdlZW4gdHdvIGxhdGxuZyBsb2NhdGlvbnMgaW4ga20uXG4gKiBAc2VlIGh0dHA6Ly93d3cubW92YWJsZS10eXBlLmNvLnVrL3NjcmlwdHMvbGF0bG9uZy5odG1sXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IHAxIFRoZSBmaXJzdCBsYXQgbG5nIHBvaW50LlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IHAyIFRoZSBzZWNvbmQgbGF0IGxuZyBwb2ludC5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIGRpc3RhbmNlIGJldHdlZW4gdGhlIHR3byBwb2ludHMgaW4ga20uXG4gKiBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmRpc3RhbmNlQmV0d2VlblBvaW50c18gPSBmdW5jdGlvbihwMSwgcDIpIHtcbiAgICBpZiAoIXAxIHx8ICFwMikge1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICB2YXIgUiA9IDYzNzE7IC8vIFJhZGl1cyBvZiB0aGUgRWFydGggaW4ga21cbiAgICB2YXIgZExhdCA9IChwMi5sYXQoKSAtIHAxLmxhdCgpKSAqIE1hdGguUEkgLyAxODA7XG4gICAgdmFyIGRMb24gPSAocDIubG5nKCkgLSBwMS5sbmcoKSkgKiBNYXRoLlBJIC8gMTgwO1xuICAgIHZhciBhID0gTWF0aC5zaW4oZExhdCAvIDIpICogTWF0aC5zaW4oZExhdCAvIDIpICtcbiAgICAgICAgTWF0aC5jb3MocDEubGF0KCkgKiBNYXRoLlBJIC8gMTgwKSAqIE1hdGguY29zKHAyLmxhdCgpICogTWF0aC5QSSAvIDE4MCkgKlxuICAgICAgICBNYXRoLnNpbihkTG9uIC8gMikgKiBNYXRoLnNpbihkTG9uIC8gMik7XG4gICAgdmFyIGMgPSAyICogTWF0aC5hdGFuMihNYXRoLnNxcnQoYSksIE1hdGguc3FydCgxIC0gYSkpO1xuICAgIHZhciBkID0gUiAqIGM7XG4gICAgcmV0dXJuIGQ7XG59O1xuXG5cbi8qKlxuICogQWRkIGEgbWFya2VyIHRvIGEgY2x1c3Rlciwgb3IgY3JlYXRlcyBhIG5ldyBjbHVzdGVyLlxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuTWFya2VyfSBtYXJrZXIgVGhlIG1hcmtlciB0byBhZGQuXG4gKiBAcHJpdmF0ZVxuICovXG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmFkZFRvQ2xvc2VzdENsdXN0ZXJfID0gZnVuY3Rpb24obWFya2VyKSB7XG4gICAgdmFyIGRpc3RhbmNlID0gNDAwMDA7IC8vIFNvbWUgbGFyZ2UgbnVtYmVyXG4gICAgdmFyIGNsdXN0ZXJUb0FkZFRvID0gbnVsbDtcbiAgICB2YXIgcG9zID0gbWFya2VyLmdldFBvc2l0aW9uKCk7XG4gICAgZm9yICh2YXIgaSA9IDAsIGNsdXN0ZXI7IGNsdXN0ZXIgPSB0aGlzLmNsdXN0ZXJzX1tpXTsgaSsrKSB7XG4gICAgICAgIHZhciBjZW50ZXIgPSBjbHVzdGVyLmdldENlbnRlcigpO1xuICAgICAgICBpZiAoY2VudGVyKSB7XG4gICAgICAgICAgICB2YXIgZCA9IHRoaXMuZGlzdGFuY2VCZXR3ZWVuUG9pbnRzXyhjZW50ZXIsIG1hcmtlci5nZXRQb3NpdGlvbigpKTtcbiAgICAgICAgICAgIGlmIChkIDwgZGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZSA9IGQ7XG4gICAgICAgICAgICAgICAgY2x1c3RlclRvQWRkVG8gPSBjbHVzdGVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGNsdXN0ZXJUb0FkZFRvICYmIGNsdXN0ZXJUb0FkZFRvLmlzTWFya2VySW5DbHVzdGVyQm91bmRzKG1hcmtlcikpIHtcbiAgICAgICAgY2x1c3RlclRvQWRkVG8uYWRkTWFya2VyKG1hcmtlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNsdXN0ZXIgPSBuZXcgQ2x1c3Rlcih0aGlzKTtcbiAgICAgICAgY2x1c3Rlci5hZGRNYXJrZXIobWFya2VyKTtcbiAgICAgICAgdGhpcy5jbHVzdGVyc18ucHVzaChjbHVzdGVyKTtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyB0aGUgY2x1c3RlcnMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5jcmVhdGVDbHVzdGVyc18gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXRoaXMucmVhZHlfKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBHZXQgb3VyIGN1cnJlbnQgbWFwIHZpZXcgYm91bmRzLlxuICAgIC8vIENyZWF0ZSBhIG5ldyBib3VuZHMgb2JqZWN0IHNvIHdlIGRvbid0IGFmZmVjdCB0aGUgbWFwLlxuICAgIHZhciBtYXBCb3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKHRoaXMubWFwXy5nZXRCb3VuZHMoKS5nZXRTb3V0aFdlc3QoKSxcbiAgICAgICAgdGhpcy5tYXBfLmdldEJvdW5kcygpLmdldE5vcnRoRWFzdCgpKTtcbiAgICB2YXIgYm91bmRzID0gdGhpcy5nZXRFeHRlbmRlZEJvdW5kcyhtYXBCb3VuZHMpO1xuXG4gICAgZm9yICh2YXIgaSA9IDAsIG1hcmtlcjsgbWFya2VyID0gdGhpcy5tYXJrZXJzX1tpXTsgaSsrKSB7XG4gICAgICAgIGlmICghbWFya2VyLmlzQWRkZWQgJiYgdGhpcy5pc01hcmtlckluQm91bmRzXyhtYXJrZXIsIGJvdW5kcykpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkVG9DbG9zZXN0Q2x1c3Rlcl8obWFya2VyKTtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblxuLyoqXG4gKiBBIGNsdXN0ZXIgdGhhdCBjb250YWlucyBtYXJrZXJzLlxuICpcbiAqIEBwYXJhbSB7TWFya2VyQ2x1c3RlcmVyfSBtYXJrZXJDbHVzdGVyZXIgVGhlIG1hcmtlcmNsdXN0ZXJlciB0aGF0IHRoaXNcbiAqICAgICBjbHVzdGVyIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGlnbm9yZVxuICovXG5mdW5jdGlvbiBDbHVzdGVyKG1hcmtlckNsdXN0ZXJlcikge1xuICAgIHRoaXMubWFya2VyQ2x1c3RlcmVyXyA9IG1hcmtlckNsdXN0ZXJlcjtcbiAgICB0aGlzLm1hcF8gPSBtYXJrZXJDbHVzdGVyZXIuZ2V0TWFwKCk7XG4gICAgdGhpcy5ncmlkU2l6ZV8gPSBtYXJrZXJDbHVzdGVyZXIuZ2V0R3JpZFNpemUoKTtcbiAgICB0aGlzLm1pbkNsdXN0ZXJTaXplXyA9IG1hcmtlckNsdXN0ZXJlci5nZXRNaW5DbHVzdGVyU2l6ZSgpO1xuICAgIHRoaXMuYXZlcmFnZUNlbnRlcl8gPSBtYXJrZXJDbHVzdGVyZXIuaXNBdmVyYWdlQ2VudGVyKCk7XG4gICAgdGhpcy5jZW50ZXJfID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlcnNfID0gW107XG4gICAgdGhpcy5ib3VuZHNfID0gbnVsbDtcbiAgICB0aGlzLmNsdXN0ZXJJY29uXyA9IG5ldyBDbHVzdGVySWNvbih0aGlzLCBtYXJrZXJDbHVzdGVyZXIuZ2V0U3R5bGVzKCksXG4gICAgICAgIG1hcmtlckNsdXN0ZXJlci5nZXRHcmlkU2l6ZSgpKTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbnMgaWYgYSBtYXJrZXIgaXMgYWxyZWFkeSBhZGRlZCB0byB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBtYXJrZXIgaXMgYWxyZWFkeSBhZGRlZC5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuaXNNYXJrZXJBbHJlYWR5QWRkZWQgPSBmdW5jdGlvbihtYXJrZXIpIHtcbiAgICBpZiAodGhpcy5tYXJrZXJzXy5pbmRleE9mKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1hcmtlcnNfLmluZGV4T2YobWFya2VyKSAhPSAtMTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbTsgbSA9IHRoaXMubWFya2Vyc19baV07IGkrKykge1xuICAgICAgICAgICAgaWYgKG0gPT0gbWFya2VyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblxuXG4vKipcbiAqIEFkZCBhIG1hcmtlciB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gYWRkLlxuICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgbWFya2VyIHdhcyBhZGRlZC5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuYWRkTWFya2VyID0gZnVuY3Rpb24obWFya2VyKSB7XG4gICAgaWYgKHRoaXMuaXNNYXJrZXJBbHJlYWR5QWRkZWQobWFya2VyKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmNlbnRlcl8pIHtcbiAgICAgICAgdGhpcy5jZW50ZXJfID0gbWFya2VyLmdldFBvc2l0aW9uKCk7XG4gICAgICAgIHRoaXMuY2FsY3VsYXRlQm91bmRzXygpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICh0aGlzLmF2ZXJhZ2VDZW50ZXJfKSB7XG4gICAgICAgICAgICB2YXIgbCA9IHRoaXMubWFya2Vyc18ubGVuZ3RoICsgMTtcbiAgICAgICAgICAgIHZhciBsYXQgPSAodGhpcy5jZW50ZXJfLmxhdCgpICogKGwtMSkgKyBtYXJrZXIuZ2V0UG9zaXRpb24oKS5sYXQoKSkgLyBsO1xuICAgICAgICAgICAgdmFyIGxuZyA9ICh0aGlzLmNlbnRlcl8ubG5nKCkgKiAobC0xKSArIG1hcmtlci5nZXRQb3NpdGlvbigpLmxuZygpKSAvIGw7XG4gICAgICAgICAgICB0aGlzLmNlbnRlcl8gPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxhdCwgbG5nKTtcbiAgICAgICAgICAgIHRoaXMuY2FsY3VsYXRlQm91bmRzXygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbWFya2VyLmlzQWRkZWQgPSB0cnVlO1xuICAgIHRoaXMubWFya2Vyc18ucHVzaChtYXJrZXIpO1xuXG4gICAgdmFyIGxlbiA9IHRoaXMubWFya2Vyc18ubGVuZ3RoO1xuICAgIGlmIChsZW4gPCB0aGlzLm1pbkNsdXN0ZXJTaXplXyAmJiBtYXJrZXIuZ2V0TWFwKCkgIT0gdGhpcy5tYXBfKSB7XG4gICAgICAgIC8vIE1pbiBjbHVzdGVyIHNpemUgbm90IHJlYWNoZWQgc28gc2hvdyB0aGUgbWFya2VyLlxuICAgICAgICBtYXJrZXIuc2V0TWFwKHRoaXMubWFwXyk7XG4gICAgfVxuXG4gICAgaWYgKGxlbiA9PSB0aGlzLm1pbkNsdXN0ZXJTaXplXykge1xuICAgICAgICAvLyBIaWRlIHRoZSBtYXJrZXJzIHRoYXQgd2VyZSBzaG93aW5nLlxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLm1hcmtlcnNfW2ldLnNldE1hcChudWxsKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChsZW4gPj0gdGhpcy5taW5DbHVzdGVyU2l6ZV8pIHtcbiAgICAgICAgbWFya2VyLnNldE1hcChudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICByZXR1cm4gdHJ1ZTtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBtYXJrZXIgY2x1c3RlcmVyIHRoYXQgdGhlIGNsdXN0ZXIgaXMgYXNzb2NpYXRlZCB3aXRoLlxuICpcbiAqIEByZXR1cm4ge01hcmtlckNsdXN0ZXJlcn0gVGhlIGFzc29jaWF0ZWQgbWFya2VyIGNsdXN0ZXJlci5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuZ2V0TWFya2VyQ2x1c3RlcmVyID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMubWFya2VyQ2x1c3RlcmVyXztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBib3VuZHMgb2YgdGhlIGNsdXN0ZXIuXG4gKlxuICogQHJldHVybiB7Z29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzfSB0aGUgY2x1c3RlciBib3VuZHMuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldEJvdW5kcyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKHRoaXMuY2VudGVyXywgdGhpcy5jZW50ZXJfKTtcbiAgICB2YXIgbWFya2VycyA9IHRoaXMuZ2V0TWFya2VycygpO1xuICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IG1hcmtlciA9IG1hcmtlcnNbaV07IGkrKykge1xuICAgICAgICBib3VuZHMuZXh0ZW5kKG1hcmtlci5nZXRQb3NpdGlvbigpKTtcbiAgICB9XG4gICAgcmV0dXJuIGJvdW5kcztcbn07XG5cblxuLyoqXG4gKiBSZW1vdmVzIHRoZSBjbHVzdGVyXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuY2x1c3Rlckljb25fLnJlbW92ZSgpO1xuICAgIHRoaXMubWFya2Vyc18ubGVuZ3RoID0gMDtcbiAgICBkZWxldGUgdGhpcy5tYXJrZXJzXztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcmV0dXJuIHtudW1iZXJ9IFRoZSBudW1iZXIgb2YgbWFya2VycyBpbiB0aGUgY2x1c3Rlci5cbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuZ2V0U2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcmtlcnNfLmxlbmd0aDtcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIGEgbGlzdCBvZiB0aGUgbWFya2VycyBpbiB0aGUgY2x1c3Rlci5cbiAqXG4gKiBAcmV0dXJuIHtBcnJheS48Z29vZ2xlLm1hcHMuTWFya2VyPn0gVGhlIG1hcmtlcnMgaW4gdGhlIGNsdXN0ZXIuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldE1hcmtlcnMgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5tYXJrZXJzXztcbn07XG5cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBjZW50ZXIgb2YgdGhlIGNsdXN0ZXIuXG4gKlxuICogQHJldHVybiB7Z29vZ2xlLm1hcHMuTGF0TG5nfSBUaGUgY2x1c3RlciBjZW50ZXIuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldENlbnRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLmNlbnRlcl87XG59O1xuXG5cbi8qKlxuICogQ2FsY3VsYXRlZCB0aGUgZXh0ZW5kZWQgYm91bmRzIG9mIHRoZSBjbHVzdGVyIHdpdGggdGhlIGdyaWQuXG4gKlxuICogQHByaXZhdGVcbiAqL1xuQ2x1c3Rlci5wcm90b3R5cGUuY2FsY3VsYXRlQm91bmRzXyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBib3VuZHMgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nQm91bmRzKHRoaXMuY2VudGVyXywgdGhpcy5jZW50ZXJfKTtcbiAgICB0aGlzLmJvdW5kc18gPSB0aGlzLm1hcmtlckNsdXN0ZXJlcl8uZ2V0RXh0ZW5kZWRCb3VuZHMoYm91bmRzKTtcbn07XG5cblxuLyoqXG4gKiBEZXRlcm1pbmVzIGlmIGEgbWFya2VyIGxpZXMgaW4gdGhlIGNsdXN0ZXJzIGJvdW5kcy5cbiAqXG4gKiBAcGFyYW0ge2dvb2dsZS5tYXBzLk1hcmtlcn0gbWFya2VyIFRoZSBtYXJrZXIgdG8gY2hlY2suXG4gKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIHRoZSBtYXJrZXIgbGllcyBpbiB0aGUgYm91bmRzLlxuICovXG5DbHVzdGVyLnByb3RvdHlwZS5pc01hcmtlckluQ2x1c3RlckJvdW5kcyA9IGZ1bmN0aW9uKG1hcmtlcikge1xuICAgIHJldHVybiB0aGlzLmJvdW5kc18uY29udGFpbnMobWFya2VyLmdldFBvc2l0aW9uKCkpO1xufTtcblxuXG4vKipcbiAqIFJldHVybnMgdGhlIG1hcCB0aGF0IHRoZSBjbHVzdGVyIGlzIGFzc29jaWF0ZWQgd2l0aC5cbiAqXG4gKiBAcmV0dXJuIHtnb29nbGUubWFwcy5NYXB9IFRoZSBtYXAuXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLmdldE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLm1hcF87XG59O1xuXG5cbi8qKlxuICogVXBkYXRlcyB0aGUgY2x1c3RlciBpY29uXG4gKi9cbkNsdXN0ZXIucHJvdG90eXBlLnVwZGF0ZUljb24gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgem9vbSA9IHRoaXMubWFwXy5nZXRab29tKCk7XG4gICAgdmFyIG16ID0gdGhpcy5tYXJrZXJDbHVzdGVyZXJfLmdldE1heFpvb20oKTtcblxuICAgIGlmIChteiAmJiB6b29tID4gbXopIHtcbiAgICAgICAgLy8gVGhlIHpvb20gaXMgZ3JlYXRlciB0aGFuIG91ciBtYXggem9vbSBzbyBzaG93IGFsbCB0aGUgbWFya2VycyBpbiBjbHVzdGVyLlxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbWFya2VyOyBtYXJrZXIgPSB0aGlzLm1hcmtlcnNfW2ldOyBpKyspIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRNYXAodGhpcy5tYXBfKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWFya2Vyc18ubGVuZ3RoIDwgdGhpcy5taW5DbHVzdGVyU2l6ZV8pIHtcbiAgICAgICAgLy8gTWluIGNsdXN0ZXIgc2l6ZSBub3QgeWV0IHJlYWNoZWQuXG4gICAgICAgIHRoaXMuY2x1c3Rlckljb25fLmhpZGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciBudW1TdHlsZXMgPSB0aGlzLm1hcmtlckNsdXN0ZXJlcl8uZ2V0U3R5bGVzKCkubGVuZ3RoO1xuICAgIHZhciBzdW1zID0gdGhpcy5tYXJrZXJDbHVzdGVyZXJfLmdldENhbGN1bGF0b3IoKSh0aGlzLm1hcmtlcnNfLCBudW1TdHlsZXMpO1xuICAgIHRoaXMuY2x1c3Rlckljb25fLnNldENlbnRlcih0aGlzLmNlbnRlcl8pO1xuICAgIHRoaXMuY2x1c3Rlckljb25fLnNldFN1bXMoc3Vtcyk7XG4gICAgdGhpcy5jbHVzdGVySWNvbl8uc2hvdygpO1xufTtcblxuXG4vKipcbiAqIEEgY2x1c3RlciBpY29uXG4gKlxuICogQHBhcmFtIHtDbHVzdGVyfSBjbHVzdGVyIFRoZSBjbHVzdGVyIHRvIGJlIGFzc29jaWF0ZWQgd2l0aC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzdHlsZXMgQW4gb2JqZWN0IHRoYXQgaGFzIHN0eWxlIHByb3BlcnRpZXM6XG4gKiAgICAgJ3VybCc6IChzdHJpbmcpIFRoZSBpbWFnZSB1cmwuXG4gKiAgICAgJ2hlaWdodCc6IChudW1iZXIpIFRoZSBpbWFnZSBoZWlnaHQuXG4gKiAgICAgJ3dpZHRoJzogKG51bWJlcikgVGhlIGltYWdlIHdpZHRoLlxuICogICAgICdhbmNob3InOiAoQXJyYXkpIFRoZSBhbmNob3IgcG9zaXRpb24gb2YgdGhlIGxhYmVsIHRleHQuXG4gKiAgICAgJ3RleHRDb2xvcic6IChzdHJpbmcpIFRoZSB0ZXh0IGNvbG9yLlxuICogICAgICd0ZXh0U2l6ZSc6IChudW1iZXIpIFRoZSB0ZXh0IHNpemUuXG4gKiAgICAgJ2JhY2tncm91bmRQb3NpdGlvbjogKHN0cmluZykgVGhlIGJhY2tncm91bmQgcG9zdGl0aW9uIHgsIHkuXG4gKiBAcGFyYW0ge251bWJlcj19IG9wdF9wYWRkaW5nIE9wdGlvbmFsIHBhZGRpbmcgdG8gYXBwbHkgdG8gdGhlIGNsdXN0ZXIgaWNvbi5cbiAqIEBjb25zdHJ1Y3RvclxuICogQGV4dGVuZHMgZ29vZ2xlLm1hcHMuT3ZlcmxheVZpZXdcbiAqIEBpZ25vcmVcbiAqL1xuZnVuY3Rpb24gQ2x1c3Rlckljb24oY2x1c3Rlciwgc3R5bGVzLCBvcHRfcGFkZGluZykge1xuICAgIGNsdXN0ZXIuZ2V0TWFya2VyQ2x1c3RlcmVyKCkuZXh0ZW5kKENsdXN0ZXJJY29uLCBnb29nbGUubWFwcy5PdmVybGF5Vmlldyk7XG5cbiAgICB0aGlzLnN0eWxlc18gPSBzdHlsZXM7XG4gICAgdGhpcy5wYWRkaW5nXyA9IG9wdF9wYWRkaW5nIHx8IDA7XG4gICAgdGhpcy5jbHVzdGVyXyA9IGNsdXN0ZXI7XG4gICAgdGhpcy5jZW50ZXJfID0gbnVsbDtcbiAgICB0aGlzLm1hcF8gPSBjbHVzdGVyLmdldE1hcCgpO1xuICAgIHRoaXMuZGl2XyA9IG51bGw7XG4gICAgdGhpcy5zdW1zXyA9IG51bGw7XG4gICAgdGhpcy52aXNpYmxlXyA9IGZhbHNlO1xuXG4gICAgdGhpcy5zZXRNYXAodGhpcy5tYXBfKTtcbn1cblxuXG4vKipcbiAqIFRyaWdnZXJzIHRoZSBjbHVzdGVyY2xpY2sgZXZlbnQgYW5kIHpvb20ncyBpZiB0aGUgb3B0aW9uIGlzIHNldC5cbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLnRyaWdnZXJDbHVzdGVyQ2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgbWFya2VyQ2x1c3RlcmVyID0gdGhpcy5jbHVzdGVyXy5nZXRNYXJrZXJDbHVzdGVyZXIoKTtcblxuICAgIC8vIFRyaWdnZXIgdGhlIGNsdXN0ZXJjbGljayBldmVudC5cbiAgICBnb29nbGUubWFwcy5ldmVudC50cmlnZ2VyKG1hcmtlckNsdXN0ZXJlci5tYXBfLCAnY2x1c3RlcmNsaWNrJywgdGhpcy5jbHVzdGVyXyk7XG5cbiAgICBpZiAobWFya2VyQ2x1c3RlcmVyLmlzWm9vbU9uQ2xpY2soKSkge1xuICAgICAgICAvLyBab29tIGludG8gdGhlIGNsdXN0ZXIuXG4gICAgICAgIHRoaXMubWFwXy5maXRCb3VuZHModGhpcy5jbHVzdGVyXy5nZXRCb3VuZHMoKSk7XG4gICAgfVxufTtcblxuXG4vKipcbiAqIEFkZGluZyB0aGUgY2x1c3RlciBpY29uIHRvIHRoZSBkb20uXG4gKiBAaWdub3JlXG4gKi9cbkNsdXN0ZXJJY29uLnByb3RvdHlwZS5vbkFkZCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuZGl2XyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ0RJVicpO1xuICAgIGlmICh0aGlzLnZpc2libGVfKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc0Zyb21MYXRMbmdfKHRoaXMuY2VudGVyXyk7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS5jc3NUZXh0ID0gdGhpcy5jcmVhdGVDc3MocG9zKTtcbiAgICAgICAgdGhpcy5kaXZfLmlubmVySFRNTCA9IHRoaXMuc3Vtc18udGV4dDtcbiAgICB9XG5cbiAgICB2YXIgcGFuZXMgPSB0aGlzLmdldFBhbmVzKCk7XG4gICAgcGFuZXMub3ZlcmxheU1vdXNlVGFyZ2V0LmFwcGVuZENoaWxkKHRoaXMuZGl2Xyk7XG5cbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIodGhpcy5kaXZfLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhhdC50cmlnZ2VyQ2x1c3RlckNsaWNrKCk7XG4gICAgfSk7XG59O1xuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgcG9zaXRpb24gdG8gcGxhY2UgdGhlIGRpdiBkZW5kaW5nIG9uIHRoZSBsYXRsbmcuXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IGxhdGxuZyBUaGUgcG9zaXRpb24gaW4gbGF0bG5nLlxuICogQHJldHVybiB7Z29vZ2xlLm1hcHMuUG9pbnR9IFRoZSBwb3NpdGlvbiBpbiBwaXhlbHMuXG4gKiBAcHJpdmF0ZVxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuZ2V0UG9zRnJvbUxhdExuZ18gPSBmdW5jdGlvbihsYXRsbmcpIHtcbiAgICB2YXIgcG9zID0gdGhpcy5nZXRQcm9qZWN0aW9uKCkuZnJvbUxhdExuZ1RvRGl2UGl4ZWwobGF0bG5nKTtcbiAgICBwb3MueCAtPSBwYXJzZUludCh0aGlzLndpZHRoXyAvIDIsIDEwKTtcbiAgICBwb3MueSAtPSBwYXJzZUludCh0aGlzLmhlaWdodF8gLyAyLCAxMCk7XG4gICAgcmV0dXJuIHBvcztcbn07XG5cblxuLyoqXG4gKiBEcmF3IHRoZSBpY29uLlxuICogQGlnbm9yZVxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLnZpc2libGVfKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc0Zyb21MYXRMbmdfKHRoaXMuY2VudGVyXyk7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS50b3AgPSBwb3MueSArICdweCc7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS5sZWZ0ID0gcG9zLnggKyAncHgnO1xuICAgIH1cbn07XG5cblxuLyoqXG4gKiBIaWRlIHRoZSBpY29uLlxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzLmRpdl8pIHtcbiAgICAgICAgdGhpcy5kaXZfLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgfVxuICAgIHRoaXMudmlzaWJsZV8gPSBmYWxzZTtcbn07XG5cblxuLyoqXG4gKiBQb3NpdGlvbiBhbmQgc2hvdyB0aGUgaWNvbi5cbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcy5kaXZfKSB7XG4gICAgICAgIHZhciBwb3MgPSB0aGlzLmdldFBvc0Zyb21MYXRMbmdfKHRoaXMuY2VudGVyXyk7XG4gICAgICAgIHRoaXMuZGl2Xy5zdHlsZS5jc3NUZXh0ID0gdGhpcy5jcmVhdGVDc3MocG9zKTtcbiAgICAgICAgdGhpcy5kaXZfLnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgICB9XG4gICAgdGhpcy52aXNpYmxlXyA9IHRydWU7XG59O1xuXG5cbi8qKlxuICogUmVtb3ZlIHRoZSBpY29uIGZyb20gdGhlIG1hcFxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5zZXRNYXAobnVsbCk7XG59O1xuXG5cbi8qKlxuICogSW1wbGVtZW50YXRpb24gb2YgdGhlIG9uUmVtb3ZlIGludGVyZmFjZS5cbiAqIEBpZ25vcmVcbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLm9uUmVtb3ZlID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKHRoaXMuZGl2XyAmJiB0aGlzLmRpdl8ucGFyZW50Tm9kZSkge1xuICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgdGhpcy5kaXZfLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQodGhpcy5kaXZfKTtcbiAgICAgICAgdGhpcy5kaXZfID0gbnVsbDtcbiAgICB9XG59O1xuXG5cbi8qKlxuICogU2V0IHRoZSBzdW1zIG9mIHRoZSBpY29uLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBzdW1zIFRoZSBzdW1zIGNvbnRhaW5pbmc6XG4gKiAgICd0ZXh0JzogKHN0cmluZykgVGhlIHRleHQgdG8gZGlzcGxheSBpbiB0aGUgaWNvbi5cbiAqICAgJ2luZGV4JzogKG51bWJlcikgVGhlIHN0eWxlIGluZGV4IG9mIHRoZSBpY29uLlxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuc2V0U3VtcyA9IGZ1bmN0aW9uKHN1bXMpIHtcbiAgICB0aGlzLnN1bXNfID0gc3VtcztcbiAgICB0aGlzLnRleHRfID0gc3Vtcy50ZXh0O1xuICAgIHRoaXMuaW5kZXhfID0gc3Vtcy5pbmRleDtcbiAgICBpZiAodGhpcy5kaXZfKSB7XG4gICAgICAgIHRoaXMuZGl2Xy5pbm5lckhUTUwgPSBzdW1zLnRleHQ7XG4gICAgfVxuXG4gICAgdGhpcy51c2VTdHlsZSgpO1xufTtcblxuXG4vKipcbiAqIFNldHMgdGhlIGljb24gdG8gdGhlIHRoZSBzdHlsZXMuXG4gKi9cbkNsdXN0ZXJJY29uLnByb3RvdHlwZS51c2VTdHlsZSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpbmRleCA9IE1hdGgubWF4KDAsIHRoaXMuc3Vtc18uaW5kZXggLSAxKTtcbiAgICBpbmRleCA9IE1hdGgubWluKHRoaXMuc3R5bGVzXy5sZW5ndGggLSAxLCBpbmRleCk7XG4gICAgdmFyIHN0eWxlID0gdGhpcy5zdHlsZXNfW2luZGV4XTtcbiAgICB0aGlzLnVybF8gPSBzdHlsZVsndXJsJ107XG4gICAgdGhpcy5oZWlnaHRfID0gc3R5bGVbJ2hlaWdodCddO1xuICAgIHRoaXMud2lkdGhfID0gc3R5bGVbJ3dpZHRoJ107XG4gICAgdGhpcy50ZXh0Q29sb3JfID0gc3R5bGVbJ3RleHRDb2xvciddO1xuICAgIHRoaXMuYW5jaG9yXyA9IHN0eWxlWydhbmNob3InXTtcbiAgICB0aGlzLnRleHRTaXplXyA9IHN0eWxlWyd0ZXh0U2l6ZSddO1xuICAgIHRoaXMuYmFja2dyb3VuZFBvc2l0aW9uXyA9IHN0eWxlWydiYWNrZ3JvdW5kUG9zaXRpb24nXTtcbn07XG5cblxuLyoqXG4gKiBTZXRzIHRoZSBjZW50ZXIgb2YgdGhlIGljb24uXG4gKlxuICogQHBhcmFtIHtnb29nbGUubWFwcy5MYXRMbmd9IGNlbnRlciBUaGUgbGF0bG5nIHRvIHNldCBhcyB0aGUgY2VudGVyLlxuICovXG5DbHVzdGVySWNvbi5wcm90b3R5cGUuc2V0Q2VudGVyID0gZnVuY3Rpb24oY2VudGVyKSB7XG4gICAgdGhpcy5jZW50ZXJfID0gY2VudGVyO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZSB0aGUgY3NzIHRleHQgYmFzZWQgb24gdGhlIHBvc2l0aW9uIG9mIHRoZSBpY29uLlxuICpcbiAqIEBwYXJhbSB7Z29vZ2xlLm1hcHMuUG9pbnR9IHBvcyBUaGUgcG9zaXRpb24uXG4gKiBAcmV0dXJuIHtzdHJpbmd9IFRoZSBjc3Mgc3R5bGUgdGV4dC5cbiAqL1xuQ2x1c3Rlckljb24ucHJvdG90eXBlLmNyZWF0ZUNzcyA9IGZ1bmN0aW9uKHBvcykge1xuICAgIHZhciBzdHlsZSA9IFtdO1xuICAgIHN0eWxlLnB1c2goJ2JhY2tncm91bmQtaW1hZ2U6dXJsKCcgKyB0aGlzLnVybF8gKyAnKTsnKTtcbiAgICB2YXIgYmFja2dyb3VuZFBvc2l0aW9uID0gdGhpcy5iYWNrZ3JvdW5kUG9zaXRpb25fID8gdGhpcy5iYWNrZ3JvdW5kUG9zaXRpb25fIDogJzAgMCc7XG4gICAgc3R5bGUucHVzaCgnYmFja2dyb3VuZC1wb3NpdGlvbjonICsgYmFja2dyb3VuZFBvc2l0aW9uICsgJzsnKTtcblxuICAgIGlmICh0eXBlb2YgdGhpcy5hbmNob3JfID09PSAnb2JqZWN0Jykge1xuICAgICAgICBpZiAodHlwZW9mIHRoaXMuYW5jaG9yX1swXSA9PT0gJ251bWJlcicgJiYgdGhpcy5hbmNob3JfWzBdID4gMCAmJlxuICAgICAgICAgICAgdGhpcy5hbmNob3JfWzBdIDwgdGhpcy5oZWlnaHRfKSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKCdoZWlnaHQ6JyArICh0aGlzLmhlaWdodF8gLSB0aGlzLmFuY2hvcl9bMF0pICtcbiAgICAgICAgICAgICAgICAncHg7IHBhZGRpbmctdG9wOicgKyB0aGlzLmFuY2hvcl9bMF0gKyAncHg7Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKCdoZWlnaHQ6JyArIHRoaXMuaGVpZ2h0XyArICdweDsgbGluZS1oZWlnaHQ6JyArIHRoaXMuaGVpZ2h0XyArXG4gICAgICAgICAgICAgICAgJ3B4OycpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5hbmNob3JfWzFdID09PSAnbnVtYmVyJyAmJiB0aGlzLmFuY2hvcl9bMV0gPiAwICYmXG4gICAgICAgICAgICB0aGlzLmFuY2hvcl9bMV0gPCB0aGlzLndpZHRoXykge1xuICAgICAgICAgICAgc3R5bGUucHVzaCgnd2lkdGg6JyArICh0aGlzLndpZHRoXyAtIHRoaXMuYW5jaG9yX1sxXSkgK1xuICAgICAgICAgICAgICAgICdweDsgcGFkZGluZy1sZWZ0OicgKyB0aGlzLmFuY2hvcl9bMV0gKyAncHg7Jyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZS5wdXNoKCd3aWR0aDonICsgdGhpcy53aWR0aF8gKyAncHg7IHRleHQtYWxpZ246Y2VudGVyOycpO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgc3R5bGUucHVzaCgnaGVpZ2h0OicgKyB0aGlzLmhlaWdodF8gKyAncHg7IGxpbmUtaGVpZ2h0OicgK1xuICAgICAgICAgICAgdGhpcy5oZWlnaHRfICsgJ3B4OyB3aWR0aDonICsgdGhpcy53aWR0aF8gKyAncHg7IHRleHQtYWxpZ246Y2VudGVyOycpO1xuICAgIH1cblxuICAgIHZhciB0eHRDb2xvciA9IHRoaXMudGV4dENvbG9yXyA/IHRoaXMudGV4dENvbG9yXyA6ICdibGFjayc7XG4gICAgdmFyIHR4dFNpemUgPSB0aGlzLnRleHRTaXplXyA/IHRoaXMudGV4dFNpemVfIDogMTE7XG5cbiAgICBzdHlsZS5wdXNoKCdjdXJzb3I6cG9pbnRlcjsgdG9wOicgKyBwb3MueSArICdweDsgbGVmdDonICtcbiAgICAgICAgcG9zLnggKyAncHg7IGNvbG9yOicgKyB0eHRDb2xvciArICc7IHBvc2l0aW9uOmFic29sdXRlOyBmb250LXNpemU6JyArXG4gICAgICAgIHR4dFNpemUgKyAncHg7IGZvbnQtZmFtaWx5OkFyaWFsLHNhbnMtc2VyaWY7IGZvbnQtd2VpZ2h0OmJvbGQnKTtcbiAgICByZXR1cm4gc3R5bGUuam9pbignJyk7XG59O1xuXG5cbi8vIEV4cG9ydCBTeW1ib2xzIGZvciBDbG9zdXJlXG4vLyBJZiB5b3UgYXJlIG5vdCBnb2luZyB0byBjb21waWxlIHdpdGggY2xvc3VyZSB0aGVuIHlvdSBjYW4gcmVtb3ZlIHRoZVxuLy8gY29kZSBiZWxvdy5cbndpbmRvd1snTWFya2VyQ2x1c3RlcmVyJ10gPSBNYXJrZXJDbHVzdGVyZXI7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydhZGRNYXJrZXInXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuYWRkTWFya2VyO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnYWRkTWFya2VycyddID0gTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5hZGRNYXJrZXJzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnY2xlYXJNYXJrZXJzJ10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuY2xlYXJNYXJrZXJzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZml0TWFwVG9NYXJrZXJzJ10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZml0TWFwVG9NYXJrZXJzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZ2V0Q2FsY3VsYXRvciddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldENhbGN1bGF0b3I7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRHcmlkU2l6ZSddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldEdyaWRTaXplO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZ2V0RXh0ZW5kZWRCb3VuZHMnXSA9XG4gICAgTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRFeHRlbmRlZEJvdW5kcztcbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGVbJ2dldE1hcCddID0gTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRNYXA7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRNYXJrZXJzJ10gPSBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldE1hcmtlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRNYXhab29tJ10gPSBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldE1heFpvb207XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRTdHlsZXMnXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZ2V0U3R5bGVzO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnZ2V0VG90YWxDbHVzdGVycyddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLmdldFRvdGFsQ2x1c3RlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydnZXRUb3RhbE1hcmtlcnMnXSA9XG4gICAgTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5nZXRUb3RhbE1hcmtlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydyZWRyYXcnXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVkcmF3O1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsncmVtb3ZlTWFya2VyJ10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVtb3ZlTWFya2VyO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsncmVtb3ZlTWFya2VycyddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnJlbW92ZU1hcmtlcnM7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydyZXNldFZpZXdwb3J0J10gPVxuICAgIE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUucmVzZXRWaWV3cG9ydDtcbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGVbJ3JlcGFpbnQnXSA9XG4gICAgTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5yZXBhaW50O1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnc2V0Q2FsY3VsYXRvciddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldENhbGN1bGF0b3I7XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydzZXRHcmlkU2l6ZSddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldEdyaWRTaXplO1xuTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZVsnc2V0TWF4Wm9vbSddID1cbiAgICBNYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlLnNldE1heFpvb207XG5NYXJrZXJDbHVzdGVyZXIucHJvdG90eXBlWydvbkFkZCddID0gTWFya2VyQ2x1c3RlcmVyLnByb3RvdHlwZS5vbkFkZDtcbk1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGVbJ2RyYXcnXSA9IE1hcmtlckNsdXN0ZXJlci5wcm90b3R5cGUuZHJhdztcblxuQ2x1c3Rlci5wcm90b3R5cGVbJ2dldENlbnRlciddID0gQ2x1c3Rlci5wcm90b3R5cGUuZ2V0Q2VudGVyO1xuQ2x1c3Rlci5wcm90b3R5cGVbJ2dldFNpemUnXSA9IENsdXN0ZXIucHJvdG90eXBlLmdldFNpemU7XG5DbHVzdGVyLnByb3RvdHlwZVsnZ2V0TWFya2VycyddID0gQ2x1c3Rlci5wcm90b3R5cGUuZ2V0TWFya2VycztcblxuQ2x1c3Rlckljb24ucHJvdG90eXBlWydvbkFkZCddID0gQ2x1c3Rlckljb24ucHJvdG90eXBlLm9uQWRkO1xuQ2x1c3Rlckljb24ucHJvdG90eXBlWydkcmF3J10gPSBDbHVzdGVySWNvbi5wcm90b3R5cGUuZHJhdztcbkNsdXN0ZXJJY29uLnByb3RvdHlwZVsnb25SZW1vdmUnXSA9IENsdXN0ZXJJY29uLnByb3RvdHlwZS5vblJlbW92ZTtcblxuT2JqZWN0LmtleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbihvKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yKHZhciBuYW1lIGluIG8pIHtcbiAgICAgICAgICAgIGlmIChvLmhhc093blByb3BlcnR5KG5hbWUpKVxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTsiLCJ2YXIgd3BzZW9fZGlyZWN0aW9ucyA9IFtdO1xudmFyIHdwc2VvX21hcHMgPSBbXTtcbnZhciBtYXJrZXJzID0gbmV3IE9iamVjdCgpO1xuXG52YXIgd3BzZW9fZGlyZWN0aW9ucyA9IFtdO1xudmFyIHdwc2VvX21hcHMgPSBbXTtcbnZhciBtYXJrZXJzID0gbmV3IE9iamVjdCgpO1xuXG53aW5kb3cud3BzZW9fc2hvd19tYXAgPSBmdW5jdGlvbiB3cHNlb19zaG93X21hcChsb2NhdGlvbl9kYXRhLCBjb3VudGVyLCBjZW50ZXJfbGF0LCBjZW50ZXJfbG9uZywgem9vbSwgbWFwX3N0eWxlLCBzY3JvbGxhYmxlLCBkcmFnZ2FibGUsIGRlZmF1bHRfc2hvd19pbmZvd2luZG93LCBpc19hZG1pbiwgbWFya2VyX2NsdXN0ZXJpbmcpIHtcbiAgICB2YXIgYm91bmRzID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZ0JvdW5kcygpO1xuICAgIHZhciBjZW50ZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGNlbnRlcl9sYXQsIGNlbnRlcl9sb25nKTtcbiAgICB2YXIgbW9iaWxlQnJlYWtwb2ludCA9IDQ4MDtcbiAgICBtYXJrZXJzW2NvdW50ZXJdID0gW107XG5cbiAgICB2YXIgd3BzZW9fbWFwX29wdGlvbnMgPSB7XG4gICAgICAgIHpvb206IHpvb20sXG4gICAgICAgIG1pblpvb206IDEsXG4gICAgICAgIG1hcFR5cGVDb250cm9sOiB0cnVlLFxuICAgICAgICB6b29tQ29udHJvbDogc2Nyb2xsYWJsZSxcbiAgICAgICAgc3RyZWV0Vmlld0NvbnRyb2w6IHRydWUsXG4gICAgICAgIG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkW21hcF9zdHlsZS50b1VwcGVyQ2FzZSgpXSxcbiAgICAgICAgc2Nyb2xsd2hlZWw6IHNjcm9sbGFibGUgJiYgd2luZG93LmlubmVyV2lkdGggPiBtb2JpbGVCcmVha3BvaW50XG4gICAgfTtcblxuICAgIC8vIGdlc3R1cmVIYW5kbGluZyBzaG91bGQgb25seSBiZSBzZXQgb24gZGV2aWNlcyB0aGF0IHN1cHBvcnQgdG91Y2guXG4gICAgaWYgKGNoZWNrRm9yVG91Y2goKSkge1xuICAgICAgICB3cHNlb19tYXBfb3B0aW9ucy5nZXN0dXJlSGFuZGxpbmcgPSBkcmFnZ2FibGUgPyAnYXV0bycgOiAnbm9uZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd3BzZW9fbWFwX29wdGlvbnMuZHJhZ2dhYmxlID0gZHJhZ2dhYmxlO1xuICAgIH1cblxuICAgIC8vIFNldCBjZW50ZXJcbiAgICBpZiAoem9vbSA9PSAtMSkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxvY2F0aW9uX2RhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBsYXRMb25nID0gbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsb2NhdGlvbl9kYXRhW2ldW1wibGF0XCJdLCBsb2NhdGlvbl9kYXRhW2ldW1wibG9uZ1wiXSk7XG4gICAgICAgICAgICBib3VuZHMuZXh0ZW5kKGxhdExvbmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgY2VudGVyID0gYm91bmRzLmdldENlbnRlcigpO1xuICAgIH1cbiAgICB3cHNlb19tYXBfb3B0aW9ucy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICB0cnkge1xuXHQgICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCBcIm1hcF9jYW52YXNcIiArICggY291bnRlciAhPSAwID8gJ18nICsgY291bnRlciA6ICcnICkgKSwgd3BzZW9fbWFwX29wdGlvbnMgKTtcbiAgICB9XG4gICAgY2F0Y2goIGVycm9yICkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHpvb20gPT09IC0xKSB7XG4gICAgICAgIG1hcC5maXRCb3VuZHMoYm91bmRzKTtcbiAgICB9XG5cbiAgICAvLyBTZXQgbWFya2VycyArIGluZm9cbiAgICB2YXIgaW5mb1dpbmRvdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcbiAgICAgICAgY29udGVudDogaW5mb1dpbmRvd0hUTUxcbiAgICB9KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYXRpb25fZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAvLyBDcmVhdGUgaW5mbyB3aW5kb3cgSFRNTFxuICAgICAgICB2YXIgaW5mb1dpbmRvd0hUTUwgPSBnZXRJbmZvQnViYmxlVGV4dChsb2NhdGlvbl9kYXRhW2ldW1wibmFtZVwiXSwgbG9jYXRpb25fZGF0YVtpXVtcImFkZHJlc3NcIl0sIGxvY2F0aW9uX2RhdGFbaV1bXCJ1cmxcIl0sIGxvY2F0aW9uX2RhdGFbaV1bXCJzZWxmX3VybFwiXSk7XG5cbiAgICAgICAgdmFyIGxhdExvbmcgPSBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxvY2F0aW9uX2RhdGFbaV1bXCJsYXRcIl0sIGxvY2F0aW9uX2RhdGFbaV1bXCJsb25nXCJdKTtcbiAgICAgICAgdmFyIGljb24gPSBsb2NhdGlvbl9kYXRhW2ldW1wiY3VzdG9tX21hcmtlclwiXTtcbiAgICAgICAgdmFyIGNhdGVnb3JpZXMgPSBsb2NhdGlvbl9kYXRhW2ldW1wiY2F0ZWdvcmllc1wiXTtcblxuICAgICAgICBtYXJrZXJzW2NvdW50ZXJdW2ldID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG4gICAgICAgICAgICBwb3NpdGlvbjogbGF0TG9uZyxcbiAgICAgICAgICAgIGNlbnRlcjogY2VudGVyLFxuICAgICAgICAgICAgbWFwOiBtYXAsXG4gICAgICAgICAgICBtYXBfaWQ6IGNvdW50ZXIsXG4gICAgICAgICAgICBodG1sOiBpbmZvV2luZG93SFRNTCxcbiAgICAgICAgICAgIGRyYWdnYWJsZTogQm9vbGVhbihpc19hZG1pbiksXG4gICAgICAgICAgICBpY29uOiB0eXBlb2YgaWNvbiAhPT0gJ3VuZGVmaW5lZCcgJiYgaWNvbiB8fCAnJyxcbiAgICAgICAgICAgIGNhdGVnb3JpZXM6IHR5cGVvZiBjYXRlZ29yaWVzICE9PSAndW5kZWZpbmVkJyAmJiBjYXRlZ29yaWVzIHx8ICcnXG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1hcmtlcnNbY291bnRlcl0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG1hcmtlciA9IG1hcmtlcnNbY291bnRlcl1baV07XG5cbiAgICAgICAgZ29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCBcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudCh0aGlzLmh0bWwpO1xuICAgICAgICAgICAgaW5mb1dpbmRvdy5vcGVuKG1hcCwgdGhpcyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGluZm9XaW5kb3csICdjbG9zZWNsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgbWFwLnNldENlbnRlcih0aGlzLmdldFBvc2l0aW9uKCkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdkcmFnZW5kJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAvLyBJZiBvbiBhIHNpbmdsZSBsb2NhdGlvbiBwYWdlIGluIGEgbXVsdGlwbGUgbG9jYXRpb24gc2V0dXAuXG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dwc2VvX2Nvb3JkaW5hdGVzX2xhdCcpICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cHNlb19jb29yZGluYXRlc19sb25nJykpIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3BzZW9fY29vcmRpbmF0ZXNfbGF0JykudmFsdWUgPSBldmVudC5sYXRMbmcubGF0KCk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dwc2VvX2Nvb3JkaW5hdGVzX2xvbmcnKS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sbmcoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gSWYgb24gdGhlIFlvYXN0IExvY2FsIFNFTyBzZXR0aW5ncyBwYWdlLCB1c2luZyBhIHNpbmdsZSBsb2NhdGlvbi5cbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb25fY29vcmRzX2xhdCcpICYmIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdsb2NhdGlvbl9jb29yZHNfbG9uZycpKSB7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2xvY2F0aW9uX2Nvb3Jkc19sYXQnKS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sYXQoKTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbG9jYXRpb25fY29vcmRzX2xvbmcnKS52YWx1ZSA9IGV2ZW50LmxhdExuZy5sbmcoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gSWYgbWFya2VyIGNsdXN0ZXJpbmcgaXMgc2V0LCB1c2UgaXQuXG4gICAgaWYgKG1hcmtlcl9jbHVzdGVyaW5nKSB7XG4gICAgICAgIG5ldyBNYXJrZXJDbHVzdGVyZXIobWFwLCBtYXJrZXJzW2NvdW50ZXJdLCB7IGltYWdlUGF0aDogd3BzZW9fbG9jYWxfZGF0YS5tYXJrZXJfY2x1c3Rlcl9pbWFnZV9wYXRoIH0pO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIG9ubHkgb25lIG1hcmtlciBhbmQgdGhlIGluZm93aW5kb3cgc2hvdWxkIGJlIHNob3duLCBtYWtlIGl0IHNvLlxuICAgIGlmIChtYXJrZXJzW2NvdW50ZXJdLmxlbmd0aCA9PSAxICYmIGRlZmF1bHRfc2hvd19pbmZvd2luZG93KSB7XG4gICAgICAgIGluZm9XaW5kb3cuc2V0Q29udGVudChtYXJrZXJzW2NvdW50ZXJdWzBdLmh0bWwpO1xuICAgICAgICBpbmZvV2luZG93Lm9wZW4obWFwLCBtYXJrZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBtYXA7XG59O1xuXG53aW5kb3cuY2hlY2tGb3JUb3VjaCA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAhIShuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9BbmRyb2lkL2kpIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL3dlYk9TL2kpIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQaG9uZS9pKSB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9pUGFkL2kpIHx8IG5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goL2lQb2QvaSkgfHwgbmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvQmxhY2tCZXJyeS9pKSB8fCBuYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC9XaW5kb3dzIFBob25lL2kpKTtcbn1cblxud2luZG93Lndwc2VvX2dldF9kaXJlY3Rpb25zID0gZnVuY3Rpb24gKG1hcCwgbG9jYXRpb25fZGF0YSwgY291bnRlciwgc2hvd19yb3V0ZSkge1xuICAgIHZhciBkaXJlY3Rpb25zRGlzcGxheSA9ICcnO1xuXG4gICAgaWYgKHNob3dfcm91dGUgJiYgbG9jYXRpb25fZGF0YS5sZW5ndGggPj0gMSkge1xuICAgICAgICBkaXJlY3Rpb25zRGlzcGxheSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zUmVuZGVyZXIoKTtcbiAgICAgICAgZGlyZWN0aW9uc0Rpc3BsYXkuc2V0TWFwKG1hcCk7XG4gICAgICAgIGRpcmVjdGlvbnNEaXNwbGF5LnNldFBhbmVsKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiZGlyZWN0aW9uc1wiICsgKGNvdW50ZXIgIT0gMCA/ICdfJyArIGNvdW50ZXIgOiAnJykpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZGlyZWN0aW9uc0Rpc3BsYXk7XG59XG5cbndpbmRvdy5nZXRJbmZvQnViYmxlVGV4dCA9IGZ1bmN0aW9uKGJ1c2luZXNzX25hbWUsIGJ1c2luZXNzX2NpdHlfYWRkcmVzcywgYnVzaW5lc3NfdXJsLCBzZWxmX3VybCkge1xuICAgIHZhciBpbmZvV2luZG93SFRNTCA9ICc8ZGl2IGNsYXNzPVwid3BzZW8taW5mby13aW5kb3ctd3JhcHBlclwiPic7XG5cbiAgICB2YXIgc2hvd1NlbGZMaW5rID0gZmFsc2U7XG4gICAgaWYgKHNlbGZfdXJsICE9IHVuZGVmaW5lZCAmJiB3cHNlb19sb2NhbF9kYXRhLmhhc19tdWx0aXBsZV9sb2NhdGlvbnMgIT0gJycgJiYgc2VsZl91cmwgIT0gd2luZG93LmxvY2F0aW9uLmhyZWYpIHNob3dTZWxmTGluayA9IHRydWU7XG5cbiAgICBpZiAoc2hvd1NlbGZMaW5rKSBpbmZvV2luZG93SFRNTCArPSAnPGEgaHJlZj1cIicgKyBzZWxmX3VybCArICdcIj4nO1xuICAgIGluZm9XaW5kb3dIVE1MICs9ICc8c3Ryb25nPicgKyBidXNpbmVzc19uYW1lICsgJzwvc3Ryb25nPic7XG4gICAgaWYgKHNob3dTZWxmTGluaykgaW5mb1dpbmRvd0hUTUwgKz0gJzwvYT4nO1xuICAgIGluZm9XaW5kb3dIVE1MICs9ICc8YnI+JztcbiAgICBpbmZvV2luZG93SFRNTCArPSBidXNpbmVzc19jaXR5X2FkZHJlc3M7XG5cbiAgICBpbmZvV2luZG93SFRNTCArPSAnPC9kaXY+JztcblxuICAgIHJldHVybiBpbmZvV2luZG93SFRNTDtcbn1cblxud2luZG93Lndwc2VvX2NhbGN1bGF0ZV9yb3V0ZSA9IGZ1bmN0aW9uKG1hcCwgZGlyRGlzcGxheSwgY29vcmRzX2xhdCwgY29vcmRzX2xvbmcsIGNvdW50ZXIpIHtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dwc2VvLXNsLWNvb3Jkcy1sYXQnKSAhPSBudWxsKSBjb29yZHNfbGF0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dwc2VvLXNsLWNvb3Jkcy1sYXQnKS52YWx1ZTtcbiAgICBpZiAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dwc2VvLXNsLWNvb3Jkcy1sb25nJykgIT0gbnVsbCkgY29vcmRzX2xvbmcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd3BzZW8tc2wtY29vcmRzLWxvbmcnKS52YWx1ZTtcblxuICAgIHZhciBzdGFydCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwib3JpZ2luXCIgKyAoY291bnRlciAhPSAwID8gXCJfXCIgKyBjb3VudGVyIDogXCJcIikpLnZhbHVlICsgJyAnICsgd3BzZW9fbG9jYWxfZGF0YS5kZWZhdWx0X2NvdW50cnk7XG4gICAgdmFyIHVuaXRfc3lzdGVtID0gZ29vZ2xlLm1hcHMuVW5pdFN5c3RlbS5NRVRSSUM7XG4gICAgaWYgKHdwc2VvX2xvY2FsX2RhdGEudW5pdF9zeXN0ZW0gPT0gJ0lNUEVSSUFMJykgdW5pdF9zeXN0ZW0gPSBnb29nbGUubWFwcy5Vbml0U3lzdGVtLklNUEVSSUFMO1xuXG4gICAgLy8gQ2xlYXIgYWxsIG1hcmtlcnMgZnJvbSB0aGUgbWFwLCBvbmx5IHNob3cgQSBhbmQgQlxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWFya2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtYXJrZXJzW2ldLnNldE1hcChudWxsKTtcbiAgICB9XG5cbiAgICAvLyBDaGFuZ2UgYnV0dG9uIHRvIGxpbmsgdG8gR29vZ2xlIE1hcHMuIGlQaG9uZXMgYW5kIEFuZHJvaWQgcGhvbmVzIHdpbGwgYXV0b21hdGljYWxseSBvcGVuIHRoZW0gaW4gTWFwcyBhcHAsIHdoZW4gYXZhaWxhYmxlLlxuICAgIGlmICgvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcbiAgICAgICAgdmFyIHVybCA9ICdodHRwczovL21hcHMuZ29vZ2xlLmNvbS9tYXBzP3NhZGRyPScgKyBlc2NhcGUoc3RhcnQpICsgJyZkYWRkcj0nICsgY29vcmRzX2xhdCArICcsJyArIGNvb3Jkc19sb25nO1xuICAgICAgICB3aW5kb3cub3Blbih1cmwsICdfYmxhbmsnKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGxhdGxuZyA9IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoY29vcmRzX2xhdCwgY29vcmRzX2xvbmcpO1xuXG4gICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgb3JpZ2luOiBzdGFydCxcbiAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBsYXRsbmcsXG4gICAgICAgICAgICBwcm92aWRlUm91dGVBbHRlcm5hdGl2ZXM6IHRydWUsXG4gICAgICAgICAgICBvcHRpbWl6ZVdheXBvaW50czogdHJ1ZSxcbiAgICAgICAgICAgIHRyYXZlbE1vZGU6IGdvb2dsZS5tYXBzLkRpcmVjdGlvbnNUcmF2ZWxNb2RlLkRSSVZJTkcsXG4gICAgICAgICAgICB1bml0U3lzdGVtOiB1bml0X3N5c3RlbVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBkaXJlY3Rpb25zU2VydmljZSA9IG5ldyBnb29nbGUubWFwcy5EaXJlY3Rpb25zU2VydmljZSgpO1xuXG4gICAgICAgIGRpcmVjdGlvbnNTZXJ2aWNlLnJvdXRlKHJlcXVlc3QsIGZ1bmN0aW9uIChyZXNwb25zZSwgc3RhdHVzMikge1xuICAgICAgICAgICAgaWYgKHN0YXR1czIgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5PSykge1xuICAgICAgICAgICAgICAgIGRpckRpc3BsYXkuc2V0RGlyZWN0aW9ucyhyZXNwb25zZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1czIgPT0gZ29vZ2xlLm1hcHMuRGlyZWN0aW9uc1N0YXR1cy5aRVJPX1JFU1VMVFMpIHtcbiAgICAgICAgICAgICAgICB2YXIgbm9yb3V0ZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3cHNlby1ub3JvdXRlJyk7XG4gICAgICAgICAgICAgICAgbm9yb3V0ZS5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgJ2NsZWFyOiBib3RoOyBkaXNwbGF5OiBibG9jazsnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG53aW5kb3cud3BzZW9fc2xfc2hvd19yb3V0ZSA9IGZ1bmN0aW9uKG9iaiwgY29vcmRzX2xhdCwgY29vcmRzX2xvbmcpIHtcbiAgICAkID0galF1ZXJ5O1xuXG4gICAgLy8gQ3JlYXRlIGhpZGRlbiBpbnB1dHMgdG8gcGFzcyB0aHJvdWdoIHRoZSBsYXQvbG9uZyBjb29yZGluYXRlcyBmb3Igd2hpY2ggaXMgbmVlZGVkIGZvciBjYWxjdWxhdGluZyB0aGUgcm91dGUuXG4gICAgJCgnLndwc2VvLXNsLWNvb3JkcycpLnJlbW92ZSgpO1xuICAgIHZhciBpbnB1dHMgPSAnPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBjbGFzcz1cIndwc2VvLXNsLWNvb3Jkc1wiIGlkPVwid3BzZW8tc2wtY29vcmRzLWxhdFwiIHZhbHVlPVwiJyArIGNvb3Jkc19sYXQgKyAnXCI+JztcbiAgICBpbnB1dHMgKz0gJzxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgY2xhc3M9XCJ3cHNlby1zbC1jb29yZHNcIiBpZD1cIndwc2VvLXNsLWNvb3Jkcy1sb25nXCIgdmFsdWU9XCInICsgY29vcmRzX2xvbmcgKyAnXCI+JztcblxuICAgICQoJyN3cHNlby1kaXJlY3Rpb25zLWZvcm0nKS5hcHBlbmQoaW5wdXRzKS5zdWJtaXQoKTtcbiAgICAkKCcjd3BzZW8tZGlyZWN0aW9ucy13cmFwcGVyJykuc2xpZGVVcChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykuaW5zZXJ0QWZ0ZXIoJChvYmopLnBhcmVudHMoJy53cHNlby1yZXN1bHQnKSkuc2xpZGVEb3duKCk7XG4gICAgfSk7XG59XG5cbndpbmRvdy5maWx0ZXJNYXJrZXJzID0gZnVuY3Rpb24oY2F0ZWdvcnksIG1hcF9pZCkge1xuICAgIGZvciAoaSA9IDA7IGkgPCBtYXJrZXJzW21hcF9pZF0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbWFya2VyID0gbWFya2Vyc1ttYXBfaWRdW2ldO1xuXG4gICAgICAgIC8vIElmIGlzIHNhbWUgY2F0ZWdvcnkgb3IgY2F0ZWdvcnkgbm90IHBpY2tlZFxuICAgICAgICBpZiAobWFya2VyLmNhdGVnb3JpZXMuaGFzT3duUHJvcGVydHkoY2F0ZWdvcnkpIHx8IGNhdGVnb3J5Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgbWFya2VyLnNldFZpc2libGUodHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gQ2F0ZWdvcmllcyBkb24ndCBtYXRjaFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1hcmtlci5zZXRWaXNpYmxlKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiJdfQ==
