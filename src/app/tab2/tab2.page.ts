import { Component, ViewChild, ElementRef } from "@angular/core";
import { Plugins } from "@capacitor/core";
const { Geolocation } = Plugins;

declare var google;
@Component({
	selector: "app-tab2",
	templateUrl: "tab2.page.html",
	styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
	// Map related
	@ViewChild("map", { static: false }) mapElement: ElementRef;
	map: any;
	markers = [];

	constructor() {}

	ionViewWillEnter() {
		this.loadMap();
	}
	loadMap() {
		let latLng = new google.maps.LatLng(-38.55, -55.6673267);

		let mapOptions = {
			center: latLng,
			zoom: 5,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true,
		};

		this.map = new google.maps.Map(
			this.mapElement.nativeElement,
			mapOptions
		);
	}
}
