import { Component, ViewChild, ElementRef } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import {
	AngularFirestoreCollection,
	AngularFirestore,
} from "@angular/fire/firestore";
const { Geolocation } = Plugins;

declare var google;
@Component({
	selector: "app-tab2",
	templateUrl: "tab2.page.html",
	styleUrls: ["tab2.page.scss"],
})
export class Tab2Page {
	@ViewChild("map", { static: false }) mapElement: ElementRef;
	map: any;
	markers = [];

	locations: Observable<any>;
	locationsCollection: AngularFirestoreCollection<any>;
	userRef;
	isTracking = false;
	watch: string;
	user = null;
	otherUser: string;
	constructor(private afs: AngularFirestore) {
		this.locationsCollection = this.afs.collection(`users`);
		this.getMyPosition();
	}

	ionViewWillEnter() {
		this.loadMap();
	}

	// conseguir mi posicion y actualizar la DB
	getMyPosition() {
		this.user = "kfOuIqQxzn1Y6DSfKLSv";
		/* this.locationsCollection = this.afs.collection(`users`); */
		this.userRef = this.locationsCollection.doc(this.user);
		this.locations = this.userRef
			.snapshotChanges()
			.pipe(map((doc) => (doc as any).payload.data().position));
		// actualizar en cada cambio
		this.locations.subscribe((locations) => {
			this.updateMap(locations);
		});
		/* this.locationsCollection = this.afs.collection(
			`users/${this.user}`,
			(ref) => ref.orderBy("timestamp")
		);
		console.log(this.locationsCollection);
		this.locations = this.locationsCollection.snapshotChanges().pipe(
			map((actions) =>
				actions.map((a) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				})
			)
		);

		this.locations.subscribe((locations) => {
			console.log(locations);

			this.updateMap(locations);
		}); */
	}

	getOtherUserPosition() {
		this.otherUser = "eJFKh5JPZaqyfUcZj2qT";
		this.locationsCollection = this.afs.collection(`users`);
		this.userRef = this.locationsCollection.doc(this.otherUser);
		this.locations = this.userRef
			.snapshotChanges()
			.pipe(map((doc) => (doc as any).payload.data().position));
		// actualizar en cada cambio
		this.locations.subscribe((locations) => {
			this.updateMap(locations);
		});

		/* this.locationsCollection = this.afs.collection(`users`);
		const userRef = this.locationsCollection.doc(this.otherUser);
		this.locations = this.userRef.snapshotChanges().pipe(
			map(
				(actions) => console.log(actions)
				/* actions.map((a) => {
					const data = a.payload.doc.data();
					const id = a.payload.doc.id;
					return { id, ...data };
				}) 
			)
		);
		// actualizar en cada cambio
		this.locations.subscribe((locations) => {
			this.updateMap(locations);
		}); */
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
	// empezar a trackear
	startTracking() {
		this.isTracking = true;
		this.watch = Geolocation.watchPosition({}, (position, err) => {
			if (position) {
				this.addNewLocation(
					position.coords.latitude,
					position.coords.longitude,
					position.timestamp
				);
				// ACÁ AGREGO LA FUNCION PARA COMPARTIR CON CONTACTOS?
			}
		});

		this.locations.subscribe((locations) => {
			console.log("hola");

			console.log(locations);

			this.updateMap(locations);
		});
	}

	// cerrar la suscripción
	stopTracking() {
		Geolocation.clearWatch({ id: this.watch }).then(() => {
			this.isTracking = false;
		});
	}

	// guardar la ubicacion y actualizar el mapa
	addNewLocation(lat, lng, timestamp) {
		console.log("agregue");
		this.user = "kfOuIqQxzn1Y6DSfKLSv";
		this.userRef = this.locationsCollection.doc(this.user);
		this.userRef.set({
			position: {
				lat,
				lng,
			},

			timestamp,
		});

		let position = new google.maps.LatLng(lat, lng);
		this.map.setCenter(position);
		this.map.setZoom(5);
	}

	updateMap(position) {
		this.markers.map((marker) => marker.setMap(null));
		this.markers = [];

		let latLng = new google.maps.LatLng(position.lat, position.lng);

		let marker = new google.maps.Marker({
			map: this.map,
			animation: google.maps.Animation.DROP,
			position: latLng,
		});
		//console.log(this.markers, marker);
		this.markers.push(marker);
	}
}
