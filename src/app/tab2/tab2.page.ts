import { Component, ViewChild, ElementRef } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
	AngularFirestoreCollection,
	AngularFirestore,
} from "@angular/fire/firestore";
import { AuthService } from "../services/auth.service";
import { AlertController } from "@ionic/angular";
const { Geolocation } = Plugins;

declare var google;
@Component({
	selector: "app-tab2",
	templateUrl: "tab2.page.html",
	styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
	@ViewChild("map", { static: false }) mapElement: ElementRef;
	user = null;
	userid;
	map: any;
	markers = [];
	positions: Observable<any>;
	usersCollection: AngularFirestoreCollection<any>;
	userDoc;
	isTracking = false;
	watch: string;
	lat;
	lng;
	destination;

	constructor(
		private afs: AngularFirestore,
		private authservice: AuthService
	) {
		this.usersCollection = this.afs.collection(`users`);
		/* this.user = this.authservice.getuserAuth().subscribe(user => {
			this.userid = user.uid;
		  }); */
		this.userDoc = this.usersCollection.doc("2");
		this.destination = null;
		this.getMyPosition();
	}

	ionViewWillEnter() {
		this.loadMap();
	}

	// conseguir mi posicion y actualizar la DB
	getMyPosition() {
		//this.userDoc = this.usersCollection.doc(this.user);
		this.positions = this.userDoc
			.snapshotChanges()
			.pipe(map((doc) => (doc as any).payload.data().position));
		// actualizar en cada cambio
		this.positions.subscribe((positions) => {
			this.updateMap(positions);
		});
	}

	// inicializar el mapa
	loadMap() {
		let latLng = new google.maps.LatLng(-35.9036442, -57.6673267);

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

	sendAlert() {
		this.userDoc.set({
			notifications: "panic",
			state: "sharing",
			position: {
				lat: this.lat,
				lng: this.lng,
			},
		});
	}

	//track with destination
	trackWithDestination(lat, lng) {
		this.destination = { lat, lng };
		this.startTracking();
	}
	// empezar a trackear
	startTracking() {
		this.isTracking = true;
		this.watch = Geolocation.watchPosition({}, (position, err) => {
			if (position) {
				this.lat = position.coords.latitude;
				this.lng = position.coords.longitude;
				this.addNewPosition(
					position.coords.latitude,
					position.coords.longitude,
					position.timestamp
				);
			}
		});

		// this.positions.subscribe((positions) => {
		// 	console.log({ positions });
		// 	this.updateMap(positions);
		// });
	}

	// cerrar la suscripción
	stopTracking() {
		Geolocation.clearWatch({ id: this.watch }).then(() => {
			this.isTracking = false;
		}); /* 
		this.userDoc.update({
			notification: "stopped",
		}); */
	}

	// guardar la ubicacion y actualizar el mapa
	addNewPosition(lat, lng, timestamp) {
		this.userDoc.set({
			position: {
				lat,
				lng,
			},
			timestamp,
			state: "sharing",
		});

		let position = new google.maps.LatLng(lat, lng);
		this.map.setCenter(position);
		this.map.setZoom(5);
	}

	updateMap(position) {
		this.markers.map((marker) => marker.setMap(null));
		this.markers = [];

		let latLng = new google.maps.LatLng(position.lat, position.lng);

		/* latLng.google.maps.event.addListener(map, "click", function (event) {
			let pos = event.latLng;
			console.log(pos);
            
			let lat = pos.lat();
			let lng = pos.lng();
			this.destination = { lat: lat, lng: lng };
			console.log(this.destination);
		}); */
		let marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng,
		});

		if (this.destination) {
			let marker = new google.maps.Marker({
				map: this.map,
				animation: google.maps.Animation.DROP,
				position: this.destination,
				title: "Nuevo destino",
			});

			this.markers.push(marker);
		}

		//console.log(this.markers, marker);
		this.markers.push(marker);
	}
}
